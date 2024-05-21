const express = require("express");
const { ensureAuth } = require("../middlewares/auth.middleware");
const {
  EventParticipantController,
} = require("../controllers/eventParticipant.controller");

const router = express.Router();
const path = "/event-participants";

router.get(
  path,
  ensureAuth,
  EventParticipantController.getAllEventParticipants
);
router.get(
  `${path}/:id`,
  ensureAuth,
  EventParticipantController.getEventParticipantById
);
router.get(
  `${path}/event/:id`,
  ensureAuth,
  EventParticipantController.getEventParticipantByEventId
);
router.post(
  path,
  ensureAuth,
  EventParticipantController.createEventParticipant
);
router.delete(
  `${path}/:id`,
  ensureAuth,
  EventParticipantController.deleteEventParticipant
);

module.exports = router;
