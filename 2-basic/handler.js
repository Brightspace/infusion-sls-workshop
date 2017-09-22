'use strict';

let numSuccessfulCalls = 0;

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
