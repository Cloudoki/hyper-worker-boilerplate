'use strict'

const methods = require('./methods'); 

exports = module.exports = {};

exports.get = (msg, reply) => {

    methods.get(msg.payload.id).then((placeholderEnity) => {

        let placeholderObj = placeholderEnity.serialize();

        reply(placeholderObj);  

    }).catch((err)=>{
        reply({error: err});    
    });

};
