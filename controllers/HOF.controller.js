const { HOFService } = require("../services/HOF.service");
const HttpException = require("../exceptions/HttpException");

const HOFController = {
  createHOF: async (req, res, next) => {
    try {
      const hofData = req.body;
      const id = Number(req.user.id);

      const newHOF = await HOFService.createHOF({ ...hofData, created_by: id });

      res.status(201).json({ success: true, data: newHOF });
    } catch (error) {
      next(error);
    }
  },

  getAllHOFEntries: async (req, res, next) => {
    try {
      const hofEntries = await HOFService.getAllHOFEntries();

      res.status(200).json({ success: true, data: hofEntries });
    } catch (error) {
      next(error);
    }
  },

  getHOFEntryById: async (req, res, next) => {
    try {
      const hofId = Number(req.params.id);
      const hofEntry = await HOFService.getHOFEntryById(hofId);

      if (!hofEntry) {
        throw new HttpException(404, "HOF entry not found");
      }

      res.status(200).json({ success: true, data: hofEntry });
    } catch (error) {
      next(error);
    }
  },

  updateHOFEntry: async (req, res, next) => {
    try {
      const hofId = Number(req.params.id);
      const id = Number(req.user.id);

      const { image, title, subtitle } = req.body;

      const updatedData = {
        image,
        title,
        subtitle,
       
      };

      const [updatedRowsCount, updatedHOFEntries] =
        await HOFService.updateHOFEntry(hofId, id, updatedData);

      if (Number(updatedRowsCount) === 0) {
        throw new HttpException(404, "HOF entry not found or Unauthorized");
      } else {
        res.status(200).json({
          message: "HOF entry updated successfully",
          updatedHOFEntries,
        });
      }
    } catch (error) {
      next(error);
    }
  },

  deleteHOFEntry: async (req, res, next) => {
    try {
      const hofId = Number(req.params.id);

      const deletedRowsCount = await HOFService.deleteHOFEntry(
        req.user.id,
        hofId
      );

      if (deletedRowsCount === 0) {
        throw new HttpException(404, "HOF entry not found");
      } else {
        res.status(200).json({ message: "HOF entry deleted successfully" });
      }
    } catch (error) {
      next(error);
    }
  },
};

module.exports = { HOFController };
