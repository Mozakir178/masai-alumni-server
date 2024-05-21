const { sequelize } = require("../configs/db");
const { DataTypes } = require("sequelize");
const { UserModel } = require("./user.model");
const { ExperienceModel } = require("./experience.model");
const { EducationModel } = require("./education.model");
const { AddressModel } = require("./address.model");
const { SkillModel } = require("./skill.model");

const ProfileModel = sequelize.define(
  "Profile",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: false,
      primaryKey: true,
      unique: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    user_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    birth_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    secondary_email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    secondary_contactNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    current_company: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    current_designation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    about: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    start_batch: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    end_batch: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    roll_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    banner: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    interests: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    links: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    resume: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    placement_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    dropout_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Profile",
    tableName: "profiles",
    indexes: [
      {
        unique: true,
        fields: ["id"], 
      },
      {
        unique: true,
        fields: ["user_id"],
      },
    ],
  }
);

ProfileModel.belongsTo(UserModel, {
  as: "user_data",
  foreignKey: "user_id",
  targetKey: "id",
});

ProfileModel.hasMany(ExperienceModel, {
  as: "experiences",
  foreignKey: "profile_id",
});

ProfileModel.hasMany(EducationModel, {
  as: "educations",
  foreignKey: "profile_id",
});

ProfileModel.hasMany(AddressModel, {
  as: "addresses",
  foreignKey: "profile_id",
});

ProfileModel.hasMany(SkillModel, {
  as: "skills",
  foreignKey: "profile_id",
});

module.exports = { sequelize, ProfileModel };
