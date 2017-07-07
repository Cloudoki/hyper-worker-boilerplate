'use strict'

const bunyan = require('bunyan');
const config = require('config');

const bunyanConfig = config.logger;

exports = module.exports = bunyan.createLogger(bunyanConfig);
