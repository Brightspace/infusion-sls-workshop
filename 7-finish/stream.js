'use strict';

const aws = require('aws-sdk');

exports.handler = async (event) => {
  event.Records.forEach(record => {
    const newRecord = aws.DynamoDB.Converter.unmarshall(record.dynamodb.NewImage);
    console.log('value is now', JSON.stringify(newRecord, null, 2));
  });
};
