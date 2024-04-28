"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class GrapeWine extends Model {
    static associate({ Grape, Wine }) {
      GrapeWine.belongsTo(Grape, {
        foreignKey: "idGrape",
      });
      GrapeWine.belongsTo(Wine, {
        foreignKey: "wineName",
      });
    }
  }
  GrapeWine.init(
    {
      idGrape: { type: DataTypes.INTEGER, primaryKey: true },
      wineName: { type: DataTypes.STRING, primaryKey: true },
    },
    {
      sequelize,
      modelName: "GrapeWine",
    }
  );
  //GrapeWine.sync({ alter: true });
  return GrapeWine;
};
