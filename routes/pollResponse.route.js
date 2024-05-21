const express = require("express");
const { ensureAuth } = require("../middlewares/auth.middleware");
const {
  PollResponseController,
} = require("../controllers/pollResponse.controller");

const router = express.Router();
const path = "/poll-responses";

// Create a poll response
router.post(path, ensureAuth, PollResponseController.createPollResponse);

// Get responses by poll ID
router.get(
  `${path}/poll/:id`,
  ensureAuth,
  PollResponseController.getResponseByPollId
);

module.exports = router;
