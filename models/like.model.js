const {sequelize} = require("../configs/db");
const { DataTypes, Model } = require("sequelize");
const { UserModel } = require("./user.model");

const LikeModel = sequelize.define(
  "Like",
  {
    likeId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    postedId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "like",
    tableName: "likes",
    timestamps: false,
    indexes: [
      {
        unique: false,
        fields: ["userId", "postedId"],
      },
    ],
  }
);

LikeModel.belongsTo(UserModel, {
  foreignKey: "userId",
  as: "liked_by",
  targetKey: "id",
});

module.exports = { sequelize, LikeModel };
