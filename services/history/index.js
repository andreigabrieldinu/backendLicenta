const { History, User } = require("../../models");

const gethistory = async (idUser) => {
  try {
    const historyUser = await History.findAll({
      where: {
        idUser,
      },
    });
    return historyUser;
  } catch (err) {
    console.log(err);
  }
};

const getOneHistory = async (id) => {
  try {
    const historyUser = await History.findOne({
      where: {
        id,
      },
    });
    return historyUser;
  } catch (err) {
    console.log(err);
  }
};

const createHistory = async (data) => {
  try {
    const newHistory = await History.create(data);
    return newHistory;
  } catch (err) {
    console.log(err);
  }
};

const getListHistory = async () => {
  try {
    const listHistory = await History.findAll();
    return listHistory;
  } catch (err) {
    console.log(err);
  }
};

const updateHistory = async (id, data) => {
  try {
    const history = await History.update(data, {
      where: {
        id,
      },
    });
    return history;
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  gethistory,
  createHistory,
  updateHistory,
  getListHistory,
  getOneHistory,
};
