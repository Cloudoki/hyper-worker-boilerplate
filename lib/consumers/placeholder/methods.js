'use strict'

const placeholderModel = require('lib/model/placeholder');

exports.get = function (placeholderModel) {
    return placeholderModel.where({
            id: placeholderModel
        }).fetch();
};