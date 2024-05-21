
const { UserModel } = require("./user.model");
const { sequelize } = require("../configs/db");
const { DataTypes } = require("sequelize");
const EventParticipantModel = sequelize.define(
  "eventParticipant",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    event_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    participant_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    modelName: "eventParticipant",
    tableName: "eventParticipants",
    timestamps: true,
    indexes: [
      {
        unique: false,
        fields: ["event_id"], 
      },
      {
        unique: false,
        fields: ["participant_id"], 
      },
    ],
  }
);

EventParticipantModel.belongsTo(UserModel, {
  as: "participant",
  foreignKey: "participant_id",
});

module.exports = { sequelize, EventParticipantModel };
