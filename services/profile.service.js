const HttpException = require("../exceptions/HttpException");
const { UserModel } = require("../models/user.model");
const { ProfileModel } = require("../models/profile.model");
const { AddressModel } = require("../models/address.model");
const { ExperienceModel } = require("../models/experience.model");
const { SkillModel } = require("../models/skill.model");
const { EducationModel } = require("../models/education.model");
const { ConnectionModel } = require("../models/connection.model");

const { Op } = require("sequelize");

const ProfileService = {
  getProfileById: async (profileId) => {
    try {
      const profile = await ProfileModel.findByPk(profileId, {
        include: [
          { model: UserModel, as: "user_data" },
          { model: ExperienceModel, as: "experiences" },
          { model: EducationModel, as: "educations" },
          { model: AddressModel, as: "addresses" },
          { model: SkillModel, as: "skills" },
        ],
      });

      const connections = await ConnectionModel.findAll({
        where: {
          [Op.or]: [
            { user2Id: profile["user_data"]["dataValues"].id },
            { user1Id: profile["user_data"]["dataValues"].id },
          ],
        },
      });
      return { ...profile.toJSON(), connections };
    } catch (error) {
      throw new HttpException(500, "Error fetching profile");
    }
  },

  getProfileByUserId: async (userId) => {
    try {
      console.log({ userId });
      const profile = await ProfileModel.findOne({
        where: { user_id: userId },
        include: [
          { model: UserModel, as: "user_data" },
          { model: ExperienceModel, as: "experiences" },
          { model: EducationModel, as: "educations" },
          { model: AddressModel, as: "addresses" },
          { model: SkillModel, as: "skills" },
        ],
      });

      return profile;
    } catch (error) {
      throw new HttpException(500, "Error fetching profile");
    }
  },

  getAllProfiles: async (filters, userId, page, pageSize) => {
    try {
      const pagination = {
        limit: pageSize,
        offset: (page - 1) * pageSize,
      };

      let profileFilterOptions = {};
      const skillFilterOptions = {};
      const educationFilterOptions = {};
      const addressFilterOptions = {};
      const experienceFilterOptions = {};

      // Profile section filters
      if (filters.batch) {
        const batchCondition = {
          [Op.or]: [
            {
              start_batch: { [Op.lte]: filters.batch },
              end_batch: { [Op.gte]: filters.batch },
            },
            {
              start_batch: { [Op.gte]: filters.batch },
              end_batch: { [Op.lte]: filters.batch },
            },
          ],
        };

        profileFilterOptions.where = {
          ...(profileFilterOptions.where || {}),
          ...batchCondition,
        };
      }

      if (filters.gender) {
        profileFilterOptions.where = {
          ...(profileFilterOptions.where || {}),
          gender: filters.gender,
        };
      }

      if (filters.roll_number) {
        profileFilterOptions.where = {
          ...(profileFilterOptions.where || {}),
          roll_number: {
            [Op.regexp]: `.*${filters.roll_number}.*`,
          },
        };
      }

      // Experience section filters
      if (filters.designation) {
        experienceFilterOptions.where = {
          ...(experienceFilterOptions.where || {}),
          designation: { [Op.regexp]: `.*${filters.designation}.*` },
        };
      }

      if (filters.company_name) {
        experienceFilterOptions.where = {
          ...(experienceFilterOptions.where || {}),
          company_name: {
            [Op.regexp]: `.*${filters.company_name}.*`,
          },
        };
      }

      if (filters.workIndustry) {
        experienceFilterOptions.where = {
          ...(experienceFilterOptions.where || {}),
          workIndustry: {
            [Op.regexp]: `.*${filters.workIndustry}.*`,
          },
        };
      }

      // Skills section filters
      if (filters.skills) {
        skillFilterOptions.where = {
          ...(skillFilterOptions.where || {}),
          skill_name: { [Op.regexp]: `.*${filters.skills}.*` },
        };
      }

      // Education section filters
      if (filters.education) {
        educationFilterOptions.where = {
          ...(educationFilterOptions.where || {}),
          course: { [Op.regexp]: `.*${filters.education}.*` },
        };
      }

      // Address section filters
      if (filters.city) {
        addressFilterOptions.where = {
          city: { [Op.regexp]: `.*${filters.city}.*` },
        };
      }

      // User section filters
      if (filters.search) {
        const searchText = {
          [Op.or]: [
            { $user_name$: { [Op.regexp]: `.*${filters.search}.*` } },
            { city: { [Op.regexp]: `.*${filters.search}.*` } },
            { $current_designation$: { [Op.regexp]: `.*${filters.search}.*` } },
            { $current_company$: { [Op.regexp]: `.*${filters.search}.*` } },
          ],
        };
        profileFilterOptions.where = {
          ...(profileFilterOptions.where || {}),
          ...searchText,
        };
      }

      const userProfile = await ProfileModel.findOne({
        where: { user_id: userId },
      });

      if (userProfile && userProfile.dataValues.id) {
        profileFilterOptions.where = {
          ...(profileFilterOptions.where || {}),
          id: { [Op.not]: userProfile.dataValues.id },
        };
      }
      const { count, rows: profiles } = await ProfileModel.findAndCountAll({
        ...profileFilterOptions,
        ...pagination,
        include: [
          { as: "user_data", model: UserModel },
          {
            model: ExperienceModel,
            as: "experiences",
            ...experienceFilterOptions,
            attributes: [
              "id",
              "title",
              "employment_type",
              "currently_working",
              "company_name",
              "designation",
            ],
          },
          {
            model: EducationModel,
            as: "educations",
            ...educationFilterOptions,
            attributes: ["id", "institution", "course", "persuing"],
          },
          {
            model: AddressModel,
            as: "addresses",
            ...addressFilterOptions,
          },
          {
            model: SkillModel,
            as: "skills",
            ...skillFilterOptions,
            attributes: ["id", "skill_name", "used_on"],
          },
        ],
        attributes: [
          "id",
          "user_name",
          "current_designation",
          "current_company",
          "links",
          "roll_number",
        ],
      });

      const profilesWithConnectionStatus = await Promise.all(
        profiles.map(async (profile) => {
          const connection = await ConnectionModel.findOne({
            where: {
              [Op.or]: [
                {
                  user1Id: userId,
                  user2Id: profile["user_data"]["dataValues"].id,
                },
                {
                  user1Id: profile["user_data"]["dataValues"].id,
                  user2Id: userId,
                },
              ],
            },
          });
          return { ...profile.toJSON(), connection };
        })
      );

      return {
        total: count,
        profiles: profilesWithConnectionStatus,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(500, "Error fetching profile");
    }
  },

  createProfile: async (profile, userId, userName) => {
    try {
      console.log("++++++++++++++++++++++++++", profile, userId, userName);
      let newProfile = await ProfileModel.create({
        ...profile,
        id: userId,
        user_id: userId,
        user_name: userName,
      });
      newProfile = await ProfileModel.findByPk(newProfile.id);

      return newProfile;
    } catch (error) {
      throw new HttpException(500, "Unable to create profile");
    }
  },

  updateUser: async (userId, updatedUser) => {
    try {
      const updatedUserResponse = await UserModel.update(updatedUser, {
        where: { id: userId },
        returning: true,
      });
      if (updatedUser.name) {
        await ProfileModel.update(
          { user_name: updatedUser.name },
          { where: { user_id: userId } }
        );
      }

      return [updatedUserResponse];
    } catch (error) {
      throw new HttpException(500, "Unable to update user");
    }
  },

  updateProfile: async (profileId, updatedProfile) => {
    try {
      const updatedProfileResponse = await ProfileModel.update(updatedProfile, {
        where: { id: profileId },
        returning: true,
      });

      return [updatedProfileResponse];
    } catch (error) {
      throw new HttpException(500, "Unable to update profile");
    }
  },
};

module.exports = { ProfileService };
