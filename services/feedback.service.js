const HttpException = require("../exceptions/HttpException");
const { FeedbackModel } = require("../models/feedback.model");
const { MentorModel } = require("../models/mentor.model");
const { Op, Sequelize } = require("sequelize");

const FeedbackService = {
  createFeedback: async (mentor_id, mentee_id, feed, rating) => {
    try {
      const feedback = await FeedbackModel.create({
        mentor_id,
        mentee_id,
        feed,
        rating,
      });

      return feedback;
    } catch (error) {
      throw new HttpException(500, "Unable to create feedback");
    }
  },

  // calculateAndUpdateRating: async (mentor_id, rating) => {
  //   //let star = rating;
  //   try {
  //     const ratings = await FeedbackModel.findAll({
  //       where: {
  //         mentor_id,
  //         rating: {
  //           [Op.not]: null,
  //         },
  //       },
  //       attributes: [
  //         [Sequelize.fn("AVG", Sequelize.col("rating")), "averageRating"],
  //       ],
  //     });

  //     const averageRating = ratings[0].get("averageRating") || 0;

  //     if (!isNaN(averageRating)) {
  //       const updatedRating = await FeedbackModel.update(
  //         { rating: averageRating },
  //         {
  //           where: {
  //             mentor_id,
  //           },
  //         }
  //       );
  //       console.log("************updated rating"+updatedRating);
  //       return updatedRating;
  //     } else {
  //       throw new HttpException(404, "Invalid rating");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     //throw new HttpException(500, "Unable to calculate and update rating");
  //     if (error instanceof HttpException) {
  //       throw error;
  //     } else {
  //       throw new HttpException(500, "Unable to calculate and update rating");
  //     }
  //   }
  // },

  calculateAndUpdateRating: async (mentor_id, rating) => {
    try {
      const ratings = await FeedbackModel.findAll({
        where: {
          mentor_id,
          rating: {
            [Op.not]: null,
          },
        },
        attributes: [
          [Sequelize.fn("AVG", Sequelize.col("rating")), "averageRating"],
        ],
      });

      const averageRating = ratings[0].get("averageRating") || 0;

      if (!isNaN(averageRating)) {
        const updatedRating = await FeedbackModel.update(
          { rating: averageRating },
          {
            where: {
              mentor_id,
            },
          }
        );
        console.log("Updated rating:", updatedRating);
        return updatedRating;
      } else {
        throw new HttpException(404, "Invalid rating");
      }
    } catch (error) {
      console.error(error);
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(500, "Unable to calculate and update rating");
      }
    }
  },

  deleteFeedback: async (feedbackId) => {
    try {
      const feedback = await FeedbackModel.findByPk(feedbackId);

      if (!feedback) {
        throw new HttpException(404, "Feedback not found");
      }

      const deletedFeedback = await feedback.destroy();
      return deletedFeedback;
    } catch (error) {
      throw new HttpException(500, "Unable to delete feedback");
    }
  },

  getAllFeedbacksForMentor: async (mentor_id) => {
    try {
      const feedbacks = await FeedbackModel.findAll({
        where: {
          mentor_id: mentor_id,
        },
      });

      return feedbacks;
    } catch (error) {
      throw new HttpException(500, "Unable to fetch feedbacks");
    }
  },
};

module.exports = { FeedbackService };
