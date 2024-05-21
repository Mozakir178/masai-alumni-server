const { DataTypes} = require("sequelize");
const { sequelize } = require("../configs/db");

const QuestionModel = sequelize.define(
  "Question",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    poll_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    options: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
  },
  {
    modelName: "Question",
    tableName: "questions",
    indexes: [
      {
        fields: ["poll_id"],
      },
    ],
  }
);

module.exports = { sequelize, QuestionModel };
