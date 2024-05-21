const HttpException = require("../exceptions/HttpException");
const { UserModel } = require("../models/user.model");
const AuthUtils = require("../utils/AuthUtils");
const { MasaiUserModel } = require("../models/masaiUserData.model");
require('dotenv').config();
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { ProfileService } = require("../services/profile.service");

const AuthController = {
  loginWithLMS: async (req, res, next) => {
    const lms_token = req.body.lms_token;
    try {
      const jwt_secret_from_lms = process.env.JWT_SECRET_LMS;

      const decodedUserOfLMS = jwt.verify(lms_token, jwt_secret_from_lms);
      console.log(
        decodedUserOfLMS,
        "-------------",
       
      );
      const batch = decodedUserOfLMS?.userData?.batchData
   
      const existingUser = await UserModel.findOne({
        where: { email: decodedUserOfLMS.userData.email },
      });

      if (existingUser) {
        const profile = await ProfileService.getProfileByUserId(
          Number(existingUser.dataValues.id)
        );

        if (!profile) {
          await ProfileService.createProfile(
            {
              id: Number(existingUser.dataValues.id),
              start_batch:
                batch.length !== 0
                  ? batch[0]?.name
                  : null,
              end_batch:
                batch.length >= 1
                  ? batch[batch.length - 1]?.name
                  : null,
              roll_number: decodedUserOfLMS?.userData?.student_code,
            },
            Number(existingUser.dataValues.id),
            existingUser.dataValues.name.toString()
          );
        }
        const token = jwt.sign(
          { id: existingUser?.toJSON().id, role: existingUser?.toJSON().role },
          process.env.JWT_SECRET
        );

        return res.status(200).json({
          message: "Sign in successful!",
          success: true,
          user: existingUser.dataValues,
          token: token,
        });
      } else if (!existingUser && decodedUserOfLMS?.userData?.email) {
        let user = await UserModel.create({
          name: decodedUserOfLMS?.userData?.name,
          email: decodedUserOfLMS.userData?.email,
          phone_number: decodedUserOfLMS?.userData?.mobile_number,
          student_code:decodedUserOfLMS?.userData?.student_code,
          role:
            decodedUserOfLMS?.userData?.role === "admin"
              ? decodedUserOfLMS?.userData?.role
              : "student",
          user_profile_photo_path: decodedUserOfLMS?.userData?.profile_photo_path
            ? decodedUserOfLMS?.userData?.profile_photo_path
            : null,
        });

        user = await UserModel.findByPk(user.dataValues.id);
        const profile = await ProfileService.getProfileByUserId(
          Number(user.dataValues.id)
        );

        if (!profile) {
          await ProfileService.createProfile(
            {
              start_batch: batch.length !== 0 ? batch[0]?.name : null,
              end_batch:
                batch.length >= 1 ? batch[batch.length - 1]?.name : null,
              roll_number: decodedUserOfLMS?.userData?.student_code,
            },
            Number(user.dataValues.id),
            user.name.toString()
          );
        }

        const token = jwt.sign(
          { id: user.toJSON().id, role: user.toJSON().role },
          process.env.JWT_SECRET
        );

        return res.status(200).json({
          message: "Sign in successful!",
          success: true,
          user: user.dataValues,
          token: token,
        });
      } else {
        next(HttpException(404,"something went wrong"));
      }
      
    } catch (error) {
       console.log(error)
    }
  },

  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const existingUser = await UserModel.findOne({
        where: { email: email },
      });

      if (existingUser) {
        const isPasswordMatch = AuthUtils.comparePasswords(
          password,
          existingUser.dataValues.password
        );

        console.log(isPasswordMatch, "++++++++++++++++++++++++");
        if (isPasswordMatch) {
          delete existingUser.dataValues.password;

          const profile = await ProfileService.getProfileByUserId(
            Number(existingUser.dataValues.id)
          );

          console.log(profile, "--------------------");

          if (!profile) {
            await ProfileService.createProfile(
              { id: Number(existingUser.dataValues.id) },
              Number(existingUser.dataValues.id),
              existingUser.dataValues.name.toString()
            );
          }
          const token = jwt.sign(
            { id: existingUser.toJSON().id, role: existingUser.toJSON().role },
            process.env.JWT_SECRET
          );

          return res.status(200).json({
            message: "Sign in successful!",
            success: true,
            user: existingUser.dataValues,
            token: token,
          });
        } else {
          return res.status(400).send({ message: "Incorrect password" });
        }
      }

      const alumniUser = await MasaiUserModel.findOne({
        where: { email: email },
      });

      if (alumniUser) {
        const isPasswordMatch = AuthUtils.comparePasswords(
          password,
          alumniUser.dataValues.password
        );

        if (isPasswordMatch) {
          let user = await UserModel.create({
            name: alumniUser.dataValues.name,
            email: alumniUser.dataValues.email,
            phone_number: alumniUser.dataValues.mobile,
            password: alumniUser.dataValues.password,
            role: alumniUser.dataValues.role,
            user_profile_photo_path: alumniUser.dataValues.profile_photo_path,
          });

          user = await UserModel.findByPk(user.id);

          delete user.dataValues.password;

          const profile = await ProfileService.getProfileByUserId(
            Number(user.id)
          );

          if (!profile) {
            await ProfileService.createProfile(
              {},
              Number(user.id),
              user.name.toString()
            );
          }

          const token = jwt.sign(
            { id: user.toJSON().id, role: user.toJSON().role },
            process.env.JWT_SECRET
          );

          return res.status(200).json({
            message: "Sign in successful!",
            success: true,
            user: user.dataValues,
            token: token,
          });
        } else {
          return res.status(400).send({ message: "Incorrect password" });
        }
      } else {
        return res.status(404).send({ message: "User not Found" });
      }
    } catch (error) {
      next(error);
    }
  },
  logout: async (req, res, next) => {
    return res.status(200).send({
      message: "Logged out successfully",
      error: false,
    });
  },
};

module.exports = {
  AuthController,
};
