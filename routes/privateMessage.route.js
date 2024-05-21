const express = require("express");
const { ensureAuth } = require("../middlewares/auth.middleware");
const {
  privateMessageController,
} = require("../controllers/privateMessage.controller");

const router = express.Router();
const path = "/messages";

// Get all messages between two users
router.get(`${path}/:id`, ensureAuth, privateMessageController.getAllMessages);

// Send a message to a user
router.post(
  `${path}/send/:id`,
  ensureAuth,
  privateMessageController.sendMessage
);

// Mark all messages as seen between two users
router.patch(
  `${path}/mark-as-seen/:id`,
  ensureAuth,
  privateMessageController.markAllMessagesAsSeen
);

module.exports = router;
