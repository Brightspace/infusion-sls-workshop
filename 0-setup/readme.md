We will have a limited number of laptops already configured to work at the
workshop. Depending on the number of attendees, we may ask you to bring your own
if possible.

This document contains setup instructions for those bringing your own laptops
that need to be completed before the workshop.

## Node.js Setup

AWS Lambda currently supports Node.js versions 4.3, 6.10, and 8.10. We will
be using the 8.10 version.

### Windows

Download and run the [8.10
msi](https://nodejs.org/download/release/v8.10.0/node-v8.10.0-x64.msi). If you
already have Node.js, but at a different version, you can consider installing
[nvm-windows](https://github.com/coreybutler/nvm-windows) to switch between the
two versions.

### Mac

Download and run the [8.10
pkg](https://nodejs.org/download/release/v8.10.0/node-v8.10.0.pkg). If you
already have Node.js, but at a different version, you can consider installing
[nvm](https://github.com/creationix/nvm) to switch between the two versions.

### Linux

Please contact us if you would like to use a Linux machine and are not able to
set up Node.js 8.10. If you already have Node.js but at a different version, you
can consider installing [nvm](https://github.com/creationix/nvm) to switch
between the two versions.

## Serverless Setup

Run the following:

```sh
npm install --global serverless@1.22.0
```

To reduce network usage, we built these samples to use the global `serverless`
dependency. However, for your own projects, it is recommended to add it to your
`devDependencies` section like so:

```json
{
  "name": "infusion-sls-workshop-helper",
  "version": "1.0.0",
  "description": "Helper package for setting up for the infusion sls workshop.",
  "main": "validate.js",
  "scripts": {
    "sls": "sls",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "UNLICENSED",
  "devDependencies": {
    "serverless": "1.22.0"
  }
}
```

Note: these samples were developed against version 1.22.0, but you are free to
experiment with the newest version by running:

```sh
npm install --global serverless
```

## Credentials Setup

**If you are already set up for AWS access, these steps may overwrite your
existing credentials file. Consider making a backup of your [credentials
file](http://docs.aws.amazon.com/cli/latest/userguide/cli-config-files.html)
first.**

You are free to use your own AWS account, but note that we might not have time
to troubleshoot any issues due to account configurations.

More details available in [AWS
documentation](http://docs.aws.amazon.com/cli/latest/userguide/cli-config-files.html).

Open a command line or terminal window in this directory (`0-setup`), and run
the following:

```sh
# Install helper libraries defined in `package.json`
# for setting up and validating AWS credentials.
npm install

# `npm run sls` runs the Serverless Framework command line tool (CLI),
# and anything after `--` is parameters for the CLI.
npm run sls -- config credentials --provider aws --key <access_key> --secret <secret_key>
```

`<access_key>` and `<secret_key>` are values that will be provided to you before
the workshop.

## HTTP Client

Part of the workshop requires making HTTP requests to the Serverless Framework
application, and you will need more than a web browser to make these (PUT,
DELETE) requests. Please bring along your favourite HTTP client - we recommend
[Postman](https://www.getpostman.com/apps).

## Validation

Run the following:

```sh
node validate.js
```

You should get the following response:

```
Success!
{"ResponseMetadata":{"RequestId":...},"User":{"Path":"/","UserName":...,"UserId":...,"Arn":...,"CreateDate":...}}
```

If you get an error, please reach out to us to get it resolved.
