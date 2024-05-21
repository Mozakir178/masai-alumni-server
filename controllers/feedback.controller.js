const { FeedbackService } = require("../services/feedback.service");

const FeedbackController = {
  createFeedback: async (req, res) => {
    const menteeid = req.user.id;
    const { mentorid, feed, rating } = req.body;

    try {
      await FeedbackService.createFeedback(mentorid, menteeid, feed, rating);
      res.status(201).json({ message: "Feedback created successfully" });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  calculateAndUpdateRating: async (req, res, next) => {
    const mentorid = +req.params.mentorid;
    const rating = +req.body.rating;

    try {
      await FeedbackService.calculateAndUpdateRating(mentorid, rating);
      res.json({ message: "Rating calculated and updated successfully" });
    } catch (error) {
      console.error("Error calculating and updating rating:", error);
      //res.status(500).json({ error: "Internal Server Error" });
      next(error);
    }
  },

  deleteFeedback: async (req, res) => {
    const feedbackId = +req.params.feedbackId;

    try {
      await FeedbackService.deleteFeedback(feedbackId);
      res.json({ message: "Feedback deleted successfully" });
    } catch (error) {
      console.error("Error deleting feedback:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getAllFeedbacksForMentor: async (req, res) => {
    const mentorId = +req.params.mentorId;

    try {
      const feedbacks = await FeedbackService.getAllFeedbacksForMentor(
        mentorId
      );
      res.json(feedbacks);
    } catch (error) {
      console.error("Error fetching feedbacks for mentor:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

module.exports = { FeedbackController };
