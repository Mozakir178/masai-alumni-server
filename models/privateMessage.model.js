const { DataTypes } = require("sequelize");
const { sequelize } = require("../configs/db");
const { UserModel } = require("./user.model");

const privateMessageModel = sequelize.define(
  "privateMessage",
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
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    attachments: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    receiverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    messageType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    modelName: "privateMessage",
    tableName: "privatemessages",
    timestamps: true,
    underscored: true,
  }
);

privateMessageModel.belongsTo(UserModel, {
  foreignKey: "authorId",
  as: "author",
});
privateMessageModel.belongsTo(UserModel, {
  foreignKey: "receiverId",
  as: "receiver",
});

module.exports = { privateMessageModel };
