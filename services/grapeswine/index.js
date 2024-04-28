const { GrapeWine } = require("../../models");
const { Grape, Wine } = require("../../models");
const { Op } = require("sequelize");

const getAllWine = async () => {
  try {
    const listWineGrapes = await GrapeWine.findAll({
      attributes: [`idGrape`, `wineName`, `createdAt`, `updatedAt`],
    });
    return listWineGrapes;
  } catch (err) {
    console.log(err);
  }
};

const getAllWineGrapes = async (wineName) => {
  try {
    const wine = await GrapeWine.findOne({
      attributes: [`idGrape`, `wineName`, `createdAt`, `updatedAt`],

      where: {
        wineName,
      },
    });
    return wine;
  } catch (err) {
    console.log(err);
  }
};

const getAllGrapesWine = async (idGrape) => {
  try {
    const grapes = await GrapeWine.findAll({
      attributes: [`idGrape`, `wineName`, `createdAt`, `updatedAt`],

      where: {
        idGrape,
      },
    });
    return grapes;
  } catch (err) {
    console.log(err);
  }
};

const getOneGrapeWine = async (wineName, idGrape) => {
  try {
    const wineGrape = await GrapeWine.findOne({
      attributes: [`idGrape`, `wineName`, `createdAt`, `updatedAt`],

      where: {
        wineName,
        idGrape,
      },
    });
    return wineGrape;
  } catch (err) {
    console.log(err);
  }
};

const addGrapeWine = async (data) => {
  try {
    const newGrapeWine = await GrapeWine.create(data);
    return newGrapeWine;
  } catch (err) {
    console.log(err);
  }
};

const paginationWineGrapeByName = async (name, page, size) => {
  try {
    const wineGrape = await GrapeWine.findAndCountAll({
      attributes: [`idGrape`, `wineName`, `createdAt`, `updatedAt`],
      where: {
        wineName: {
          [Op.like]: `%${name}%`,
        },
      },
      limit: size,
      offset: (page - 1) * size,
    });
    return wineGrape;
  } catch (err) {
    console.log(err);
  }
};

const deleteGrapeWine = async (wineName, idGrape) => {
  try {
    const wineGrape = await GrapeWine.destroy({
      attributes: [`idGrape`, `wineName`, `createdAt`, `updatedAt`],
      where: {
        idGrape,
        wineName,
      },
    });

    return wineGrape;
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getAllWine,
  getAllWineGrapes,
  getAllGrapesWine,
  addGrapeWine,
  getOneGrapeWine,
  paginationWineGrapeByName,
  deleteGrapeWine,
};
