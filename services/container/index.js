const { Container } = require("../../models");
const { Op } = require("sequelize");

const getAllContainer = async () => {
  try {
    const listContainer = await Container.findAll();
    return listContainer;
  } catch (err) {
    console.log(err);
  }
};

const getContainerById = async (id) => {
  try {
    const container = await Container.findOne({
      where: {
        id,
      },
    });
    return container;
  } catch (err) {
    console.log(err);
  }
};

const addContainer = async (data) => {
  try {
    const newContainer = await Container.create(data);
    return newContainer;
  } catch (err) {
    console.log(err);
  }
};

const paginationContainerByName = async (name, page, size) => {
  try {
    const container = await Container.findAndCountAll({
      where: {
        name: {
          [Op.like]: `%${name}%`,
        },
      },
      limit: size,
      offset: (page - 1) * size,
    });
    return container;
  } catch (err) {
    console.log(err);
  }
};

const deleteContainer = async (id) => {
  try {
    const containerDeleted = await Container.destroy({
      where: {
        id,
      },
    });
    return containerDeleted;
  } catch (err) {
    console.log(err);
  }
};

const updateContainer = async (id, data) => {
  try {
    const container = await Container.update(data, {
      where: {
        id,
      },
    });
    return container;
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getAllContainer,
  updateContainer,
  getContainerById,
  addContainer,
  paginationContainerByName,
  deleteContainer,
};
