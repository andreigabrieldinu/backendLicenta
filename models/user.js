"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate({ Cart, Comment, History, Messenger }) {
      User.hasOne(Cart, {
        foreignKey: "idUser",
        as: "cart",
      });
      User.hasOne(Comment, {
        foreignKey: "idUser",
        as: "comment",
      });
      User.hasOne(History, {
        foreignKey: "idUser",
        as: "history",
      });
      User.hasMany(Messenger, { foreignKey: "senderId", as: "sender" });
      User.hasMany(Messenger, { foreignKey: "receiverId", as: "receiver" });
    }
  }
  User.init(
    {
      fullname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          min: 6,
          max: 30,
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          min: 10,
          max: 50,
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          min: 6,
        },
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /^(?:\d{10}|\+\d{10,13})$/,
        },
      },
      admin: {
        type: DataTypes.STRING,
        defaultValue: false,
      },
      birthDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  // User.sync({ alter: true });
  return User;
};
