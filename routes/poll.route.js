const express = require("express");
const { ensureAuth, ensureAdminAuth } = require("../middlewares/auth.middleware");
const { PollController } = require("../controllers/poll.controller");

const router = express.Router();
const path = "/polls";

router.get(`${path}/user`, ensureAuth, PollController.getPollsByUserId);
router.get(`${path}/:id`, ensureAuth, PollController.getPollById);
router.post(path, ensureAdminAuth, PollController.createPoll);
router.delete(`${path}/:id`, ensureAdminAuth, PollController.deletePoll);

module.exports = router;
