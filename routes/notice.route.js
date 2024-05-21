const express = require("express");
const { NoticeController } = require("../controllers/notice.conroller");
const { ensureAuth } = require("../middlewares/auth.middleware");
const router = express.Router();

router.get("/notices",ensureAuth, NoticeController.getAllNotices);
router.post("/notices",ensureAuth, NoticeController.createNotice);
router.patch("/notices/:id",ensureAuth, NoticeController.updateNotice);
router.delete("/notices/:id",ensureAuth, NoticeController.deleteNotice);

module.exports = router;
