import { S3Client } from "@aws-sdk/client-s3";

const requiredEnv = [
  "B2_ENDPOINT",
  "B2_REGION",
  "B2_KEY_ID",
  "B2_APPLICATION_KEY",
];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`${key} is not defined.`);
  }
}

const b2Client = new S3Client({
  endpoint: process.env.B2_ENDPOINT,
  region: process.env.B2_REGION,
  credentials: {
    accessKeyId: process.env.B2_KEY_ID,
    secretAccessKey: process.env.B2_APPLICATION_KEY,
  },
});

export default b2Client;
