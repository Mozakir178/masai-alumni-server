const { DataTypes } = require("sequelize");
const { sequelize } = require("../configs/db");
const { QuestionModel } = require("./question.model");

const PollModel = sequelize.define(
  "Poll",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    creater_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    modelName: "Poll",
    tableName: "polls",
    indexes: [
      {
        unique: false,
        fields: ["creater_id"],
      },
    ],
  }
);

PollModel.hasMany(QuestionModel, {
  foreignKey: "poll_id",
  as: "questions",
});

module.exports = { sequelize, PollModel };
