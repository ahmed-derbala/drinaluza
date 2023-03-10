const  conf  = require(`./loadConf`)
const { log } = require(`./log`)

/**
 * Module dependencies.
 */
 const app = require('./app');
 const http = require('http');
 
 /**
  * Get port from environment
  */
 app.set('port', conf().app.backend.port);
 
 /**
  * Create HTTP server.
  */
  const server = http.createServer(app);
 
 /**
  * Listen on provided port, on all network interfaces.
  */
 if (conf().app.cluster > 0) {
   let cluster = require('cluster');
   if (cluster.isMaster) {
     log({ message: `cluster is enabled. ${conf().app.cluster} cpus are in use`, level: 'success' })
     // Create a worker for each CPU
     for (let c = 1; c <= conf().app.cluster; c++) {
       cluster.fork();
     }
 
     // Listen for dying workers
     cluster.on('exit', function () {
       console.log(`cluster exited`)
       cluster.fork();
     });
 
   } else {
     //launching the server
     server.listen(conf().app.backend.port, log({ message: `${conf().app.name} ${conf().app.version} ${conf().app.backend.url} NODE_ENV=${conf().app.NODE_ENV} fork ${cluster.worker.id} pid ${cluster.worker.process.pid}`, level: 'startup' }))
     server.on('error', onError);
     server.on('listening', onListening);
   }
 } else {
   //launching the server without cluster
   server.listen(conf().app.backend.port, log({ message: `${conf().app.name} ${conf().app.version} ${conf().app.backend.url} NODE_ENV=${conf().app.NODE_ENV}`, level: 'startup' }))
   server.on('error', onError);
   server.on('listening', onListening);
 }
 
 server.setTimeout(0)//make sure timeout is disabled , wait forever
 
 /**
  * Event listener for HTTP server "error" event.
  */
 
 function onError(error) {
   if (error.syscall !== 'listen') {
     throw error;
   }
 
   const bind = typeof conf().app.backend.port === 'string'
     ? 'Pipe ' + conf().app.backend.port
     : 'Port ' + conf().app.backend.port;
 
   // handle specific listen errors with friendly messages
   switch (error.code) {
     case 'EACCES':
       log({ level: 'error', message: `${bind} requires elevated privileges` });
       process.exit(1);
       break;
     case 'EADDRINUSE':
       log({ level: 'error', message: `${bind} is already in use. If you used pm2, try npm run delete` });
       process.exit(1);
       break;
     default:
       throw error;
   }
 }
 
 /**
  * Event listener for HTTP server "listening" event.
  */
 
 function onListening() {
   const addr = server.address();
   const bind = typeof addr === 'string'
     ? 'pipe ' + addr
     : 'port ' + addr.port;
   //log({ level: 'success', message: `Listening on ${bind}` });
 }
 
 module.exports=server
 