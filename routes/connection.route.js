const express = require("express");
const {
  ConnectionController,
} = require("../controllers/connection.controller");
const { ensureAuth } = require("../middlewares/auth.middleware");

const router = express.Router();
const path = "/connections";

// Get all connections
router.get(path, ensureAuth, ConnectionController.getAllConnections);

// Send a connection request from user1 to user2
router.post(
  `${path}/send-request/:user2Id`,
  ensureAuth,
  ConnectionController.sendConnectionRequest
);

// Accept a connection request from user1 to user2
router.put(
  `${path}/accept-request/:user2Id`,
  ensureAuth,
  ConnectionController.acceptConnectionRequest
);

// delete a connection from user1 to user2
router.delete(
  `${path}/delete-request/:user2Id`,
  ensureAuth,
  ConnectionController.deleteConnectionRequest
);

// Reject a connection request from user1 to user2
router.delete(
  `${path}/reject-request/:user2Id`,
  ensureAuth,
  ConnectionController.rejectConnectionRequest
);

module.exports = router;
