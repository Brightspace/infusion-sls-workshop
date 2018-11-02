'use strict';

const repository = require('./repository');

exports.handler = async (event) => {
  const id = event.pathParameters.id;

  const user = await repository.find(id);

  if (user) {
    return {
      statusCode: 200,
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(user, null, 2)
    };
  }

  return {
    statusCode: 404,
    body: `User ${id} not found`
  };
};
