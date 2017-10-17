const AWS = require('aws-sdk');
const iam = new AWS.IAM();

iam.getUser()
  .promise()
  .then(data => {
    console.log('Success!');
    console.log(JSON.stringify(data));
  })
  .catch(err => {
    console.log('Error!');
    console.log(JSON.stringify(err));
  });
