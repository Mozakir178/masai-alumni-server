const { HttpException } = require("../exceptions/HttpException");
const { ExperienceModel } = require("../models/experience.model");
const { ProfileModel } = require("../models/profile.model");

const ExperienceService = {
  // Create a new experience record
  createExperience: async (userId, experienceData) => {
    try {
      let newExperience = await ExperienceModel.create({
        ...experienceData,
        user_id: userId,
      });

      newExperience = await ExperienceModel.findByPk(newExperience.id);
      const experiences = await ExperienceModel.findAll({
        where: { user_id: userId },
      });

      if (experiences && experiences.length > 0) {
        const experience = experiences.filter((e) => {
          e = e.toJSON();
          return e.currently_working === true;
        });

        if (experience.length > 0) {
          await ProfileModel.update(
            {
              current_designation: experience[0].dataValues.designation,
              current_company: experience[0].dataValues.company_name,
            },
            { where: { user_id: userId } }
          );
        }
      } else {
        throw new HttpException(
          404,
          "experience record not found after creating"
        );
      }

      return newExperience;
    } catch (error) {
      throw new HttpException(500, "Error creating experience record");
    }
  },

  // Update an existing experience record
  updateExperience: async (userId, experienceId, updatedExperienceData) => {
    try {
      const experience = await ExperienceModel.findOne({
        where: { id: experienceId, user_id: userId },
      });

      if (experience) {
        experience.set(updatedExperienceData);
        await experience.save();

        const experiences = await ExperienceModel.findAll({
          where: { user_id: userId },
        });

        if (experiences && experiences.length > 0) {
          const experience = experiences.filter((e) => {
            e = e.toJSON();
            return e.currently_working === true;
          });

          if (experience.length > 0) {
            await ProfileModel.update(
              {
                current_designation: experience[0].dataValues.designation,
                current_company: experience[0].dataValues.company_name,
              },
              { where: { user_id: userId } }
            );
          }
        } else {
          throw new HttpException(
            404,
            "experience record not found after creating"
          );
        }

        return experience;
      } else {
        return null;
      }
    } catch (error) {
      throw new HttpException(500, "Error updating experience record");
    }
  },

  // Delete an experience record
  deleteExperience: async (userId, experienceId) => {
    try {
      const deletedRowsCount = await ExperienceModel.destroy({
        where: { id: experienceId, user_id: userId },
      });

      const experiences = await ExperienceModel.findAll({
        where: { user_id: userId },
      });

      if (experiences && experiences.length > 0) {
        const experience = experiences.filter((e) => {
          e = e.toJSON();
          return e.currently_working === true;
        });

        if (experience.length > 0) {
          await ProfileModel.update(
            {
              current_designation: experience[0].dataValues.designation,
              current_company: experience[0].dataValues.company_name,
            },
            { where: { user_id: userId } }
          );
        }
      }
      // else {
      //   throw new HttpException(
      //     404,
      //     "experience record not found after creating",
      //   );
      // }

      return deletedRowsCount;
    } catch (error) {
      throw new HttpException(500, "Error deleting experience record");
    }
  },
};

module.exports = { ExperienceService };
