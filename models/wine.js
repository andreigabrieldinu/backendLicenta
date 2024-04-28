"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Wine extends Model {
    static associate({ Container, WineIngredient, BottledWine }) {
      Wine.hasMany(Container, { foreignKey: "wineName" });
      Wine.hasMany(WineIngredient, { foreignKey: "wineName" });
      Wine.hasOne(BottledWine, { foreignKey: "wineName" });
    }
  }
  Wine.init(
    {
      wineName: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      wineColor: DataTypes.STRING,
      wineType: DataTypes.STRING,
      wineStatus: DataTypes.STRING,
      wineQuantity: DataTypes.INTEGER,

      //Alcoolul se masoara ca procentaj din cantitatea totala de vin
      alcohol: DataTypes.DOUBLE,

      //Zaharul se masoara in gram pe litru de vin
      sugar: DataTypes.DOUBLE,

      //Aciditatea totala se masoara in gram pe litru de vin
      totalAcidity: DataTypes.DOUBLE,
      //Aciditatea volatilta se masoara in gram pe litru de vin
      totalVolatility: DataTypes.DOUBLE,

      //Sulf liber se masoara in gram pe litru de vin
      freeSulphur: DataTypes.DOUBLE,

      //Sulf total se masoara in gram pe litru de vin
      totalSulphur: DataTypes.DOUBLE,

      //Densitatea se masoara in gram pe litru de vin
      density: DataTypes.DOUBLE,

      //Extract sec nereducator se masoara in gram pe litru de vin
      //cantitatea de substanta uscata din vin
      nonReducingDryExtract: DataTypes.DOUBLE,
    },
    {
      sequelize,
      modelName: "Wine",
    }
  );
  //Wine.sync({ alter: true });
  return Wine;
};
