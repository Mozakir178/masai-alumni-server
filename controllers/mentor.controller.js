const { MentorService } = require("../services/mentor.service");
const { ProfileService } = require("../services/profile.service");
const { NotificationService } = require("../services/notification.service");
const { UserModel } = require("../models/user.model");
const { getSocketServerInstance } = require("../socket/socketStore");

const  HttpException  = require("../exceptions/HttpException");
const { MentorModel } = require("../models/mentor.model");

const {
  MentorshipRelationshipModel,
} = require("../models/mentorshipRelationship.model");

const MentorController = {
  createMentor: async (req, res, next) => {
    try {
      const userId = Number(req.user.id);
      const mentorData = req.body;

      const newMentor = await MentorService.createMentor(userId, mentorData);
      res.status(201).json(newMentor);
    } catch (error) {
      next(error);
    }
  },

  getMentorById: async (req, res, next) => {
    try {
      const mentorId = Number(req.params.id);
      const mentor = await MentorService.getMentorById(mentorId);

      if (!mentor) {
        next(new HttpException(404, "Unable to find mentor"));
      }
      const allAcceptedMenteeOfThisMentor =
        await MentorshipRelationshipModel.findAll({
          where: { mentor_id: mentor.dataValues.user_id, status: "accepted" },
        });
      console.log(mentor.user_id + "===============");
      const userId = mentor.user_id;
      const mentorProfile = await ProfileService.getProfileByUserId(userId);
      console.log(mentor.user_id + "===============" + mentorProfile);
      if (!mentorProfile) {
        next(new HttpException(404, "Unable to find mentor profile"));
      }

      res
        .status(201)
        .json({
          mentor,
          mentorProfile,
          mentees: allAcceptedMenteeOfThisMentor,
        });
    } catch (error) {
      next(error);
    }
  },

  getMentorByUserId: async (req, res, next) => {
    try {
      const user_Id = Number(req.params.id);
      const mentor = await MentorService.getMentorByUserId(user_Id);

      if (!mentor) {
        next(new HttpException(404, "Unable to find mentor"));
      }
      console.log(mentor.user_id + "===============");
      const userId = mentor.user_id;
      const mentorProfile = await ProfileService.getProfileByUserId(userId);
      console.log(mentor.user_id + "===============" + mentorProfile);
      if (!mentorProfile) {
        next(new HttpException(404, "Unable to find mentor profile"));
      }

      res.status(201).json({ mentor, mentorProfile });
    } catch (error) {
      next(error);
    }
  },

  deleteMentor: async (req, res, next) => {
    try {
      const mentorId = Number(req.params.id);
      const deletedRowsCount = await MentorService.deleteMentor(mentorId);

      if (deletedRowsCount === 0) {
        next(new HttpException(400, "Mentor not found"));
      } else {
        res.json({ message: "Mentor deleted successfully" });
      }
    } catch (error) {
      next(error);
    }
  },

  getAllMentors: async (req, res, next) => {
    console.log("Mentor", req.user);
    try {
      const userid = req.user.id;
      const query = req.query;
      const mentors = await MentorService.getAllMentors(query, userid);
      res.status(200).json(mentors);
    } catch (error) {
      next(error);
    }
  },

  getAllPendingMenteesForMentor: async (req, res, next) => {
    const mentorId = Number(req.params.id);

    try {
      const menteeIds = await MentorService.getAllMenteesForMentor(mentorId);
      res.status(200).json({ menteeIds });
    } catch (error) {
      next(error);
    }
  },

  getAllMentorForMentee: async (req, res, next) => {
    const menteeId = Number(req.params.id);

    try {
      const menteeIds = await MentorService.getAllMentorForMentee(menteeId);
      res.status(200).json({ menteeIds });
    } catch (error) {
      next(error);
    }
  },

  getAllMenteesForMentor: async (req, res, next) => {
    const mentorId = Number(req.params.id);

    try {
      const mentorIds = await MentorService.getAllMenteesForMentor(mentorId);
      res.status(200).json({ mentorIds });
    } catch (error) {
      next(error);
    }
  },

  mentorshipNotification: async (req, res, next) => {
    const mentorId = Number(req.params.mentorId);

    try {
      const allMentorshipNotification =
        await MentorService.mentorshipNotification(mentorId);
      res.status(200).json(allMentorshipNotification);
    } catch (error) {
      next(error);
    }
  },



  mentorForApproval: async (req, res, next) => {
    const user_id=Number(req.user.id);
    
    try {
      const allMentorsApplications =
        await MentorService.mentorForApproval(user_id);
      res.status(200).json(allMentorsApplications);
    } catch (error) {
      console.log("error ", error)
      next(error);
    }
  },

  updateMentor: async (req, res, next) => {
    const mentorId = Number(req.params.id);
    const updatedData = req.body;

    try {
      const [updatedRowsCount, updatedMentors] =
        await MentorService.updateMentor(mentorId, updatedData);

      if (updatedRowsCount === 0) {
        next(new HttpException(404, "Mentor not found"));
      } else {
        res.status(200).json(updatedMentors);
      }
    } catch (error) {
      next(error);
    }
  },

  acceptMentee: async (req, res, next) => {
    const menteeId = Number(req.params.menteeId);
    const mentorId = Number(req.user.id);
    const { io } = getSocketServerInstance();

    

    console.log("mentorId ++++++++++++++++++++", mentorId);

    try {
      const mentorshipRelationship = await MentorService.acceptMentee(
        mentorId,
        menteeId
      );

      if (!mentorshipRelationship) {
        next(
          new HttpException(
            404,
            "Mentorship relationship not found or status is not pending"
          )
        );
      }

      const receiver = await UserModel.findByPk(menteeId);

      if (!receiver) {
        return next(new HttpException(404, "Receiver not found"));
      }

      const receiverData = receiver.toJSON();
      const notification = await NotificationService.createNotification({
        receiverId: menteeId,
        type: "new-mentorship-application",
        status: "delivered",
        message: "Congratulations! Your mentorship application got accepted",
        authorId: mentorId,
      });

      if (receiverData.socket_id) {
        io.to(receiverData.socket_id).emit("new-notification", notification);
      }

      res.status(200).json({ message: `Mentee accepted successfully` });
    } catch (error) {
      next(error);
    }
  },

  rejectMentee: async (req, res, next) => {
    const mentorId = Number(req.user.id);
    const menteeId = Number(req.params.menteeId);
    const { io } = getSocketServerInstance();

    try {
      const mentorshipRelationship = await MentorService.rejectMentee(
        mentorId,
        menteeId
      );

      if (!mentorshipRelationship) {
        next(
          new HttpException(
            404,
            "Mentorship relationship not found or status is not pending"
          )
        );
      } else {
        const receiver = await UserModel.findByPk(menteeId);

        if (!receiver) {
          return next(new HttpException(404, "Receiver not found"));
        }

        const receiverData = receiver.toJSON();
        const notification = await NotificationService.createNotification({
          receiverId: menteeId,
          type: "new-mentorship-application",
          status: "delivered",
          message: "Sorry! Your mentorship application got rejected",
          authorId: mentorId,
        });

        if (receiverData.socket_id) {
          io.to(receiverData.socket_id).emit("new-notification", notification);
        }

        res.status(200).json({
          message: `Mentee rejected successfully`,
        });
      }
    } catch (error) {
      next(error);
    }
  },

  acceptMentorRequest: async (req, res, next) => {
    const mentorId = Number(req.params.mentorId);
    const adminId = Number(req.user.id);
    const { io } = getSocketServerInstance();
    
    try {
      const newMentor = await MentorService.acceptMentorRequest(
        mentorId,
        adminId,
      );

      if (!newMentor) {
        next(
          new HttpException(
            404,
            "No new Mentor Application Found"
          )
        );
      }
      
      const user_Id = newMentor.user_id;
      const receiver = await UserModel.findByPk(user_Id);

      if (!receiver) {
        return next(new HttpException(404, "Receiver not found"));
      }

      const receiverData = receiver.toJSON();
      const notification = await NotificationService.createNotification({
        receiverId: user_Id,
        type: "new-mentorship-application",
        status: "delivered",
        message: "Congratulations! Your mentor application got accepted",
        authorId: adminId,
      });

      if (receiverData.socket_id) {
        io.to(receiverData.socket_id).emit("new-notification", notification);
      }

      res.status(200).json({ message: `Mentor application accepted successfully` });
    } catch (error) {
      next(error);
    }
  },

  rejectMentorRequest: async (req, res, next) => {
    const mentorId = Number(req.params.mentorId);
    const adminId = Number(req.user.id);
    const { io } = getSocketServerInstance();
    
    try {
      const newMentor = await MentorService.rejectMentorRequest(
        mentorId,
        adminId,
      );

      if (!newMentor) {
        next(
          new HttpException(
            404,
            "No new Mentor Application Found"
          )
        );
      }
      
      const user_Id = newMentor.user_id;
      const receiver = await UserModel.findByPk(user_Id);

      if (!receiver) {
        return next(new HttpException(404, "Receiver not found"));
      }

      const receiverData = receiver.toJSON();
      const notification = await NotificationService.createNotification({
        receiverId: user_Id,
        type: "new-mentorship-application",
        status: "delivered",
        message: "Sorry! Your mentor application got rejected",
        authorId: adminId,
      });

      if (receiverData.socket_id) {
        io.to(receiverData.socket_id).emit("new-notification", notification);
      }

      res.status(200).json({ message: `Mentor  application got rejected successfully` });
    } catch (error) {
      next(error);
    }
  },


  searchMentors: async(req, res, next) =>{
    const keyword =req.body;
    const word=keyword.keyword;
    console.log("keyword+++++++++++++++++++" , word);
    try {
      const results=await MentorService.searchMentors({
        word,
      })
      res.status(200).json({results});
    } catch (error) {
      next(error);
    }
  },
 
  applyForMentorship: async (req, res, next) => {
    const userId = Number(req.user.id);
    const menteeData = req.body;
    const { io } = getSocketServerInstance();

    try {
      await MentorService.applyForMentorship({
        ...menteeData,
        mentee_id: userId,
      });

      const receiver = await UserModel.findByPk(menteeData.mentor_id);

      if (!receiver) {
        return next(new HttpException(404, "Receiver not found"));
      }

      const receiverData = receiver.toJSON();
      const notification = await NotificationService.createNotification({
        receiverId: menteeData.mentor_id,
        type: "new-mentorship-application",
        status: "delivered",
        message: "You received a new mentorship application",
        authorId: menteeData.mentee_id,
      });

      if (receiverData.socket_id) {
        io.to(receiverData.socket_id).emit("new-notification", notification);
      }

      res.status(201).json({ message: "Application sent successfully" });
    } catch (error) {
      next(error);
    }
  },

  getAcceptedMenteeCount: async (req, res, next) => {
    const mentorId = Number(req.params.mentorId);

    try {
      const acceptedMenteeCount = await MentorService.getAcceptedMenteeCount(
        mentorId
      );
      res.status(200).json({ acceptedMenteeCount });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = { MentorController };
