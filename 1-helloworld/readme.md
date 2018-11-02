# Helo World

## Getting Started

Navigate to the working directory.

```sh
cd 1-helloworld
```

## Walkthrough

Everything you need is already available in this directory. Simply run the
following command to deploy this Serverless project:

```sh
npx serverless deploy
```

Once this has completed, you can invoke the `hello` function.

```sh
npx serverless invoke -f hello
```

## Do-It-Yourself Walkthrough

Create a Serverless template:

```sh
# npx serverless create -t aws-nodejs --name user-management-service

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
