const { Sequelize } = require("sequelize");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USERNAME,
  process.env.DATABASE_PASSWORD,
  {
    host: process.env.DATABASE_HOST,
    dialect: "mysql",
    dialectModule: require("mysql2"),
  }
);

module.exports = {
  SequelizeSessionStore: SequelizeStore(session.Store),
  sequelize: sequelize,
};
