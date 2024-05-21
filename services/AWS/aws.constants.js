const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
require("dotenv").config();
const { getS3 } = require("./aws.config");

const s3Client = getS3();

const GetPreSignedUrl = {
  getPresignedUrlToUpload: async (objectKey, contentType) => {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: objectKey,
      ContentType: contentType,
      // ContentDisposition: "inline"
    };

    try {
      const putCommand = new PutObjectCommand(params);
      const presignedUrl = await getSignedUrl(s3Client, putCommand, {
        expiresIn: 3600,
      });

      return { presignedUrl };
    } catch (error) {
      console.error("Error generating pre-signed URL:", error);
      throw error;
    }
  },
};

module.exports = { GetPreSignedUrl };
