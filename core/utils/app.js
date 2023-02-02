const express = require('express');
const useragent = require('express-useragent');
const expressWinston = require('express-winston');
const winston = require('winston'); //logging module
const loaders = require('./loaders')
const morganLogger = require(`./morgan`)
const rateLimit = require('express-rate-limit')
const conf = require(`./loadConf`)
const compression = require('compression')
const cors = require('cors')
const helmet = require('helmet')
const { tidHandler } = require('./tid')
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');



let app = express();
app.use(cors(conf().app.corsOptions))
app.use('/', rateLimit(conf().app.apiLimiter))
app.use(compression())
app.use(helmet({ crossOriginResourcePolicy: false }))
app.use(tidHandler)
app.use(useragent.express());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.disable('x-powered-by');
app.disable('etag');
app.use(morganLogger())

//set language
app.use((req, res, next) => {
  // This reads the accept-language header
  // and returns the language if found or false if not
  const lang = req.acceptsLanguages(conf().app.langs)
  if (lang) { // if found, attach it as property to the request
      req.lang = lang
  } else { // else set the default language
      req.lang = 'en'
  }
  next()
})


//cookies and sessions
app.use(session(conf().app.session));
app.use(flash());



// view engine setup
app.set('view engine', 'ejs');
app.use(express.static(`${process.cwd()}/public`));
app.set('views', [`${process.cwd()}/src`]);
app.set('layout', `${process.cwd()}/src/index/views/layout`)//to make index/views/layout.ejs availabe for expressLayouts
app.use(expressLayouts);



//save logs to db
app.use(expressWinston.logger({
  transports: [
    new winston.transports.MongoDB(conf().log.transportsOptions.mongo)
  ],
  expressFormat: true
}));



loaders.routes(app)//load routes



//when no api route matched
app.use((req, res, next) => {
  return res.status(404).json({ statusCode: 404, message: '404 not found', data: null })
})

//when error occurs
app.use((err, req, res, next) => {
  return res.status(err.statusCode || 500).json(err)
})


module.exports = app;
