const { sequelize } = require("../configs/db");
const { DataTypes } = require("sequelize");
const { ProfileModel } = require("./profile.model");

const SkillModel = sequelize.define(
  "Skill",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    profile_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    skill_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    used_on: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Skill",
    tableName: "skills",
     indexes: [
      {
        fields: ["profile_id"],
      },
    ],
  }
);

// SkillModel.belongsTo(ProfileModel, {
//   foreignKey: "profile_id",
//   as: "profiles",
// });

module.exports = { sequelize, SkillModel };
