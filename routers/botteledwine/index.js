const {
  BottledWine,
  Label,
  Cork,
  Bottle,
  Wine,
  Container,
} = require("../../models");
const { Op } = require("sequelize");

const bottledWinerouter = require("express").Router();

bottledWinerouter.post("/", async (req, res) => {
  const { corkName, labelName, bottleName, wineName, bottledBottlesNumber } =
    req.body;

  const cork = await Cork.findOne({
    attributes: ["id", "corkName", "idSupplier", "createdAt", "updatedAt"],

    where: {
      corkName: corkName,
    },
  });

  if (!cork) {
    return res.status(404).send({ msg: "Nu exista dopul", status: 404 });
  }

  const label = await Label.findOne({
    attributes: ["id", "labelName", "idSupplier", "createdAt", "updatedAt"],
    where: {
      labelName: labelName,
    },
  });

  if (!label) {
    return res.status(404).send({ msg: "Nu exista eticheta", status: 404 });
  }

  const bottle = await Bottle.findOne({
    attributes: ["id", "bottleName", "idSupplier", "createdAt", "updatedAt"],
    where: {
      bottleName: bottleName,
    },
  });

  if (!bottle) {
    return res.status(404).send({ msg: "Nu exista sticla", status: 404 });
  }

  const wine = await Wine.findOne({
    where: {
      wineName,
    },
  });

  if (!wine) {
    return res.status(404).send({ msg: "Nu exista vinul", status: 404 });
  }
  let calcul = Math.round(bottledBottlesNumber * 0.75);

  wine.update({
    wineQuantity: wine.wineQuantity - calcul,
  });
  let container = await Container.findAll({
    where: {
      wineName: wineName,
    },
  });
  for (let i = 0; i < container.length; i++) {
    if (container[i].occupiedCapacity >= calcul) {
      container[i].update({
        occupiedCapacity: container[i].occupiedCapacity - calcul,
      });
      break;
    }
  }

  await BottledWine.create({
    idCork: cork.id,
    idLabel: label.id,
    idBottle: bottle.id,
    wineName,
    bottledBottlesNumber,
  });
  return res.status(201).send({ msg: "Vinul a fost imbuteliat", status: 201 });
});

bottledWinerouter.get("/", async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) - 1 || 0;
    const size = Number.parseInt(req.query.size) || 6;
    let keyWordSearch = "";
    if (req.query.search) {
      keyWordSearch = req.query.search.toString().toLocaleLowerCase();
    }
    let botteledWines;
    let response;
    if (keyWordSearch !== "") {
      botteledWines = await BottledWine.findAll({
        where: {
          wineName: {
            [Op.like]: `%${keyWordSearch}%`,
          },
        },
        limit: size,
        offset: page * size,
      });
      const total = await BottledWine.count({
        where: {
          wineName: {
            [Op.like]: `%${keyWordSearch}%`,
          },
        },
        limit: size,
        offset: page * size,
      });
      let cork = await Cork.findAll({
        attributes: ["id", "corkName", "idSupplier", "createdAt", "updatedAt"],
      });
      let label = await Label.findAll({
        attributes: ["id", "labelName", "idSupplier", "createdAt", "updatedAt"],
      });
      let bottle = await Bottle.findAll({
        attributes: [
          "id",
          "bottleName",
          "idSupplier",
          "createdAt",
          "updatedAt",
        ],
      });

      for (let i = 0; i < botteledWines.length; i++) {
        for (let j = 0; j < cork.length; j++) {
          for (let k = 0; k < label.length; k++) {
            for (let l = 0; l < bottle.length; l++) {
              if (
                botteledWines[i].idCork == cork[j].id &&
                botteledWines[i].idLabel == label[k].id &&
                botteledWines[i].idBottle == bottle[l].id
              ) {
                botteledWines[i].dataValues.corkName = cork[j].corkName;
                botteledWines[i].dataValues.labelName = label[k].labelName;
                botteledWines[i].dataValues.bottleName = bottle[l].bottleName;
              }
            }
          }
        }
      }

      response = {
        botteledWines,
        total,
        page: page,
        size: size,
      };
      return res.status(200).send(response);
    } else {
      botteledWines = await BottledWine.findAll({
        limit: size,
        offset: page * size,
      });
      const total = await BottledWine.count({
        limit: size,
        offset: page * size,
      });
      let cork = await Cork.findAll({
        attributes: ["id", "corkName", "idSupplier", "createdAt", "updatedAt"],
      });
      let label = await Label.findAll({
        attributes: ["id", "labelName", "idSupplier", "createdAt", "updatedAt"],
      });
      let bottle = await Bottle.findAll({
        attributes: [
          "id",
          "bottleName",
          "idSupplier",
          "createdAt",
          "updatedAt",
        ],
      });

      for (let i = 0; i < botteledWines.length; i++) {
        for (let j = 0; j < cork.length; j++) {
          for (let k = 0; k < label.length; k++) {
            for (let l = 0; l < bottle.length; l++) {
              if (
                botteledWines[i].idCork == cork[j].id &&
                botteledWines[i].idLabel == label[k].id &&
                botteledWines[i].idBottle == bottle[l].id
              ) {
                botteledWines[i].dataValues.corkName = cork[j].corkName;
                botteledWines[i].dataValues.labelName = label[k].labelName;
                botteledWines[i].dataValues.bottleName = bottle[l].bottleName;
              }
            }
          }
        }
      }

      response = {
        botteledWines,
        total,
        page: page,
        size: size,
      };
      return res.status(200).send(response);
    }
  } catch (error) {
    return res.status(500).send({ msg: error.message, status: 500 });
  }
});

bottledWinerouter.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const bottledWine = await BottledWine.findOne({
    where: {
      id,
    },
  });

  if (!bottledWine) {
    return res
      .status(404)
      .send({ msg: "Nu exista vinul imbuteliat", status: 404 });
  }

  const wine = await Wine.findOne({
    where: {
      wineName: bottledWine.wineName,
    },
  });

  if (!wine) {
    return res.status(404).send({ msg: "Nu exista vinul", status: 404 });
  }

  wine.update({
    wineQuantity:
      wine.wineQuantity + Math.round(bottledWine.bottledBottlesNumber * 0.75),
  });

  await BottledWine.destroy({
    where: {
      id,
    },
  });

  return res.status(200).send({ msg: "Vinul a fost sters", status: 200 });
});

module.exports = bottledWinerouter;
