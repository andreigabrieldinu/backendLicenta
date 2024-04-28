const { Field } = require("../../models");
const { Op } = require("sequelize");

const getAllField = async () => {
  try {
    const listField = await Field.findAll();
    return listField;
  } catch (err) {
    console.log(err);
  }
};

const getFieldById = async (id) => {
  try {
    const field = await Field.findOne({
      where: {
        id,
      },
    });
    return field;
  } catch (err) {
    console.log(err);
  }
};

const addField = async (data) => {
  try {
    const newField = await Field.create(data);
    return newField;
  } catch (err) {
    console.log(err);
  }
};

// const paginationField = async (page, size) => {
//   try {
//     const field = await Field.findAndCountAll({
//       limit: size,
//       offset: (page - 1) * size,
//     });
//     return field;
//   } catch (err) {
//     console.log(err);
//   }
// };

const paginationFieldByName = async (name, page, size) => {
  try {
    const field = await Field.findAndCountAll({
      where: {
        name: {
          [Op.like]: `%${name}%`,
        },
      },
      limit: size,
      offset: (page - 1) * size,
    });
    return field;
  } catch (err) {
    console.log(err);
  }
};

const deleteField = async (id) => {
  try {
    const fieldDeleted = await Field.destroy({
      where: {
        id,
      },
    });
    return fieldDeleted;
  } catch (err) {
    console.log(err);
  }
};

const searchField = async (name) => {
  try {
    const field = await Field.findAll({
      where: {
        fieldName: {
          [Op.like]: `%${name}%`,
        },
      },
    });
    return field;
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getAllField,
  getFieldById,
  addField,
  paginationFieldByName,
  deleteField,
  searchField,
};
