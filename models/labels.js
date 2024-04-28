"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Label extends Model {
    static associate({ Supplier, BottledWine }) {
      Label.belongsTo(Supplier, {
        foreignKey: "idSupplier",
      });
      Label.hasOne(BottledWine, {
        foreignKey: "idLabel",
      });
    }
  }
  Label.init(
    {
      labelName: DataTypes.STRING,
      idSupplier: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Label",
    }
  );
  //Label.sync({ alter: true });
  return Label;
};
