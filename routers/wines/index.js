const express = require("express");
const {
  updateWine,
  getWineByWineName,
  addWine,
  deleteWine,
} = require("../../services/wines");
const { Wine } = require("../../models");
const { Op } = require("sequelize");

const wineRouter = express.Router();

wineRouter.post("/", async (req, res) => {
  try {
    const { wineName, wineColor, wineType, wineStatus, wineQuantity } =
      req.body;

    const wine = await getWineByWineName(wineName);

    if (wine) {
      return res.status(409).send({ message: "Vinul exista deja" });
    }

    const newWine = await addWine({
      wineName,
      wineColor,
      wineType,
      wineStatus,
      wineQuantity,
    });

    if (!newWine) {
      return res.status(500).send("Can't add Wine");
    }

    return res.status(200).send(newWine);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

wineRouter.get("/", async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) - 1 || 0;
    const size = Number.parseInt(req.query.size) || 6;
    let keyWordSearch = "";
    if (req.query.search) {
      keyWordSearch = req.query.search.toString().toLocaleLowerCase();
    }
    let wines;
    let response;
    if (keyWordSearch !== "") {
      wines = await Wine.findAll({
        where: {
          [Op.or]: [
            {
              wineName: {
                [Op.like]: `%${keyWordSearch}%`,
              },
            },
            {
              wineColor: {
                [Op.like]: `%${keyWordSearch}%`,
              },
            },
            {
              wineType: {
                [Op.like]: `%${keyWordSearch}%`,
              },
            },
            {
              wineStatus: {
                [Op.like]: `%${keyWordSearch}%`,
              },
            },
          ],
        },
        limit: size,
        offset: page * size,
      });
      const total = await Wine.count({
        where: {
          [Op.or]: [
            {
              wineName: {
                [Op.like]: `%${keyWordSearch}%`,
              },
            },
            {
              wineColor: {
                [Op.like]: `%${keyWordSearch}%`,
              },
            },
            {
              wineType: {
                [Op.like]: `%${keyWordSearch}%`,
              },
            },
            {
              wineStatus: {
                [Op.like]: `%${keyWordSearch}%`,
              },
            },
          ],
        },
      });
      response = {
        wines,
        total,
        page: page,
        size,
      };
      return res.status(200).send(response);
    } else {
      wines = await Wine.findAll({
        limit: size,
        offset: page * size,
      });

      const total = await Wine.count();
      response = {
        wines,
        total,
        page: page + 1,
        size,
      };
      return res.status(200).send(response);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Can't get wines");
  }
});

wineRouter.put("/:wineName", async (req, res) => {
  const { wineName } = req.params;
  const {
    wineStatus2,
    alcohol,
    sugar,
    totalAcidity,
    totalVolatility,
    freeSulphur,
    totalSulphur,
    density,
    nonReducingDryExtract,
  } = req.body;
  let wineUpdate;

  if (wineStatus2) {
    wineUpdate = await updateWine(wineName, { wineStatus: wineStatus2 });
    console.log(wineUpdate);
    return res
      .status(200)
      .send({ msg: "Statusul a fost schimbat cu succes!", status: 200 });
  } else {
    wineUpdate = await updateWine(wineName, {
      alcohol,
      sugar,
      totalAcidity,
      totalVolatility,
      freeSulphur,
      totalSulphur,
      density,
      nonReducingDryExtract,
    });
    return res
      .status(200)
      .send({ msg: "Analiza a fost actualizata cu succes!", status: 200 });
  }
});
wineRouter.delete("/:wineName", async (req, res) => {
  const { wineName } = req.params;
  const wineDeleted = await deleteWine(wineName);
  if (!wineDeleted) {
    return res.status(500).send({ message: "Nu se poate sterge vinul" });
  }
  return res.status(200).send({ message: "Vinul a fost sters cu succes!" });
});

module.exports = wineRouter;
