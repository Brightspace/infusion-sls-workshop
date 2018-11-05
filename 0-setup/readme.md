# Setup

This document contains setup instructions that need to be completed before the workshop.

## Node.js

AWS Lambda currently supports Node.js versions 4.3, 6.10, and 8.10.

We will be using the 8.10 version. Download and run the appropriate installer for [Windows](https://nodejs.org/download/release/v8.10.0/node-v8.10.0-x64.msi) or [MacOS](https://nodejs.org/download/release/v8.10.0/node-v8.10.0.pkg)

## Serverless

For this workshop, we are going to use a global installation of Serverless to keep things simple.

Run:

```sh
npm install -g serverless@1.32.0
```

## AWS Credentials

Open a command line or terminal window and enter:

```sh
serverless config credentials -p aws -n infusion-workshop -k <access_key> -s <secret_key>
```

`<access_key>` and `<secret_key>` are values that will be provided to you. This will configure an AWS Profile called `infusion-workshop` that won't interfere with your other AWS credentials.

To verify that your credentials work, run the following in this directory (`0-setup`):

```sh
npm it
```

You should get a response that looks like

```sh
Success!
{"ResponseMetadata":{"RequestId":...}
```

If you get an error, please reach out to us to get it resolved.

## HTTP Client

Part of the workshop requires making HTTP requests to the Serverless Framework application, and you will need more than a web browser to make these (PUT, DELETE) requests. Please bring along your favourite HTTP client - we recommend [Postman](https://www.getpostman.com/apps) but you can use `curl` or `wget` if you prefer.
