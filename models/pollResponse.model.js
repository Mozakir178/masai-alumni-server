const { DataTypes } = require("sequelize");
const { sequelize } = require("../configs/db");

const PollResponseModel = sequelize.define(
  "PollResponse",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      unique:true
    },
    poll_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    
    },
    question_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    responder_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    response_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    selected_option: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    modelName: "PollResponse",
    tableName: "pollResponses",
    indexes: [
      {
        
        fields: ["poll_id", "question_id", "responder_id"], 
      },
    ],
  }
);

module.exports = { sequelize, PollResponseModel };
