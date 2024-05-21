
const { UserModel } = require("./user.model");
const { EventParticipantModel } = require("./eventParticipantModel.model");
const { sequelize } = require("../configs/db");
const { DataTypes } = require("sequelize");
const EventModel = sequelize.define(
  "event",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    event_title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    event_description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    event_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    manager_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    event_mode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    event_start_time: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    event_end_time: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    event_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    event_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    event_location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    event_status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    event_banner: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    event_speakers: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    modelName: "event",
    tableName: "events",
    timestamps: true,
    indexes: [
      {
        unique: false,
        fields: ["id"], 
      },
      {
        unique: false,
        fields: ["manager_id"], 
      },
    ],
  }
);

EventModel.belongsTo(UserModel, {
  as: "event_manager",
  foreignKey: "manager_id",
  targetKey: "id",
});

EventModel.hasMany(EventParticipantModel, {
  as: "event_participants",
  foreignKey: "event_id",
});

module.exports = { sequelize, EventModel };
