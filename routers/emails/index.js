const { getCartByUser, getOrder } = require("../../services/carts");
const express = require("express");
const { authenticate } = require("../../middwares/auth");
const { sendMail } = require("../../mailer");
const nodeMailer = require("nodemailer");
const { getProductById } = require("../../services/products");

const emailRouter = express.Router();

emailRouter.post("/", [authenticate], async (req, res) => {
  const { fullName, email, phone, address, products, paymentMethod, voucher } =
    req.body;

  const user = req.user;
  const subject = "Factura comenzi";

  const cartsUser = await getOrder(user.id, products);
  let modifiedProducts = [];
  for (let i = 0; i < products; i++) {
    const product = await getProductById(cartsUser[i].idProduct);
    let modifiedProduct = {
      idProduct: cartsUser[i].idProduct,
      nameProduct: product.name,
      priceProduct: product.price,
      count: cartsUser[i].count,
      img: product.img1,
      promotionPercent: product.promotionPercent,
    };
    modifiedProducts.push(modifiedProduct);
  }

  let total = modifiedProducts.reduce((total, product) => {
    return (
      total +
      Math.round(
        product.priceProduct -
          (product.priceProduct * product.promotionPercent) / 100
      ) *
        product.count
    );
  }, 0);
  total = Math.round(total - (total * voucher) / 100);
  const htmlHead = `<table style="width:50%">
    <tr style="border: 1px solid black;">
    <th style="border: 1px solid black;">Numele produsului</th>
    <th style="border: 1px solid black;">Pret produs</th>
    <th style="border: 1px solid black;">Cantitate</th>
    <th style="border: 1px solid black;">
    Total Produs</th>`;

  let htmlContent = "";

  for (let i = 0; i < cartsUser.length; i++) {
    let final = Number(modifiedProducts[i].priceProduct);
    if (modifiedProducts[i].priceProduct.promotionPercent !== "") {
      final = Math.round(
        final - (final * Number(modifiedProducts[i].promotionPercent)) / 100
      );
    }
    final = Math.round(
      final * modifiedProducts[i].count -
        (final * modifiedProducts[i].count * voucher) / 100
    );
    htmlContent += `<tr>
      <td style="border: 1px solid black; font-size: 1.2rem; text-align: center;">${
        modifiedProducts[i].nameProduct
      }</td>
      <td style="border: 1px solid black; font-size: 1.2rem; text-align: center;">
      ${
        modifiedProducts[i].priceProduct -
        (modifiedProducts[i].priceProduct *
          modifiedProducts[i].promotionPercent) /
          100 -
        ((modifiedProducts[i].priceProduct -
          (modifiedProducts[i].priceProduct *
            modifiedProducts[i].promotionPercent) /
            100) *
          voucher) /
          100
      } RON</td>
      <td style="border: 1px solid black; font-size: 1.2rem; text-align: center;">${
        modifiedProducts[i].count
      }</td>
      <td style="border: 1px solid black; font-size: 1.2rem; text-align: center;">
      ${final}
       RON</td><tr>`;
  }
  const htmlResult = `
  <h1>Nume: ${fullName}</h1>
  <h3>Telefon: ${phone}</h3>
  <h3>Adresa: ${address}</h3>
  <h3>Metoda de plata: ${paymentMethod}</h3>
  <h3>Voucher:${voucher}%</h3>
  <h1>Total: ${total}
  <p>Multumim!</p>
  ${htmlHead}
  ${htmlContent}
    `;

  const info = await sendMail(email, subject, htmlResult);

  res.status(200).send({ sendEmail: nodeMailer.getTestMessageUrl(info) });
});

module.exports = emailRouter;
