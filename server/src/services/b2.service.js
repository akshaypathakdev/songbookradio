import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

import b2Client from "../config/b2.js";

const BUCKET_NAME = process.env.B2_BUCKET_NAME;

export const uploadFile = async ({ key, body, contentType }) => {
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
  const response = await b2Client.send(
    new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    }),
  );

  return response;
};

export const deleteFile = async (key) => {
  await b2Client.send(
    new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    }),
  );
};
