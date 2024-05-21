const HttpException = require("../exceptions/HttpException");
const { Op, FindOptions } = require("sequelize");
const { JobModel } = require("../models/job.model");
const { UserModel } = require("../models/user.model");
const { ParticipantModel } = require("../models/jobParticipants.model");

const JobService = {
  getJobById: async (jobId) => {
    try {
      const job = await JobModel.findByPk(jobId, {
        include: [
          {
            as: "posted_by",
            model: UserModel,
          },
          {
            model: ParticipantModel,
            as: "participants",
            include: [
              {
                model: UserModel,
                as: "apply_by",
              },
            ],
          },
        ],
      });
      return job;
    } catch (error) {
      throw new HttpException(500, "Error fetching job");
    }
  },

  getAllJobs: async (filters, userId) => {
    try {
      const page = filters.page && filters.page > 0 ? filters.page : 1;
      const pageSize =
        filters.pageSize && filters.pageSize <= 36 ? filters.pageSize : 18;

      const filterOptions = {
        limit: pageSize,
        offset: (page - 1) * pageSize,
      };

      if (filters.query) {
        filterOptions.where = {
          [Op.or]: [
            { title: { [Op.regexp]: `.*${filters.query}.*` } },
            { company_name: { [Op.regexp]: `.*${filters.query}.*` } },
          ],
        };
      }

      if (filters?.field?.working_mode) {
        filterOptions.where = {
          ...filterOptions.where,
          working_mode: {
            [Op.in]: Array.isArray(filters.field.working_mode)
              ? filters.field.working_mode
              : [filters.field.working_mode],
          },
        };
      }

      if (filters?.field?.work_type) {
        filterOptions.where = {
          ...filterOptions.where,
          work_type: {
            [Op.in]: Array.isArray(filters.field.work_type)
              ? filters.field.work_type
              : [filters.field.work_type],
          },
        };
      }

      if (filters.created_by_me) {
        filterOptions.where = {
          ...filterOptions.where,
          publisher_id: userId,
        };
      }

      let orderOptions = ["createdAt", "DESC"];

      if (filters.field && filters.direction) {
        orderOptions = [filters.field, filters.direction.toUpperCase()];
      }

      filterOptions.order = [orderOptions];

      const jobs = await JobModel.findAll({
        ...filterOptions,
        include: [
          {
            as: "posted_by",
            model: UserModel,
          },
          {
            model: ParticipantModel,
            as: "participants",
            include: [
              {
                model: UserModel,
                as: "apply_by",
              },
            ],
          },
        ],
      });
      return jobs;
    } catch (error) {
      throw new HttpException(500, "Unable to fetch jobs");
    }
  },

  createJob: async (jobData) => {
    try {
      let newJob = await JobModel.create(jobData);
      newJob = await JobModel.findByPk(newJob.id,{
        include: [
          {
            as: "posted_by",
            model: UserModel,
          },
          {
            model: ParticipantModel,
            as: "participants",
            include: [
              {
                model: UserModel,
                as: "apply_by",
              },
            ],
          },
        ],
      });
      return newJob;
    } catch (error) {
      throw new HttpException(500, "Unable to create job");
    }
  },

  applyForJob: async (jobId, userId) => {
    try {
      const existingParticipant = await ParticipantModel.findOne({
        where: {
          jobId: jobId,
          userId: userId,
        },
      });

      if (existingParticipant) {
        throw new HttpException(400, "You have already applied for this Job");
      }
      await ParticipantModel.create({
          jobId: jobId,
          userId: userId,
      });

      const  updatedJob = await JobModel.findByPk(jobId,{
        include: [
          {
            as: "posted_by",
            model: UserModel,
          },
          {
            model: ParticipantModel,
            as: "participants",
            include: [
              {
                model: UserModel,
                as: "apply_by",
              },
            ],
          },
        ],
      });
      return updatedJob;
    } catch (error) {
      throw new HttpException(500, error.message);
    }
  },
  approveJobToAdd: async (user_id) => {
    const user = await UserModel.findByPk(user_id);
    if (user) {
      const role = user.role;
      if (role !== "admin") {
        throw new HttpException(
          500,
          "Sorry You are not admin or You are not authorized"
        );
      }
    } else {
      throw new HttpException(404, "No user Found");
    }
    try {
      const jobs = await JobModel.findAll({
        where: {
          status: "pending",
        },
        include: [
          {
            as: "posted_by",
            model: UserModel,
          },
          {
            model: ParticipantModel,
            as: "participants",
            include: [
              {
                model: UserModel,
                as: "apply_by",
              },
            ],
          },
        ],
      });
      console.log(jobs);
      if (jobs.length === 0) {
        throw new HttpException(404, "No new job requests found");
      }

      return jobs;
    } catch (error) {
      throw new HttpException(
        500,
        `Error fetching pending jobs : ${error.message}`
      );
    }
  },

  acceptJobRequest: async (jobId, adminId) => {
    const user = await UserModel.findByPk(adminId);
    if (user) {
      const role = user.role;
      if (role !== "admin") {
        throw new HttpException(
          500,
          "Sorry You are not admin or You are not authorized"
        );
      }
    } else {
      throw new HttpException(404, "No user Found");
    }
    try {
      const job = await JobModel.findByPk(jobId);

      if (!job) {
        throw new HttpException(404, "Jobs not found");
      }

      job.status = "accepted";

      await job.save();

      return job;
    } catch (error) {
      console.error("Error accepting job request:", error);
      throw new Error(`Unable to accept job request: ${error.message}`);
    }
  },

  rejectJobRequest: async (jobId, adminId) => {
    const user = await UserModel.findByPk(adminId);
    if (user) {
      const role = user.role;
      if (role !== "admin") {
        throw new HttpException(
          500,
          "Sorry You are not admin or You are not authorized"
        );
      }
    } else {
      throw new HttpException(404, "No user Found");
    }
    try {
      const job = await JobModel.findByPk(jobId);

      if (!job) {
        throw new HttpException(404, "Job not found");
      }

      if (job.status === "pending" || job.status === "accepted") {
        // Delete the job if status is pending
        (job.status = "rejected"), await job.save();
        return { message: "Job rejected successfully",job };
      }
    } catch (error) {
      console.error("Error in rejecting job request:", error);
      throw new HttpException(
        500,
        `Unable to reject job request: ${error.message}`
      );
    }
  },

  updateJob: async (jobId, updatedData, userId) => {
    try {
      const job = await JobModel.findOne({ where: { id: jobId } });

      if (!job) {
        throw new HttpException(404, "Job not found");
      }

      if (job.dataValues.publisher_id != userId) {
        throw new HttpException(
          403,
          "You are not authorized to update this job"
        );
      }

      const [updatedRowsCount, updatedJobs] = await JobModel.update(
        updatedData,
        {
          where: { id: jobId },
          returning: true,
        }
      );

      return [updatedRowsCount, updatedJobs];
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(500, "Unable to update job");
      }
    }
  },

  deleteJob: async (jobId, user) => {
    try {
      const job = await JobModel.findOne({ where: { id: jobId } });

      if (!job) {
        throw new HttpException(404, "Job not found");
      }

      if (job.dataValues.publisher_id !== user.id && user.role!=='admin') {
        throw new HttpException(
          403,
          "You are not authorized to delete this job"
        );
      }

      const deletedRowsCount = await JobModel.destroy({ where: { id: jobId } });

      return deletedRowsCount;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(500, "Unable to delete job");
      }
    }
  },
};

module.exports = { JobService };
