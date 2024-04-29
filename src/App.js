// import logo from './logo.svg';
import './App.css';
import AWS from 'aws-sdk';
import React, {useState} from 'react';
import { nanoid } from 'nanoid'

function App() {
  const [inputText, setInputText] = useState('')
  const [inputfile, setUploadFile] = useState([])


  const handleInputText = (event) => {
    setInputText(event.target.value);
    // alert(inputText)
  };

  const handleFileUpload = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setUploadFile(selectedFiles);
  };

  const handleUpload = (event) => {
    event.preventDefault();
    // You can handle form submission here, such as uploading the file
    console.log('Input Text:', inputText);
    console.log('Selected File:', inputfile);
  
  // const handleUpload = () => {
  //   alert('Input Text:', inputText);
  //   alert('Selected File:', inputfile);
    if (!inputText || inputfile.length < 2) {
      alert('Please provide input text and select appropriate files');
      return;
    }

    const scriptFile = inputfile.find(file => file.name === 'script.sh');
    if (!scriptFile) {
      alert('Please upload the script.sh file');
      return;
    }

    var bucketName = "fovusbuckettest";
    var bucketRegion = "us-east-1";
    var accessKeyId= 'Access Key Id';
    var secretAccessKey= 'Secret Access Key';

    AWS.config.update({
      region: bucketRegion,
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey
    });

    const s3 = new AWS.S3({
      signatureVersion: 'v4'
    });

    // const fileKey = `${inputfile.name}`; 

    // const s3Params = {
    //   Bucket: bucketName,
    //   Key: fileKey,
    //   Body: inputfile,
    //   ContentType: inputfile.type,
    // };

    // s3.upload(s3Params).promise()
    // .then(data => {
    //   console.log('File uploaded successfully:', data.Location);
    // })
    // .catch(error => {
    //   console.error('Error uploading file to S3:', error);
    // });

  //   const apiGatewayUrl='https://ve993y2js7.execute-api.us-east-1.amazonaws.com/nodejstrial' 
  //   const requestBody = JSON.stringify({
  //       id: nanoid(),
  //       inputText: inputText,
  //       filePath: `${bucketName}/${fileKey}`
  //   });
  //   console.log(requestBody)

  //   fetch(apiGatewayUrl,{
  //     method: 'POST',
  //     body: requestBody,
  //     headers: {
  //         'Content-Type': 'application/json'
  //     }
  //   })
  //   .then(response => {
  //     if (response.status==500) {
  //         throw new Error('Failed to save data to DynamoDB');
  //     }
  //     console.log('Data saved successfully');
  //   })
  //   .catch(error => {
  //     console.error('Error:', error.message);
  //   });

  // }


  const uploadPromises = inputfile.map((file) => {
    const fileKey = `${file.name}`;

    const s3Params = {
      Bucket: bucketName,
      Key: fileKey,
      Body: file,
      ContentType: file.type
    };

    return s3.upload(s3Params).promise();
  });

  Promise.all(uploadPromises)
    .then((results) => {
      console.log('Files uploaded successfully:', results);
      
      const apiGatewayUrl = 'https://ve993y2js7.execute-api.us-east-1.amazonaws.com/nodejstrial';
      const requestBody = JSON.stringify({
        id: nanoid(),
        inputText: inputText,
        filePaths: results.map((result) => result.Location)
      });

      fetch(apiGatewayUrl, {
        method: 'POST',
        body: requestBody,
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then((response) => {
          if (response.status === 500) {
            throw new Error('Failed to save data to DynamoDB');
          }
          console.log('Data saved successfully');
        })
        .catch((error) => {
          console.error('Error:', error.message);
        });
    })
    .catch((error) => {
      console.error('Error uploading files to S3:', error);
    });
};


  return (

    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
        <form onSubmit={handleUpload}>
        <label>Text Input:</label>
          <input type="text" id="textInput" value={inputText} onChange={handleInputText}/><br></br><br></br>
          {/* <p>Input Value: {inputText}</p> */}
        <label>File Input:</label>
          <input type="file" id="fileInput" onChange={handleFileUpload} multiple/><br></br><br></br>
        {/* <button type="button" onClick={handleUpload}>Submit</button> */}
        <button type="submit">Submit</button>
        </form>
      
    </div>
  );
}

export default App;
