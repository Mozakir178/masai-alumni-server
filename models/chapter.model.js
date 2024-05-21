const { DataTypes} = require("sequelize");
const {sequelize} = require("../configs/db");

const ChapterGroupModel = sequelize.define(
  "ChapterGroup",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    privacy: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "public",
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
    lastMessage: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    membersCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    members: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    coverPhoto: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    admins: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Chapter",
    tableName: "chapters",
   
  }
);

// ChapterGroupModel.belongsTo(Model.Message, {
//   foreignKey: "lastMessage",
//   as: "lastMessageInfo",
//   targetKey: "id",
// });
// ChapterGroupModel.belongsToMany(User, {
//   through: "GroupAdmins",
//   as: "admins",
//   foreignKey: "groupId",
// });

module.exports = { ChapterGroupModel };
