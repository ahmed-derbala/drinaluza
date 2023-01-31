const express = require('express');
const router = express.Router();
const conf = require(`../../core/utils/loadConf`)
const { getFlash } = require(`../../core/helpers/flash`)


router.get('/', function (req, res, next) {
    return res.render('index/views/index', { title: `${conf().app.name}`, flash: getFlash(req) })
});

router.get('/index', function (req, res, next) {
    return res.render('index/views/index', { title: `${conf().app.name}`, flash: getFlash(req) })
});

router.get('/error', function (req, res, next) {
    try{
    return res.render('index/views/error', { title: `${conf().app.name}`, flash: getFlash(req) })
    }catch(err){
        console.error(err)
    }
});

module.exports = router;
