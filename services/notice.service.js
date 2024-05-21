// import { JobService } from "@services/job.service";
// import { PollService } from "./poll.service";
// import { PollResponseService } from "@services/pollResponse.service";
// import { PostService } from "./posts.service";
// import { UserModel } from "@models/user.model";
// import { ProfileService } from "./profile.service";

const HttpException = require("../exceptions/HttpException");
const { UserModel } = require("../models/user.model");
const { NoticeModel } = require("../models/notice.model");
const { EventService } = require("./event.service");
const { PollResponseService } = require("./pollResponse.service");
const { PollService } = require("./poll.service");
const { PostService } = require("./post.service");
const { JobService } = require("./job.service");

const NoticeService = {
  getAllNotices: async (userId, page = 1, pageSize = 10) => {
    try {
      const offset = (page - 1) * pageSize;
      const { count, rows: notices } = await NoticeModel.findAndCountAll({
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: UserModel,
            as: "author",
          },
        ],
        limit: pageSize,
        offset: offset,
      });

      const temp = await Promise.all(
        notices.map(async (item) => {
          const val = item.toJSON();
          if (val.category === "job") {
            const data = await JobService.getJobById(String(val.attachmentId));
            return { ...val, data };
          } else if (val.category === "event") {
            const data = await EventService.getEventById(
              Number(val.attachmentId)
            );
            return { ...val, data };
          } else if (val.category === "poll") {
            const isResponded = await PollResponseService.checkIfResponded(
              val.attachmentId,
              userId
            );
            if (isResponded) {
              const response = await PollResponseService.getResponsesByPollId(
                val.attachmentId,
                userId
              );
              return { ...val, type: "response", data: response };
            } else {
              const data = await PollService.getPollById(
                Number(val.attachmentId)
              );
              const expired =
                new Date(data.createdAt).getTime() + data.duration * 1000 * 60 <
                Date.now();
              if (expired) {
                const response = await PollResponseService.getResponsesByPollId(
                  val.attachmentId,
                  userId
                );
                return { ...val, type: "response", data: response };
              } else {
                return { ...val, type: "poll", data };
              }
            }
          } else if (val.category === "announcement") {
            const data = await PostService.getPostById(
              Number(val.attachmentId)
            );
            return { ...val, data };
          }
          return null;
        })
      );
      // Filter out any potential null values from unsupported categories
      const filteredTemp = temp.filter((item) => item !== null);

      return {
        total: count,
        data: filteredTemp,
      };
    } catch (error) {
      throw new HttpException(500, "Error fetching notices: " + error.message);
    }
  },

  createNotice: async (noticeData) => {
    try {
      let notice = await NoticeModel.create(noticeData);
      notice = await NoticeModel.findByPk(notice.id, {
        include: [
          {
            model: UserModel,
            as: "author",
          },
        ],
      });
      return notice;
    } catch (error) {
      throw new HttpException(401, "Unable to create notice" + error.message);
    }
  },

  updateNotice: async (NoticeId, updatedData) => {
    try {
      const [updatedRowsCount, updatedNotice] = await NoticeModel.update(
        updatedData,
        {
          where: { id: NoticeId },
          returning: true,
        }
      );
      return [updatedRowsCount, updatedNotice];
    } catch (error) {
      throw new HttpException(404, "Unable to update notice");
    }
  },

  deleteNotice: async (noticeId) => {
    try {
      const deletedRowsCount = await NoticeModel.destroy({
        where: { id: noticeId },
      });
      console.log({ deletedRowsCount });
      return deletedRowsCount;
    } catch (error) {
      throw new HttpException(404, "Unable to delete notice");
    }
  },

  deleteNoticebyAttachmentID: async (attachmentId, category) => {
    try {
      const deletedRowsCount = await NoticeModel.destroy({
        where: { attachmentId: attachmentId, category: category },
      });
      console.log({ deletedRowsCount });
      return deletedRowsCount;
    } catch (error) {
      throw new Error("Unable to delete notice");
    }
  },
};

module.exports = { NoticeService };
