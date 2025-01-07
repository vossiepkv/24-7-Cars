// src/s3Config.js
import { S3Client } from "@aws-sdk/client-s3"; // v3 import
import dotenv from 'dotenv';

dotenv.config({ path: './server/.env' }); // Load environment variables


const s3Client = new S3Client({
  region: process.env.AWS_REGION,  // Specify the appropriate region
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});


export default s3;
