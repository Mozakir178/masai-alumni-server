const { Model, DataTypes, Association } = require("sequelize");
const {sequelize} = require("../configs/db");
const { UserModel } = require("./user.model");
const { LikeModel } = require("./like.model");
const { CommentModel } = require("./comment.model");

const PostModel = sequelize.define(
  "Post",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    postType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    attachments: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    modelName: "Post",
    tableName: "posts",
    indexes: [
      {
        fields: ["created_by"], 
      },
     
     
    ],
  }
);

PostModel.hasMany(LikeModel, { foreignKey: "postedId", as: "likes" });
PostModel.hasMany(CommentModel, { foreignKey: "postId", as: "comments" });

PostModel.belongsTo(UserModel, {
  foreignKey: "created_by",
  as: "posted_by",
  targetKey: "id",
});

module.exports = { sequelize, PostModel };
