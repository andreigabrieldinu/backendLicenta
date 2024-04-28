"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Cork extends Model {
    static associate({ Supplier, BottledWine }) {
      Cork.belongsTo(Supplier, {
        foreignKey: "idSupplier",
      });
      Cork.hasOne(BottledWine, {
        foreignKey: "idCork",
      });
    }
  }
  Cork.init(
    {
      corkName: DataTypes.STRING,
      idSupplier: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Cork",
    }
  );
  //Cork.sync({ alter: true });
  return Cork;
};
