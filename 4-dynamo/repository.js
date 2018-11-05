'use strict';

const aws = require('aws-sdk');

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html
const client =  new aws.DynamoDB.DocumentClient();

/*
Make sure to request a promise from the client, for example:

client.put().promise()
*/

exports.save = async (id, user) => {
  throw new Error('Not implemented');
};

exports.find = async (id) => {
  throw new Error('Not implemented');
};

exports.remove = async (id) => {
  throw new Error('Not implemented');
};

