const {sequelize} = require("../configs/db");
const { DataTypes, Model } = require("sequelize");
const { UserModel } = require("./user.model");
const { MentorModel } = require("./mentor.model");

const MentorshipRelationshipModel = sequelize.define(
  "MentorshipRelationship",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    mentee_status: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "active",
    },
    mentee_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    mentor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    problem: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    preferred_domain: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    preferred_communication: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "accepted", "rejected"),
      allowNull: false,
      defaultValue: "pending",
    },
  },
  {
    sequelize,
    modelName: "MentorshipRelationship",
    tableName: "mentorship_relationships",
    indexes: [
      {
        fields: ["mentee_id"], 
      },
      {
        fields: ["mentor_id"],
      },
    ],
  }
);

MentorshipRelationshipModel.belongsTo(UserModel, {
  as: "mentee",
  foreignKey: "mentee_id",
  targetKey: "id",
});

MentorshipRelationshipModel.belongsTo(MentorModel, {
  as: "mentor",
  foreignKey: "mentor_id",
  targetKey: "user_id",
});

module.exports = { sequelize, MentorshipRelationshipModel };
