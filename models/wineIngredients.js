"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class WineIngredient extends Model {
    static associate({ Wine, Ingredient }) {
      WineIngredient.belongsTo(Wine, {
        foreignKey: "wineName",
      });
      WineIngredient.belongsTo(Ingredient, {
        foreignKey: "idIngredient",
      });
    }
  }
  WineIngredient.init(
    {
      idIngredient: DataTypes.INTEGER,
      wineName: DataTypes.STRING,
      administratedQuantity: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "WineIngredient",
    }
  );
  //WineIngredient.sync({ alter: true });
  return WineIngredient;
};
