const express = require("express");
const {FeedbackController }= require("../controllers/feedback.controller");
const { ensureAuth } = require("../middlewares/auth.middleware");

const router = express.Router();

const path = '/feedbacks';


router.post(`${path}/create`, ensureAuth, FeedbackController.createFeedback);
router.post(`${path}/calculate-rating/:mentorid`, ensureAuth, FeedbackController.calculateAndUpdateRating);
router.delete(`${path}/delete/:feedbackId`, ensureAuth, FeedbackController.deleteFeedback);
router.get(`${path}/mentor/:mentorId`, ensureAuth, FeedbackController.getAllFeedbacksForMentor);

module.exports = router;
