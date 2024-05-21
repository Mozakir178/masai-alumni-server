const { UserModel } = require("../models/user.model");
const AuthUtils = require("../utils/AuthUtils");
const { MasaiUserModel } = require("../models/masaiUserData.model");
// const MailSender = require("@utils/mailSender");

const UserService = {
  requestForgotPassword: async (email) => {
    try {
      const existingUser = await UserModel.findOne({ where: { email: email } });

      if (existingUser) {
        const resetToken = await AuthUtils.generateResetToken();
        const resetTokenExpiration = new Date(Date.now() + 600000);
        console.log("Reset Token:", resetToken);
        console.log("Reset Token Expiration:", resetTokenExpiration);

        await UserModel.update(
          {
            resetToken: resetToken,
            resetTokenExpiration: resetTokenExpiration,
          },
          { where: { email: email } }
        );

        await MailSender.sendPasswordResetEmail(email, resetToken);
        return;
      }

      const alumniUser = await MasaiUserModel.findOne({
        where: { email: email },
      });

      if (alumniUser) {
        await UserModel.create({
          name: alumniUser.dataValues.name,
          email: alumniUser.dataValues.email,
          phone_number: alumniUser.dataValues.mobile,
          password: alumniUser.dataValues.password,
          role: alumniUser.dataValues.role,
          user_profile_photo_path: alumniUser.dataValues.profile_photo_path,
        });

        const resetToken = await AuthUtils.generateResetToken();
        const resetTokenExpiration = new Date(Date.now() + 600000);
        console.log("Reset Token:", resetToken);
        console.log("Reset Token Expiration:", resetTokenExpiration);

        await UserModel.update(
          {
            resetToken: resetToken,
            resetTokenExpiration: resetTokenExpiration,
          },
          { where: { email: email } }
        );

        await MailSender.sendPasswordResetEmail(email, resetToken);
        return;
      } else {
        throw new Error("User not found...");
      }
    } catch (error) {
      throw new Error("Error during forgot password request: " + error.message);
    }
  },

  resetPassword: async (resetToken, newPassword) => {
    try {
      const user = await UserModel.findOne({
        where: {
          resetToken: resetToken,
        },
      });

      const date = new Date(user.dataValues.resetTokenExpiration);
      const milliseconds = date.getTime();

      if (!user) {
        throw new Error("Invalid or expired reset token");
      } else {
        if (milliseconds >= Date.now()) {
          await UserModel.update(
            { password: newPassword },
            { where: { resetToken: resetToken } }
          );
        } else {
          throw new Error("Expired reset token");
        }
      }
    } catch (error) {
      throw new Error("Error during password reset: " + error.message);
    }
  },

  changePassword: async (email, oldPassword, newPassword) => {
    try {
      const existingUser = await UserModel.findOne({ where: { email: email } });

      if (!existingUser) {
        throw new Error("User not found");
      }

      const isPasswordMatch = await AuthUtils.comparePasswords(
        oldPassword,
        existingUser.dataValues.password
      );

      if (isPasswordMatch) {
        await UserModel.update(
          { password: newPassword },
          { where: { email: email } }
        );

        console.log("Password updated successfully");
      } else {
        throw new Error("Incorrect password");
      }
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  },
};
module.exports = {
  UserService
};
