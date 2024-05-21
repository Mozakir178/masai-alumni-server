const express = require("express");
const { ensureAuth } = require("../middlewares/auth.middleware");
const { ChapterController } = require("../controllers/chapter.controller");

const router = express.Router();
const path = "/group";
router.post(path, ensureAuth, ChapterController.createGroup);
router.put(`${path}/:id`,ensureAuth, ChapterController.editGroup);
router.post(`${path}/addUsers`,ensureAuth, ChapterController.addUserToGroup);

router.post(`${path}/approveUserToAdd/:id`,ensureAuth, ChapterController.approveUserToAdd);
router.post(`${path}/acceptUserRequest/:id`,ensureAuth, ChapterController.acceptUserRequest);
router.post(`${path}/rejectUserRequest/:id`,ensureAuth, ChapterController.rejectUserRequest);

router.delete(`${path}/:id`,ensureAuth, ChapterController.deleteGroup);
router.post(`${path}/:id`,ensureAuth,ChapterController.removeUserFromGroupByAdmin);
router.post(`${path}/leaveGroup/:id`,ensureAuth, ChapterController.leaveGroup);
router.post(`${path}/makeAdmin/:id`,ensureAuth, ChapterController.makeAdmin);
router.post(`${path}/removeAdmin/:id`,ensureAuth, ChapterController.removeAdmin);
router.get(`${path}/:id`,ensureAuth, ChapterController.getGroupById);
router.get(path, ChapterController.getAllGroups);

module.exports = router;
