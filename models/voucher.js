("use strict");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Voucher extends Model {}
  Voucher.init(
    {
      voucherName: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      voucherPercentage: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { isInt: true, min: 10, max: 50 },
      },
    },
    {
      sequelize,
      modelName: "Voucher",
    }
  );
  //Voucher.sync({ alter: true });
  return Voucher;
};
