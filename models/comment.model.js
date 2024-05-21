const { DataTypes, Model } = require("sequelize");
const {sequelize} = require("../configs/db");
const { UserModel } = require("./user.model");

const CommentModel = sequelize.define(
  "comment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    body: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "comment",
    tableName: "comments",
    timestamps: true,
    indexes: [
      {
        unique: false,
        fields: ["userId", "postId"],
      },
    ],
  }
);

CommentModel.belongsTo(UserModel, {
  foreignKey: "userId",
  as: "commented_by",
  targetKey: "id",
});

module.exports = { sequelize, CommentModel };
