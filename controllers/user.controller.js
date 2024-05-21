const HttpException = require("../exceptions/HttpException");
const { UserModel } = require("../models/user.model");
const { UserService } = require("../services/user.service");
const { getSocketServerInstance } = require("../socket/socketStore");

const UserController = {
  UpdateUser: async (req, res, next) => {
    const data = req.body;
    const userId = req.user.id;
    const { io } = getSocketServerInstance();
    try {
      if (!userId) {
        throw new HttpException(400, "please provide a user ID");
      }
      let user = await UserModel.findOne({ where: { id: userId } });
      user = user?.dataValues;
      await UserModel.update(data, { where: { id: user.id } });
      io.emit("userStatusUpdated", {
        ...user,
        ...data,
      });
      res.status(200).send("user successfully updated");
    } catch (error) {
      const message = new HttpException(
        500,
        "Error updating current user model: " + error.message
      );
      next(message);
    }
  },
  getUserDetails: async (req, res) => {
    const id = Number(req.user.id);
    try {
      const user = await UserModel.findOne({ where: { id: id } });
      res.status(200).json({
        success: true,
        error: false,
        user: user?.dataValues,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      await UserService.requestForgotPassword(email);
      res
        .status(200)
        .json({ message: "Password reset email sent successfully" });
    } catch (error) {
      console.error("Error during forgot password request:", error);
      res
        .status(500)
        .json({ error: "An error occurred during password reset request" });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { resetToken, newPassword } = req.body;
      await UserService.resetPassword(resetToken, newPassword);
      res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
      console.error("Error during password reset:", error);
      res
        .status(500)
        .json({ error: "An error occurred during password reset" });
    }
  },
  changePassword: async (req, res) => {
    try {
      const { oldPassword, newPassword } = req.body;
      const email = req.user.email;

      if (!oldPassword || !newPassword) {
        res
          .status(400)
          .json({ error: "Both oldPassword and newPassword are required." });
        return;
      }

      await UserService.changePassword(email, oldPassword, newPassword);

      res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      res.status(401).json({ error: "InvalidCredentials" });
    }
  },
};
module.exports = {
  UserController,
};
