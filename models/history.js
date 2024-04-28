"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class History extends Model {
    static associate({ User }) {
      History.belongsTo(User, { foreignKey: "idUser" });
    }
  }
  History.init(
    {
      idUser: DataTypes.INTEGER,
      phone: DataTypes.STRING,
      address: DataTypes.STRING,
      cart: DataTypes.STRING,
      fullname: DataTypes.STRING,
      total: DataTypes.STRING,
      paymentMethod: DataTypes.STRING,
      status: {
        type: DataTypes.TINYINT,
        defaultValue: false,
      },
      delivery: {
        type: DataTypes.TINYINT,
        defaultValue: false,
      },
      voucherPercentage: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "History",
    }
  );
  // History.sync({ alter: true });
  return History;
};
