const { PollResponseService } = require("../services/pollResponse.service");
const HttpException = require("../exceptions/HttpException");
const { getSocketServerInstance } = require("../socket/socketStore");

const PollResponseController = {
  createPollResponse: async (req, res, next) => {
    const userId = +req.user.id;
    const pollResponseData = { responder_id: userId, ...req.body };
    const { io } = getSocketServerInstance();
    try {
      await PollResponseService.createPollResponse(pollResponseData, userId);
      const data = await PollResponseService.getResponsesByPollId(
        pollResponseData.poll_id,
        userId
      );
      io.emit("new-poll-response", data);
      res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  },
  getResponseByPollId: async (req, res, next) => {
    const userId = req.user.id;
    const pollId = +req.params.id;

    try {
      const PollResponses = await PollResponseService.getResponsesByPollId(
        pollId,
        userId
      );
      if (!PollResponses) {
        next(new HttpException(404, "response not found"));
      } else {
        res.status(201).json(PollResponses);
      }
    } catch (error) {
      next(error);
    }
  },
};

module.exports = { PollResponseController };
