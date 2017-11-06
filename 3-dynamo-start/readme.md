## Getting Started

Navigate to the working directory.

```sh
cd 3-dynamo-start
```

## Walkthrough

In this stage we will create the basic functionality of our user management
service: creating, getting, and deleting users from a DynamoDB table.

### Custom Variables
The handler functions interact with a DynamoDB table, which Serverless can
create for us. First, we'll create a custom variable for the name of the table,
since we will refer to it in multiple places.

Create a new section in `serverless.yml` called `custom` to contain a `table`
property. Append your stage name to avoid collisions with other tables in the
AWS account:

```
custom:
  table: users-${opt:stage}
```

Variables in the `custom` section can be referred to with the syntax
`${self:custom.VARIABLE_NAME}`.

### Resources
The `resources` section of `serverless.yml` defines AWS CloudFormation resources
that will be created when we deploy our project. We can create the DynamoDB
table using the CloudFormation described
[here](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html).

The DynamoDB table will store the Id and Name for each user (both strings),
keyed on Id. Since Dynamo is schemaless, we only need to define the Id
attribute (the key schema) in CloudFormation.

Create a new section in `serverless.yml` called `resources` with the
CloudFormation definition of the DynamoDB table. The propterties that need to
be defined are:

* `TableName`: using the custom `table` variable we created above
* `AttributeDefinitions`: the name (Id) and type (string) of the key schema
* `KeySchema`: the name and key type (HASH)
* `ProvisionedThroughput`: amount of read and write units for our table; we'll use 1 for both (see [here](http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/ProvisionedThroughput.html) for more information on throughput)

```
resources:
  Resources:
    table:
      Type: "AWS::DynamoDB::Table"
      Properties:
        TableName: ${self:custom.table}
        AttributeDefinitions:
          - AttributeName: Id
            AttributeType: S
        KeySchema:
          - AttributeName: Id
            KeyType: HASH
        ProvisionedThroughput:
          ReadCapacityUnits: 1
          WriteCapacityUnits: 1
```

### Environment Variables
To refer to the DynamoDB table in the handler functions, we can pass in the
table name as an environment variable. Environment variables can be defined in
the `provider.environment` section of `serverless.yml` where they are passed to
all lambda functions, or they can be defined for an individual function.

Add an `environment` property to the existing `provider` section in
`serverless.yml` and define a `TABLE` environment variable:

```
provider:
  environment:
    TABLE: ${self:custom.table}
```

### Permissions
Finally, we need to give the lambda functions permission to interact with the
DynamoDB table by defining IAM policy statements. `${self:custom.table}`
is used as the `Resource` so that the permissions only apply to the DynamoDB
table we created.

Add an `iamRoleStatements` property to the existing `provider` section in
`serverless.yml` and with the following IAM role statements:

```
provider:
  iamRoleStatements:
    - Effect: Allow
      Action:
        - dynamodb:DeleteItem
        - dynamodb:GetItem
        - dynamodb:PutItem
      Resource: arn:aws:dynamodb:*:*:table/${self:custom.table}
```

### Handlers
`handler.js` has been replaced with stubs of the three new functions
(`addUser.js`, `deleteUser.js`, and `getUser.js`), and the `functions` section
of `serverless.yml` has been updated.

Add the proper DynamoDB API calls to `addUser.js`, `deleteUser.js`, and
`getUser.js`. An example of how to format the parameters is in `addUser.js`.
Consider using the following functions:

* [putItem()](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#putItem-property)
* [deleteItem()](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#deleteItem-property)
* [getItem()](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#getItem-property)

Once you're done, try running some of the examples below! If you get stuck,
check out the sample solution in `3-dynamo`.

## Examples

```sh
# Deploys the lambda functions and DynamoDB table
npm run sls -- deploy --stage <stage>

# Add a user
npm run sls -- invoke --stage <stage> --function addUser --data "{\"name\":\"d2lsupport\", \"id\": \"169\"}"
# View the table in the DynamoDB console to see the added user

# Get the user
npm run sls -- invoke --stage <stage> --function getUser --data "{\"id\": \"169\"}"
# Response
# {
#    "Id": "169",
#    "Name": "d2lsupport"
# }

# Delete the user
npm run sls -- invoke --stage <stage> --function deleteUser --data "{\"id\": \"169\"}"
# View the table in the DynamoDB console to see that the user is removed

# Get deleted user
npm run sls -- invoke --stage <stage> --function getUser --data "{\"id\": \"169\"}"
# Response
# {}
```
