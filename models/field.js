"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Field extends Model {
    static associate({ Grape }) {
      Field.hasOne(Grape, {
        foreignKey: "idGrape",
        as: "grape",
      });
    }
  }
  Field.init(
    {
      fieldName: DataTypes.STRING,
      longitude: DataTypes.STRING,
      latitude: DataTypes.STRING,
      fieldArea: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Field",
    }
  );
  //Field.sync({ alter: true });
  return Field;
};
