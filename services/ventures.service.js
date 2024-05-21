const { UserModel } = require("../models/user.model");
const { VentureModel } = require("../models/venture.model");
const { HttpException } = require("../exceptions/HttpException");

const VentureService = {
  getAllVentures: async () => {
    try {
      const ventures = await VentureModel.findAll({
        include: [
          {
            model: UserModel,
            as: "owner", // Alias defined in the association
          },
        ],
      });
      return ventures;
    } catch (error) {
      throw new Error("Error fetching ventures: " + error.message);
    }
  },

  getVentureById: async (ventureId) => {
    try {
      const venture = await VentureModel.findByPk(ventureId, {
        include: [
          {
            model: UserModel,
            as: "owner", // Alias defined in the association
          },
        ],
      });

      if (!venture) {
        throw new Error("Venture not found");
      }

      return venture;
    } catch (error) {
      throw new Error("Error fetching venture: " + error.message);
    }
  },

  createVenture: async (ventureData) => {
    try {
      const venture = await VentureModel.create(ventureData);
      return venture;
    } catch (error) {
      throw new Error("Unable to create venture: " + error.message);
    }
  },

  acceptVentureRequest: async (ventureId, adminId) => {
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
      const venture = await VentureModel.findByPk(ventureId);

      if (!venture) {
        throw new HttpException(404, "Venture not found");
      }

      venture.status = "accepted";

      await venture.save();

      return venture;
    } catch (error) {
      console.error("Error accepting venture request:", error);
      throw new Error(`Unable to accept venture request: ${error.message}`);
    }
  },

  rejectVentureRequest: async (ventureId, adminId) => {
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
      const venture = await VentureModel.findByPk(ventureId);

      if (!venture) {
        throw new HttpException(404, "venture not found");
      }

      if (venture.status === "pending" || venture.status === "accepted") {
       
        (venture.status = "rejected"), await venture.save();
        return { message: "venture rejected successfully",venture };
      }
    } catch (error) {
      console.error("Error in rejecting venture request:", error);
      throw new HttpException(
        500,
        `Unable to reject venture request: ${error.message}`
      );
    }
  },

  updateVenture: async (ventureId, updatedData) => {
    try {
      const [updatedRowsCount, updatedVenture] = await VentureModel.update(
        updatedData,
        { where: { id: ventureId }, returning: true }
      );
      return [updatedRowsCount, updatedVenture];
    } catch (error) {
      throw new Error("Unable to update venture: " + error.message);
    }
  },

  deleteVenture: async (ventureId) => {
    try {
      const deletedRowsCount = await VentureModel.destroy({
        where: { id: ventureId },
      });

      return deletedRowsCount;
    } catch (error) {
      throw new Error("Unable to delete venture: " + error.message);
    }
  },
};

module.exports = { VentureService };
