'use strict'

const BaseModel = require('./base');

const instanceProps = {
  tableName: 'placeholder'
  //blm-model-relation: function () {
  //  return this.hasMany(require('./blm-model-relation-file'));
  //}
};

const classProps = {
  typeName: 'placeholder',
  filters: {
    // name: function (qb, value) {
    //   return qb.whereIn('name', value)
    // }
  },
  //dependents: ['blm-model-relation-dep'],
  relations: [
    // 'keywords'
  ]
};

exports = module.exports = BaseModel.extend(instanceProps, classProps);