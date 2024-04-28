const express = require("express");
const {
  gethistory,
  createHistory,
  getOneHistory,
  getListHistory,
  updateHistory,
} = require("../../services/history");
const { Op } = require("sequelize");
const { History, Cart } = require("../../models");
const historyRouter = express.Router();

historyRouter.get("/", async (req, res) => {
  const { idUser } = req.query;

  if (idUser) {
    const user = await gethistory(idUser);
    if (!user) {
      return res.status(500).send("Can't get user history");
    }
    res.status(200).send(user);
  } else {
    const listHistory = await getListHistory();
    if (!listHistory) {
      return res.status(500).send("Can't get list history");
    }

    res.status(200).send(listHistory);
  }
});

historyRouter.post("/", async (req, res) => {
  const {
    idUser,
    phone,
    address,
    cart,
    fullname,
    paymentMethod,
    total,
    status,
    voucherPercentage,
  } = req.body;

  const history = await createHistory({
    idUser,
    paymentMethod,
    phone,
    address,
    cart,
    fullname,
    total,
    status,
    voucherPercentage,
  });

  if (!history) {
    return res.status(500).send("Can't create history");
  }

  res.status(200).send(history);
});

historyRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { livrare, plata } = req.body;
  const history = await getOneHistory(id);
  if (!history) {
    return res.status(500).send("Can't get history");
  }
  let data = {};
  if (livrare) {
    data.delivery = livrare;
  }
  if (plata) {
    data.status = plata;
  }
  const historyUpdate = await updateHistory(id, data);
  if (!historyUpdate) {
    return res.status(500).send("Can't update history");
  }
  res.status(200).send(historyUpdate);
});

historyRouter.get("/pagination", async (req, res) => {
  const page = Number.parseInt(req.query.page) - 1 || 0;
  const size = Number.parseInt(req.query.size) || 6;
  let keyWordSearch = "";
  function nvl(value, defaultValue) {
    return value !== null && value !== undefined ? value : defaultValue;
  }
  if (req.query.search) {
    keyWordSearch = req.query.search.toString().toLocaleLowerCase();
  }

  let histories;
  let carts;
  let response;
  if (keyWordSearch !== "") {
    histories = await History.findAll({
      where: {
        fullname: {
          [Op.like]: `%${keyWordSearch}%`,
        },
      },
      limit: size,
      offset: page * size,
    });
    const total = await History.count({
      where: {
        fullname: {
          [Op.like]: `%${keyWordSearch}%`,
        },
      },
    });
    let obj = [];
    carts = await Cart.findAll();
    carts.forEach((element) => {
      histories.forEach((history) => {
        if (
          Math.round(
            Number(element.priceProduct) * Number(element.count) -
              Number(element.priceProduct) *
                Number(element.count) *
                (nvl(Number(history.voucherPercentage), 0) / 100)
          ) === Math.round(Number(history.total))
        ) {
          let object = {
            id: history.id,
            productName: element.nameProduct,
            productCount: element.count,
            name: history.fullname,
            address: history.address,
            total: history.total,
            status: history.status,
            delivery: history.delivery,
            createdAt: history.createdAt,
          };
          obj.push(object);
        }
      });
    });
    response = {
      content: obj,
      total,
      page: page,
      size: size,
    };
  } else {
    histories = await History.findAll({
      limit: size,
      offset: page * size,
    });
    const total = await History.count();
    let obj = [];
    carts = await Cart.findAll();
    carts.forEach((element) => {
      histories.forEach((history) => {
        if (
          Math.round(
            Number(element.priceProduct) * Number(element.count) -
              Number(element.priceProduct) *
                Number(element.count) *
                (nvl(Number(history.voucherPercentage), 0) / 100)
          ) === Math.round(Number(history.total))
        ) {
          let object = {
            id: history.id,
            productName: element.nameProduct,
            productCount: element.count,
            name: history.fullname,
            address: history.address,
            total: history.total,
            status: history.status,
            delivery: history.delivery,
            createdAt: history.createdAt,
          };
          obj.push(object);
        }
      });
    });
    response = {
      content: obj,
      total,
      page: page,
      size: size,
    };
  }

  res.status(200).send(response);
});

module.exports = historyRouter;
