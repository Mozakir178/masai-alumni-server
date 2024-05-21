const { NoticeService } = require("../services/notice.service");

const NoticeController = {
  getAllNotices: async (req, res) => {
    const { page, pageSize } = req.query;
    try {
      const { total, data } = await NoticeService.getAllNotices(
        req.user.id,
        +page || 1,
        +pageSize || 4
      );
      res.status(200).json({
        success: true,
        error: false,
        notices: data,
        total,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: true,
        success: false,
        message: "Something went wrong",
      });
    }
  },

  createNotice: async (req, res) => {
    const noticeData = req.body;
    try {
      const notice = await NoticeService.createNotice(noticeData);
      res.status(201).json({
        success: true,
        error: false,
        message: "Added notice",
        notice,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: true,
        success: false,
        message: "Something went wrong",
      });
    }
  },

  updateNotice: async (req, res) => {
    const noticeId = Number(req.params.id);
    const updatedData = req.body;
    try {
      const [updatedRowsCount, updatedNotice] =
        await NoticeService.updateNotice(noticeId, updatedData);
      if (updatedRowsCount === 0) {
        res.status(404).json({ message: "Notice not found" });
      } else {
        res.status(200).json({
          success: true,
          error: false,
          message: "Updated notice",
          notice: updatedNotice,
        });
      }
    } catch (error) {
      res.status(500).json({
        success: true,
        error: false,
        message: error.message,
      });
    }
  },

  deleteNotice: async (req, res) => {
    const noticeId = Number(req.params.id);
    try {
      console.log({ noticeId });
      const deletedRowsCount = await NoticeService.deleteNotice(noticeId);
      if (deletedRowsCount === 0) {
        res.status(404).json({ message: "Notice not found" });
      } else {
        res.json({ message: "Notice deleted successfully" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = { NoticeController };
