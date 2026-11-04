import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

import b2Client from "../config/b2.js";

const BUCKET_NAME = process.env.B2_BUCKET_NAME;

if (!BUCKET_NAME) {
  throw new Error("B2_BUCKET_NAME is not defined.");
}

const validateKey = (key) => {
  if (typeof key !== "string" || !key.trim()) {
    throw new Error("A valid B2 object key is required.");
  }
};

export const uploadFile = async ({ key, body, contentType }) => {
  validateKey(key);

  if (!body) {
    throw new Error("File body is required.");
  }

  if (!contentType) {
    throw new Error("File content type is required.");
  }

  await b2Client.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  );

  return key;
};

export const getFile = async (key) => {
  validateKey(key);

  return b2Client.send(
    new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    }),
  );
};

export const deleteFile = async (key) => {
  validateKey(key);

  await b2Client.send(
    new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    }),
  );
};
