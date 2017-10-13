'use strict';

const aws = require('aws-sdk');
const createHttpResponse = require('./createHttpResponse');

module.exports.handler = (event, context, callback) => {
  const dynamodb = new aws.DynamoDB();

  const id = event.pathParameters.id;
  const params = {
    Key: {
      'Id': { S: id }
    },
    TableName: process.env.TABLE
  };

  dynamodb.deleteItem(params).promise()
    .then(() => callback(null, createHttpResponse(200)))
    .catch(err => callback(err));
};
