const HttpException = require("../exceptions/HttpException");
const { QuestionModel } = require("../models/question.model");

const QuestionService = {
  createQuestion: async (questionData) => {
    try {
      let newQuestion = await QuestionModel.create(questionData);
      newQuestion = await QuestionModel.findByPk(newQuestion.id);
      return newQuestion;
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

  getQuestionById: async (Id) => {
    try {
      const question = await QuestionModel.findByPk(Id);
      return question;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(500, "Error fetching questions");
      }
    }
  },

  getAllQuestions: async () => {
    try {
      const questions = await QuestionModel.findAll();
      return questions;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(500, "Error fetching questions");
      }
    }
  },

  deleteQuestionById: async (Id) => {
    try {
      const deletedRowsCount = await QuestionModel.destroy({
        where: { id: Id },
      });
      return deletedRowsCount;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(500, "Error deleting question");
      }
    }
  },

  deleteQuestionByPollId: async (pollId) => {
    try {
      const question = await QuestionModel.findAll({
        where: { poll_id: pollId },
      });

      if (!question || question.length === 0) {
        throw new HttpException(404, "Question not found");
      } else {
        const deletedRowsCount = await QuestionModel.destroy({
          where: { poll_id: pollId },
        });

        return deletedRowsCount;
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(500, "Unable to delete poll");
      }
    }
  },
};

module.exports = { QuestionService };
