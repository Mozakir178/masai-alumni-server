const { SpotlightService } = require("../services/spotlight.service");
const  HttpException  = require("../exceptions/HttpException");
const SpotlightController = {
  getSpotlightById: async (req, res, next) => {
    try {
      const spotlightId = Number(req.params.id);
      const spotlight = await SpotlightService.getSpotlightById(spotlightId);

      if (spotlight) {
        res.status(200).json(spotlight);
      } else {
        throw new HttpException(404, "Spotlight not found");
      }
    } catch (error) {
      next(error);
    }
  },

  getAllSpotlights: async (req, res, next) => {
    try {
      const { category } = req.query;
      const categories = category;
      const spotlights = await SpotlightService.getAllSpotlights(categories);
      res.status(200).json(spotlights);
    } catch (error) {
      next(error);
    }
  },

  createSpotlight: async (req, res, next) => {
    try {
      const spotlightData = req.body;
      const id = Number(req.user.id);
console.log(spotlightData);

      const newSpotlight = await SpotlightService.createSpotlight({
        ...spotlightData,
        created_by: id,
      });
      res.status(201).json(newSpotlight);
    } catch (error) {
      console.log(error.message);

      next(error);
    }
  },

  updateSpotlight: async (req, res, next) => {
    try {
      const userId = Number(req.user.id);
      const spotlightId = Number(req.params.id);
      const updatedData = req.body;

      const [updatedRowsCount, updatedSpotlights] =
        await SpotlightService.updateSpotlight(
          userId,
          spotlightId,
          updatedData
        );

      if (Number(updatedSpotlights) === 0) {
        throw new HttpException(
          404,
          "Spotlight not found or Unauthorized: You are not the creator of this spotlight"
        );
      } else {
        res
          .status(200)
          .json({ message: "Spotlight is updated", updatedSpotlights });
      }
    } catch (error) {
      next(error);
    }
  },

  deleteSpotlight: async (req, res, next) => {
    try {
      const spotlightId = Number(req.params.id);

      const deletedRowsCount = await SpotlightService.deleteSpotlight(
        req.user.id,
        spotlightId
      );

      if (deletedRowsCount === 0) {
        throw new HttpException(404, "Spotlight not found");
      } else {
        res.status(200).json({ message: "Spotlight deleted successfully" });
      }
    } catch (error) {
      next(error);
    }
  },
};

module.exports = { SpotlightController };
