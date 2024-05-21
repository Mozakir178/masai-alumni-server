const { DataTypes } = require("sequelize");
const { sequelize } = require("../configs/db");

const ExperienceModel = sequelize.define(
  "Experience",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    profile_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    designation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    employment_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    company_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    industry: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    location_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    currently_working: {
      type: DataTypes.BOOLEAN,
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
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Experience",
    tableName: "experiences",
    timestamps: true,
    indexes: [
      {
        unique: false,
        fields: ["profile_id"],
      },
      {
        unique: false,
        fields: ["user_id"],
      },
    ],
  }
);

module.exports = { sequelize, ExperienceModel };
