const { HOFModel } = require("../models/HOF.model");
const HttpException  = require("../exceptions/HttpException");
const { UserModel } = require("../models/user.model");

const HOFService = {
  createHOF: async (hofData) => {
    try {
      let newHOF = await HOFModel.create(hofData);

      
      const createdHOF = await HOFModel.findByPk(newHOF.dataValues.Id, {
        include: [
          {
            model: UserModel,
            as: "HOF_userCreatedBy",
            attributes: ["id", "name", "email", "phone_number", "role"],
          },
         
        ],
      });

      return createdHOF;
    } catch (error) {
      console.log(error.message)
      throw new HttpException(500, "Unable to create HOF entry");
    }
  },

  getAllHOFEntries: async () => {
    try {
      const hofEntries = await HOFModel.findAll({
        include: [
          {
            model: UserModel,
            as: "HOF_userCreatedBy",
            attributes: ["id", "name", "email", "phone_number", "role"],
          },
      
        ],
      });

      return hofEntries;
    } catch (error) {
      throw new HttpException(500, "Unable to fetch HOF entries");
    }
  },

  getHOFEntryById: async (hofId) => {
    try {
      const hofEntry = await HOFModel.findByPk(hofId, {
        include: [
          {
            model: UserModel,
            as: "HOF_userCreatedBy",
            attributes: ["id", "name", "email", "phone_number", "role"],
          },
         
        ],
      });

      return hofEntry || null;
    } catch (error) {
      throw new HttpException(500, "Error fetching HOF entry");
    }
  },

  updateHOFEntry: async (hofId, userId, updatedData) => {
    try {
      const hof = await HOFModel.findOne({ where: { id: hofId } });

      if (!hof) {
        throw new HttpException(404, "HOF not found");
      }

      if (hof.dataValues.created_by !== userId) {
        throw new HttpException(
          403,
          "You are not authorized to update this HOF"
        );
      }

      const [updatedRowsCount, updatedHOFEntries] = await HOFModel.update(
        updatedData,
        {
          where: { id: hofId },
          returning: true,
        }
      );

      return [updatedRowsCount, updatedHOFEntries];
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(500, "Unable to update HOF");
      }
    }
  },

  deleteHOFEntry: async (userId, hofId) => {
    try {
      const hof = await HOFModel.findOne({ where: { id: hofId } });

      if (!hof) {
        throw new HttpException(404, "HOF not found");
      }

      if (hof.dataValues.created_by !== userId) {
        throw new HttpException(
          403,
          "You are not authorized to update this HOF"
        );
      }

      const deletedRowsCount = await HOFModel.destroy({ where: { id: hofId } });

      return deletedRowsCount;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(500, "Unable to update job");
      }
    }
  },
};

module.exports = { HOFService };
