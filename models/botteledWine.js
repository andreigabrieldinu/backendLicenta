"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class BottledWine extends Model {
    static associate({ Label, Bottle, Cork, Wine }) {
      BottledWine.hasOne(Bottle, {
        foreignKey: "idBottle",
      });
      BottledWine.hasOne(Cork, {
        foreignKey: "idCork",
      });
      BottledWine.hasOne(Label, {
        foreignKey: "idLabel",
      });
      BottledWine.belongsTo(Wine, {
        foreignKey: "wineName",
      });
    }
  }
  BottledWine.init(
    {
      bottledBottlesNumber: DataTypes.INTEGER,
      idBottle: DataTypes.INTEGER,
      idCork: DataTypes.INTEGER,
      idLabel: DataTypes.INTEGER,
      wineName: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "BottledWine",
    }
  );
  //BottledWine.sync({ alter: true });
  return BottledWine;
};
