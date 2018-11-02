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

  dynamodb.getItem(params).promise()
    .then(data => {
      if(data.Item) {
        const response = createHttpResponse(200, {
          Id: data.Item.Id.S,
          Name: data.Item.Name.S
        });
        callback(null, response);
      } else {
        callback(null, createHttpResponse(404));
      };
    })
    .catch(err => callback(err));
};
