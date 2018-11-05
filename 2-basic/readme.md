# Basic

## Getting Started

Navigate to the working directory.

```sh
cd 2-basic
```

## Deployment

Update your application:

```sh
serverless deploy
```

## Invoke

The next two commands will throw an Error with a stack trace and output:

> {"errorMessage": "Please provide a user and a user ID."}

Invoke your function with no event:

```sh
serverless invoke -f hello
```

Invoke your function with an event containing insufficient data

```sh
serverless invoke -f hello --data '{"name":"d2lsupport"}'
```

The next command will succeed with output:

> "Hello d2lsupport (169)! Number of successful calls: 1"

Invoke your function with an event (sufficient data)

```sh
serverless invoke -f hello --data '{"name":"d2lsupport","id":"169"}'
```

If you run the above command again, you will notice that the number of successful calls increases. This is because Lambdas, while best thought of as stateless, stick around for a while (stay 'warm').

## Logs

Run the following command:

```sh
serverless logs -f hello
```

