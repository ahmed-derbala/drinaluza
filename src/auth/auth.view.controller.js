const express = require('express');
const router = express.Router();
const authCtrl = require(`./auth.api.controller`)
const { check, query, param } = require('express-validator');
const validatorCheck = require(`../../core/utils/error`).validatorCheck;
const { authenticate } = require(`../../core/mw/auth`)
const { getFlash } = require(`../../core/helpers/flash`)
const { errorHandler } = require('../../core/utils/error');






router.get('/', function (req, res, next) {
  res.render('auth/views/signup', { title: 'Express', flash: getFlash(req) });
});

router.get('/signup', function (req, res, next) {
  res.render('auth/views/signup', { title: 'Express', flash: getFlash(req) });
});


router.get('/signin', function (req, res, next) {
  try {
    res.render('auth/views/signin', { title: 'Singin', flash: getFlash(req) });

  } catch (err) {
    errorHandler({err})
  }
});

module.exports = router;
