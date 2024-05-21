const {sequelize} = require("../configs/db");
const { Model, DataTypes } = require("sequelize");

const MasaiUserModel = sequelize.define(
  "masaiuser",
  {
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique:true
    },
    mobile: {
      type: DataTypes.STRING(255),
    },
    password: {
      type: DataTypes.STRING(255),
    },
    role: {
      type: DataTypes.STRING(255),
    },
    profile_photo_path: {
      type: DataTypes.STRING(255),
    },
  },
  {
    sequelize,
    modelName: "masaiuser",
    tableName: "masaiusers",
    timestamps: false,
    indexes: [
      {
        unique: true, // Ensure email uniqueness
        fields: ["email"], // Index on email column
      },
    ],
  }
);

module.exports = { sequelize, MasaiUserModel };
