'use strict';

const createHttpResponse = require('./createHttpResponse');

module.exports.handler = (event, context, callback) => {
  callback(null, createHttpResponse(200, 'OK'));
};
