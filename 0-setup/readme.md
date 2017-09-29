We will have a limited number of laptops already configured to work at the
workshop. Depending on the number of attendees, we may ask you to bring your own
if possible.

This document contains setup instructions for those bringing your own laptops
that need to be completed before the workshop.

## Credentials Setup

You are free to use your own AWS account, but note that we might not have time
to troubleshoot any issues due to account configurations.

More details available in [AWS
documentation](http://docs.aws.amazon.com/cli/latest/userguide/cli-config-files.html).

### Windows

Open up Windows Explorer, and type in `%USERPROFILE%`. Create a folder named
`.aws`, and create a file named `credentials`. The full path to the file should
be `C:\Users\<your_username>\.aws\credentials`.

Edit the file using Notepad or another text editor, and paste in the following:

```ini
[default]
aws_access_key_id = <access_key>
aws_secret_access_key = <secret_key>
```

where `<access_key>` and `<secret_key>` will be provided to you before the
workshop.

### Mac / Linux

Open up a terminal, and run the following:

```sh
echo '[default]' >> `~/.aws/credentials`
echo 'aws_access_key_id = <access_key>' >> `~/.aws/credentials`
echo 'aws_secret_access_key = <secret_key>' >> `~/.aws/credentials`
```

where `<access_key>` and `<secret_key>` will be provided to you before the
workshop.

## Node.js Setup

AWS Lambda currently supports Node.js versions 4.3 and 6.10. We will be using
the 6.10 version.

### Windows

Download and run the [6.10
msi](https://nodejs.org/download/release/v6.10.3/node-v6.10.3-x64.msi). If you
already have Node.js, but at a different version, you can consider installing
[nvm-windows](https://github.com/coreybutler/nvm-windows) to switch between the
two versions.

### Mac

Download and run the [6.10
pkg](https://nodejs.org/download/release/v6.10.3/node-v6.10.3.pkg). If you
already have Node.js, but at a different version, you can consider installing
[nvm](https://github.com/creationix/nvm) to switch between the two versions.

### Linux

Please contact us if you would like to use a Linux machine and am not able to
set up Node.js 6.10. If you already have Node.js, but at a different version,
you can consider installing [nvm](https://github.com/creationix/nvm) to switch
between the two versions.

## Validation

Run the following:

```sh
npm i aws-sdk
node validate.js
```

You should get the following response:

```
Success!
{"ResponseMetadata":{"RequestId":...},"User":{"Path":"/","UserName":...,"UserId":...,"Arn":...,"CreateDate":...}}
```

If you get an error, please reach out to us to get it resolved.
