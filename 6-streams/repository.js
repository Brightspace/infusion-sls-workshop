'use strict';

const aws = require('aws-sdk');

const tableName = process.env.TABLE_NAME;

const client =  new aws.DynamoDB.DocumentClient();

exports.save = async (id, user) => {
  const { name } = user;

  const params = {
    TableName: tableName,
    Item: {
      id,
      name
    }
  };

  await client.put(params).promise();
};

exports.find = async (id) => {
  const params = {
    TableName: tableName,
    Key: {
      id,
    }
  };

  const result = await client.get(params).promise();

  return result.Item;
};

exports.remove = async (id) => {
  const params = {
    TableName: tableName,
    Key: {
      id,
    }
  };

  await client.delete(params).promise();
};

