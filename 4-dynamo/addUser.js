'use strict';

const repository = require('./repository');

exports.handler = async (event) => {
  const id = event.pathParameters.id;
  const body = JSON.parse(event.body || '{}');

  const { name } = body;

  if (name) {
    await repository.save(id, { name });

    return {
      statusCode: 200,
      body: 'Saved!'
    };
  }

  return {
    statusCode: 400,
    body: 'Request body must include "name"'
  };

};
