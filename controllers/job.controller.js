const { JobService } = require("../services/job.service");
const { NoticeService } = require("../services/notice.service");
const  HttpException  = require("../exceptions/HttpException");
const qs = require("qs");
const { getSocketServerInstance } = require("../socket/socketStore");
const { NotificationService } = require("../services/notification.service");
const { UserModel } = require("../models/user.model");

const JobController = {
  getJobById: async (req, res, next) => {
    const jobId = req.params.id;
    try {
      const job = await JobService.getJobById(jobId);
      if (job) {
        res.status(200).json(job);
      } else {
        throw new HttpException(404, "Job not found");
      }
    } catch (error) {
      next(error);
    }
  },

  getAllJobs: async (req, res, next) => {
    try {
      console.log(qs.parse(req.query));
      const filters = req.query;

      console.log(filters);

      const jobs = await JobService.getAllJobs(filters, req.user.id);
      res.status(200).json(jobs);
    } catch (error) {
      next(error);
    }
  },

  createJob: async (req, res, next) => {
    const jobData = req.body;
    const id = Number(req.user.id);
    try {
      const newJob = await JobService.createJob({
        ...jobData,
        publisher_id: id,
        isopen: true,
      });
      // NoticeService.createNotice({
      //   attachmentId: newJob.toJSON().id,
      //   category: "job",
      //   authorId: id,
      // });
      res.status(201).json(newJob);
    } catch (error) {
      next(error);
    }
  },

  applyForJob: async (req, res, next) => {
    try {
      const { jobId } = req.body;
      const userId = Number(req.user.id);
      console.log(req.body)

      const updatedJob = await JobService.applyForJob(jobId, userId);

      if (!updatedJob) {
        throw new HttpException(404, "Job not found");
      }

      res.status(200).json({ success: true, data: updatedJob });
    } catch (error) {
      next(error);
    }
  },

  approveJobToAdd: async (req, res, next) => {
    const id = Number(req.user.id);
    try {
      const jobs = await JobService.approveJobToAdd(id);
      if (jobs) {
        res.status(200).json(jobs);
      } else {
        throw new HttpException(404, "Not any jobs request found");
      }
    } catch (error) {
      next(error);
    }
  },

  acceptJobRequest: async (req, res, next) => {
    const jobId = Number(req.params.id);
    const adminId = Number(req.user.id);
    const { io } = getSocketServerInstance();
    
    try {
      const newJob = await JobService.acceptJobRequest(
        jobId,
        adminId,
      );

      if (!newJob) {
        next(
          new HttpException(
            404,
            "No new Job Application Found"
          )
        );
      }
      
      const user_Id = newJob.dataValues.publisher_id;
      console.log(user_Id);
      const receiver = await UserModel.findByPk(user_Id);

      if (!receiver) {
        throw new HttpException(404, "Receiver not found");
      }

        
      NoticeService.createNotice({
        attachmentId: newJob.toJSON().id,
        category: "job",
        authorId: user_Id,
      });

      const receiverData = receiver.toJSON();
      console.log(receiverData);
      const notification = await NotificationService.createNotification({
        receiverId: user_Id,
        type: "new_message",
        status: "delivered",
        message: "Congratulations! Your Job application got accepted",
        authorId: adminId,
      });
      console.log(notification);


      if (receiverData.socket_id) {
        io.to(receiverData.socket_id).emit("new-notification", notification);
      }

      console.log(notification);
      res.status(200).json({ message: `Job application accepted successfully`,newJob });
    } catch (error) {
      next(error);
    }
  },

  rejectJobRequest: async (req, res, next) => {
    const jobId = Number(req.params.id);
    const adminId = Number(req.user.id);
    const { io } = getSocketServerInstance();
    
    try {
      const newJob = await JobService.rejectJobRequest(
        jobId,
        adminId,
      );

      if (!newJob) {
        next(
          new HttpException(
            404,
            "No new Job Request Found"
          )
        );
      }
      console.log(newJob);
      const user_Id = newJob.job.dataValues.publisher_id;
      const receiver = await UserModel.findByPk(user_Id);

      if (!receiver) {
        return next(new HttpException(404, "Receiver not found"));
      }

      const receiverData = receiver.toJSON();
      const notification = await NotificationService.createNotification({
        receiverId: user_Id,
        type: "new_message",
        status: "delivered",
        message: "Sorry! Your job application got rejected",
        authorId: adminId,
      });

      if (receiverData.socket_id) {
        io.to(receiverData.socket_id).emit("new-notification", notification);
      }

      res.status(200).json({ message: `Job request got rejected successfully` });
    } catch (error) {
      next(error);
    }
  },

  updateJob: async (req, res, next) => {
    const jobId = Number(req.params.id);
    const updatedData = req.body;
    try {
      const [updatedRowsCount, updatedJobs] = await JobService.updateJob(
        jobId,
        updatedData,
        req.user.id
      );
      console.log(updatedRowsCount, updatedJobs);
      if (Number(updatedJobs) === 0) {
        throw new HttpException(404, "Job not found");
      } else {
        res.status(200).json({ message: "Job is updated", updatedJobs });
      }
    } catch (error) {
      next(error);
    }
  },

  deleteJob: async (req, res, next) => {
    const jobId = Number(req.params.id);
    try {
      const deletedRowsCount = await JobService.deleteJob(jobId, req.user);
      if (deletedRowsCount === 0) {
        throw new HttpException(404, "Job not found");
      } else {
        await NoticeService.deleteNoticebyAttachmentID(jobId, "job");
        res.status(200).json({ message: "Job deleted successfully" });
      }
    } catch (error) {
      next(error);
    }
  },
};

module.exports = { JobController };
