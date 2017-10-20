## Getting Started

Navigate to the working directory.

```sh
cd 4-apigateway
```

Please note that this code sample is **not** production ready.

## Walkthrough

In this stage we will attach our user management service to API gateway to
create a RESTful API for managing our users.

Before we start, let's ensure there is at least one user in the system by
running the following:

```sh
npm run sls -- invoke --stage <stage> --function addUser --data "{\"name\":\"d2lsupport\", \"id\": \"169\"}"
```

### `events` Property

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

## Appendix

### Authorization

You will likely want to run some authorization logic in front of your service.
This can be achieved by providing a [custom
authorizer](https://serverless.com/framework/docs/providers/aws/events/apigateway#http-endpoints-with-custom-authorizers).

### `event` format

The input format is available on
[docs.aws.amazon.com](http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-set-up-simple-proxy.html#api-gateway-simple-proxy-for-lambda-input-format).
The following are examples of what `event` will look like for our user
management service.

Sample GET `event`:

```js
{ resource: '/users/{id}',
  path: '/users/169',
  httpMethod: 'GET',
  headers:
   { Accept: '*/*',
     'Accept-Encoding': 'gzip, deflate',
     'cache-control': 'no-cache',
     'CloudFront-Forwarded-Proto': 'https',
     'CloudFront-Is-Desktop-Viewer': 'true',
     'CloudFront-Is-Mobile-Viewer': 'false',
     'CloudFront-Is-SmartTV-Viewer': 'false',
     'CloudFront-Is-Tablet-Viewer': 'false',
     'CloudFront-Viewer-Country': 'CA',
     Host: '5eg3sd8dkh.execute-api.us-east-1.amazonaws.com',
     'Postman-Token': '692e9cfb-2ed8-4dc5-8f90-fa2f9c7646f8',
     'User-Agent': 'PostmanRuntime/6.4.0',
     Via: '1.1 1b6b00b86f1f234214316c68f617caa6.cloudfront.net (CloudFront)',
     'X-Amz-Cf-Id': '4xWo7dPXfszYkZ8CQqzFYA7p1-uxpdMbT4RY2IcL38Pp4Gu-f1SRnw==',
     'X-Amzn-Trace-Id': 'Root=1-59e11d00-39fcb9bf0a47955c249ce463',
     'X-Forwarded-For': '216.16.228.6, 54.182.234.52',
     'X-Forwarded-Port': '443',
     'X-Forwarded-Proto': 'https' },
  queryStringParameters: null,
  pathParameters: { id: '169' },
  stageVariables: null,
  requestContext:
   { path: '/mtse/users/169',
     accountId: '728041832160',
     resourceId: 'bfjzr5',
     stage: 'mtse',
     requestId: '2367c734-b052-11e7-ba73-19a6f8363655',
     identity:
      { cognitoIdentityPoolId: null,
        accountId: null,
        cognitoIdentityId: null,
        caller: null,
        apiKey: '',
        sourceIp: '216.16.228.6',
        accessKey: null,
        cognitoAuthenticationType: null,
        cognitoAuthenticationProvider: null,
        userArn: null,
        userAgent: 'PostmanRuntime/6.4.0',
        user: null },
     resourcePath: '/users/{id}',
     httpMethod: 'GET',
     apiId: '5eg3sd8dkh' },
  body: null,
  isBase64Encoded: false }
```

Sample PUT `event`:

```js
{ resource: '/users/{id}',
  path: '/users/169',
  httpMethod: 'PUT',
  headers:
   { Accept: '*/*',
     'Accept-Encoding': 'gzip, deflate',
     'cache-control': 'no-cache',
     'CloudFront-Forwarded-Proto': 'https',
     'CloudFront-Is-Desktop-Viewer': 'true',
     'CloudFront-Is-Mobile-Viewer': 'false',
     'CloudFront-Is-SmartTV-Viewer': 'false',
     'CloudFront-Is-Tablet-Viewer': 'false',
     'CloudFront-Viewer-Country': 'CA',
     'Content-Type': 'application/json',
     Host: '5eg3sd8dkh.execute-api.us-east-1.amazonaws.com',
     'Postman-Token': 'ff8380ef-e929-49d0-aa06-ba75b865dd3c',
     'User-Agent': 'PostmanRuntime/6.4.0',
     Via: '1.1 d4288fffbe3895015af2915a87b1fa4e.cloudfront.net (CloudFront)',
     'X-Amz-Cf-Id': 'W7srsa5fPMB9j-dbbfKZ-NWbAmYGK4hgZVCnJmGxu_oxeXXQs5nZKw==',
     'X-Amzn-Trace-Id': 'Root=1-59e12562-0fffeeb8594c0fb23a95db3f',
     'X-Forwarded-For': '216.16.228.6, 54.182.234.75',
     'X-Forwarded-Port': '443',
     'X-Forwarded-Proto': 'https' },
  queryStringParameters: null,
  pathParameters: { id: '169' },
  stageVariables: null,
  requestContext:
   { path: '/mtse/users/169',
     accountId: '728041832160',
     resourceId: 'bfjzr5',
     stage: 'mtse',
     requestId: '2277331f-b057-11e7-80ad-ed0f21aa38ea',
     identity:
      { cognitoIdentityPoolId: null,
        accountId: null,
        cognitoIdentityId: null,
        caller: null,
        apiKey: '',
        sourceIp: '216.16.228.6',
        accessKey: null,
        cognitoAuthenticationType: null,
        cognitoAuthenticationProvider: null,
        userArn: null,
        userAgent: 'PostmanRuntime/6.4.0',
        user: null },
     resourcePath: '/users/{id}',
     httpMethod: 'PUT',
     apiId: '5eg3sd8dkh' },
  body: '{\n\t"name": "mtse"\n}',
  isBase64Encoded: false }
```

Sample DELETE `event`:

```js
{ resource: '/users/{id}',
  path: '/users/171',
  httpMethod: 'DELETE',
  headers:
   { Accept: '*/*',
     'Accept-Encoding': 'gzip, deflate',
     'cache-control': 'no-cache',
     'CloudFront-Forwarded-Proto': 'https',
     'CloudFront-Is-Desktop-Viewer': 'true',
     'CloudFront-Is-Mobile-Viewer': 'false',
     'CloudFront-Is-SmartTV-Viewer': 'false',
     'CloudFront-Is-Tablet-Viewer': 'false',
     'CloudFront-Viewer-Country': 'CA',
     'Content-Type': 'application/json',
     Host: '5eg3sd8dkh.execute-api.us-east-1.amazonaws.com',
     'Postman-Token': '56b6d040-fc9f-41bd-9c69-1d02dc8c4bb3',
     'User-Agent': 'PostmanRuntime/6.4.0',
     Via: '1.1 cae81d5ff1d682b28f2deabdd94777d4.cloudfront.net (CloudFront)',
     'X-Amz-Cf-Id': 'IRzKP8dvkwG_U0jLeTJSXg3i0Tg-9G7jEQbU-b5Wo_RqMTe8h_jpzg==',
     'X-Amzn-Trace-Id': 'Root=1-59e12ab7-5dfc94071c6b052731296661',
     'X-Forwarded-For': '216.16.228.6, 54.182.234.70',
     'X-Forwarded-Port': '443',
     'X-Forwarded-Proto': 'https' },
  queryStringParameters: null,
  pathParameters: { id: '171' },
  stageVariables: null,
  requestContext:
   { path: '/mtse/users/171',
     accountId: '728041832160',
     resourceId: 'bfjzr5',
     stage: 'mtse',
     requestId: '4ff76cf4-b05a-11e7-a8a6-cdfa785d819f',
     identity:
      { cognitoIdentityPoolId: null,
        accountId: null,
        cognitoIdentityId: null,
        caller: null,
        apiKey: '',
        sourceIp: '216.16.228.6',
        accessKey: null,
        cognitoAuthenticationType: null,
        cognitoAuthenticationProvider: null,
        userArn: null,
        userAgent: 'PostmanRuntime/6.4.0',
        user: null },
     resourcePath: '/users/{id}',
     httpMethod: 'DELETE',
     apiId: '5eg3sd8dkh' },
  body: null,
  isBase64Encoded: false }
```
