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

  const { name } = event;

  if (name) {
    numSuccessfulCalls++;
    return `Hello ${name}! numSuccessfulCalls: ${numSuccessfulCalls}`;
  }

  throw new Error('Please provide a name.');
};
