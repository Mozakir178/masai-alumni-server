const { getContentType } = require("../utils/getContentType");
const {GetPreSignedUrl} = require("../services/AWS/aws.constants");
require("dotenv").config();


const AwsController = {
  preSignedUrlForSingleFile: async (req, res) => {
    try {
      const { fileExtension, type } = req.body;
      const contentType = getContentType(req.body.fileExtension);
      const objectKey = `alumni/${type}/${Date.now()}.${fileExtension}`;

      const presignedUrl = await GetPreSignedUrl.getPresignedUrlToUpload(
        objectKey,
        contentType
      );
      presignedUrl[
        "fileUrl"
      ] = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${objectKey}`;
      res.status(200).json(presignedUrl);
    } catch (error) {
      console.error("Error initiating file upload:", error);
      res.status(500).json({ error: "Error initiating file upload." });
    }
  },

  preSignedUrlForMultipleFile: async (req, res) => {
    try {
      const fileArray = req.body;
      const uploadFileDetail = await Promise.all(
        fileArray.map(async (file) => {
          const { fileExtension, type } = file;
          const contentType = getContentType(fileExtension);
          const objectKey = `alumni/${type}/${
            Date.now() + Math.random()
          }.${fileExtension}`;
          const presignedUrl = await GetPreSignedUrl.getPresignedUrlToUpload(
            objectKey,
            contentType
          );
          presignedUrl[
            "fileUrl"
          ] = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${objectKey}`;
          presignedUrl["s3AccessKey"] = objectKey;
          return presignedUrl;
        })
      );
      res.status(200).json(uploadFileDetail);
  
    } catch (error) {
      console.error("Error initiating file upload:", error);
      res.status(500).json({ error: "Error initiating file upload." });
    }
  },
};

module.exports = { AwsController };
