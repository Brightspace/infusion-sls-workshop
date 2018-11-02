# API Gateway

## Getting Started

Navigate to the working directory.

```sh
cd 3-apigateway
```

In this stage we will attach API Gateway to our user management service.

Please note that this code is **not** production ready.

## `events` Property

If you examine `serverless.yml` you will see that there are now three functions:

- addUser
- deleteuser
- getUser

Each function has an `events` object.  A function can be hooked up to more than one event source, but in this case we have just one: `http`.

The `http` event configuration has `path` and `method` properties.

## Deploy

Deploy the updated application:

```sh
serverless deploy
```

Upon a successful deployment, Serverless should output something like:

```sh
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

## Changes to the `event` Object

Because API Gateway is invoking the Lambda function, the `event` object structure conforms to a [certain
format](http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-set-up-simple-proxy.html#api-gateway-simple-proxy-for-lambda-input-format), and has changed significantly:

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

API Gateway takes all path parameters (e.g. `{id}`) and provides them as
properties inside `event.pathParameters`. This means we obtain `id` by
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

## Invoke

You can now make HTTP calls to
https://5eg3sd8dkh.execute-api.us-east-1.amazonaws.com/mtse/users/{id} (your
stage and domain will be different)! But what is `{id}`? `{id}` is a path
parameter that should be replaced with the ID of the user of interest.

Try making a GET request to your API endpoint with a value of `1` for id. You should see a response:

```js
{
    "message": "Internal server error"
}
```

Oops. Looks like there's still a bit of work to do.

If you wait a minute, you can run `sls logs -f getUser` to see more information. You an also browse the source code and see why we're having an Internal Server Error.

## Additional Reading

The [Serverless Framework documentation](https://serverless.com/framework/docs/providers/aws/events/) describes other event types that allow you to hook seamlessly into other AWS services.
