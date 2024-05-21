const { S3Client } = require("@aws-sdk/client-s3");
// const { SESClient } = require("@aws-sdk/client-ses");

require("dotenv").config();
const CONFIG = {
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_REGION,
};

// function getSES() {
//   return new SESClient(CONFIG);
// }

function getS3() {
  return new S3Client(CONFIG);
}

module.exports = { getS3 };
