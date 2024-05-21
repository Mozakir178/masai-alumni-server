const HttpException = require("../exceptions/HttpException");
const { PollModel } = require("../models/poll.model");
const { QuestionModel } = require("../models/question.model");

const PollService = {
  getPollById: async (pollId) => {
    try {
      const poll = await PollModel.findByPk(pollId, {
        include: [
          {
            model: QuestionModel,
            as: "questions",
          },
        ],
      });
      if (!poll) {
        throw new HttpException(404, "Poll not found");
      }
      return poll.toJSON();
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(500, "Error fetching poll");
      }
    }
  },

  getPollByUserId: async (userId) => {
    try {
      const polls = await PollModel.findAll({
        where: { creater_id: userId },
        include: [
          {
            model: QuestionModel,
            as: "questions",
          },
        ],
      });
      return polls;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(500, "Error fetching poll");
      }
    }
  },

  createPoll: async (pollData) => {
    try {
      let newPoll = await PollModel.create(pollData);
      newPoll = await PollModel.findByPk(newPoll.id);

      return newPoll;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(
          500,
          "Unable to create Poll with Questions and Options"
        );
      }
    }
  },

  deletePoll: async (pollId, userId) => {
    try {
      const poll = await PollModel.findOne({
        where: { id: pollId, creater_id: userId },
      });

      

      if (!poll) {
        throw new HttpException(
          404,
          "Poll not found or you are not authorized to delete it."
        );
      }

      const deletedRowsCount = await PollModel.destroy({
        where: { id: pollId },
      });

      return deletedRowsCount;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(500, "Unable to delete poll");
      }
    }
  },
};

module.exports = { PollService };
