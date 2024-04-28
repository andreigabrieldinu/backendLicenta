const { Cork, Label, Bottle, Ingredient, Supplier } = require("../../models");
const express = require("express");
const {
  createSupplierAndObject,
  getSupplierById,
  getAllObjectsFromSupplier,
  deleteObject,
  getAllSupplierAndObjects,
} = require("../../services/supplier");

const { Op } = require("sequelize");

const supplierRouter = express.Router();

supplierRouter.post("/", async (req, res) => {
  console.log("supplierName", req.body.supplierName);
  const {
    supplierName,
    supplierEmail,
    supplierPhone,
    supplierAddress,
    obj,
    objName,
  } = req.body;
  const newSupplier = await createSupplierAndObject(
    supplierName,
    supplierAddress,
    supplierPhone,
    supplierEmail,
    obj,
    objName
  );
  console.log("newSupplier", newSupplier);
  res.status(200).send(newSupplier);
});

supplierRouter.get("/", async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) - 1 || 0;
    const size = Number.parseInt(req.query.size) || 6;
    let keyWordSearch = "";

    if (req.query.search) {
      keyWordSearch = req.query.search.toString().toLocaleLowerCase();
    }

    let objects;
    let suppliers;
    let response;
    objects = await getAllSupplierAndObjects(keyWordSearch, page, size);
    const total = objects.length;
    suppliers = await Supplier.findAll();
    let objectsFiltered = [];
    for (let i = page * size; i < objects.length; i++) {
      if (objectsFiltered.length < size) {
        objectsFiltered.push(objects[i]);
      }
    }
    for (let i = 0; i < objectsFiltered.length; i++) {
      for (let j = 0; j < suppliers.length; j++) {
        if (objectsFiltered[i].dataValues.idSupplier === suppliers[j].id) {
          objectsFiltered[i].dataValues.supplierName =
            suppliers[j].supplierName;
          objectsFiltered[i].dataValues.supplierAddress =
            suppliers[j].supplierAddress;
          objectsFiltered[i].dataValues.supplierPhone =
            suppliers[j].supplierPhone;
          objectsFiltered[i].dataValues.supplierEmail =
            suppliers[j].supplierEmail;
        }
      }
    }
    response = {
      objects: objectsFiltered,
      total,
      page: page,
      size,
    };

    return res.status(200).send(response);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

supplierRouter.get("/:id", async (req, res) => {
  try {
    const supplier = await getSupplierById(req.params.id);
    if (!supplier) {
      return res.status(404).send("Supplier not found");
    }
    res.status(200).send(supplier);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

supplierRouter.delete("/:objName/:obj", async (req, res) => {
  try {
    const { objName, obj } = req.params;

    if (obj === "Dop") {
      const cork = await Cork.findOne({
        attributes: ["id", "corkName", "idSupplier", "createdAt", "updatedAt"],
        where: {
          corkName: objName,
        },
      });
      if (cork) {
        const deletedCork = await Cork.destroy({
          attributes: [
            "id",
            "corkName",
            "idSupplier",
            "createdAt",
            "updatedAt",
          ],

          where: {
            corkName: objName,
          },
        });
        if (!deletedCork) {
          return res.status(404).send({ msg: "Dop negasit", status: "404" });
        }
        return res.status(200).send({ msg: "Dop sters", status: "200" });
      }
    }
    if (obj === "Eticheta") {
      const label = await Label.findOne({
        attributes: ["id", "labelName", "idSupplier", "createdAt", "updatedAt"],

        where: {
          labelName: objName,
        },
      });
      if (label) {
        const deletedLabel = await Label.destroy({
          where: {
            labelName: objName,
          },
        });
        if (!deletedLabel) {
          return res
            .status(404)
            .send({ msg: "Eticheta negasita", status: "404" });
        }
        return res.status(200).send({ msg: "Eticheta stearsa", status: "200" });
      }
    }
    if (obj === "Sticla") {
      const bottle = await Bottle.findOne({
        attributes: [
          "id",
          "bottleName",
          "idSupplier",
          "createdAt",
          "updatedAt",
        ],
        where: {
          bottleName: objName,
        },
      });
      if (bottle) {
        const deletedBottle = await Bottle.destroy({
          attributes: [
            "id",
            "bottleName",
            "idSupplier",
            "createdAt",
            "updatedAt",
          ],
          where: {
            bottleName: objName,
          },
        });
        if (!deletedBottle) {
          return res
            .status(404)
            .send({ msg: "Sticla negasita", status: "404" });
        }
        return res.status(200).send({ msg: "Sticla stearsa", status: "200" });
      }
    }
    if (obj === "Ingredient") {
      const ingredient = await Ingredient.findOne({
        attributes: [
          "id",
          "ingredientName",
          "idSupplier",
          "createdAt",
          "updatedAt",
        ],
        where: {
          ingredientName: objName,
        },
      });
      if (ingredient) {
        const deletedIngredient = await Ingredient.destroy({
          attributes: [
            "id",
            "ingredientName",
            "idSupplier",
            "createdAt",
            "updatedAt",
          ],
          where: {
            ingredientName: objName,
          },
        });

        if (!deletedIngredient) {
          return res
            .status(404)
            .send({ msg: "Ingredient negasit", status: "404" });
        }

        return res.status(200).send({ msg: "Ingredient sters", status: "200" });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

module.exports = supplierRouter;
