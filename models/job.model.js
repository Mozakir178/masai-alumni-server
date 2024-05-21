const { Model, DataTypes } = require("sequelize");
const {sequelize} = require("../configs/db");
const { UserModel } = require("./user.model");
const  {ParticipantModel}  = require("./jobParticipants.model");
const JobModel = sequelize.define(
  "Job",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    publisher_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    company_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    company_address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    application_deadline: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    isopen: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    working_mode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    work_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    positions: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    skills: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: JSON.stringify([]),
      get() {
        const rawValue = this.getDataValue("skills");
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue("skills", JSON.stringify(value));
      },
    },
    contacts: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: JSON.stringify({
        phone: "",
        email: "",
        link: "",
      }),
      get() {
        const rawValue = this.getDataValue("contacts");
        return rawValue ? JSON.parse(rawValue) : {};
      },
      set(value) {
        this.setDataValue("contacts", JSON.stringify(value));
      },
    },
    required_exp: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: JSON.stringify({
        min: 0,
        max: 0,
      }),
      get() {
        const rawValue = this.getDataValue("required_exp");
        return rawValue ? JSON.parse(rawValue) : {};
      },
      set(value) {
        this.setDataValue("required_exp", JSON.stringify(value));
      },
    },
    salary: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: JSON.stringify({
        min: 0,
        max: 0,
      }),
      get() {
        const rawValue = this.getDataValue("salary");
        return rawValue ? JSON.parse(rawValue) : {};
      },
      set(value) {
        this.setDataValue("salary", JSON.stringify(value));
      },
    },
    website_link: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pending",
    },
  },
  {
    sequelize,
    modelName: "Job",
    tableName: "jobs",
    indexes: [
      {
        fields: ["publisher_id"],
      },
    ],
  }
);

JobModel.belongsTo(UserModel, {
  foreignKey: "publisher_id",
  as: "posted_by",
  targetKey: "id",
});

JobModel.hasMany(ParticipantModel, { foreignKey: "jobId", as: "participants" });

module.exports = { sequelize, JobModel };
