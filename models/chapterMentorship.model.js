const { DataTypes, Model } = require("sequelize");
const {sequelize} = require("../configs/db");
const { UserModel } = require("./user.model");
const { ChapterGroupModel } = require("./chapter.model");

const ChapterGroupMembershipModel = sequelize.define(
  "ChapterMembership",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pending",
    },
  },
  {
    sequelize,
    modelName: "ChapterMembership",
    tableName: "chapter_memberships",
    timestamps: true,
    indexes: [
      {
        unique: false,
        fields: ["groupId", "userId"],
      },
    ],
  }
);

ChapterGroupModel.belongsToMany(UserModel, {
  through: ChapterGroupMembershipModel,
  foreignKey: "groupId",
  as: "GroupMembers",
});
UserModel.belongsToMany(ChapterGroupModel, {
  through: ChapterGroupMembershipModel,
  foreignKey: "userId",
  as: "GroupMemberships",
});

module.exports = { ChapterGroupMembershipModel, sequelize };
