# Helo World

## Getting Started

Navigate to the working directory.

```sh
cd 1-helloworld
```

## Deploy

Everything you need is already available in this directory. Simply run the
following command to deploy this Serverless app:

```sh
serverless deploy
```

## Invoke

Once this has completed, you can invoke the `hello` function.

```sh
serverless invoke -f hello
```

This works because the `serverless.yml` defines the function:

```yml
functions:
  hello:
    handler: hello.handler
```
