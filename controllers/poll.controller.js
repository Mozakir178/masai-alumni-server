const { PollService } = require("../services/poll.service");
const { QuestionService } = require("../services/question.service");

const { PollResponseService } = require("../services/pollResponse.service");
const { NoticeService } = require("../services/notice.service");
const HttpException = require("../exceptions/HttpException");

const PollController = {
  getPollById: async (req, res, next) => {
    const userId = Number(req.user.id);
    const pollId = Number(req.params.id);
    try {
      const poll = await PollService.getPollById(pollId);

      const ans = {
        ...poll,
        response: await PollResponseService.getResponsesByPollId(
          poll.id,
          userId
        ),
      };

      if (ans) {
        res.status(200).json(ans);
      } else {
        next(new HttpException(404, "Poll not found"));
      }
    } catch (error) {
      next(error);
    }
  },

  getPollsByUserId: async (req, res, next) => {
    const userId = Number(req.user.id);
    try {
      const polls = await PollService.getPollByUserId(userId);
      if (polls.length > 0) {
        res.status(200).json(polls);
      } else {
        next(new HttpException(404, "Poll not found"));
      }
    } catch (error) {
      next(error);
    }
  },

  createPoll: async (req, res, next) => {
    const { poll, question } = req.body;
    const id = Number(req.user.id);

    try {
      const newPoll = await PollService.createPoll({
        creater_id: id,
        ...poll,
      });
      const questionWithPollId = {
        ...question,
        poll_id: newPoll.toJSON().id,
      };
      const newQuestion = await QuestionService.createQuestion(
        questionWithPollId
      );
      const notice = await NoticeService.createNotice({
        attachmentId: newPoll.toJSON().id,
        category: "poll",
        authorId: id,
      });
      console.log(notice.toJSON());
      res.status(201).json({
        ...notice.toJSON(),
        data: { ...newPoll.toJSON(), questions: [newQuestion.toJSON()] },
        type: "poll",
      });
    } catch (error) {
      next(error);
    }
  },

  deletePoll: async (req, res, next) => {
    const pollId = Number(req.params.id);
    const userId = Number(req.user.id);

    try {
      await QuestionService.deleteQuestionByPollId(pollId);
      const deletedRowsCount = await PollService.deletePoll(pollId, userId);

      if (deletedRowsCount === 0) {
        next(new HttpException(404, "Poll not found"));
      } else {
        await NoticeService.deleteNoticebyAttachmentID(pollId, "poll");
        res.status(200).json({
          message: "Poll deleted successfully",
        });
      }
    } catch (error) {
      next(error);
    }
  },
};

module.exports = { PollController };
