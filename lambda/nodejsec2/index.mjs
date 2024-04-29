// export const handler = async (event) => {
//   // TODO implement
//   const response = {
//     statusCode: 200,
//     body: JSON.stringify('Hello from Lambda!'),
//   };
//   return event;
// };

import { EC2Client,RunInstancesCommand,TerminateInstancesCommand, DescribeInstancesCommand} from "@aws-sdk/client-ec2";
import { S3Client } from "@aws-sdk/client-s3";
import { SSMClient, SendCommandCommand } from "@aws-sdk/client-ssm";

const ec2Client = new EC2Client();
const s3 = new S3Client();
const ssmClient = new SSMClient({ region: "us-east-1" });

export const handler = async (event) => {
    try {
        const runParams = {
            ImageId: 'ami-0a1179631ec8933d7',
            InstanceType: 't2.micro',
            MinCount: 1,
            MaxCount: 1,
            IamInstanceProfile: {
                Arn: "arn:aws:iam::013825576837:instance-profile/ec2ssm"
             }
        };
        
        // console.log("Event details", event.Records[0].dynamodb);
        
        const dynamoDetails = event.Records[0].dynamodb.NewImage;
        const id = dynamoDetails.id.S;
        const inputText = dynamoDetails.inputText.S;
        const filePath = dynamoDetails.filePath.S;
        const script = "script.sh"
        
        const [bucketName, key] = filePath.split('/');
        
        // console.log(bucketName,key)
        
        // const bucketName ="fovusbuckettest"
        // const key = "file.txt"

        const runResponse = await ec2Client.send(new RunInstancesCommand(runParams));
        const instanceId = runResponse.Instances[0].InstanceId;
        console.log(instanceId);
        // await waitForInstanceRunning(instanceId);
        let instanceState;
        
        do{
        const describeParams = {
            InstanceIds: [instanceId]
        };  
        const describeResponse = await ec2Client.send(new DescribeInstancesCommand(describeParams));
        instanceState = describeResponse.Reservations[0].Instances[0].State.Name;
        // console.log(describeResponse.Reservations[0].Instances[0].State.Name);
        }while(instanceState!="running");
        
        await new Promise(resolve => setTimeout(resolve, 30000));
        
        const commandParams = {
            InstanceIds: [instanceId],
            DocumentName: "AWS-RunShellScript",
            Parameters: {
                "commands": [`aws s3 cp s3://${bucketName}/${key} ${key}`,
                             `aws s3 cp s3://${bucketName}/script.sh script.sh`,
                             "chmod +x script.sh",
                             `./script.sh ${key} Output.txt ${inputText} ${bucketName}`
                            ]
            }
        };
        
        
        // const responsessm = await ssmClient.send(new SendCommandCommand(commandParams));
        // console.log('Response ssm:', responsessm);

        // console.log('EC2 Instance Created:', runResponse.Instances[0]);
        
        try {
            const responsessm = await ssmClient.send(new SendCommandCommand(commandParams));
            console.log('Response ssm:', responsessm);
        } catch (error) {
            console.error('Error sending command to EC2 instance:', error);
        }

        const terminateParams = {
            InstanceIds: [instanceId]
        };

        await ec2Client.send(new TerminateInstancesCommand(terminateParams));

        return {
            statusCode: 200,
            body: 'Process completed successfully'
        };
        
    } catch (error) {
        console.error('Detailed error:', error);

        return {
            statusCode: 500,
            body: 'Error'
        };
    }
};

