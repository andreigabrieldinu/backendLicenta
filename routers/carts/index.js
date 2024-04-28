const { addToCart, getAllCart } = require("../../services/carts");

const express = require("express");
const { getProductById } = require("../../services/products");
const { authenticate } = require("../../middwares/auth");

const cartRouter = express.Router();

cartRouter.post("/", [authenticate], async (req, res) => {
  const { idProduct, productCount, paymentMethod } = req.query;

  const user = req.user;
  const product = await getProductById(idProduct);

  const cart = await addToCart({
    idUser: user.id,
    paymentMethod: paymentMethod,
    idProduct: idProduct,
    nameProduct: product.name,
    priceProduct: Math.round(
      product.price - (product.price * product.promotionPercent) / 100
    ),
    count: productCount,
    img: product.img1,
  });

  if (!cart) {
    res.status(500).send("Can't create cart");
  }

  res.status(200).send(cart);
});

cartRouter.get("/", async (req, res) => {
  const allCarts = await getAllCart();
  if (!allCarts) {
    res.status(500).send("Can't get carts");
  }
  res.status(200).send(allCarts);
});
module.exports = cartRouter;
