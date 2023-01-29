const express = require('express');
const router = express.Router();
const  conf  = require(`../../core/utils/loadConf`)



router.get('/', function (req, res, next) {
        return res.render('index/views/index',{ title: `${conf().app.name}`,message:null })
    });

    router.get('/index', function (req, res, next) {
        return res.render('index/views/index',{ title: `${conf().app.name}`,message:null })
    });

module.exports = router;
