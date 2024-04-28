"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Grape extends Model {
    static associate({ Field, GrapeWine }) {
      Grape.belongsTo(Field, {
        foreignKey: "idField",
      });
      Grape.hasMany(GrapeWine, { foreignKey: "id" });
    }
  }
  Grape.init(
    {
      grapeName: DataTypes.STRING,
      grapeColor: DataTypes.STRING,
      grapeQuantity: DataTypes.STRING,
      idField: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Grape",
    }
  );
  // Grape.sync({ alter: true });
  return Grape;
};
