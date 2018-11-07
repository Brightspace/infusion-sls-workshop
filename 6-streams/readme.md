# Streams

## Getting Started

Navigate to the working directory.

```sh
cd 6-streams
```

You will enable a DynamoDB Stream and connect a new Lambda function to it. If you get stuck you can look in the `7-finish` directory for a working solution.

## Enable The Stream

The following needs to be added to your DynamoDB Table Properties in `serverless.yml`

```yml
StreamSpecification:
  StreamViewType: NEW_AND_OLD_IMAGES
```

## Function

A new Lambda function needs to be defined.

- It should use `stream.handler` as the handler
- It needs to have an `event` configured to invoke it from the DynamoDB Stream.

Have a look [here](https://serverless.com/framework/docs/providers/aws/events/streams/) to see an example of the DyanmoDB `stream` event type. Serverless will automatically add the necessary permissions for you!

## Deploy

```sh
serverless deploy
```

When the deploy is complete, try interacting with your API - create a user, delete a user.

After some time has passed, examine the logs for the stream function. Assuming you named it `stream`:

```sh
serverless logs -f stream
```

You should see the event logged, with a `Records` array. Each item in the array describes a change to the Dynamo table with associated metadata.

This is an example of a single record:

```json
 {
  "eventID": "2c3c9f4192fb1f2447b3f47cfe741eb2",
  "eventName": "MODIFY",
  "eventVersion": "1.1",
  "eventSource": "aws:dynamodb",
  "awsRegion": "us-east-1",
  "dynamodb": {
    "ApproximateCreationDateTime": 1541552460,
    "Keys": {
      "id": {
        "S": "1"
      }
    },
    "NewImage": {
      "name": {
        "S": "test2"
      },
      "id": {
        "S": "1"
      }
    },
    "OldImage": {
      "name": {
        "S": "test"
      },
      "id": {
        "S": "1"
      }
    },
    "SequenceNumber": "3633500000000062125042319",
    "SizeBytes": 26,
    "StreamViewType": "NEW_AND_OLD_IMAGES"
  },
  "eventSourceARN": "arn:aws:dynamodb:us-east-1:306988141716:table/user-management-service-dmoscrop-Table-1W29TNEPIN2HX/stream/2018-11-06T23:29:42.757"
}
```

Here, `NewImage` and `OldImage` represent the previous and current value of the record, but are formatted in a low-level Dynamo way. The AWS SDK offers a helper method to turn them in to plain objects:

```js
const aws = require('aws-sdk');

exports.handler = async (event) => {
  event.Records.forEach(record => {
    const newRecord = aws.DynamoDB.Converter.unmarshall(record.dynamodb.NewImage);
    console.log('value is now', JSON.stringify(newRecord, null, 2));
  });
};
```
