'use strict'

const handlers = require('./handlers');

exports = module.exports = {};

exports.consumers = [{
  queue: {
    name: 'project.placeholder.get',
    options: {
      durable: false
    }
  },
  async: false,
  handler: handlers.get
}];