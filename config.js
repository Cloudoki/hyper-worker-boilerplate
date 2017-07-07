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
    }
};
