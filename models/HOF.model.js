const {sequelize} = require("../configs/db");
const { DataTypes, Model } = require("sequelize");
const { UserModel } = require("./user.model");

const HOFModel = sequelize.define(
  "hof",
  {
    Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    attachments: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    subtitle: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "hof",
    tableName: "hofs",
    timestamps: false,
    indexes: [
      {
        unique: false,
        fields: ["created_by"],
      },
    ],
  }
);


HOFModel.belongsTo(UserModel, {
  as: "HOF_userCreatedBy",
  foreignKey: "created_by",
  targetKey: "id",
});

module.exports = { sequelize, HOFModel };
