const { ProfileService } = require("../services/profile.service");
const HttpException = require("../exceptions/HttpException");
const { UserModel } = require("../models/user.model");
const { ExperienceService } = require("../services/experience.service");
const { EducationService } = require("../services/education.service");
const { addressService } = require("../services/address.service");
const { skillService } = require("../services/skill.service");
const { ProfileModel } = require("../models/profile.model");
const ProfileController = {
  getProfileById: async (req, res, next) => {
    const id = Number(req.params.id);
    const userId = Number(req.user.id);

    try {
      const profile = await ProfileService.getProfileById(id);

      if (profile) {
        res.status(200).json(profile);
      } else {
        next(new HttpException(404, "Profile not found"));
      }
    } catch (error) {
      next(error);
    }
  },

  getProfileByUserId: async (req, res, next) => {
    const userId = Number(req.params.id);

    console.log(userId);
    try {
      const profile = await ProfileService.getProfileByUserId(userId);

      res.status(200).json(profile);
    } catch (error) {
      next(error);
    }
  },

  getAllProfiles: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const filters = req.query;
      console.log(filters);
      const { page, pageSize } = req.query;
      const { total, profiles } = await ProfileService.getAllProfiles(
        filters,
        userId,
        +page || 1,
        +pageSize || 12
      );

      res.status(200).json({ total, profiles });
    } catch (error) {
      next(error);
    }
  },

  createProfile: async (req, res, next) => {
    const userName = req.user.name;
    const userId = Number(req.user.id);
    const profile = req.body;

    try {
      const newProfile = await ProfileService.createProfile(
        profile,
        userId,
        userName
      );
      res.status(201).json(newProfile);
    } catch (error) {
      next(error);
    }
  },

  updateExperience: async (req, res, next) => {
    const experienceId = Number(req.params.id);
    const userId = Number(req.user.id);
    const updatedData = req.body;

    try {
      const updateResponse = await ExperienceService.updateExperience(
        userId,
        experienceId,
        updatedData
      );
      res.status(201).json(updateResponse);
    } catch (error) {
      next(error);
    }
  },

  createExperience: async (req, res, next) => {
    const experienceData = req.body;
    const userId = Number(req.user.id);

    try {
      const newExperience = await ExperienceService.createExperience(
        userId,
        experienceData
      );
      res.status(201).json(newExperience);
    } catch (error) {
      next(error);
    }
  },

  deleteExperience: async (req, res, next) => {
    const userId = Number(req.user.id);
    const experienceId = Number(req.params.id);

    try {
      const deletedExperience = await ExperienceService.deleteExperience(
        userId,
        experienceId
      );
      res.status(201).json(deletedExperience);
    } catch (error) {
      next(error);
    }
  },

  updateEducation: async (req, res, next) => {
    const userId = Number(req.user.id);
    const educationId = Number(req.params.id);
    const updatedData = req.body;

    try {
      const updateResponse = await EducationService.updateEducation(
        userId,
        educationId,
        updatedData
      );
      res.status(201).json(updateResponse);
    } catch (error) {
      next(error);
    }
  },

  createEducation: async (req, res, next) => {
    const userId = Number(req.user.id);
    const educationData = req.body;
    console.log({ userId, educationData });
    try {
      const newEducation = await EducationService.createEducation(
        userId,
        educationData
      );
      res.status(201).json(newEducation);
    } catch (error) {
      next(error);
    }
  },

  deleteEducation: async (req, res, next) => {
    const userId = Number(req.user.id);
    const educationId = Number(req.params.id);

    try {
      const deletedEducation = await EducationService.deleteEducation(
        userId,
        educationId
      );
      res.status(201).json(deletedEducation);
    } catch (error) {
      next(error);
    }
  },

  updateAddress: async (req, res, next) => {
    const userId = Number(req.user.id);
    const addressId = Number(req.params.id);
    const updatedData = req.body;

    try {
      const updateResponse = await addressService.updateAddress(
        userId,
        addressId,
        updatedData
      );
      res.status(201).json(updateResponse);
    } catch (error) {
      next(error);
    }
  },

  createAddress: async (req, res, next) => {
    const userId = Number(req.user.id);
    const addressData = req.body;

    try {
      const newAddress = await addressService.createAddress(
        userId,
        addressData
      );
      res.status(201).json(newAddress);
    } catch (error) {
      next(error);
    }
  },

  deleteAddress: async (req, res, next) => {
    const userId = Number(req.user.id);
    const addressId = Number(req.params.id);

    try {
      const deletedResponse = await addressService.deleteAddress(
        userId,
        addressId
      );
      res.status(201).json(deletedResponse);
    } catch (error) {
      next(error);
    }
  },

  updateSkill: async (req, res, next) => {
    const userId = Number(req.user.id);
    const skillId = Number(req.params.id);
    const updatedData = req.body;

    try {
      const updateResponse = await skillService.updateSkill(
        userId,
        skillId,
        updatedData
      );
      res.status(201).json(updateResponse);
    } catch (error) {
      next(error);
    }
  },

  createSkill: async (req, res, next) => {
    const userId = Number(req.user.id);
    const skillData = req.body;

    try {
      const newSkill = await skillService.createSkill(userId, skillData);
      res.status(201).json(newSkill);
    } catch (error) {
      next(error);
    }
  },

  deleteSkill: async (req, res, next) => {
    const userId = Number(req.user.id);
    const skillId = Number(req.params.id);

    try {
      const deletedSkill = await skillService.deleteSkill(userId, skillId);
      res.status(201).json(deletedSkill);
    } catch (error) {
      next(error);
    }
  },

  updateProfile: async (req, res, next) => {
    const userId = Number(req.user.id);
    const profileId = Number(req.params.id);
    const { updatedProfile, updatedUser } = req.body;

    try {
      const user = await UserModel.findByPk(userId);
      const profile = await ProfileService.getProfileById(profileId);

      if (!profile) {
        next(new HttpException(404, "Profile not found"));
      }
      if (!user) {
        next(new HttpException(404, "User not found"));
      }

      const updatedProfileResponse = await ProfileService.updateProfile(
        profileId,
        updatedProfile
      );

      const updatedUserResponse = await ProfileService.updateUser(
        userId,
        updatedUser
      );

      res.status(201).json({
        message: "profile updated successfully",
        updatedProfileResponse,
        updatedUserResponse,
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = { ProfileController };
