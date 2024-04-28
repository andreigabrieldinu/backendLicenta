const express = require("express");
const vouchersRouter = express.Router();
const { Voucher } = require("../../models");
const { Op } = require("sequelize");
const { authenticate } = require("../../middwares/auth");
const {
  getVoucher,
  createVoucher,
  deleteVoucher,
} = require("../../services/vouchers");

vouchersRouter.get("/:voucherName", async (req, res) => {
  const { voucherName } = req.params;
  const voucher = await getVoucher(voucherName);
  if (voucher === null) {
    return res.status(500).send("Can't get voucher");
  }
  return res.status(200).send(voucher);
});

vouchersRouter.post("/", async (req, res) => {
  const { voucherName, voucherPercentage } = req.body;

  const voucher = await Voucher.findOne({
    where: {
      voucherName: voucherName,
    },
  });
  if (voucher) {
    return res.status(500).send({ msg: "Voucher-ul exista deja", status: 500 });
  }

  await Voucher.create({ voucherName, voucherPercentage: voucherPercentage });

  return res
    .status(200)
    .send({ msg: "Voucher-ul a fost creat cu succes", status: 200 });
});

vouchersRouter.get("/", async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) - 1 || 0;
    const size = Number.parseInt(req.query.size) || 6;

    let keyWordSearch = "";
    if (req.query.search) {
      keyWordSearch = req.query.search.toString().toLocaleLowerCase();
    }

    let vouchers;
    let response;
    if (keyWordSearch !== "") {
      vouchers = await Voucher.findAll({
        where: {
          voucherName: {
            [Op.like]: `%${keyWordSearch}%`,
          },
        },
      });
      const total = await Voucher.count({
        where: {
          voucherName: {
            [Op.like]: `%${keyWordSearch}%`,
          },
        },
      });
      response = {
        vouchers,
        total,
        page: page,
        size,
      };
      return res.status(200).send(response);
    } else {
      vouchers = await Voucher.findAll({
        limit: size,
        offset: page * size,
      });
      const total = await Voucher.count();
      response = {
        vouchers,
        total,
        page: page,
        size,
      };
      return res.status(200).send(response);
    }
  } catch (err) {
    console.log(err);
  }
});

vouchersRouter.delete("/:voucherName", async (req, res) => {
  const { voucherName } = req.params;

  const voucher = await deleteVoucher(voucherName);

  if (!voucher) {
    return res
      .status(500)
      .send({ msg: "Voucher-ul nu a fost sters", status: 500 });
  }
  res
    .status(200)
    .send({ msg: "Voucher-ul a fost sters cu succes", status: 200 });
});

module.exports = vouchersRouter;
