const express = require("express");
const { ensureAuth } = require("../middlewares/auth.middleware");
const { ProfileController } = require("../controllers/profile.controller");

const router = express.Router();
const path = "/alumni";

router.get(`${path}/directory`, ensureAuth, ProfileController.getAllProfiles);
// router.get(`${path}/:id`, ensureAuth, profileController.getPollById);
// router.post(path, ensureAuth, profileController.createPoll);
// router.delete(`${path}/:id`, ensureAuth, profileController.deletePoll);

module.exports = router;
