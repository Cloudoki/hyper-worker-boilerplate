'use strict'

const mq = require('hyper-queue');

const placeholder = require('lib/consumers/placeholder');

const log = require('log');

const config = require('config');

mq.broker(config.queue.uri, config.queue.options, config.queue.reconnect);

mq.logger(log);

mq.registerCconsumers(placeholder.consumers);

mq.connect();
