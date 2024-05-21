const { DataTypes } = require("sequelize");
const { sequelize } = require("../configs/db");
const { UserModel } = require("./user.model");

const NotificationModel = sequelize.define(
  "Notification",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    receiverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM(
        "connection_request_accepted",
        "connection_request_received",
        "new_message",
        "new-mentorship-application",
        "new-venture-application"
      ),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("delivered", "seen"),
      allowNull: false,
      defaultValue: "delivered",
    },
    message: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    linkedTo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    linkedToId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Notification",
    tableName: "notifications",
    timestamps: true,
    indexes: [
      {
        fields: ["receiverId"],
      },
      {
        fields: ["authorId"],
      },
    ],
  }
);

NotificationModel.belongsTo(UserModel, {
  foreignKey: "receiverId",
  as: "receiver",
});
NotificationModel.belongsTo(UserModel, {
  foreignKey: "authorId",
  as: "author",
});

module.exports = NotificationModel;
