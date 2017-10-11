'use strict';

const aws = require('aws-sdk');

module.exports.handler = (event, context, callback) => {
  const dynamodb = new aws.DynamoDB();

  const id = event.id;

  if (id) {
    const params = {
      Key: {
        'Id': { S: id }
      },
      TableName: process.env.TABLE
    };
    dynamodb.deleteItem(params).promise()
      .then(data => callback(null, data))
      .catch(err => callback(err));
  } else {
    callback('Please provide a user ID.');
  }
};
