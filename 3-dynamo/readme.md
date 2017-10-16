## Getting Started

Navigate to the working directory.

```sh
cd 3-dynamo
```

## Walkthrough

In this stage we will create the basic functionality of our user management
service: creating, getting, and deleting users from a DynamoDB table.

### Handlers
First, replace `handler.js` with the handlers for the three functions
(`addUser.js`, `deleteUser.js`, and `getUser.js`) and update the `functions`
section of `serverless.yml`.

### Custom Variables
The handler functions interact with a DynamoDB table, which Serverless can
create for us. First, we'll create a custom variable in the `serverless.yml`
file for the name of the table, since we will refer to it in multiple places.

```
custom:
  table: users-${opt:stage}
```

Variables in the `custom` section can be referred to with the syntax
`${self:custom.VARIABLE_NAME}`.

### Resources
The `resources` section of `serverless.yml` defines AWS CloudFormation
resources that will be created when we deploy our project. We can create the
DynamoDB table using the CloudFormation described
[here](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html),
and using the custom `table` variable for the `TableName` property.

```
resources:
  Resources:
    table:
      Type: "AWS::DynamoDB::Table"
      Properties:
        TableName: ${self:custom.table}
        ...
```

### Environment Variables
To refer to the DynamoDB table in the handler functions, we can pass in the
table name as an environment variable. Environment variables can be defined in
the `provider.environment` section of `serverless.yml` where they are passed
to all lambda functions, or they can be defined for an individual function.

```
provider:
  environment:
    TABLE: ${self:custom.table}
```

### Permissions
Finally, we need to give the lambda functions permission to interact with the
DynamoDB table by defining IAM policy statements in the
`provider.iamRoleStatements` section of `serverless.yml`.
`${self:custom.table}` is used as the `Resource` so that the permissions only
apply to the DynamoDB table we created.

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
