'use strict';

const repository = require('./repository');

exports.handler = async (event) => {
  const id = event.pathParameters.id;

  await repository.remove(id);

  return {
    statusCode: 200,
    body: 'Deleted user'
  };
};
