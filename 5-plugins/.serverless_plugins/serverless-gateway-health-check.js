'use strict';

const request = require('request-promise-native');

class GatewayHealthCheck {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.stage = options.stage;
    this.provider = serverless.getProvider('aws');
    this.region = this.serverless.service.provider.region;

    this.commands = {
      health: {
        lifecycleEvents: [
          'check'
        ]
      },
    };

    this.hooks = {
      'health:check': this.healthcheck.bind(this)
    };
  }

  /* helpers */
  getEndpointPrefixFromStackPromise() {
    const stackName = this.provider.naming.getStackName();
    const outputName = 'ServiceEndpoint';

    return this.provider.request('CloudFormation', 'describeStacks', { StackName: stackName }, this.stage, this.region)
      .then((response) => {
        if (!response.Stacks || response.Stacks.length !== 1) {
          throw new Error(`Error getting stack "${stackName}" - did not find exactly 1 stack ": ${JSON.stringify(response)}`);
        }

        const matches = response.Stacks[0].Outputs.filter(output => output.OutputKey == outputName);
        if (!matches || matches.length !== 1) {
          throw new Error(`Error getting output "${outputName}" for stack "${stackName}" - did not find exactly 1 output with that name ": ${JSON.stringify(response.Stacks[0])}`);
        }

        return matches[0].OutputValue;
      });
  }

  evaluateHealthCheck(endpoint) {
    return request
      .get(endpoint)
      .then(response => {
        this.serverless.cli.log(`${endpoint}: ${response}`);
        if (JSON.parse(response) !== 'OK') {
          throw new Error(`Unexpected health check response. ${endpoint}: ${response}`);
        }
      })
      .catch(err => {
        this.serverless.cli.log(`${endpoint}: ${err}`);
        throw(err);
      });
  }

  /* hooks */
  healthcheck() {
      this.getEndpointPrefixFromStackPromise()
        .then(endpoint => this.evaluateHealthCheck(endpoint + '/healthcheck'))
  }
}

module.exports = GatewayHealthCheck;
