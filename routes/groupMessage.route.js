const express = require("express");
const { ensureAuth } = require("../middlewares/auth.middleware");
const {
  GroupMessageController,
} = require("../controllers/groupMessage.controller");

const router = express.Router();
const path = "/group-messages";

// Get all messages for a group
router.get(
  `${path}/:groupId`,
  ensureAuth,
  GroupMessageController.getAllMessages
);

// Create a new message in a group
router.post(
  `${path}/:groupId`,
  ensureAuth,
  GroupMessageController.createMessage
);

module.exports = router;
