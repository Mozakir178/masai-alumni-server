const { spotLightModel } = require("../models/spotlight.model");
const  HttpException  = require("../exceptions/HttpException");
const { UserModel } = require("../models/user.model");

const SpotlightService = {
  getSpotlightById: async (spotlightId) => {
    try {
      const spotlight = await spotLightModel.findByPk(spotlightId, {
        include: [
          {
            as: "posted_by",
            model: UserModel,
          },
        ],
      });
      return spotlight;
    } catch (error) {
      throw new HttpException(500, "Error fetching spotlight");
    }
  },

  getAllSpotlights: async (categories) => {
    try {
      let spotlights;

      if (categories) {
        spotlights = await spotLightModel.findAll({
          where: {
            Categories: categories,
          },
          include: [
            {
              as: "posted_by",
              model: UserModel,
            },
          ],
        });
      } else {
        spotlights = await spotLightModel.findAll({
          include: [
            {
              as: "posted_by",
              model: UserModel,
            },
          ],
        });
      }

      return spotlights;
    } catch (error) {
      throw new HttpException(500, "Unable to fetch spotlight");
    }
  },

  createSpotlight: async (spotlightData) => {
    try {
      let newSpotlight = await spotLightModel.create(spotlightData);

      newSpotlight = await spotLightModel.findByPk(newSpotlight.spotlight_id);
      return newSpotlight;
    } catch (error) {
      console.log(error.message)

      throw new HttpException(500, "Unable to fetch spotlight");
    }
  },

  updateSpotlight: async (userId, spotlightId, updatedData) => {
    try {
      const spotlight = await spotLightModel.findOne({
        where: { spotlight_id: spotlightId },
      });

      if (!spotlight) {
        throw new HttpException(404, "spotlight not found");
      }

      if (spotlight.dataValues.created_by !== userId) {
        throw new HttpException(
          403,
          "You are not authorized to update this spotlight"
        );
      }

      const [updatedRowsCount, updatedSpotlights] = await spotLightModel.update(
        updatedData,
        {
          where: { spotlight_id: spotlightId },
          returning: true,
        }
      );

      return [updatedRowsCount, updatedSpotlights];
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(500, "Unable to update spotlight");
      }
    }
  },

  deleteSpotlight: async (userId, spotlightId) => {
    try {
      const spotlight = await spotLightModel.findOne({
        where: { spotlight_id: spotlightId },
      });
      if (!spotlight) {
        throw new HttpException(404, "spotlight not found");
      }

      if (spotlight.dataValues.created_by !== userId) {
        throw new HttpException(
          403,
          "You are not authorized to delete this spotlight"
        );
      }

      const deletedRowsCount = await spotLightModel.destroy({
        where: { spotlight_id: spotlightId },
      });

      return deletedRowsCount;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(500, "Unable to delete spotlight");
      }
    }
  },
};

module.exports = { SpotlightService };
