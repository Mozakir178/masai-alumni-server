const { HttpException } = require("../exceptions/HttpException");
const { EducationModel } = require("../models/education.model");

const EducationService = {
  // Create a new education record
  createEducation: async (userId, educationData) => {
    try {
      let newEducation = await EducationModel.create({
        ...educationData,
        user_id: userId,
      });
      newEducation = await EducationModel.findByPk(newEducation.id);
      return newEducation;
    } catch (error) {
      throw new HttpException(500, "Error creating education record");
    }
  },

  // Update an education record
  updateEducation: async (userId, educationId, updatedEducationData) => {
    try {
      const education = await EducationModel.findOne({
        where: { id: educationId, user_id: userId },
      });

      if (education) {
        education.set(updatedEducationData);
        await education.save();
        return education;
      } else {
        return null;
      }
    } catch (error) {
      throw new HttpException(500, "Error updating education record");
    }
  },

  // Delete an education record
  deleteEducation: async (userId, educationId) => {
    try {
      const deletedRowsCount = await EducationModel.destroy({
        where: { id: educationId, user_id: userId },
      });
      return deletedRowsCount;
    } catch (error) {
      throw new HttpException(500, "Error deleting education record");
    }
  },
};

module.exports = { EducationService };
