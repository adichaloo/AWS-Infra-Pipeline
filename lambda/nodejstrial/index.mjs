// export const handler = async (event) => {
//   // TODO implement
//   const response = {
//     statusCode: 200,
//     body: JSON.stringify('Hello from Lambda!'),
//   };
//   return event.queryStringParameters;
// };
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

const dynamoDBClient = new DynamoDBClient();

export const handler = async (event) => {
    try {
        const requestBody = JSON.parse(event.body);
        
        console.log("Request Body", requestBody);
        const id = requestBody.id;
        const inputText = requestBody.inputText;
        const filePath = requestBody.filePaths;
        
        // const txtFiles = filePath.filter(path => path.endsWith('.txt'));

        // // Extract file names from the filtered file paths
        // const txtFileName = txtFiles.map(path => {
        //   const parts = path.split('/');
        //   return parts[parts.length - 1];
        // });
        let txtFileName;
        if (filePath && Array.isArray(filePath)) {
          // Filter file paths to include only those ending with '.txt'
          const txtFiles = filePath.filter(path => path.endsWith('.txt'));
        
          // Extract file names from the filtered file paths
          txtFileName = txtFiles.map(path => {
            const parts = path.split('/');
            return parts[parts.length - 1];
          });
          console.log(txtFileName); // Output: ['file.txt']
        } else {
          console.log('filePaths is not defined or not an array');
        }
        const bucketName = filePath[0].split('/')[2].split('.')[0];
        const putParams = {
            TableName: 'fovusstorage',
            Item: {
                'id': { S: id },
                'inputText': { S: inputText },
                'filePath': { S: `${bucketName}/${txtFileName[0]}` }
            }
        };
        
        console.log(putParams);

        await dynamoDBClient.send(new PutItemCommand(putParams));
        
        return {
            statusCode: 200,
            body: JSON.stringify('Data saved successfully')
        };
        // return JSON.parse(event.body);
    } catch (error) {
        console.error('Error saving data to DynamoDB:', error);
        return {
            statusCode: 500,
            body: JSON.stringify('Failed to save data to DynamoDB'),
        };
    }
};
