const { HttpException } = require("@exceptions/HttpException");
const { QuestionService } = require("@services/question.service");

// Assuming QuestionService has all the required methods

const questionController = {
  getAllQuestions: async (req, res, next) => {
    try {
      const questions = await QuestionService.getAllQuestions();
      if (questions.length > 0) {
        res.status(200).json(questions);
      } else {
        next(new HttpException(404, "question not found"));
      }
    } catch (error) {
      next(error);
    }
  },

  // createQuestion: async (req, res, next) => {
  //     const questionData = req.body;

  //     try {
  //         const newQuestion = await QuestionService.createQuestion(questionData);
  //         res.status(201).json(newQuestion);
  //     } catch (error) {
  //         next(error);
  //     }
  // },

  // getQuestionById: async (req, res, next) => {
  //     const questionId = +req.params.id;

  //     try {
  //         const question = await QuestionService.getQuestionById(questionId);
  //         if (question) {
  //             res.status(200).json(question);
  //         } else {
  //             next(new HttpException(404, "question not found"));
  //         }
  //     } catch (error) {
  //         next(error);
  //     }
  // },

  // deleteQuestionByPollId: async (req, res, next) => {
  //     const pollId = +req.params.id;

  //     try {
  //         const deletedRowsCount = await QuestionService.deleteQuestionByPollId(pollId);
  //         if (deletedRowsCount === 0) {
  //             throw new HttpException(404, "Questions not found");
  //         }
  //         res.status(201).json({ message: "question deleted successfully" });
  //     } catch (error) {
  //         next(error);
  //     }
  // },

  // deleteQuestionById: async (req, res, next) => {
  //     const Id = +req.params.id;

  //     try {
  //         await QuestionService.deleteQuestionByPollId(Id);
  //         res.status(201).json({ message: "question deleted successfully" });
  //     } catch (error) {
  //         next(error);
  //     }
  // },
};

module.exports = { questionController };
