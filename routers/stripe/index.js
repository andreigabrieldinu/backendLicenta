const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const stripeRouter = express.Router();
const { authenticate } = require("../../middwares/auth");
const { getProductById } = require("../../services/products");

const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

stripeRouter.post("/", [authenticate], async (req, res) => {
  try {
    const { voucher } = req.body;
    let dbProducts = [];
    const array = req.url.split(",");
    const arrayProduct = [];
    for (let i = 0; i < array.length; i++) {
      if (i === 0) {
        array[i] = array[i].slice(1);
      }
      const params = new URLSearchParams(array[i].slice(1));
      const idProduct = params.get("idProduct");
      const productCount = params.get("productCount");
      const product = {
        idProduct,
        productCount,
      };
      arrayProduct.push(product);
      const product1 = await getProductById(idProduct);
      dbProducts.push(product1);
    }

    for (let i = 0; i < arrayProduct.length; i++) {
      arrayProduct[i].nameProduct = dbProducts[i].name;
      arrayProduct[i].category = dbProducts[i].category;
      if (dbProducts[i].promotionPercent) {
        arrayProduct[i].priceProduct = Math.round(
          Number(dbProducts[i].price) -
            (Number(dbProducts[i].price) *
              Number(dbProducts[i].promotionPercent)) /
              100
        );
      } else {
        arrayProduct[i].priceProduct = Number(dbProducts[i].price);
      }
    }

    if (voucher) {
      for (let i = 0; i < arrayProduct.length; i++) {
        arrayProduct[i].priceProduct =
          arrayProduct[i].priceProduct -
          (arrayProduct[i].priceProduct * voucher) / 100;
      }
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: arrayProduct.map((product) => {
        return {
          price_data: {
            currency: "RON",
            product_data: {
              name: product.nameProduct,
            },
            unit_amount: product.priceProduct * 100,
          },
          quantity: product.productCount,
        };
      }),
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/checkout`,
    });
    return res.send(session.url);
  } catch (err) {
    console.log(err);
  }
});

module.exports = stripeRouter;
