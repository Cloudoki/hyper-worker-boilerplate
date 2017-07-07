'use strict'

const Bookshelf = require('lib/conn/db');

var ModelBase = require('bookshelf-modelbase')(Bookshelf);

exports = module.exports = ModelBase;
