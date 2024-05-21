const { sequelize } = require("../configs/db");
const { DataTypes, Model } = require("sequelize");
const { UserModel } = require("./user.model");
const { FeedbackModel } = require("./feedback.model");

const MentorModel = sequelize.define(
  "Mentor",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    expertise: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    preferred_communication: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    experience_years: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    target_mentee: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    discription: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    application_status: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    is_checked: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "Mentor",
    tableName: "mentors",
    indexes: [
      {
        fields: ["user_id"], // Index on user_id column
      },
    ],
  }
);

MentorModel.belongsTo(UserModel, {
  as: "user",
  foreignKey: "user_id",
  targetKey: "id",
});

MentorModel.hasMany(FeedbackModel, {
  as: "feedbacks",
  foreignKey: "mentor_id",
});

module.exports = { sequelize, MentorModel };
