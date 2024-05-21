const { DataTypes } = require("sequelize");
const {sequelize} = require("../configs/db");

const EducationModel = sequelize.define(
  "Education",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    profile_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    institution: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    course: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    field_of_study: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    grade: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    persuing: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
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
  },
  {
    sequelize,
    modelName: "Education",
    tableName: "educations",
    timestamps: true,
    indexes: [
      {
        unique: false,
        fields: ["user_id"], 
      },
      {
        unique: false,
        fields: ["profile_id"], 
      },
    ],
  }
);

module.exports = { sequelize, EducationModel };
