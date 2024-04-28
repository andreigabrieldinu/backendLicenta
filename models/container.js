"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Container extends Model {
    static associate({ Wine }) {
      Container.belongsTo(Wine, {
        foreignKey: "wineName",
      });
    }
  }
  Container.init(
    {
      containerName: DataTypes.STRING,
      containerCapacity: DataTypes.INTEGER,
      occupiedCapacity: DataTypes.INTEGER,
      containerTemperature: DataTypes.INTEGER,
      wineName: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Container",
    }
  );
  //Container.sync({ alter: true });
  return Container;
};
