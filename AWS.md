# Deploy to AWS (Serverless)

If you have your own AWS account, this deploys as serverless functions (Lambda + API Gateway).

---

## Prerequisites

1. **AWS Account** - You have one
2. **Node.js** - Installed
3. **AWS CLI** configured

---

## Option 1: Serverless Framework (Recommended)

### Install

```bash
npm install -g serverless
```

### Create serverless.yml

Create `serverless.yml` in project root:

```yaml
service: schemaorg-agent

provider:
  name: aws
  runtime: nodejs18.x
  stage: dev
  region: us-east-1
  memorySize: 1024
  timeout: 30
  environment:
    GROQ_KEY: ${env:GROQ_KEY}
    NEXTAUTH_SECRET: ${env:NEXTAUTH_SECRET}
    NEXTAUTH_URL: ${env:NEXTAUTH_URL}

functions:
  api:
    handler: backend/route.api
    events:
      - http:
          path: /{proxy+}
          method: ANY
          cors: true
      - http:
          path: /
          method: ANY
          cors: true

# Optional: Bundle with Vite
plugins:
  - serverless-plugin-lambda-edge
```

### Deploy

```bash
# Set env vars
export GROQ_KEY=sk-your-key
export NEXTAUTH_SECRET=your-secret
export NEXTAUTH_URL=https://xxx.execute-api.us-east-1.amazonaws.com

# Deploy
serverless deploy
```

---

## Option 2: SAM CLI

### Install

```bash
brew install aws-sam-cli
# or: pip install aws-sam-cli
```

### Create template.yaml

```yaml
AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31
Description: Schema.org Agent

Resources:
  ApiFunction:
    Type: AWS::Serverless::Function
    Properties:
      Runtime: nodejs18.x
      Handler: handler.api
      Timeout: 30
      MemorySize: 1024
      Environment:
        Variables:
          GROQ_KEY: ${env:GROQ_KEY}
      Events:
        Api:
          Type: HttpApi
          Properties:
            Path: /{proxy+}
            Method: ANY

Outputs:
  ApiUrl:
    Description: API endpoint
    Value: !Sub "https://${ServerlessRestApi}.execute-api.${AWS::Region}.amazonaws.com"
```

### Deploy

```bash
sam build
sam deploy --guided
```

---

## Option 3: CloudFormation (Raw)

### Upload to S3

```bash
# Zip function
zip -r function.zip . -x "node_modules/*"

# Upload
aws s3 cp function.zip s3://your-bucket/
```

### Create Stack

```bash
aws cloudformation create-stack \
  --stack-name schemaorg-agent \
  --template-body file://cfn-template.yaml \
  --parameters ParameterKey=FunctionBucket,ParameterValue=your-bucket
```

---

## Environment Variables

Set in AWS Console: **Lambda → Configuration → Environment variables**

| Key | Value |
|-----|-------|
| `GROQ_KEY` | From https://console.groq.com |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Your API Gateway URL |

---

## Cold Start Fix

Add Lambda reserved concurrency:

```yaml
provisionedConcurrency: 1
```

Or use Lambda@Edge for global edge.

---

## Custom Domain

1. Create API in API Gateway
2. Request certificate in ACM
3. Create custom domain in API Gateway
4. Add record in Route 53

---

## Pricing

- Lambda: $0.20/1M requests + $0.000016666/GB-sec
- API Gateway: $3.50/1M requests
- Data transfer: $0.09/GB out

**Estimated**: $0-10/month for low traffic

---

## Quick Commands

| Action | Command |
|--------|---------|
| Deploy | `serverless deploy` |
| Logs | `serverless logs -f api` |
| Invoke | `serverless invoke -f api -d '{"body":"test"}'` |
| Remove | `serverless remove` |