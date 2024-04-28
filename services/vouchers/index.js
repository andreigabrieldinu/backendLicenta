const { Voucher } = require("../../models");
const { Op } = require("sequelize");

const getVoucher = async (name) => {
  try {
    const voucher = await Voucher.findOne({
      where: {
        voucherName: name,
      },
    });
    return voucher;
  } catch (err) {
    return err;
  }
};

const createVoucher = async (data) => {
  try {
    const { voucherName, vouherPercentage } = data;
    const newVoucher = await Voucher.create({
      voucherName,
      vouherPercentage,
    });
    return newVoucher;
  } catch (err) {
    console.log(err);
  }
};

const deleteVoucher = async (voucherName) => {
  try {
    const voucher = await Voucher.destroy({
      where: {
        voucherName: voucherName,
      },
    });

    return voucher;
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getVoucher,
  createVoucher,
  deleteVoucher,
};
