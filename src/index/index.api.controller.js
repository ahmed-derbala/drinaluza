const express = require('express');
const router = express.Router();
const conf = require(`../../core/utils/loadConf`)



router.get('/', function (req, res, next) {
    return res.status.json({ name: `${conf().app.name}`, version: `${conf().app.version}` })
});

router.get('/index', function (req, res, next) {
    return res.status.json({ name: `${conf().app.name}`, version: `${conf().app.version}` })
});

module.exports = router;
