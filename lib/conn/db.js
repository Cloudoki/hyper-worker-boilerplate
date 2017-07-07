'use strict'

const config = require('../../knexfile')['default'];

const Knex = require('knex')(config);
const Bookshelf = require('bookshelf')(Knex);

module.exports = Bookshelf;
