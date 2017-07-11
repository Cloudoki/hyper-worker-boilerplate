'use strict'

const config = require('config');
const log = require('log');
const mq = require('hyper-queue');

const placeholder = require('lib/consumers/placeholder');

mq.logger(log);

mq.broker(config.queue.uri, config.queue.options, config.queue.reconnect);

mq.registerCconsumers(placeholder.consumers);

mq.connect();
