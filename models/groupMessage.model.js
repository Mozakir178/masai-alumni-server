const { DataTypes } = require("sequelize");
const { sequelize } = require("../configs/db");
const { UserModel } = require("../models/user.model");

const GroupMessageModel = sequelize.define(
  "groupMessage",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    attachments: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    messageType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "groupMessage",
    tableName: "groupmessages",
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: false,
        fields: ["id"],
      },
     
    ],
  }
);
GroupMessageModel.belongsTo(UserModel, {
  foreignKey: "authorId",
  as: "messaged_by",
  targetKey: "id",
});
module.exports = { GroupMessageModel };
