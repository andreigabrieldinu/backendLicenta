const { Cart, User } = require("../../models");

const getCartByUser = async (idUser) => {
  try {
    const cartUser = await Cart.findAll({
      where: {
        idUser,
      },
    });
    return cartUser;
  } catch (err) {
    console.log(err);
  }
};

const getAllCart = async () => {
  try {
    const cartUser = await Cart.findAll();
    return cartUser;
  } catch (err) {
    console.log(err);
  }
};

const getOrder = async (idUser, products) => {
  try {
    const cartUser = await Cart.findAll({
      where: {
        idUser,
      },
      order: [["createdAt", "DESC"]],
      limit: products,
    });
    return cartUser;
  } catch (err) {
    console.log(err);
  }
};

const addToCart = async (product) => {
  try {
    const carts = await Cart.create(product);
    return carts;
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getCartByUser,
  getAllCart,
  getOrder,
  addToCart,
};
