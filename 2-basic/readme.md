# Basic

## Getting Started

Navigate to the working directory.

```sh
cd 2-basic
```

## Deploy

Update your application:

```sh
serverless deploy
```

When complete, you will have a new function called `greet` (and `hello` is gone!). This function expects a name to be passed in.

## Invoke

Invoking your function (`serverless invoke -f greet`) will produce an error:

```json
{
    "errorMessage": "Please provide a name.",
    "errorType": "Error",
    "stackTrace": [
        "exports.handler (/var/task/greet.js:21:9)"
    ]
}
```

You need to pass data to the function or it will continue to throw an Error. The `invoke` command takes an additional argument called `--data` (or `-d` for short) which passes in some text.

Try the following command:

```sh
serverless invoke -f greet -d '{"name":"d2lsupport"}'
```

This will return `"Hello d2lsupport! numSuccessfulCalls: 1"`

If you run the above command again, you will notice that `numSuccessfulCalls` increases. This is because Lambdas, while best thought of as stateless, stick around for a while (stay 'warm'). If you were to concurrently request many invocations, `numSuccessfulCalls` might appear erratic as new containers spin up and requests get load balanaced between them. No state is shared between these containers, despite all being part of the "same" function.

## Logs

If you look at the `greet.js` source code, you will see `console.log('Event:', JSON.stringify(event));`

Lambda integrates with CloudWatch and `stdout` is sent to CloudWatch Logs.

Wait a minute or so, and then run the following command:

```sh
serverless logs -f greet
```

You should see something similar to:

```sh
START RequestId: 0e283867-e16a-11e8-a707-2dc309265183 Version: $LATEST
2018-11-05 21:17:05.683 (-05:00)	0e283867-e16a-11e8-a707-2dc309265183	Event: {"name":"d2lsupport"}
END RequestId: 0e283867-e16a-11e8-a707-2dc309265183
REPORT RequestId: 0e283867-e16a-11e8-a707-2dc309265183	Duration: 3.35 ms	Billed Duration: 100 ms 	Memory Size: 1024 MB	Max Memory Used: 20 MB
```

Lambda automatically logs the `START`, `END` and `REPORT` entries for each invocation. The custom log message is prefixed automatically by Lambda as well. This can be bypassed by writing directly to `process.stdout` (such as when using a structured logging library) rather than `console.log`
