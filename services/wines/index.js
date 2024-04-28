const { Wine } = require("../../models");
const { Op } = require("sequelize");

const getAllWine = async () => {
  try {
    const listWine = await Wine.findAll();
    return listWine;
  } catch (err) {
    console.log(err);
  }
};

const getWineByWineName = async (wineName) => {
  try {
    const wine = await Wine.findOne({
      where: {
        wineName,
      },
    });
    return wine;
  } catch (err) {
    console.log(err);
  }
};

const addWine = async (data) => {
  try {
    const newWine = await Wine.create(data);
    return newWine;
  } catch (err) {
    console.log(err);
  }
};

const paginationWineByName = async (name, page, size) => {
  try {
    const wine = await Wine.findAndCountAll({
      where: {
        wineName: {
          [Op.like]: `%${name}%`,
        },
      },
      limit: size,
      offset: (page - 1) * size,
    });
    return wine;
  } catch (err) {
    console.log(err);
  }
};

const deleteWine = async (wineName) => {
  try {
    const wineDeleted = await Wine.destroy({
      where: {
        wineName,
      },
    });
    return wineDeleted;
  } catch (err) {
    console.log(err);
  }
};

const updateWine = async (wineName, data) => {
  try {
    const wineUpdated = await Wine.update(data, {
      where: {
        wineName,
      },
    });
    return wineUpdated;
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getAllWine,
  updateWine,
  getWineByWineName,
  addWine,
  paginationWineByName,
  deleteWine,
};
