import dotenv from "dotenv";
import { randomUUID } from "node:crypto";

import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

dotenv.config();

const testB2 = async () => {
  const { B2_BUCKET_NAME, B2_KEY_ID, B2_APPLICATION_KEY, B2_REGION } =
    process.env;

  if (!B2_BUCKET_NAME || !B2_KEY_ID || !B2_APPLICATION_KEY || !B2_REGION) {
    throw new Error("Missing B2 environment variables.");
  }

  // Import after loading environment variables
  const { default: b2Client } = await import("../src/config/b2.js");

  const key = `test/connection-${randomUUID()}.txt`;
  const testContent = "Lyricist B2 connection successful!";

  try {
    // 1. Upload
    await b2Client.send(
      new PutObjectCommand({
        Bucket: B2_BUCKET_NAME,
        Key: key,
        Body: testContent,
        ContentType: "text/plain",
      }),
    );

    console.log("1. File uploaded successfully.");

    // 2. Retrieve
    const response = await b2Client.send(
      new GetObjectCommand({
        Bucket: B2_BUCKET_NAME,
        Key: key,
      }),
    );

    const content = await response.Body.transformToString();

    if (content !== testContent) {
      throw new Error("Retrieved file content does not match.");
    }

    console.log("2. File retrieved successfully.");

    // 3. Delete
    await b2Client.send(
      new DeleteObjectCommand({
        Bucket: B2_BUCKET_NAME,
        Key: key,
      }),
    );

    console.log("3. File deleted successfully.");

    console.log("\nBackblaze B2 test completed successfully!");
  } catch (error) {
    console.error("\nBackblaze B2 test failed:", error.message);
    process.exitCode = 1;
  }
};

testB2();
