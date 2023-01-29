/**
 * this file has the logging system
 * logging system written in seperate file to make it easy to integrates in other projects and to be extensible as possible
 */
const winston = require('winston'); //logging module
const conf = require(`./loadConf`)
/**
 * log function
 * @param {Object} log
 * @param {Request} log.req 
 * @param {string} log.level
 * @param {string} log.message
 */
module.exports.log = ({ req, level, message }) => {
  if (!message) message = 'no_message'
  if (!level) level = 'debug'

  let memory = null
  if (conf().log.memory) memory = process.memoryUsage()

  let logger = winston.createLogger(conf().log.createLoggerOptions)
  winston.addColors(conf().log.colors)
  logger[level]({ req, level, message, memory })

  logger.close()
  return logger
}


module.exports.levelNames = {
  ...conf().log.levelNames
}




