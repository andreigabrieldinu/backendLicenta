"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Messenger extends Model {
    static associate({ User }) {
      Messenger.belongsTo(User, { foreignKey: "senderId" });
      Messenger.belongsTo(User, { foreignKey: "receiverId" });
    }
  }
  Messenger.init(
    {
      senderId: DataTypes.INTEGER,
      receiverId: DataTypes.INTEGER,
      content: DataTypes.TEXT,
      //emitator sau receptor
      category: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Messenger",
    }
  );
  // Messenger.sync({ alter: true });
  return Messenger;
};
