'use strict';

let numSuccessfulCalls = 0;

/**
 * Description of the callback function.
 *
 * @callback callback
 * @param {*} err Error message to report back to AWS Lambda; if null, AWS
 * assumes the function completed successfully.
 * @param {*} responseMessage Success message to report back to AWS Lambda.
 */

/**
 * Entry point for the Lambda function.
 *
 * @param {Object} event The inputs to the function from the user or another AWS
 * service.
 * @param {Object} context Metadata about the execution context.
 * @param {callback} callback See definition on 'callback()'.
 */
module.exports.hello = (event, context, callback) => {
  console.log(`Event: ${JSON.stringify(event)}`);

  const name = event.name;
  const id = event.id;

  if(name && id) {
    numSuccessfulCalls = numSuccessfulCalls + 1;
    callback(null, `Hello ${name} (${id})! Number of successful calls: ${numSuccessfulCalls}`);
  } else {
    callback('Please provide a user and a user ID.');
  }
};
