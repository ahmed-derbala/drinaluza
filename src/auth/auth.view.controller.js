const express = require('express');
const router = express.Router();
const authCtrl = require(`./auth.api.controller`)
const { check, query, param } = require('express-validator');
const validatorCheck = require(`../../core/utils/error`).validatorCheck;
const { authenticate } = require(`../../core/mw/auth`)






router.get('/', function (req, res, next) {
  res.render('auth/views/signup', { title: 'Express',message:null });
});

router.get('/signup', function (req, res, next) {
  res.render('auth/views/signup', { title: 'Express',message:null });
});


router.get('/signin', function (req, res, next) {
  console.log("signin");
/*
  const infoErrorsObj = req.flash('infoErrors');
  const infoSubmitObj = req.flash('infoSubmit');
  console.log(infoErrorsObj,'infoErrorsObj');
  console.log(infoSubmitObj,'infoSubmitObj');
*/
  res.render('auth/views/signin', { title: 'Singin',message:null,/*infoErrorsObj, infoSubmitObj*/ });
});

module.exports = router;
