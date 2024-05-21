const { DataTypes } = require("sequelize");
const { sequelize } = require("../configs/db");
const { UserModel } = require("./user.model");
const { privateMessageModel } = require("./privateMessage.model");

const ConnectionModel = sequelize.define(
  "Connection",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    user1Id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user2Id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "accepted", "rejected"),
      allowNull: false,
      defaultValue: "pending",
    },
    lastMessageId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Connection",
    tableName: "connections",
    timestamps: true,
    indexes: [
      {
        unique: false,
        fields: ["user1Id", "user2Id"], 
      },
      {
        unique: false,
        fields: ["lastMessageId"], 
      },
    ],
  }
);

ConnectionModel.belongsTo(UserModel, {
  foreignKey: "user1Id",
  as: "User1",
  targetKey: "id",
});
ConnectionModel.belongsTo(UserModel, {
  foreignKey: "user2Id",
  as: "User2",
  targetKey: "id",
});
ConnectionModel.belongsTo(privateMessageModel, {
  foreignKey: "lastMessageId",
  as: "LastMessageInfo",
  targetKey: "id",
});

module.exports = { ConnectionModel };
