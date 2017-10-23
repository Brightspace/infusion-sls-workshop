'use strict';

const aws = require('aws-sdk');
const createHttpResponse = require('./createHttpResponse');

module.exports.handler = (event, context, callback) => {
  const dynamodb = new aws.DynamoDB();
  const body = JSON.parse(event.body || '{}');

  const id = event.pathParameters.id;
  const name = body.name;

  if (!name) {
    const response = createHttpResponse(400, {
      error: 'Request body must include "name".'
    });
    callback(null, response);
  }

  const params = {
    Item: {
      'Id': { S: id },
      'Name': { S: name }
    },
    TableName: process.env.TABLE
  };

  dynamodb.putItem(params).promise()
    .then(() => callback(null, createHttpResponse(200)))
    .catch(err => callback(err));
};
