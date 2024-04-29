# AWS Project
## Getting Started with Create React App

1. Clone the repository
2. cd fovus-project
3. npm install
4. npm start

## On the AWS Part
### S3 Bucket
1. We need to Create a S3 bucket called **fovusbuckettest**
2. Create an IAM role for the s3 bucket to have access to the s3 bucket.
3. Assign this role to a user and create an access key and value for the role.
4. This access key and value is to be added in App.js

### Creating a DynamoDB
1. Create a DynamoDB named **fovusstorage** to store the bucketname/file and inputText.
2. The primary key should be assigned the variable **id** and it should be of type string.
3. Also activate the DynamoDB stream and choose the option New and old images.
4. Add the trigger **nodejsec2** mentioned in Lambda function point 4 and 5.

### Creating Lambda function for DynamoDB
1. Create a lambda function called **nodejstrial** which will be triggered whenever a request is to be sent to the DynamoDB table. A 30 seconds timeout should be fine.
2. This lambda function should have access to the DynamoDB hence a role for this lambda function having access to DynamoDB. AWSLambdaBasicExecutionRole and AWSLambdaMicroserviceExecutionRole should be sufficient. Choose NodeJS 20.x.
3. Copy the index.mjs in lambda/nodejstrial folder into the index.mjs for the lambda function.
4. Create **nodejsec2** which will be triggered whenever there is an insertion in DynomoDB this Lambda will be responsible to create the EC2 instance and run the shell script on the ec2. Later this ec2 is gracefully terminated automatically.
5. This lambda function should have access to EC2, AmazonSSMFullAccess,AmazonSSMManagedInstanceCore, IAM Access and the S3 Bucket. This could be done by creating a role and assigning the policies which are already provided by AWS.
6. Make sure that the Lambda function **nodejsec2** has a timeout of 6 mins as it takes time for the ec2 instance to spin up.

### Creating roles for EC2
1. To run ssm.Client() commands the Ec2 should have access to policies of AmazonSSMFullAccess,AmazonSSMManagedInstanceCore and resources of S3 and DynamoDB. This can be done by creating an IAM role for the ec2. This role should be updated in the lambda function **nodejsec2** in the parameters for creating an EC2 instance by updating
   IamInstanceProfile: {
                Arn: "Instance profile name"
             }


### Creating the API Gateway
1. Create a HTTP gateway called **nodejlambda** which act as a gateway to the lambda function **nodejstrial**.
2. Update the apiGateUrl variable also in App.js with the api gateway generated once it is created.

## Demo
1. After starting the react app upload a .txt file with some content, input and script.sh file. Do not forget the script.sh
2. You will see that the files .txt and script.sh get uploaded to the S3 bucket and bucketname/.txt and inputText is updated on the DynamoDB
3. This will trigger a DynamoDB event which will trigger another lambda function which will spin up an EC2 instance, download the script.sh and .txt file from the s3 bucket, Run the script to append the .txt with input content and create a Output.txt which will be uploaded to the S3 bucket.
4. The ouput file and its id is then stored in DynamoDB
5. Once these commands are executed the EC2 instance is gracefully terminated.

## Demo
<img width="891" alt="api-gateway-to-lambda" src="https://github.com/adichaloo/fovus-project/assets/46870107/6e2850c7-54ac-4fe2-8535-820dff7d50fa">

<img width="705" alt="dynamo-trigger-lambda" src="https://github.com/adichaloo/fovus-project/assets/46870107/178207a3-4083-4a12-b904-894a5264ec4c">

## [Video Demo](https://drive.google.com/file/d/1UbBrHnw9Gmc7f3h3qfh9mj-i2m_EXEMO/view?usp=sharing)

Click on Video Demo

