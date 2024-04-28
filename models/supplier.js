"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Supplier extends Model {
    static associate({ Ingredient, Cork, Label, Bottle }) {
      Supplier.hasMany(Ingredient, {
        foreignKey: "idSupplier",
        as: "ingredients",
      });
      Supplier.hasMany(Cork, {
        foreignKey: "idSupplier",
        as: "corks",
      });
      Supplier.hasMany(Label, {
        foreignKey: "idSupplier",
        as: "label",
      });
      Supplier.hasMany(Bottle, {
        foreignKey: "idSupplier",
        as: "bottles",
      });
    }
  }
  Supplier.init(
    {
      supplierName: DataTypes.STRING,
      supplierEmail: DataTypes.STRING,
      supplierPhone: DataTypes.STRING,
      supplierAddress: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Supplier",
    }
  );
  //Supplier.sync({ alter: true });
  return Supplier;
};
