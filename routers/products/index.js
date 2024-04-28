const express = require("express");
const {
  addProduct,
  getListProduct,
  getProductById,
  paginationProduct,
  deleteProduct,
  updateProduct,
  getProductByCategory,
  getProductByCategoryAndType,
} = require("../../services/products");
const productRouter = express.Router();

productRouter.post("/", async (req, res) => {
  const {
    name,
    description,
    price,
    img1,
    img2,
    img3,
    img4,
    category,

    promotionPercent,
    wineType,
    productQuantity,
  } = req.body;

  const newProduct = await addProduct({
    name,
    description,
    price,
    img1,
    img2,
    img3,
    img4,
    category,
    promotionPercent,
    wineType,
    productQuantity,
  });

  if (!newProduct) {
    return res.status(500).send("Can't add product");
  }

  res.status(200).send(newProduct);
});

productRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  const product = await getProductById(id);

  if (!product) {
    return res.status(500).send(`Can't get product id: ${id}`);
  }

  res.status(200).send(product);
});

productRouter.get("/", async (req, res) => {
  const page = Number.parseInt(req.query.page);
  const size = Number.parseInt(req.query.size);
  const keyWordSearch = req.query.search || "";
  const category = req.query.category || "";
  let products;

  if (page && size) {
    let start = (page - 1) * size;
    let end = page * size;
    if (category === "all") {
      products = await getListProduct();
    } else {
      products = await getProductByCategory(category);
    }
    let paginationProducts = products.slice(start, end);
    if (!keyWordSearch) {
      res.status(200).send(paginationProducts);
    } else {
      let newProduct = paginationProducts.filter((value) => {
        return (
          value.name.toLowerCase().indexOf(keyWordSearch.toLowerCase()) !== -1
        );
      });
      res.status(200).send(newProduct);
    }
  } else if (category) {
    if (category === "all") {
      products = await getListProduct();
    } else {
      if (category !== "Accesorii" && category !== "all") {
        const categoryArr = category.split(" ");
        const categoryType = categoryArr[0] + " " + categoryArr[1].trim();
        const wineType = categoryArr[2].trim();
        products = await getProductByCategoryAndType(
          categoryType,
          wineType,
          1,
          6
        );
      } else {
        products = await getProductByCategory(category);
      }
    }
    res.status(200).send(products);
  } else {
    const products = await getListProduct();
    if (!products) {
      return res.status(500).send("Can't get pagination page");
    }
    res.status(200).send(products);
  }
});

productRouter.get("/:category/:wineType", async (req, res) => {
  const { category, wineType } = req.params;
  const products = await getProductByCategoryAndType(category, wineType, 1, 9);
  if (!products) {
    return res.status(500).send("Can't get pagination page");
  }
  res.status(200).send(products);
});

productRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { price2, promotionPercent2, productQuantity2 } = req.body;

  const isProductExist = await getProductById(id);

  if (!isProductExist) {
    return res.status(500).send(`Product ${id} is not exists in db`);
  }
  let data = {};
  if (price2) {
    data.price = price2;
  }
  if (promotionPercent2) {
    data.promotionPercent = promotionPercent2;
  }
  if (productQuantity2) {
    data.productQuantity = productQuantity2;
  }

  await updateProduct(id, data);
  res.status(200).send("data updated");
});

productRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const isProductExist = getProductById(id);

  if (!isProductExist) {
    return res.status(500).send(`Product ${id} is not exists in db `);
  }

  const productDeleted = await deleteProduct(id);

  res.status(200).send(`User id : ${productDeleted} successfully`);
});

module.exports = productRouter;
