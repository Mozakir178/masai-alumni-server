const express = require("express");
const { MentorController } = require("../controllers/mentor.controller");
const { ensureAuth } = require("../middlewares/auth.middleware");

const router = express.Router();

const path = "/mentors";
router.post(`${path}/search-mentor`,ensureAuth, MentorController.searchMentors);
router.get(`${path}/mentors-application`,ensureAuth, MentorController.mentorForApproval);
router.post(`${path}/create`, ensureAuth, MentorController.createMentor);
router.get(`${path}/:id`, ensureAuth, MentorController.getMentorById);
router.get(`${path}/mentorbyUser/:id`, ensureAuth, MentorController.getMentorByUserId);
router.delete(`${path}/:id`, ensureAuth, MentorController.deleteMentor);
router.get(path,ensureAuth, MentorController.getAllMentors);
router.put(`${path}/:id`, ensureAuth, MentorController.updateMentor);
router.get(`${path}/mentees-request/:mentorId`,ensureAuth,MentorController.mentorshipNotification);
router.post(`${path}/apply-for-mentorship`, ensureAuth, MentorController.applyForMentorship);
router.get(`${path}/accepted-mentee-count/:mentorId`, ensureAuth, MentorController.getAcceptedMenteeCount);
router.put(`${path}/accept-mentee/:menteeId`,ensureAuth, MentorController.acceptMentee);
router.put(`${path}/reject-mentee/:menteeId`,ensureAuth, MentorController.rejectMentee);
router.put(`${path}/accept-mentor/:mentorId`,ensureAuth, MentorController.acceptMentorRequest);
router.put(`${path}/reject-mentor/:mentorId`,ensureAuth, MentorController.rejectMentorRequest);

router.get(`${path}/:id/mentor`,ensureAuth, MentorController.getAllMentorForMentee);
router.get(`${path}/:id/mentees`,ensureAuth, MentorController.getAllMenteesForMentor);

module.exports = router;
