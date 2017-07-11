exports = module.exports = {
    logger: {
        name: process.env.CLDK_WORKER_LOGGER_NAME || 'CLDK',
        level: process.env.CLDK_WORKER_LOGGER_LEVEL || 'debug'
    },
    database: {
        host: process.env.CLDK_WORKER_DB_HOST || 'localhost',
        database: process.env.CLDK_WORKER_DB_NAME || 'cloudoki_dev',
        user: process.env.CLDK_WORKER_DB_USER || 'root',
        password: process.env.CLDK_WORKER_DB_PASSWORD || 'cloudokidev',
        pool: {
            min: process.env.CLDK_WORKER_DB_POOL_MIN || 2,
            max: process.env.CLDK_WORKER_DB_POOL_MAX || 10
        }
    },
    queue: {
        uri: process.env.CLDK_WORKER_QUEUE_URI || 'amqps://mq.dev.cloudoki.com',
        reconnect: 5000,
        options: {
            cert: process.env.CLDK_WORKER_QUEUE_CERT || '/Users/tomasfoglio/Cloudoki/donderstarter-api/ssl/client/cert.pem',
            key: process.env.CLDK_WORKER_QUEUE_KEY || '/Users/tomasfoglio/Cloudoki/donderstarter-api/ssl/client/key.pem',
            passphrase: process.env.CLDK_WORKER_QUEUE_CERT_PASS || 'cloudoki',
            ca: process.env.CLDK_WORKER_QUEUE_CA || '/Users/tomasfoglio/Cloudoki/donderstarter-api/ssl/ca/cacert.pem'
        }
    }
};
