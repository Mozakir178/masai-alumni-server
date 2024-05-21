const { MentorModel } = require("../models/mentor.model");

const {
  MentorshipRelationshipModel,
} = require("../models/mentorshipRelationship.model");
//const { sequelize, Op } = require("sequelize");
const { Op, sequelize } = require('sequelize');
const { UserModel } = require("../models/user.model");
const { FeedbackModel } = require("../models/feedback.model");
const HttpException = require("../exceptions/HttpException");

const MentorService = {
  createMentor: async (userId, mentorData) => {
    try {
      const existingMentor = await MentorModel.findOne({
        where: { user_id: userId },
      });

      if (existingMentor) {
        throw new HttpException(400, "User is already registered as a mentor.");
      }

      const newMentor = await MentorModel.create({
        ...mentorData,
        user_id: userId,
      });
      return newMentor;
    } catch (error) {
      throw new HttpException(
        500,
        "Unable to create mentor. Please check your input data."
      );
    }
  },

  getMentorById: async (mentorId) => {
    try {
      const mentor = await MentorModel.findByPk(mentorId);

      if (!mentor) {
        throw new HttpException(404, "mentor not found.");
      }

      return mentor;
    } catch (error) {
      throw new HttpException(500, "Unable to find mentor.");
    }
  },

  getMentorByUserId: async (userId) => {
    try {
      const mentor = await MentorModel.findOne({
        where: {
          user_id: userId,
        },

        include: [
          {
            model: UserModel,
            as: 'user',
           
          }
        ],

      });
      if (!mentor) {
        throw new HttpException(404, "mentor not found.");
      }
      return mentor;
    } catch (error) {
      throw new HttpException(500, "Unable to find mentor.");
    }
  },

  deleteMentor: async (mentorId) => {
    try {
      const deletedRowsCount = await MentorModel.destroy({
        where: { id: mentorId },
      });
      return deletedRowsCount;
    } catch (error) {
      throw new HttpException(500, "Unable to delete mentor");
    }
  },

  getAllMentors: async (filters, userId) => {
    try {
      const filterOptions = {
        where: {},
        include: [
          {
            model: UserModel,
            as: "user",
          },
          {
            model: FeedbackModel,
            as: "feedbacks",
          },
        ],
      };

      if (userId) {
        const isUserMentor = await MentorModel.findOne({
          where: { user_id: userId },
        });

        if (isUserMentor) {
          filterOptions.where = {
            is_active: true,
            user_id: { [Op.ne]: userId },
          };
        } else {
          filterOptions.where = { is_active: true };
        }
      } else {
        filterOptions.where = { is_active: true };
      }

      if (filters.expertise) {
        filterOptions.where.expertise = { [Op.like]: `%${filters.expertise}%` };
      }

      if (filters.experienceYears) {
        filterOptions.where.experience_years = {
          [Op.overlap]: [filters.experienceYears],
        };
      }

      if (filters.name) {
        filterOptions.include[0].where = {
          name: { [Op.regexp]: `.*${filters.name}.*` },
        };
      }

      const mentors = await MentorModel.findAll(filterOptions);
      return mentors;
    } catch (error) {
      throw new HttpException(500, "Unable to fetch mentors");
    }
  },

  updateMentor: async (mentorId, updatedData) => {
    try {
      const updatedMentors = await MentorModel.update(updatedData, {
        where: { id: mentorId },
        returning: true,
      });
      return updatedMentors;
    } catch (error) {
      console.log(error);
      throw new HttpException(500, "Unable to update mentor");
    }
  },

  getAllMenteesForMentor: async (mentorId) => {
    try {
      const acceptedMentees = await MentorshipRelationshipModel.findAll({
        where: {
          mentor_id: mentorId,
          status: "accepted",
        },
        include: [
          {
            model: UserModel,
            as: "mentee",
          },
        ],
      });
      console.log(acceptedMentees, "========================");

      return acceptedMentees;
    } catch (error) {
      console.error(error);
      throw new Error("Internal Server Error");
    }
  },

  getAllMentorForMentee: async (menteeId) => {
    try {
      const acceptedMentors = await MentorshipRelationshipModel.findAll({
        where: {
          mentee_id: menteeId,
          status: "accepted",
        },
        include: [
          {
            model: MentorModel,
            as: "mentor",
            include: [
              {
                model: UserModel,
                as: "user",
              },
            ],
          },
        ],
      });

      return acceptedMentors;
    } catch (error) {
      console.error(error);
      throw new Error("Internal Server Error");
    }
  },

  acceptMentee: async (mentorId, menteeId) => {
    try {
      const [rowsUpdated] = await MentorshipRelationshipModel.update(
        { status: "accepted" },
        {
          where: {
            mentor_id: mentorId,
            mentee_id: menteeId,
            status: "pending",
          },
        }
      );

      if (rowsUpdated === 0) {
        throw new HttpException(
          404,
          "Mentorship relationship not found or status is not pending"
        );
      }

      const acceptedMentee = await MentorshipRelationshipModel.findAll({
        where: {
          mentor_id: mentorId,
          mentee_id: menteeId,
          status: "accepted",
        },
      });

      return acceptedMentee;
    } catch (error) {
      throw new HttpException(500, `Unable to accept mentee: ${error.message}`);
    }
  },

  rejectMentee: async (mentorId, menteeId) => {
    try {
      const [rowsUpdated] = await MentorshipRelationshipModel.update(
        { status: "rejected" },
        {
          where: {
            mentor_id: mentorId,
            mentee_id: menteeId,
            status: "pending",
          },
        }
      );

      if (rowsUpdated === 0) {
        throw new HttpException(
          404,
          "Mentorship relationship not found or status is not pending"
        );
      }

      const rejectedMentee = await MentorshipRelationshipModel.findAll({
        where: {
          mentor_id: mentorId,
          mentee_id: menteeId,
          status: "rejected",
        },
      });

      return rejectedMentee;
    } catch (error) {
      throw new HttpException(500, `Unable to reject mentee: ${error.message}`);
    }
  },

  applyForMentorship: async (menteeData) => {
    try {
      const existingRelationship = await MentorshipRelationshipModel.findOne({
        where: {
          mentee_id: menteeData.mentee_id,
          mentor_id: menteeData.mentor_id,
        },
        limit: 1,
      });

      if (existingRelationship) {
        if (existingRelationship.dataValues.status === "rejected") {
          throw new HttpException(
            400,
            "your application had been rejected by this mentor before"
          );
        } else {
          throw new HttpException(
            400,
            "Mentorship relationship already exists"
          );
        }
      }

      const relation = await MentorshipRelationshipModel.create(menteeData);
      return relation;
    } catch (error) {
      throw new HttpException(
        500,
        `Unable to apply for mentorship: ${error.message}`
      );
    }
  },

  mentorshipNotification: async (mentorId) => {
    try {
      const pendingMentorship = await MentorshipRelationshipModel.findAll({
        where: {
          mentor_id: mentorId,
          status: "pending",
        },
      });

      return pendingMentorship;
    } catch (error) {
      throw new HttpException(500, "Error fetching pending mentorship");
    }
  },

  mentorForApproval: async (user_id) => {
    

    try {
      const user=await UserModel.findByPk(user_id);
      if(user){
      const role=user.role;
      if(role!=="admin"){
        throw new HttpException(403, "Sorry You are not admin or You are not authorized");
      }
    }else{
      throw new HttpException(404, "No user Found")
    }
      const mentors = await MentorModel.findAll({
        where: {
          is_active: false,
          is_checked: false,
        },
        include: [
          {
            model: UserModel,
            as: 'user',
           
          }
        ],
      });
      
      if (mentors.length === 0) {
        throw new HttpException(404, "No new mentor requests found");
      }
      
      return mentors;
    } catch (error) {
      throw new HttpException(
        500,
        `Error fetching pending mentors : ${error.message}`
      );
    }
  },
  

  acceptMentorRequest: async (mentorId,adminId) => {
 
    try {
      const user=await UserModel.findByPk(adminId);
      if(user){
      const role=user.role;
      if(role!=="admin"){
        throw new HttpException(403, "Sorry You are not admin or You are not authorized");
      }
    }else{
      throw new HttpException(404, "No user Found")
    }
      const mentor = await MentorModel.findByPk(mentorId);

      if (!mentor) {
        throw new HttpException(404, "Mentor not found");
      }

      mentor.is_active = true;
      mentor.is_checked = true;

      await mentor.save();

      return mentor;
    } catch (error) {
      console.error("Error accepting mentor request:", error);
      throw new HttpException(500, `Unable to accept mentor request: ${error.message}`);
    }
  },

  rejectMentorRequest: async (mentorId,adminId) => {
 
    try {
      const user=await UserModel.findByPk(adminId);
      if(user){
      const role=user.role;
      if(role!=="admin"){
        throw new HttpException(403 , "Sorry You are not admin or You are not authorized");
      }
    }else{
      throw new HttpException(404 ,"No user Found")
    }
      const mentor = await MentorModel.findByPk(mentorId);

      if (!mentor) {
        throw new HttpException(404 ,"Mentor not found");
      }

      mentor.is_checked = true;

      await mentor.save();

      return mentor;
    } catch (error) {
      console.error("Error in rejecting mentor request:", error);
      throw new HttpException(500,
        console.log("jai shree ram++++++++++++")
        `Unable to reject mentor request: ${error.message}`
      );
    }
  },

 

 

  searchMentors: async (Keyword) => {
    const keyword = Keyword.word;
    try {
        const mentorResults = await MentorModel.findAll({
            where: {
                [Op.or]: [
                    { expertise: { [Op.startsWith]: keyword } },
                    { preferred_communication: { [Op.startsWith]: keyword } },
                    { experience_years: { [Op.startsWith]: keyword } }
                ]
            },
            include: [
                {
                    model: UserModel,
                    as: 'user',
                }
            ],
        });

        const userResults = await UserModel.findAll({
            where: {
                [Op.or]: [
                    { name: { [Op.startsWith]: keyword } },
                    { email: { [Op.startsWith]: keyword } },
                    { phone_number: { [Op.startsWith]: keyword } }
                ]
            }
        });

        if (mentorResults.length === 0 && userResults.length === 0) {
            throw new HttpException(404, `Results not found for keyword "${keyword}"`);
        }

        return { mentorResults, userResults };
    } catch (error) {
        throw new HttpException(500, `Unable to Search Results: ${error.message}`);
    }
},

  
  getAcceptedMenteeCount: async (mentorId) => {
    try {
      const acceptedMenteeCount = await MentorshipRelationshipModel.count({
        where: {
          mentor_id: mentorId,
          status: "accepted",
        },
      });

      return acceptedMenteeCount;
    } catch (error) {
      throw new HttpException(
        500,
        `Unable to get accepted mentee count: ${error.message}`
      );
    }
  },
};

module.exports = { MentorService };
