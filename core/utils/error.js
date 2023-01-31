const { validationResult } = require('express-validator');
const { log } = require(`./log`)
const conf = require(`./loadConf`)
const { setFlashError, getFlashError } = require(`../helpers/flash`)

/**
 * handle errors
 * @param {Object} error 
 * @param {Object | String} error.err the error message or object
 * @param {Request} error.req request object
 * @param {Response} error.res response object
 * @param {Next} error.next next object
 */
exports.errorHandler = ({ err, req, res, next, statusCode, redirect }) => {
    //console.log('errorHandler...')

    if (typeof err == 'string') err = { message: err }
    if (!statusCode) statusCode = 500
    let errObject = {}
    errObject.level = 'error'
    errObject.statusCode = statusCode

    if (err) {
        errObject.error = err
        if (typeof err == 'object') {
            if (err.errors) errObject.error = err.errors
            if (err.message) {
                errObject.message = err.message
            }
            if (err.name) {
                if (err.name == 'ValidationError') {
                    statusCode = 409
                }
                if (err.name == 'TokenExpiredError') {
                    statusCode = 401
                }
            }
        }
    }

    errObject.statusCode = statusCode
    if (!errObject.message) errObject.message = 'error'

    // console.log(errObject,'object')
    if (req) {
        errObject.req = {}
        errObject.req.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
        errObject.req.user = req.user
    }
    log(errObject)

    if (res) {
        //check if the client is requesting a view
        if (req.query?.view) {
            setFlashError(req, errObject.message)
            if (redirect && typeof redirect == 'string') {
                return res.redirect(redirect)
            }
            return res.redirect(`${conf().app.frontend.url}/error`)
        }
        return res.status(statusCode).json(errObject)//client requesting api only
    }
    return errObject
};

/**
 * checking errors returned by validator, it should be called directly after validator on routes
 */
exports.validatorCheck = ({ redirect }) => {
    return function (req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const reqObject = {
                ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
                user: req.user
            }
            const errorString = JSON.stringify(errors.errors)
            log({
                label: 'VALIDATION_ERROR',
                message: errorString,
                req: reqObject,
                level: 'warn'
            });

            //check if the client is requesting a view
            if (req.query?.view) {
                setFlashError(req, errors.errors[0].msg)
                if (redirect && typeof redirect == 'string') {
                    return res.redirect(redirect)
                }
                return res.redirect(`${conf().app.frontend.url}/error`)
            }

            return res.status(422).json({ message: `validation error`, err: errors.errors });
        }
        return next();
    }
}
