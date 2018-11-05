'use strict';

const aws = require('aws-sdk');

const tableName = process.env.TABLE_NAME;

const client =  new aws.DynamoDB.DocumentClient();

exports.save = async (id, user) => {
  const params = {
    TableName: tableName,
    Item: {
      Id: id,
      Name: user.name
    }
  };

  await client.put(params).promise();
};

exports.find = async (id) => {
  const params = {
    TableName: tableName,
    Key: {
      Id: id,
    }
  };

  return client.get(params).promise();
};

exports.remove = async (id) => {
  const params = {
    TableName: tableName,
    Key: {
      Id: id,
    }
  };

  await client.delete(params).promise();
};

