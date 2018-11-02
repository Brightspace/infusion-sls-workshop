# Basic

## Getting Started

Navigate to the working directory.

```sh
cd 2-basic
```

## Examples

This example uses the command line interface to invoke the function. It is also possible to invoke the Lambda function in the [AWS console](http://docs.aws.amazon.com/lambda/latest/dg/get-started-invoke-manually.html).

## Walkthrough

```sh
# Updates the "Hello World" Lambda function
npx serverless deploy

# Invoke your function with no event
npm run sls -- invoke --stage <stage> --function hello
# Invoke your function with an event (insufficient data)
npm run sls -- invoke --stage <stage> --function hello --data "{\"name\":\"d2lsupport\"}"
# Both will throw an error with a stack trace and output:
# {"errorMessage": "Please provide a user and a user ID."}

# Invoke your function with an event (sufficient data)
npm run sls -- invoke --stage <stage> --function hello --data "{\"name\":\"d2lsupport\", \"id\": \"169\"}"
# This one will succeed with output:
# "Hello d2lsupport (169)! Number of successful calls: 1"
```
