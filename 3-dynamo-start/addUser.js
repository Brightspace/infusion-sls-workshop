'use strict';

module.exports.handler = (event, context, callback) => {
  const name = event.name;
  const id = event.id;

  if (name && id) {
    // Add user to DynamoDB

  } else {
    callback('Please provide a user and a user ID.');
  }
};
