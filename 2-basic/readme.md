## Getting Started

Navigate to the working directory.

```sh
cd 2-basic
```

## Examples

```sh
# Updates the "Hello World" Lambda function
npm run sls -- deploy --stage <stage>

# Invoke your function with no event
npm run sls -- invoke --stage <stage> --function hello
# Invoke your function with an event (insufficient data)
npm run sls -- invoke --stage <stage> --function hello --data "{\"name\":\"d2lsupport\"}"
# Both will throw an error with a stack trace and output:
# {"errorMessage": "Please provide a user and a user ID."}

# Invoke your function with an event (sufficient data)
npm run sls -- invoke --stage <stage> --function hello --data "{\"name\":\"d2lsupport\", \"id\": 169}"
# This one will succeed with output:
# "Hello d2lsupport (169)! Number of successful calls: 1"
```
