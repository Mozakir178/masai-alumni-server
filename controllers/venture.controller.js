
const { VentureService } = require("../services/ventures.service");
const { getSocketServerInstance } = require("../socket/socketStore");
const { NotificationService } = require("../services/notification.service");
const { UserModel } = require("../models/user.model");
const VentureController = {
  getAllVentures: async (req, res) => {
    try {
      const ventures = await VentureService.getAllVentures();
      res.status(200).json({
        success: true,
        error: false,
        ventures,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: true,
        success: false,
        message: "Something went wrong",
      });
    }
  },

  getVentureById: async (req, res) => {
    const ventureId = Number(req.params.id);
    try {
      const venture = await VentureService.getVentureById(ventureId);
      if (!venture) {
        res.status(404).json({ message: "Venture not found" });
      } else {
        res.status(200).json({
          success: true,
          error: false,
          venture,
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: true,
        message: error.message,
      });
    }
  },

  createVenture: async (req, res) => {
    const ventureData = req.body;
    try {
      const venture = await VentureService.createVenture(ventureData);
      res.status(201).json({
        success: true,
        error: false,
        message: "Added venture",
        venture,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: true,
        success: false,
        message: "Something went wrong",
      });
    }
  },

  acceptVentureRequest: async (req, res, next) => {
    const ventureId = Number(req.params.id);
    const adminId = Number(req.user.id);
    const { io } = getSocketServerInstance();
    
    try {
      const newVenture = await VentureService.acceptVentureRequest(
        ventureId,
        adminId,
      );

      if (!newVenture) {
        next(
          new HttpException(
            404,
            "No new Venture Request Found"
          )
        );
      }
      
      const user_Id = newVenture.dataValues.venture_owner;
      const receiver = await UserModel.findByPk(user_Id);

      if (!receiver) {
        throw new HttpException(404, "Receiver not found");
      }

      const receiverData = receiver.toJSON();
      console.log(receiverData);
      const notification = await NotificationService.createNotification({
        receiverId: user_Id,
        type: "new-venture-application",
        status: "delivered",
        message: "Congratulations! Your Venture application got accepted",
        authorId: adminId,
      });
      console.log(notification.toJSON());


      if (receiverData.socket_id) {
        io.to(receiverData.socket_id).emit("new-notification", notification);
      }

      console.log(notification.toJSON());
      res.status(200).json({ message: `Venture application accepted successfully`,newVenture });
    } catch (error) {
      next(error);
    }
  },

  rejectVentureRequest: async (req, res, next) => {
    const ventureId = Number(req.params.id);
    const adminId = Number(req.user.id);
    const { io } = getSocketServerInstance();
    
    try {
      const newVenture = await VentureService.rejectVentureRequest(
        ventureId,
        adminId,
      );

      if (!newVenture) {
        next(
          new HttpException(
            404,
            "No new Venture Request Found"
          )
        );
      }
      console.log(newVenture);
     const user_Id = newVenture.venture.dataValues.venture_owner;
     console.log(user_Id);
      const receiver = await UserModel.findByPk(user_Id);

      if (!receiver) {
        return next(new HttpException(404, "Receiver not found"));
      }

      const receiverData = receiver.toJSON();
      const notification = await NotificationService.createNotification({
        receiverId: user_Id,
        type: "new-venture-application",
        status: "delivered",
        message: "Sorry! Your venture application got rejected",
        authorId: adminId,
      });
      console.log(notification.toJSON());
      if (receiverData.socket_id) {
        io.to(receiverData.socket_id).emit("new-notification", notification);
      }

      res.status(200).json({ message: `Venture request got rejected successfully` });
    } catch (error) {
      next(error);
    }
  },

  updateVenture: async (req, res) => {
    const ventureId = Number(req.params.id);
    const updatedData = req.body;
    try {
      const [updatedRowsCount, updatedVenture] =
        await VentureService.updateVenture(ventureId, updatedData);
      if (updatedVenture === 0) {
        res.status(404).json({
          success: false,
          error: true,
          message: "Venture not found",
        });
      } else {
        console.log({
          updatedRowsCount,
          updatedVenture,
        });
        res.status(200).json({
          success: true,
          error: false,
          message: "Updated venture",
          venture: updatedVenture,
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: true,
        message: error.message,
      });
    }
  },

  deleteVenture: async (req, res) => {
    const ventureId = Number(req.params.id);
    try {
      const deletedRowsCount = await VentureService.deleteVenture(ventureId);
      if (deletedRowsCount === 0) {
        res.status(404).json({
          success: false,
          error: true,
          message: "Venture not found",
        });
      } else {
        res.json({
          success: true,
          error: false,
          message: "Venture deleted successfully",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: true,
        message: error.message,
      });
    }
  },
};

module.exports = { VentureController };
