'use strict';

const aws = require('aws-sdk');

module.exports.handler = (event, context, callback) => {
  const dynamodb = new aws.DynamoDB();

  const name = event.name;
  const id = event.id;

  if (name && id) {
    const params = {
      Item: {
        'Id': { S: id },
        'Name': { S: name }
      },
      TableName: process.env.TABLE
    };

    // Add user to DynamoDB

  } else {
    callback('Please provide a user and a user ID.');
  }
};
