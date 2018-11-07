# Dynamo

## Getting Started

Navigate to the working directory.

```sh
cd 4-dynamo
```

In this stage we will implement the basic functionality of our user management
service: creating, getting, and deleting users from a DynamoDB table.

## Resources

The `resources` section of `serverless.yml` defines custom AWS CloudFormation resources
that will be created when we deploy our project. We define the DynamoDB
table using the CloudFormation described
[here](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html).

The DynamoDB table stores the Id and Name for each user (both strings),
keyed on Id. Since Dynamo is schemaless, we only need to define the Id
attribute (the key schema) in CloudFormation.

* `AttributeDefinitions`: the name (Id) and type (string) of the key schema
* `KeySchema`: the name and key type (HASH)
* `ProvisionedThroughput`: amount of read and write units for our table; we'll use 1 for both (see [here](http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/ProvisionedThroughput.html) for more information on throughput)

## Environment Variables

To refer to the DynamoDB table in the handler functions, we can pass in the
table name as an environment variable. Environment variables can be defined in
the `provider.environment` section of `serverless.yml` where they are passed to
all lambda functions, or they can be defined for an individual function.

```yml
provider:
  environment:
    TABLE_NAME:
      Ref: Table
```

The `Ref` concept is a CloudFormation intrinsic function. It is not handled by Serverless but rather passed along during deployment, and CloudFormation performs the substitution of the appropriate value. This can be confusing for beginners as it's not always clear what aspects of the configuraion file are being handled by Serverless, and which are CloudFormation constructs.

## Permissions

Finally, we needed to give the Lambda functions permission to interact with the
DynamoDB table by defining IAM policy statements.

This is accomplished via the `iamRoleStatements` property:

```yml
provider:
  iamRoleStatements:
    - Effect: Allow
      Action:
        - dynamodb:PutItem
        - dynamodb:GetItem
        - dynamodb:DeleteItem
      Resource:
        Fn::GetAtt:
          - Table
          - Arn
```

`Fn::GetAtt` is another CloudFormation intrinsic like `Ref`

## Deploy

Run `serverless deploy` to create your DynamoDB Table. After it is complete, your API will still be throwing "Not implemented" Errors.

## Implementation

Open up `repository.js`. Your task is to implement the three methods using the DynamoDB DocumentClient!

Each time you make a change to your source code and you want to test it, you can `serverless deploy` again. When you are finished you should be able to create a user, get that user back, then delete them.

If you get stuck, you can look ahead at the code in the `5-plugins`!
