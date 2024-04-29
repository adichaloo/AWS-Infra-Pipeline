# Getting Started with Create React App

1. Clone the repository
2. cd fovus-project
3. npm install
4. npm start

# On the AWS Part
## S3 Bucket
1. We need to Create a S3 bucket called **fovusbuckettest**
2. Create an IAM role for the s3 bucket to have access to the s3 bucket.
3. Assign this role to a user and create an access key and value for the role.
4. This access key and value is to be added in App.js

## Creating a DynamoDB
1. Create a DynamoDB of name **fovusstorage** to store the bucketname/file and inputText.
2. The primary key should be assigned the variable **id** and it should be of type string.
3. Also activate the DynamoDB stream and choose the option New and old images.

## Creating Lambda function for DynamoDB

## Creating the API Gateway
1. Create a HTTP gateway called **nodejlambda** which act as a gateway to the lambda function **nodejstrial**.
2. Update the apiGateUrl variable also in App.js with the api gateway generated once it is created.



