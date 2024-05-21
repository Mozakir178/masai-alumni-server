const {sequelize} = require("../configs/db");
const { DataTypes, Model } = require("sequelize");
const { UserModel } = require("./user.model");

const ParticipantModel = sequelize.define(
  "Participant",
  {
    participantId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    jobId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "jobParticipant",
    tableName: "jobParticipants",
    timestamps: false,
    indexes: [
      {
        unique: false,
        fields: ["userId", "jobId"],
      },
    ],
  }
);

ParticipantModel.belongsTo(UserModel, {
  foreignKey: "userId",
  as: "apply_by",
  targetKey: "id",
});

module.exports = { sequelize, ParticipantModel };
