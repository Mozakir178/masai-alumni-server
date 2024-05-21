const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../configs/db");
const { UserModel } = require("./user.model");

const VentureModel = sequelize.define(
  "Venture",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    venture_owner: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    venture_founders: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    venture_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    venture_description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    website_link: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contact_info: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    Industry: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    founding_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    current_status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Socials: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    financial_status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    number_of_employee: {
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
    modelName: "Venture",
    tableName: "ventures",
  }
);

VentureModel.belongsTo(UserModel, {
  foreignKey: "venture_owner",
  as: "owner",
});

module.exports = { sequelize, VentureModel };
