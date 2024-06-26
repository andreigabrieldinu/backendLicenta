"use strict";
const dotenv = require("dotenv");
dotenv.config();
const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const db = {};

const database_name = process.env.DATABASE_NAME;
const database_user = process.env.DATABASE_USER;
const database_password = process.env.DATABASE_PASSWORD;
const database_host = process.env.DATABASE_HOST;

const sequelize = new Sequelize(
  database_name,
  database_user,
  database_password,
  {
    host: database_host,
    dialect: process.env.DIALECT,
    port: process.env.PORTDATABASE,
  }
);

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
