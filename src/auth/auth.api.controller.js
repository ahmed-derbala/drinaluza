const express = require('express');
const router = express.Router();
const { check, query, param } = require('express-validator');
const validatorCheck = require(`../../core/utils/error`).validatorCheck;
const { authenticate } = require(`../../core/mw/auth`)
const authService = require(`./auth.service`)
const  conf  = require(`../../core/utils/loadConf`)






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
    // const infoErrorsObj = req.flash('infoErrors');
    // const infoSubmitObj = req.flash('infoSubmit');
    return authService.signup({ user: req.body })
      .then(result => {
        //  return res.render('index/views/index',{ title: 'Express',message:null })
        //req.flash('infoSubmit', 'Recipe has been added.')
        if (req.query.view) return res.redirect(`${conf().app.frontend.url}/auth/signin`)
        return res.status(result.status).json(result)
      })
      .catch(err => errorHandler({ err, res }))
  })

router.post('/signin',
  /*[
    check('user.email').isEmail(),
    check('user.password').isString().notEmpty()
  ],
  validatorCheck,*/
  async (req, res) => {
    return authService.signin({ user:req.body, req })
      .then(result => {
        if (req.query.view) return res.redirect(`${conf().app.frontend.url}/index`)
        return res.status(result.status).json(result)
      })
      .catch(err => errorHandler({ err, req, res }))
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
