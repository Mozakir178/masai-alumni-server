const {sequelize} = require("../configs/db");
const { DataTypes, Model } = require("sequelize");
// Assuming UserModel is defined somewhere
const {UserModel} = require("./user.model");

const spotLightModel = sequelize.define(
  "spotlight",
  {
    spotlight_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    spotlight_title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    spotlight_description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    spotlight_image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    spotlight_video: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Categories: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    related_links: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "spotlights",
    timestamps: true,
  }
);

spotLightModel.belongsTo(UserModel, {
  foreignKey: "created_by",
  as: "posted_by",
  targetKey: "id",
});

module.exports = { sequelize, spotLightModel };
