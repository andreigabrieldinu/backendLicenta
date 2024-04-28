"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Bottle extends Model {
    static associate({ Supplier, BottledWine }) {
      Bottle.belongsTo(Supplier, {
        foreignKey: "idSupplier",
      });
      Bottle.hasOne(BottledWine, {
        foreignKey: "idBottle",
      });
    }
  }
  Bottle.init(
    {
      bottleName: DataTypes.STRING,
      idSupplier: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Bottle",
    }
  );
  //Bottle.sync({ alter: true });
  return Bottle;
};
