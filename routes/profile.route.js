const express = require("express");
const { ensureAuth } = require("../middlewares/auth.middleware");
const { ProfileController } = require("../controllers/profile.controller");

const router = express.Router();
const path = "/profiles";

router.get(path, ensureAuth, ProfileController.getAllProfiles);
router.get(`${path}/user/:id`, ensureAuth, ProfileController.getProfileByUserId);
router.get(`${path}/:id`, ensureAuth, ProfileController.getProfileById);
router.post(path, ensureAuth, ProfileController.createProfile);
router.patch(`${path}/:id`, ensureAuth, ProfileController.updateProfile);

// Experience route
router.post(
  `${path}/experience`,
  ensureAuth,
  ProfileController.createExperience
);
router.patch(
  `${path}/experience/:id`,
  ensureAuth,
  ProfileController.updateExperience
);
router.delete(
  `${path}/experience/:id`,
  ensureAuth,
  ProfileController.deleteExperience
);

// Education route
router.post(`${path}/education`, ensureAuth, ProfileController.createEducation);
router.patch(
  `${path}/education/:id`,
  ensureAuth,
  ProfileController.updateEducation
);
router.delete(
  `${path}/education/:id`,
  ensureAuth,
  ProfileController.deleteEducation
);

// Address route
router.post(`${path}/address`, ensureAuth, ProfileController.createAddress);
router.patch(
  `${path}/address/:id`,
  ensureAuth,
  ProfileController.updateAddress
);
router.delete(
  `${path}/address/:id`,
  ensureAuth,
  ProfileController.deleteAddress
);

// Skill route
router.post(`${path}/skill`, ensureAuth, ProfileController.createSkill);
router.patch(`${path}/skill/:id`, ensureAuth, ProfileController.updateSkill);
router.delete(`${path}/skill/:id`, ensureAuth, ProfileController.deleteSkill);

module.exports = router;
