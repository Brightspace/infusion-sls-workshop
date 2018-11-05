# API Gateway

## Getting Started

This is an example of what the user management service could look like after
hooking it up to API Gateway.

Please note that this code sample is **not** production ready.

## Walkthrough

In this stage we will attach our user management service to API gateway and implement a basic in-memory user repository.

### `events` Property

If you examine `serverless.yml` you will see that there are now three functions:

- addUser
- deleteuser
- getUser

To let Serverless know it should also set up HTTP listeners, add the following
to the `addUser` function in `serverless.yml`:

```yaml
    events:
      - http:
          path: users/{id}
          method: put
```

Do the same for `getUser` and `deleteUser`, except replace `put` with `get` and
`delete` respectively.

After making these changes, update the service:

```sh
npm run sls -- deploy --stage <stage>
```

Upon a successful deployment, Serverless should output something like:

```
Service Information
service: user-management-service
stage: mtse
region: us-east-1
api keys:
  None
endpoints:
  PUT - https://5eg3sd8dkh.execute-api.us-east-1.amazonaws.com/mtse/users/{id}
  DELETE - https://5eg3sd8dkh.execute-api.us-east-1.amazonaws.com/mtse/users/{id}
  GET - https://5eg3sd8dkh.execute-api.us-east-1.amazonaws.com/mtse/users/{id}
functions:
  addUser: user-management-service-mtse-addUser
  deleteUser: user-management-service-mtse-deleteUser
  getUser: user-management-service-mtse-getUser
```

This change configures AWS API Gateway to listen to the endpoints above, and
invoke our Lambda function accordingly. Your stage and domain will be different
from the above sample output. Please adjust accordingly throughout the
walkthrough.

Side note: we will only be using the `http` event type, which connects Lambda
functions to an API gateway. The [Serverless Framework
documentation](https://serverless.com/framework/docs/providers/aws/events/)
describes other event types that allow you to hook seemlessly into other AWS
services.

You can now make HTTP calls to
https://5eg3sd8dkh.execute-api.us-east-1.amazonaws.com/mtse/users/{id} (your
stage and domain will be different)! But what is `{id}`? `{id}` is a path
parameter that should be replaced with the ID of the user of interest. In our
case, we created a user with ID `169` before starting, so let's try retrieving
it now by calling `GET` on
`https://5eg3sd8dkh.execute-api.us-east-1.amazonaws.com/mtse/users/169`.

```js
{
    "message": "Internal server error"
}
```

Oops. Looks like there's still a bit of work to do.

### Changes to the `event` Object

Because API Gateway has taking over the invocation of the Lambda function, the
`event` object structure conforms to a [certain
format](http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-set-up-simple-proxy.html#api-gateway-simple-proxy-for-lambda-input-format),
and has changed significantly:

```js
{
    "resource": "Resource path",
    "path": "Path parameter",
    "httpMethod": "Incoming request's method name"
    "headers": {Incoming request headers}
    "queryStringParameters": {query string parameters }
    "pathParameters":  {path parameters}
    "stageVariables": {Applicable stage variables}
    "requestContext": {Request context, including authorizer-returned key-value pairs}
    "body": "A JSON string of the request payload."
    "isBase64Encoded": "A boolean flag to indicate if the applicable request payload is Base64-encode"
}
```

(See [Appendix](#appendix) for details).

API Gateway takes all path parameters (e.g. `{id}`) and provides them as
properties inside `event.pathParameters`. This means we need extract `id` by
accessing `event.pathParameters.id` for [addUser](addUser.js),
[deleteUser](./deleteUser.js), and [getUser](./getUser.js).

For [addUser](./addUser.js), we also need to provide the name of the user. We
will do that by including the name in the body of the PUT request (`{"name":
"d2lsupport"}`). API Gateway provides the body of the PUT request as a JSON
string, which we deserialize by calling `JSON.parse()`:

```js
  const body = JSON.parse(event.body || '{}');
  const name = body.name;
```

With these two changes, we are now able to get the `id` and `name` from the HTTP
request.

### Changes to the Callback Response Message

The `callback()` function, which previously returned the output directly to us,
now returns the output to API Gateway. API Gateway expects the output to
[conform to a specific
format](http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-set-up-simple-proxy.html#api-gateway-simple-proxy-for-lambda-output-format):

```js
{
    "isBase64Encoded": true|false,
    "statusCode": httpStatusCode,
    "headers": { "headerName": "headerValue", ... },
    "body": "..."
}
```

Note that only `statusCode` is required.

To avoid code duplication, [createHttpResponse.js](./createHttpResponse.js) was
created to house the `createHttpResponse()` method:

```js
'use strict';

module.exports = (statusCode, responseMessage = {}) => ({
  statusCode: statusCode,
  body: JSON.stringify(responseMessage)
});
```

which simplifies formatting the output.

To use it, we add the following to [addUser](./addUser.js),
[deleteUser](./deleteUser.js), and [getUser](./getUser.js):

```js
const createHttpResponse = require('./createHttpResponse');
```

For all three Lambda functions, we replace `responseMessage` (the second
parameter) with the output of `createHttpResponse()`.

### Verifying the Changes

Compare your functions with the functions in this sample to see if they look
similar. If done properly, the service can now be used via HTTP calls!

#### Add User

```
PUT https://5eg3sd8dkh.execute-api.us-east-1.amazonaws.com/mtse/users/169
{
  "name": "d2lsupport"
}
```

#### Get User

```
GET https://5eg3sd8dkh.execute-api.us-east-1.amazonaws.com/mtse/users/169
```

#### Delete User

```
DELETE https://5eg3sd8dkh.execute-api.us-east-1.amazonaws.com/mtse/users/169
```
