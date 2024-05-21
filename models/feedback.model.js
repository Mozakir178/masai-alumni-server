const {sequelize} = require("../configs/db");
const { DataTypes, Model } = require("sequelize");


const FeedbackModel = sequelize.define(
  "Feedback",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    mentor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    mentee_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    feed: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rating: {
      type: DataTypes.FLOAT(2, 1),
      allowNull: true,
      validate: {
        min: 1,
        max: 5,
      },
    },
  },
  {
    sequelize,
    modelName: "Feedback",
    tableName: "feedbacks",
    timestamps: true,
    indexes: [
      {
        unique: false,
        fields: ["mentor_id"],
      },
    ],
  }
);

module.exports = { sequelize, FeedbackModel };
