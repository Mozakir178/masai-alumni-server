const express = require("express");
const { JobController } = require("../controllers/job.controller");
const { ensureAuth } = require("../middlewares/auth.middleware");

const router = express.Router();

const path = "/jobs";

router.get(`${path}/approveJobToAdd`,ensureAuth, JobController.approveJobToAdd);
router.get(path, ensureAuth, JobController.getAllJobs);
router.get(`${path}/:id`, ensureAuth, JobController.getJobById);
router.post(path, ensureAuth, JobController.createJob);
router.put(`${path}/:id`, ensureAuth, JobController.updateJob);
router.delete(`${path}/:id`, ensureAuth, JobController.deleteJob);

router.patch(`${path}/acceptJobRequest/:id`,ensureAuth, JobController.acceptJobRequest);
router.delete(`${path}/rejectJobRequest/:id`,ensureAuth, JobController.rejectJobRequest);
router.post(`${path}/applyForJob`, ensureAuth, JobController.applyForJob);

module.exports = router;
