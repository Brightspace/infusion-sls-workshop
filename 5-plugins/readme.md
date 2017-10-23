## Getting Started

Navigate to the working directory.

```sh
cd 5-plugins
```

Please note that this code sample is **not** production ready.

## Walkthrough

In this stage we will add a healthcheck lambda and use a custom serverless
plugin to add a `health` CLI command to check the health of our service.

### Healthcheck lambda

First, add `healthcheck.js` and update `serverless.yml` to add the new
function:

```yaml
functions:
  healthcheck:
    handler: healthcheck.handler
    events:
      - http:
          path: healthcheck
          method: get
```

The healthcheck function responds to GET requests to the `/healthcheck`
endpoint with a `200 OK` response. Update the service to test the endpoint.

```sh
npm run sls -- deploy --stage <stage>

...
Serverless: Stack update finished...
Service Information
...
endpoints:
  GET - https://<id>.execute-api.us-east-1.amazonaws.com/<stage>/healthcheck
```

### Custom Plugin

First, the plugin requires two modules, so add them as `dev-dependencies` to
`package.json`:

```
npm i --save-dev request
npm i --save-dev request-promise-native
```

#### How the plugin works

The plugin uses the serverless stack name to make a request to CloudFormation
for the 'ServiceEndpoint' (HTTP endpoint of the API Gateway).

```
const stackName = this.provider.naming.getStackName();
const outputName = 'ServiceEndpoint';

return this.provider.request('CloudFormation', 'describeStacks', { StackName: stackName }, this.stage, this.region)
...
```

Once it has the endpoint, it makes a request to the `/healthcheck` route and
looks for the `'OK'` response.

#### Hooking up the plugin

Add a `plugins` section to `serverless.yml` with the name of the
healthcheck plugin:

```yaml
plugins:
  - serverless-gateway-health-check
```

Serverless looks for local plugins in the `.serverless_plugins` directory
(`<plugin-name>.js` or `<plugin-name>/index.js`). Create this directory and
add the file `serverless-gateway-health-check.js`.

The plugin code defines a custom `health` CLI command (like `deploy`), with a
custom lifecycle event called `check`.

```yaml
this.commands = {
  health: {
    lifecycleEvents: [
      'check'
    ]
  },
};
```

A hook is defined that triggers the execution of the `this.healthcheck()`
function whenever the `health:check` event occurs (running `sls health`).

```yaml
this.hooks = {
  'health:check': this.healthcheck.bind(this)
};
```

After making these changes, update the service:

```sh
npm run sls -- deploy --stage <stage>
```

Invoke the healthcheck by running:

```sh
npm run sls -- health --stage <stage>

#Response
> user-management-service@1.0.0 health .../infusion-sls-workshop/5-plugins
> sls health "--stage" "<stage>"

Serverless: https://<id>.execute-api.us-east-1.amazonaws.com/<stage>/healthcheck: "OK"
```
