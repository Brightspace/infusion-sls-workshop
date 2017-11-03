## Getting Started

Navigate to the working directory.

```sh
cd 1-helloworld
```

## Walkthrough

Everything you need is already available in this directory. Simply run the
following commands to deploy this Serverless project, where `<stage>` is your
username:

```sh
# Deploy the "Hello World" Lambda function
npm run sls -- deploy --stage <stage>

# Invoke your function!
npm run sls -- invoke --stage <stage> --function hello
```

## Do-It-Yourself Walkthrough

This section contains steps to do this from scratch.

Create a `package.json` file, which contains metadata about the node project.
```
# npm init
This utility will walk you through creating a package.json file.
It only covers the most common items, and tries to guess sensible defaults.

See `npm help json` for definitive documentation on these fields
and exactly what they do.

Use `npm install <pkg> --save` afterwards to install a package and
save it as a dependency in the package.json file.

Press ^C at any time to quit.
name: (a-template) user-management-service
version: (1.0.0)
description: A simple user management service
entry point: (index.js) handler.js
test command:
git repository:
keywords:
author:
license: (ISC) UNLICENSED
About to write to C:\workspace\infusion-sls-workshop\1-intro\a-template\package.json:

{
  "name": "user-management-service",
  "version": "1.0.0",
  "description": "A simple user management service",
  "main": "handler.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "UNLICENSED"
}


Is this ok? (yes) yes
```

Add an entry to the `scripts` section to access the tool easily:

The `package.json` file should look like this afterwards:

```json
{
  "name": "user-management-service",
  "version": "1.0.0",
  "description": "A simple user management service",
  "main": "handler.js",
  "scripts": {
    "sls": "sls",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "UNLICENSED",
  "devDependencies": {}
}

```

Create a Serverless template:

```
# npm run sls -- create -t aws-nodejs --name user-management-service

> user-management-service@1.0.0 sls C:\workspace\infusion-sls-workshop\1-intro\a-template
> sls "create" "-t" "aws-nodejs"

Serverless: Generating boilerplate...
 _______                             __
|   _   .-----.----.--.--.-----.----|  .-----.-----.-----.
|   |___|  -__|   _|  |  |  -__|   _|  |  -__|__ --|__ --|
|____   |_____|__|  \___/|_____|__| |__|_____|_____|_____|
|   |   |             The Serverless Application Framework
|       |                           serverless.com, v1.22.0
 -------'

Serverless: Successfully generated boilerplate for template: "aws-nodejs"
```

Deploy the "Hello World" Lambda function...:

```
# npm run sls -- deploy --stage <stage>

> user-management-service@1.0.0 sls C:\workspace\infusion-sls-workshop\1-intro\a-template
> sls "deploy" "--stage" "<stage>"

Serverless: Creating Stack...
Serverless: Checking Stack create progress...
.....
Serverless: Stack create finished...
Serverless: Uploading CloudFormation file to S3...
Serverless: Uploading artifacts...
Serverless: Uploading service .zip file to S3 (11.13 KB)...
Serverless: Validating template...
Serverless: Updating Stack...
Serverless: Checking Stack update progress...
...............
Serverless: Stack update finished...
Serverless: Invoke aws:info
Service Information
service: user-management-service
stage: <stage>
region: us-east-1
stack: user-management-service-<stage>
api keys:
  None
endpoints:
  None
functions:
  hello: user-management-service-<stage>-hello
Serverless: Invoke aws:deploy:finalize
```

and invoke it!

```
# npm run sls -- invoke --stage <stage> --function hello

> user-management-service@1.0.0 sls C:\workspace\infusion-sls-workshop\1-intro\a-template
> sls "invoke" "--stage" "<stage>" "--function" "hello"

"Hello world!"
```
