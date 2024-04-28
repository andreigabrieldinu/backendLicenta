const { Grape } = require("../../models/");
const { Op } = require("sequelize");

const getAllGrape = async () => {
  try {
    const listGrape = await Grape.findAll({
      attributes: [
        "id",
        "grapeName",
        "grapeColor",
        "grapeQuantity",
        "idField",
        "createdAt",
        "updatedAt",
      ],
    });
    return listGrape;
  } catch (err) {
    console.log(err);
  }
};

const getGrapeById = async (id) => {
  try {
    const grape = await Grape.findOne({
      attributes: [
        "id",
        "grapeName",
        "grapeColor",
        "grapeQuantity",
        "idField",
        "createdAt",
        "updatedAt",
      ],
      where: {
        id,
      },
    });
    return grape;
  } catch (err) {
    console.log(err);
  }
};

const addGrape = async (data) => {
  try {
    const newGrape = await Grape.create(data);
    return newGrape;
  } catch (err) {
    console.log(err);
  }
};

const paginationGrapeByName = async (name, page, size) => {
  try {
    const grape = await Grape.findAll({
      attributes: [
        "id",
        "grapeName",
        "grapeColor",
        "grapeQuantity",
        "idField",
        "createdAt",
        "updatedAt",
      ],
      where: {
        [Op.or]: [
          {
            grapeName: {
              [Op.like]: `%${name}%`,
            },
          },
          {
            grapeColor: {
              [Op.like]: `%${name}%`,
            },
          },
        ],
      },
      limit: size,
      offset: page * size,
    });
    return grape;
  } catch (err) {
    console.log(err);
  }
};

const paginationGrape = async (page, size) => {
  try {
    const grape = await Grape.findAndCountAll({
      attributes: [
        "id",
        "grapeName",
        "grapeColor",
        "grapeQuantity",
        "idField",
        "createdAt",
        "updatedAt",
      ],
      limit: size,
      offset: page * size,
    });
    return grape;
  } catch (err) {
    console.log(err);
  }
};

const deleteGrape = async (id) => {
  try {
    const grapeDeleted = await Grape.destroy({
      attributes: [
        "id",
        "grapeName",
        "grapeColor",
        "grapeQuantity",
        "idField",
        "createdAt",
        "updatedAt",
      ],
      where: {
        id,
      },
    });
    return grapeDeleted;
  } catch (err) {
    console.log(err);
  }
};

const searchGrape = async (name) => {
  try {
    const grape = await Grape.findAll({
      where: {
        grapeName: {
          [Op.like]: `%${name}%`,
        },
      },
    });
    return grape;
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getAllGrape,
  getGrapeById,
  addGrape,
  paginationGrape,
  paginationGrapeByName,
  deleteGrape,
  searchGrape,
};
