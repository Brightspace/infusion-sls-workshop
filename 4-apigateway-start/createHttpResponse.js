'use strict';

module.exports = (statusCode, responseMessage = {}) => ({
  statusCode: statusCode,
  body: JSON.stringify(responseMessage)
});
