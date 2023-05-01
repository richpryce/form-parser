import React, { useState } from 'react';
import AWS from 'aws-sdk';

// Configure the AWS SDK
AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  region: process.env.REACT_APP_AWS_REGION,
});

// Initialize the S3 client
const s3 = new AWS.S3();

const FormUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      uploadForm(file);
    }
  };



  const uploadForm = async (file: File) => {
    setUploading(true);
    setUploadSuccess(false);
    setUploadError(false);

    const bucket = process.env.REACT_APP_AWS_S3_BUCKET;

  if (!bucket) {
    console.error('Error: S3 bucket name is not defined');
    setUploading(false);
    setUploadError(true);
    return;
  }

  const params: AWS.S3.PutObjectRequest = {
    Bucket: bucket as string, // Assert that the bucket variable is of type string
    Key: `forms/${file.name}`,
    ContentType: file.type,
    Body: file,
  };

    try {

      await s3.upload(params).promise();
      setUploading(false);
      setUploadSuccess(true);
    } catch (error) {
      console.error('Error uploading form to S3:', error);
      setUploading(false);
      setUploadError(true);
    }
  };

  return (
    <div>
      <h1>Upload a Scanned Form</h1>
      <label htmlFor="file-upload">
        Upload
        <input id="file-upload" type="file" accept="image/*" onChange={handleFileChange} />
        {uploading && <p>Uploading form...</p>}
        {uploadSuccess && <p>Form uploaded successfully!</p>}
        {uploadError && <p>Error uploading form. Please try again.</p>}
      </label>
    </div>
  );
};

export default FormUpload;
