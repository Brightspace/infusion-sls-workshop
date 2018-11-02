'use strict';

const aws = require('aws-sdk');
const createHttpResponse = require('./createHttpResponse');

module.exports.handler = (event, context, callback) => {
  const dynamodb = new aws.DynamoDB();

  const name = undefined; // TODO: deserialize the body and retrieve `name`
  const id = undefined;   // TODO: retrieve `id`

  if (name && id) {
    const params = {
      Item: {
        'Id': { S: id },
        'Name': { S: name }
      },
      TableName: process.env.TABLE
    };
    dynamodb.putItem(params).promise()
      .then(() => callback(null, createHttpResponse(null /* TODO: replace with proper response status code */)))
      .catch(err => callback(err));
  } else {
    callback('Please provide a user and a user ID.');
  }
};
