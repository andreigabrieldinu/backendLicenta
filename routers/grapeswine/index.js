const express = require("express");
const {
  getAllWine,
  getAllWineGrapes,
  getAllGrapesWine,
  getOneGrapeWine,
  addGrapeWine,
  paginationWineGrapeByName,
  deleteGrapeWine,
} = require("../../services/grapeswine");
const { getGrapeByName } = require("../../services/grapes");
const { getWineByWineName } = require("../../services/wines");
const { GrapeWine, Grape, Wine, sequelize } = require("../../models");
const { Op } = require("sequelize");

const grapeWineRouter = express.Router();

grapeWineRouter.post("/", async (req, res) => {
  const { grapeName, wineName } = req.body;

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
      grapeName,
    },
  });
  if (!grape) {
    return res.status(404).send({ msg: "Strugurele nu exista", status: 404 });
  }

  const grapeWine = await getOneGrapeWine(grape.id, wineName);
  if (grapeWine) {
    return res
      .status(400)
      .send({ msg: "Acest strugure este deja pe acest vin", status: 400 });
  }

  const newGrapeWine = await addGrapeWine({
    idGrape: grape.id,
    wineName: wineName,
    createdAt: new Date(),
  });

  if (!newGrapeWine) {
    return res
      .status(500)
      .send({ msg: "Nu poti adauga un vin nou", status: 500 });
  }

  res.status(200).send(newGrapeWine);
});

grapeWineRouter.get("/", async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) - 1 || 0;
    const size = Number.parseInt(req.query.size) || 6;
    let keyWordSearch = "";
    if (req.query.search) {
      keyWordSearch = req.query.search.toString().toLocaleLowerCase();
    }

    let grapeWines;
    let response;
    if (keyWordSearch !== "") {
      grapeWines = await GrapeWine.findAll({
        attributes: [`idGrape`, `wineName`, `createdAt`, `updatedAt`],
        where: {
          wineName: {
            [Op.like]: `%${keyWordSearch}%`,
          },
        },
        limit: size,
        offset: page * size,
      });
      const total = await GrapeWine.count({
        where: {
          wineName: {
            [Op.like]: `%${keyWordSearch}%`,
          },
        },
      });
      const allGrapes = await Grape.findAll({
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
      for (let i = 0; i < grapeWines.length; i++) {
        for (let j = 0; j < allGrapes.length; j++) {
          if (grapeWines[i].idGrape === allGrapes[j].id) {
            grapeWines[i].dataValues.grapeName = allGrapes[j].grapeName;
          }
        }
      }
      response = {
        grapeWines,
        total,
        page: page,
        size,
      };
      return res.status(200).send(response);
    } else {
      grapeWines = await GrapeWine.findAll({
        attributes: [`idGrape`, `wineName`, `createdAt`, `updatedAt`],

        limit: size,
        offset: page * size,
      });
      const total = await GrapeWine.count();
      const allGrapes = await Grape.findAll({
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
      for (let i = 0; i < grapeWines.length; i++) {
        for (let j = 0; j < allGrapes.length; j++) {
          if (grapeWines[i].idGrape === allGrapes[j].id) {
            grapeWines[i].dataValues.grapeName = allGrapes[j].grapeName;
          }
        }
      }
      response = {
        grapeWines,
        total,
        page: page + 1,
        size,
      };

      return res.status(200).send(response);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Can't get grapes wines");
  }
});

grapeWineRouter.delete("/:idGrape/:wineName", async (req, res) => {
  const { idGrape, wineName } = req.params;
  const wineGrape = await deleteGrapeWine(wineName, idGrape);
  if (!wineGrape) {
    return res.status(500).send({
      msg: `Nu se poate sterge strugurele `,
      status: 500,
    });
  }

  return res
    .status(200)
    .send({ msg: "Strugurele a fost sters de pe vin cu succes", status: 200 });
});

module.exports = grapeWineRouter;
