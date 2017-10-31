'use strict';

const aws = require('aws-sdk');
const createHttpResponse = require('./createHttpResponse');

module.exports.handler = (event, context, callback) => {
  const dynamodb = new aws.DynamoDB();

  const id = undefined;   // TODO: retrieve `id`

  if (id) {
    const params = {
      Key: {
        'Id': { S: id }
      },
      TableName: process.env.TABLE
    };
    dynamodb.deleteItem(params).promise()
      .then(() => callback(null, 'Success!'))
      .catch(err => callback(err));
  } else {
    callback('Please provide a user ID.');
  }
};
