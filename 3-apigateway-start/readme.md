## Getting Started

Navigate to the working directory.

```sh
cd 4-apigateway-start
```

## Walkthrough

This code skeleton is very similar to `3-dynamo`, except with additions that
define the API contract with API Gateway. You can view these additions in
[serverless.yml](serverless.yml). All three of our Lambda functions will now be
triggered by API Gateway.

The `event` object will have a different format, and you will need to make code
changes to retrieve the `id` and `name` values you need in each function.

The changes to use API Gateway also means the response message value for
`callback()` is passed directly to API Gateway now, so the object will have to
conform to a certain format for API Gateway to understand it.

The following sections will help you retrieve the values you need and format
your responses properly.

### API Contract

The API contract determines where the `id` and `name` values will come from. For
this contract, the `id` value is found in the path, and the `name` value is
found in the body.

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

### The `event` Object

Because API Gateway has taken over the invocation of the Lambda function, the
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

API Gateway takes all path parameters (e.g. `{id}`) of the HTTP request and
provides them as properties inside `event.pathParameters`.

API Gateway also takes the body of the HTTP request and provides it as a string
inside the `event.body` parameter. We can retreive `name` by deserializing the
JSON body (`JSON.parse(event.body)`). This is important for
[addUser](addUser.js), as `name` is provided in the body.

We should be able to retrieve what we need (`id` and `name`) using the
`event.pathParameters` and `event.body` properties.

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

Change the `callback()` response message to adhere to the propery format using
[createHttpResponse.js](./createHttpResponse.js).

### Verifying the Changes

#### Add User

You should now be able to create / retrieve / delete users using PUT / GET /
DELETE HTTP requests.

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
