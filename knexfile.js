'use strict'
// Database configuration is in the config.js file.
const config = require('./config')

const knexConfig = {
  client: 'mysql',
  connection: config.database,
  pool: {
    min: config.database.pool.min,
    max: config.database.pool.max,
    refreshIdle: false
  }
}

module.exports = {
  default: knexConfig,
  development: knexConfig,
  staging: knexConfig,
  production: knexConfig
}
