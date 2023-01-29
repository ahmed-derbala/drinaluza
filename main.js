#!/usr/bin/env node
console.clear()
const conf = require(`./core/utils/loadConf`)

if (conf().app.use_strict) require('use-strict')

const db = require("./core/utils/db");
db.connect()

const { log } = require(`./core/utils/log`)

process.on('warning', err => log({ message: err.stack, level: 'warn' }));//print out memory leak errors
process.on('uncaughtException', err => log({ message: err.stack, level: 'warn' }));
process.on('unhandledRejection', err => log({ message: err.stack, level: 'warn' }));

const server = require('./core/utils/server')
const { socketio } = require('./core/utils/socketio')
socketio({ server })