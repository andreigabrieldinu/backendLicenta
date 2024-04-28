"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Ingredient extends Model {
    static associate({ Supplier, WineIngredient }) {
      Ingredient.belongsTo(Supplier, {
        foreignKey: "idSupplier",
      });
      Ingredient.hasMany(WineIngredient, {
        foreignKey: "idIngredient",
        as: "wineIngredient",
      });
    }
  }
  Ingredient.init(
    {
      ingredientName: DataTypes.STRING,
      idSupplier: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Ingredient",
    }
  );
  //Ingredient.sync({ alter: true });
  return Ingredient;
};
