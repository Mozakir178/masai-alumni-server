const express = require("express");
const { ensureAuth } = require("../middlewares/auth.middleware");
const { AwsController } = require("../controllers/aws.controller");

const router = express.Router();
const path = "/signedurl";

router.post(
  `${path}/single`,
//   ensureAuth,
  AwsController.preSignedUrlForSingleFile
);
router.post(
  `${path}/multiple`,
//   ensureAuth,
  AwsController.preSignedUrlForMultipleFile
);

module.exports = router;
