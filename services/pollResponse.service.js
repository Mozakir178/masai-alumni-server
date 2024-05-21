const HttpException = require("../exceptions/HttpException");
const { PollResponseModel } = require("../models/pollResponse.model");
const { PollModel } = require("../models/poll.model");
const { QuestionModel } = require("../models/question.model");

const PollResponseService = {
  createPollResponse: async (pollResponseData, userId) => {
    try {
      const pollResponse = await PollResponseModel.findOne({
        where: {
          responder_id: userId,
          poll_id: pollResponseData.poll_id,
        },
      });

      if (!pollResponse) {
        const newPollResponse = await PollResponseModel.create({
          ...pollResponseData,
          response_count: 1,
        });
        return newPollResponse;
      } else if (pollResponse && pollResponse.toJSON().response_count < 2) {
        if (pollResponse.toJSON().responder_id !== userId) {
          throw new HttpException(
            403,
            "You are not authorized to update this response"
          );
        }

        const [affectedCount] = await PollResponseModel.update(
          {
            ...pollResponseData,
            response_count: pollResponse.toJSON().response_count + 1,
          },
          {
            where: { id: pollResponse.toJSON().id },
            returning: true,
          }
        );
        if (affectedCount === 0) {
          throw new HttpException(400, "Unable to update poll response");
        }
        return;
      } else {
        throw new HttpException(403, "You cannot respond more than 2 times");
      }
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

  checkIfResponded: async (pollId, userId) => {
    try {
      const newPollResponse = await PollResponseModel.findOne({
        where: { poll_id: pollId, responder_id: userId },
      });

      return newPollResponse;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(500, "Unable to check if user responded");
      }
    }
  },

  getResponsesByPollId: async (pollId, userId) => {
    try {
      const pollResponses = await PollResponseModel.findAll({
        where: { poll_id: pollId },
      });

      const singlePoll = await PollModel.findByPk(pollId);
      const expired =
        new Date(singlePoll.toJSON().createdAt).getTime() +
          singlePoll.toJSON().duration * 1000 * 60 <
        Date.now();
      if (expired) {
        const question = await QuestionModel.findOne({
          where: { poll_id: pollId },
        });

        if (!question) {
          throw new HttpException(404, "Question not found for this poll");
        }

        const questionJSON = question.toJSON();

        const pollResponse = {
          question_id: questionJSON.id,
          question: questionJSON.text,
          participantCount: pollResponses.length,
          options: {},
        };

        questionJSON.options.forEach((e) => {
          if (pollResponse.options[e] === undefined) {
            pollResponse.options[e] = 0;
          }

          pollResponses.forEach((r) => {
            const rJSON = r.toJSON();

            if (e === rJSON.selected_option) {
              if (pollResponse.options[e] === undefined) {
                pollResponse.options[e] = 1;
              } else {
                pollResponse.options[e]++;
              }
            }
          });
        });

        return { ...singlePoll.toJSON(), pollResponse };
      } else {
        const myResponse = await PollResponseModel.findOne({
          where: { responder_id: userId, poll_id: pollId },
        });

        if (!myResponse) {
          throw new HttpException(
            404,
            "Please respond to receive others' response details"
          );
        }

        const myResponseJSON = myResponse.toJSON();
        const question = await QuestionModel.findOne({
          where: { poll_id: pollId },
        });

        if (!question) {
          throw new HttpException(404, "Question not found for this poll");
        }

        const questionJSON = question.toJSON();

        const pollResponse = {
          selected_option: myResponseJSON.selected_option,
          responder_id: myResponseJSON.responder_id,
          question_id: questionJSON.id,
          question: questionJSON.text,
          participantCount: pollResponses.length,
          options: {},
        };

        questionJSON.options.forEach((e) => {
          if (pollResponse.options[e] === undefined) {
            pollResponse.options[e] = 0;
          }

          pollResponses.forEach((r) => {
            const rJSON = r.toJSON();

            if (e === rJSON.selected_option) {
              if (pollResponse.options[e] === undefined) {
                pollResponse.options[e] = 1;
              } else {
                pollResponse.options[e]++;
              }
            }
          });
        });

        return { ...singlePoll.toJSON(), pollResponse };
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(500, "Unable to get responses by pollId");
      }
    }
  },
};

module.exports = { PollResponseService };
