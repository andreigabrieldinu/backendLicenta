const express = require("express");
const {
  addGrape,
  paginationGrapeByName,
  paginationGrape,
  deleteGrape,
} = require("../../services/grapes");
const { Grape } = require("../../models");
const { Field } = require("../../models");
const { Op } = require("sequelize");

const grapeRouter = express.Router();

grapeRouter.post("/", async (req, res) => {
  const { grapeName, grapeColor, grapeQuantity, fieldName } = req.body;

  const field = await Field.findOne({
    where: {
      fieldName,
    },
  });

  if (!field) {
    return res.status(404).send({ msg: "Terenul nu exista" });
  }

  const newGrape = await addGrape({
    grapeName,
    grapeColor,
    grapeQuantity,
    idField: field.id,
  });

  if (!newGrape) {
    return res.status(500).send("Can't add field");
  }

  res.status(200).send(newGrape);
});

grapeRouter.get("/", async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) - 1 || 0;
    const size = Number.parseInt(req.query.size) || 6;
    let keyWordSearch = "";
    if (req.query.search) {
      keyWordSearch = req.query.search.toString().toLocaleLowerCase();
    }
    let grapes;
    let response;
    if (keyWordSearch !== "") {
      grapes = await paginationGrapeByName(keyWordSearch, page, size);

      let fields = await Field.findAll();
      grapes.forEach((grape) => {
        fields.forEach((field) => {
          if (grape.idField === field.id) {
            grape.dataValues.fieldName = field.fieldName;
          }
        });
      });
      const total = await Grape.count({
        where: {
          grapeName: {
            [Op.like]: `%${keyWordSearch}%`,
          },
        },
      });
      response = {
        grapes,
        total,
        page: page,
        size,
      };
      return res.status(200).send(response);
    } else {
      grapes = await paginationGrape(page, size);
      let fields = await Field.findAll();
      grapes.rows.forEach((grape) => {
        fields.forEach((field) => {
          if (grape.idField === field.id) {
            grape.dataValues.fieldName = field.fieldName;
          }
        });
      });
      response = {
        grapes: grapes.rows,
        total: grapes.count,
        page: page + 1,
        size,
      };
      return res.status(200).send(response);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Cant't get grapes");
  }
});

grapeRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const grape = await deleteGrape(id);

  if (!grape) {
    return res.status(500).send(`Can't delete grape id: ${id}`);
  }
  return res.send(200).send(grape);
});

module.exports = grapeRouter;
