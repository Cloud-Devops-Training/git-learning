aws-cost-cli
CLI tool to perform cost analysis on your AWS account with Slack integration



Installation
Install the package globally or alternatively you can also use npx

npm install -g aws-cost-cli
Usage
For the simple usage, just run the command without any options.

aws-cost
The output will be a the totals with breakdown by service. Optionally, you can pass the following options to modify the output:

$ aws-cost --help

  Usage: aws-cost [options]

  A CLI tool to perform cost analysis on your AWS account

  Options:
    -V, --version                  output the version number

    -k, --access-key [key]         AWS access key
    -s, --secret-key [key]         AWS secret key
    -r, --region [region]          AWS region (default: us-east-1)

    -p, --profile [profile]        AWS profile to use (default: "default")

    -j, --json                     Get the output as JSON
    -u, --summary                  Get only the summary without service breakdown
    -t, --text                     Get the output as plain text (no colors / tables)

    -S, --slack-token [token]      Slack token for the slack message
    -C, --slack-channel [channel]  Slack channel to post the message to

    -v, --version                  Get the version of the CLI
    -h, --help                     Get the help of the CLI
In order to use the CLI you can either pass the AWS credentials through the options i.e.:

aws-cost -k [key] -s [secret] -r [region]
or if you have configured the credentials using aws-cli, you can simply run the following command:

aws-cost
To configure the credentials using aws-cli, have a look at the aws-cli docs for more information.

Docker
You can build this Dockerfile using the docker build command and then run a container from the built image. For example:

docker build -t aws-cost-cli .
docker run aws-cost-cli
Detailed Breakdown
The default usage is to get the cost breakdown by service

aws-cost
You will get the following output

Default Usage

Total Costs
You can also get the summary of the cost without the service breakdown

aws-cost --summary
You will get the following output

Summary Usage

Plain Text
You can also get the output as plain text

aws-cost --text
You will get the following output in response

Text Usage

JSON Output
You can also get the output as JSON

aws-cost --json
You will get the following output in response
Slack Integration
You can also get the output as a slack message

You will need to create a slack app, visit the OAuth & Permissions tab, and add the chat:write and chat:write.public scopes. Then create an OAuth token from the "OAuth Tokens" section and pass it to the CLI.

Note: The --slack-channel is the channel id, not the name.

aws-cost --slack-token [token] --slack-channel [channel]
You will get the message on slack with the breakdown:

Slack Usage

You can set up a GitHub workflow similar to this which can send the daily cost breakdown to Slack.

Note
Regarding the credentials, you need to have the following permissions in order to use the CLI:

{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "VisualEditor0",
      "Effect": "Allow",
      "Action": [
        "iam:ListAccountAliases",
        "ce:GetCostAndUsage"
      ],
      "Resource": "*"
    }
  ]
}
Also, please note that this tool uses AWS Cost Explorer under the hood which costs $0.01 per request.
