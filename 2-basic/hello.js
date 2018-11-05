'use strict';

let numSuccessfulCalls = 0;

/**
 * Entry point for the Lambda function.
 *
 * @param {Object} event The inputs to the function from the user or another AWS
 * service.
 */
exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event));

  const { name, id } = event;

  if (name && id) {
    numSuccessfulCalls++;
    return `Hello ${name} (${id})! Number of successful calls: ${numSuccessfulCalls}`;
  }

  throw new Error('Please provide a user and a user ID.');
};
