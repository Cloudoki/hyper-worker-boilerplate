'use strict'

const amqp = require('amqplib');
const uuid = require('node-uuid');

let brokerAddr = '';

let connection = null;

let channel = null;

let consumerConfigurations = [];

let bail = function (err) {
    console.error(err);
    if (connection) {
        connection.close(function () {
            process.exit(1);
        });
    }
}

let replyToQueue = function (msg, retMsg) {
    channel.sendToQueue(msg.properties.replyTo,
        Buffer.from(retMsg), {
            correlationId: msg.properties.correlationId
        });
    channel.ack(msg);
}

let consume = function (consumerConf) {

    if (!typeof consumerConf === 'object') {
        bail(new Error('consume paramater must be an object'));
        return
    }

    if (!consumerConf.queue) {
        bail(new Error('No queue'));
        return
    }

    if (!consumerConf.queue.name) {
        bail(new Error('queue name required'));
        return
    }

    if (!consumerConf.hasOwnProperty('async')) {
        bail(new Error('async is required'));
        return
    }

    if (!consumerConf.hasOwnProperty('handler')) {
        bail(new Error('handler required'));
        return
    }

    if (!typeof consumerConf.handler === 'function') {
        bail(new Error('handler must be a function'));
        return
    }

    if (!consumerConf.queue.options) {
        consumerConf.queue.options = {
            durable: false
        };
    }

    if (!consumerConf.queue.options.durable) {
        consumerConf.queue.durable = false;
    }

    if (!connection) {
        bail(new Error('No connection'));
        return
    }

    if (!channel) {
        bail(new Error('No channel'));
        return
    }

    let ok = channel.assertQueue(consumerConf.queue.name, consumerConf.queue.options);

    ok = ok.then(function () {
        channel.prefetch(1);
        if (consumerConf.async) {
            return channel.consume(consumerConf.queue.name, asyncReply);
        }
        return channel.consume(consumerConf.queue.name, syncReply);
    });

    function syncReply(msg) {

        try {
            let msgObj = JSON.parse(msg.content.toString());

            consumerConf.handler({
                payload: msgObj,
                rawMessage: msg
            }, function (retObj) {

                if (retObj) {
                    try {
                        let retMsg = JSON.stringify(retObj);

                        replyToQueue(msg, retMsg);

                    } catch (err) {
                        console.log(err)
                        replyToQueue(msg, JSON.stringify({
                            error: err
                        }));
                    }
                }

            });

        } catch (err) {
            console.log(err)
            replyToQueue(msg, JSON.stringify({
                error: err
            }));
        }

    }

    function asyncReply(msg) {

        try {
            let msgObj = JSON.parse(msg.content.toString());

            consumerConf.handler({
                payload: msgObj,
                rawMessage: msg
            });

        } catch (err) {
            console.log(err)
        }

    }

    return ok.then(function () {
        console.log(' [x] Awaiting RPC requests');
    });

};

exports = module.exports = {};

exports.broker = function (addr) {

    if (!addr) {
        addr = 'amqp://localhost';
    }

    brokerAddr = addr;

};

exports.consumers = function (confs) {

    if (!confs) {
        bail(new Error('consumers expects an array of objects'));
        return
    }

    if (confs.length === 0) {
        bail(new Error('consumers expects an array of objects with at least one object'));
        return
    }

    consumerConfigurations = confs;

};

exports.sendSync = function (queue, sendObj) {

    return new Promise((resolve, reject) => {

        let corrId = uuid();

        function maybeAnswer(msg) {
            if (msg.properties.correlationId === corrId) {

                try {

                    let obj = JSON.parse(msg.content.toString());

                    resolve(obj);

                } catch (e) {
                    reject(e);
                }

            }
        }

        let ok = channel.assertQueue('', {
                exclusive: true
            })
            .then(function (qok) {
                return qok.queue;
            });

        ok = ok.then(function (replyQueue) {
            return channel.consume(replyQueue, maybeAnswer, {
                    noAck: true
                })
                .then(function () {
                    return replyQueue;
                });
        });

        ok = ok.then(function (replyQueue) {

            try {

                let objStr = JSON.stringify(sendObj);

                channel.sendToQueue(queue, Buffer.from(objStr), {
                    correlationId: corrId,
                    replyTo: replyQueue
                });

            } catch (e) {
                p.reject(e);
            }

        });

    });

};

exports.sendAsync = function (queue, sendObj) {

    try {
        let sendStr = JSON.stringify(sendObj);

        channel.sendToQueue(queue, Buffer.from(sendStr));

    } catch (err) {
        console.log(err)
    }

};

exports.connect = function () {

    if (brokerAddr === '') {
        brokerAddr = 'amqp://localhost';
    }

    amqp.connect(brokerAddr).then((conn) => {
        process.once('SIGINT', () => {
            conn.close();
        });

        connection = conn;

        return conn.createChannel();

    }).then((ch) => {
        channel = ch;

        for (let cc of consumerConfigurations) {
            consume(cc);
        }

    });

};