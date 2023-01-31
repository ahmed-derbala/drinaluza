const express = require('express');
const router = express.Router();
const { check, query, param } = require('express-validator');
const validatorCheck = require(`../../core/utils/error`).validatorCheck;
const { authenticate } = require(`../../core/mw/auth`)
const authService = require(`./auth.service`)
const conf = require(`../../core/utils/loadConf`)
const { errorHandler } = require('../../core/utils/error');
const { getFlash, setFlashSuccess } = require(`../../core/helpers/flash`)
const { emailFormatErrorTranslation } = require('../../core/translations/email.translation')





router.post('/signup',
  /*[
    //  check('user').exists(),
    check('user.email').isEmail(),
    check('user.password').isString().notEmpty(),
    //   check('user.phones').isArray(),
    //  check('user.phones.*.countryCode').isString().notEmpty(),
    //  check('user.phones.*.shortNumber').isString().notEmpty()

  ],
  validatorCheck,
  */
  async (req, res) => {
    return authService.signup({ user: req.body })
      .then(result => {
        //  return res.render('index/views/index',{ title: 'Express',message:null })
        setFlashSuccess(req, 'Signup success, please signin')
        if (req.query.view) return res.redirect(`${conf().app.frontend.url}/auth/signin`)
        return res.status(result.status).json(result)
      })
      .catch(err => {
        console.log(err, "errrr");
        req.flash('error', err.message)
        //errorHandler({ err, res })
        if (req.query.view) {
          // res.render('auth/views/signup', { title: 'Singup', error:req.flash('error'),success:null });
          return res.redirect(`${conf().app.frontend.url}/auth/signup`)
        }
      })
  })



router.post('/signin',
  [
    check('email').isEmail().withMessage((value, { req, location, path }) => {
      return emailFormatErrorTranslation(req.lang)
    }),
    check('password').isString().notEmpty()
  ],
  validatorCheck({ redirect: `${conf().app.frontend.url}/auth/signin` }),
  async (req, res) => {
    try {
      const result = await authService.signin({ user: req.body, req, res })
      if (req.query.view) {
        setFlashSuccess(req, 'Signin success')
        return res.redirect(`${conf().app.frontend.url}/index`)
      }
      return res.status(result.status).json(result)
    }
    catch (err) {
      errorHandler({ err, req, res, redirect: `${conf().app.frontend.url}/auth/signin` })
    }
  })







router.post('/signout',
  authenticate(),
  async (req, res) => {
    return Sessions.deleteOne({ token: req.headers.token })
      .then(deletedSession => {
        return res.status(200).json({ msg: 'singedout', data: deletedSession })
      })
      .catch(err => errorHandler({ err, res }))
  })

module.exports = router;
