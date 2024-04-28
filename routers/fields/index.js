const express = require("express");
const { addField, deleteField } = require("../../services/fields");
const { Field } = require("../../models");
const { Op } = require("sequelize");

const fieldRouter = express.Router();

fieldRouter.post("/", async (req, res) => {
  const { fieldName, longitude, latitude, fieldArea } = req.body;

  const newField = await addField({
    fieldName,
    longitude,
    latitude,
    fieldArea,
  });

  if (!newField) {
    return res.status(500).send("Can't add field");
  }

  res.status(200).send(newField);
});

fieldRouter.get("/", async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) - 1 || 0;
    const size = Number.parseInt(req.query.size) || 6;
    let keyWordSearch = "";
    if (req.query.search) {
      keyWordSearch = req.query.search.toString().toLocaleLowerCase();
    }

    let fields;
    let response;
    if (keyWordSearch !== "") {
      fields = await Field.findAll({
        where: {
          fieldName: {
            [Op.like]: `%${keyWordSearch}%`,
          },
        },
        limit: size,
        offset: page * size,
      });
      const total = await Field.count({
        where: {
          fieldName: {
            [Op.like]: `%${keyWordSearch}%`,
          },
        },
      });
      response = {
        fields,
        total,
        page: page,
        size,
      };
      return res.status(200).send(response);
    } else {
      fields = await Field.findAll({
        limit: size,
        offset: page * size,
      });
      const total = await Field.count();
      response = {
        fields,
        total,
        page: page + 1,
        size,
      };
      return res.status(200).send(response);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Can't get fields");
  }
});

fieldRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const field = await deleteField(id);

  if (!field) {
    return res.status(500).send(`Can't delete field id: ${id}`);
  }
  res.sendStatus(200).send(field);
});

module.exports = fieldRouter;
