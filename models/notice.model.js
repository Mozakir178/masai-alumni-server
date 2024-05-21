const { sequelize } = require("../configs/db");
const { DataTypes } = require("sequelize");
const { UserModel } = require("./user.model");

const NoticeModel = sequelize.define(
  "Notice",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    attachmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Notice",
    tableName: "notices",
    indexes: [
      {
        unique: false,
        fields: ["authorId", "category"],
      },
      {
        unique: false,
        fields: ["attachmentId"], 
      },
    ],
  }
);

NoticeModel.belongsTo(UserModel, { foreignKey: "authorId", as: "author" });

module.exports = { sequelize, NoticeModel };
