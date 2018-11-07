# Plugins

## Getting Started

Navigate to the working directory.

```sh
cd 5-plugins
```

In this stage we will install some plugins that help with various aspects of deployment and configuration.

Plugins are published as regular Node.js libraries to `npm`, and usually - but not always - prefixed with `serverless-plugin-` to aid in discoverability.

## Install serverless-plugin-aws-alerts

This plugin injects additional CloudFormation Resources to help with monitoring and alerting.

Install it using the following command:

```sh
serverless plugin install -n serverless-plugin-aws-alerts
```

This changed a few things. First, it generated a `package.json` file to reference the node module and asked `npm` to install it. Then it added this to `serverless.yml`:

```yml
plugins:
  - serverless-plugin-aws-alerts
 ```

Just because a plugin is installed, does not mean it will load - it has to be in listed in `serverless.yml`.

If you examine `serverless.yml` you will see:

```yml
custom:
  alerts:
    alarms:
      - functionThrottles
      - functionErrors
```

The custom section is where all kinds of configuration properties may be written. Plugins usually read this section in order to determine how to behave. In this case, the alerts plugin looks for it's configuration in a second level `alerts` block, and it sees that we want two `alarms` created - one for throttles and one for errors _for each function_.

## Package

The plugin you just installed hooks in to the `package` lifecycle. You have previously used the `serverless deploy` command, which actaully triggers the `package` lifecycle first, as a prerequisite, but you can also run package directly:

```sh
serverless package
```

This essentialy does everything _except_ deploy the application. To see what resources were added, you can view `./.serverless/cloudformation-template-update.json`. You should see a few resources with `"Type": "AWS::CloudWatch::Alarm"` - those were created by the plugin, so you don't have to!

## Install serverless-prune-plugin

This plugin adds a new command, `prune` which will remove old version of your Lambda function from the cloud.

Install it just like you did the alerts plugin:

```sh
serverless plugin install -n serverless-prune-plugin
```

This plugin adds a new command, `prune`. Try pruning everything except the most recent version of your Lambda:

```sh
serverless prune -n 1
```
