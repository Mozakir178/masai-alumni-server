const {sequelize}  = require("../configs/db");
const { DataTypes, Model } = require("sequelize");

const UserModel = sequelize.define(
  "user",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      unique:true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique:true
    },
    phone_number: {
      type: DataTypes.STRING(15),
    },
    student_code: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING(255),
    },
    role: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "student",
    },
    user_profile_photo_path: {
      type: DataTypes.STRING(255),
    },
    resetToken: {
      type: DataTypes.STRING(255),
    },
    resetTokenExpiration: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    socket_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    current_chat_info: DataTypes.JSON,
    isOnline: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "user",
    tableName: "users",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["email","id"],
      },
    ],
  }
);

module.exports = { sequelize, UserModel };
