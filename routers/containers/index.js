const express = require("express");
const {
  updateContainer,
  getContainerById,
  addContainer,
  deleteContainer,
} = require("../../services/container");
const { getWineByWineName } = require("../../services/wines");
const { Container } = require("../../models");
const { Op } = require("sequelize");
const { getAllSupplierAndObjects } = require("../../services/supplier");

const containerRouter = express.Router();

containerRouter.post("/", async (req, res) => {
  const { containerName, containerCapacity } = req.body;

  const newContainer = await addContainer({
    containerName,
    containerCapacity,
  });

  if (!newContainer) {
    return res.status(500).send("Can't add container");
  }

  res.status(200).send(newContainer);
});

containerRouter.get("/", async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) - 1 || 0;
    const size = Number.parseInt(req.query.size) || 6;
    let keyWordSearch = "";
    if (req.query.search) {
      keyWordSearch = req.query.search.toString().toLocaleLowerCase();
    }

    let containers;
    let response;
    if (keyWordSearch !== "") {
      containers = await Container.findAll({
        where: {
          containerName: {
            [Op.like]: `%${keyWordSearch}%`,
          },
        },
        limit: size,
        offset: page * size,
      });

      const total = await Container.count({
        where: {
          containerName: {
            [Op.like]: `%${keyWordSearch}%`,
          },
        },
      });
      response = {
        containers,
        total,
        page: page,
        size,
      };
      return res.status(200).send(response);
    } else {
      containers = await Container.findAll({
        limit: size,
        offset: page * size,
      });
      const total = await Container.count();
      response = {
        containers,
        total,
        page: page + 1,
        size,
      };
      return res.status(200).send(response);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Can't get containers");
  }
});

containerRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { occupiedCapacity, containerTemperature, wineName } = req.body;
  console.log(wineName);
  if (wineName === "niciunul") {
    const containerUpdated = await updateContainer(id, {
      occupiedCapacity: null,
      containerTemperature: null,
      wineName: null,
    });
    if (!containerUpdated) {
      return res.status(500).send("Can't update container");
    }
    return res
      .status(200)
      .send({ msg: "S-a sters vinul de pe recipient", status: 200 });
  }

  const wine = await getWineByWineName(wineName);
  const container = await getContainerById(id);
  if (!wine) {
    return res.status(500).send({ msg: "Nu a fost gasit vinul", status: 500 });
  }
  if (wine.wineQuantity < occupiedCapacity || occupiedCapacity < 0) {
    return res.status(500).send({
      msg: `Nu exista atat vin din vinul ${wine.wineName}, cantitatea maxima disponibila este ${wine.wineQuantity} litri`,
      status: 500,
    });
  }
  if (container.containerCapacity < occupiedCapacity || occupiedCapacity < 0) {
    return res.status(500).send({
      msg: `Nu exista atat loc in containerul ${container.containerName}`,
      status: 500,
    });
  }
  const allContainers = await Container.findAll({
    where: {
      wineName: wine.wineName,
    },
  });
  let totalOccupiedCapacity = 0;
  allContainers.forEach((container) => {
    totalOccupiedCapacity += container.occupiedCapacity;
  });

  if (totalOccupiedCapacity + Number(occupiedCapacity) > wine.wineQuantity) {
    return res.status(500).send({
      msg: `Nu exista atata cantitate de vin disponibila pentru depozitare`,
      status: 500,
    });
  }

  const containerUpdated = await updateContainer(id, {
    occupiedCapacity,
    containerTemperature,
    wineName: wine.wineName,
  });

  if (!containerUpdated) {
    return res.status(500).send({
      msg: `Nu se poate actualiza containerul cu id-ul: ${id}`,
      status: 500,
    });
  }

  return res
    .status(200)
    .send({ msg: "Containerul a fost actualizat cu succes", status: 200 });
});
containerRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const container = await getContainerById(id);

  if (container.occupiedCapacity > 0 && container.occupiedCapacity != null) {
    return res.status(500).send({
      msg: `Containerul ${container.containerName} nu poate fi sters deoarece este ocupat`,
      status: 500,
    });
  }
  const containerDeleted = await deleteContainer(id);
  if (!containerDeleted) {
    return res.status(500).send({
      msg: `Nu se poate sterge containerul cu id-ul: ${id}`,
      status: 500,
    });
  }

  return res
    .status(200)
    .send({ msg: "Containerul a fost sters cu succes", status: 200 });
});

module.exports = containerRouter;
