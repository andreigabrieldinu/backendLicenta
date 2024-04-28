const { Cork, Label, Bottle, Ingredient, Supplier } = require("../../models");
const { Op } = require("sequelize");

const objCreation = async (obj, objName, id) => {
  switch (obj) {
    case "Dop":
      const cork = await Cork.findOne({
        attributes: ["id", "corkName", "idSupplier", "createdAt", "updatedAt"],
        where: {
          corkName: objName,
          idSupplier: id,
        },
      });
      if (cork) {
        return { msg: "Acest dop este deja inregistrat", status: 400 };
      } else {
        const newCork = await Cork.create({
          corkName: objName,
          idSupplier: id,
          createdAt: new Date(),
        });
        if (!newCork) {
          return { msg: "Nu poti adauga un dop nou", status: 500 };
        }
        return newCork;
      }
      break;
    case "Eticheta":
      const label = await Label.findOne({
        attributes: ["id", "labelName", "idSupplier", "createdAt", "updatedAt"],
        where: {
          labelName: objName,
          idSupplier: id,
        },
      });
      if (label) {
        return {
          msg: "Acesta eticheta este deja inregistrata",
          status: 400,
        };
      }
      const newLabel = await Label.create({
        labelName: objName,
        idSupplier: id,
        createdAt: new Date(),
      });
      if (!newLabel) {
        return { msg: "Nu poti adauga o eticheta noua", status: 500 };
      }
      return newLabel;
      break;
    case "Sticla":
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
          idSupplier: id,
        },
      });
      if (bottle) {
        return {
          msg: "Aceasta sticla este deja inregistrata",
          status: 400,
        };
      }
      const newBottle = await Bottle.create({
        bottleName: objName,
        idSupplier: id,
        createdAt: new Date(),
      });
      if (!newBottle) {
        return res
          .status(500)
          .send({ msg: "Nu poti adauga o sticla noua", status: 500 });
      }
      return newBottle;
      break;
    case "Ingredient":
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
          idSupplier: id,
        },
      });
      if (ingredient) {
        return {
          msg: "Acest ingredient este deja inregistrat",
          status: 400,
        };
      }
      const newIngredient = await Ingredient.create({
        ingredientName: objName,
        idSupplier: id,
        createdAt: new Date(),
      });
      if (!newIngredient) {
        return { msg: "Nu poti adauga un ingredient nou", status: 500 };
      }
      return newIngredient;
      break;
    default:
      return { msg: "Nu ai selectat un obiect", status: 400 };
  }
};

const createSupplierAndObject = async (
  supplierName,
  supplierAddress,
  supplierPhone,
  supplierEmail,
  obj,
  objName
) => {
  const supplier = await Supplier.findOne({
    attributes: [
      "id",
      "supplierName",
      "supplierAddress",
      "supplierPhone",
      "supplierEmail",
      "createdAt",
      "updatedAt",
    ],
    where: {
      supplierName: supplierName,
    },
  });

  if (supplier) {
    console.log(supplier.id);
    try {
      const resp = await objCreation(obj, objName, supplier.id);
      return resp;
    } catch (err) {
      console.log(err);
    }
  } else {
    const newSupplier = await Supplier.create({
      supplierName,
      supplierEmail,
      supplierAddress,
      supplierPhone,
      createdAt: new Date(),
    });

    if (!newSupplier) {
      return { msg: "Nu poti adauga un furnizor nou", status: 500 };
    }
    const object = await objCreation(obj, objName, newSupplier.id);
    return object;
  }
};

const getSupplierById = async (id) => {
  const supplier = await Supplier.findOne({
    attributes: [
      "id",
      "supplierName",
      "supplierAddress",
      "supplierPhone",
      "supplierEmail",
      "createdAt",
      "updatedAt",
    ],
    where: {
      id,
    },
  });
  if (!supplier) {
    return res
      .status(404)
      .send({ msg: "Nu exista acest furnizor", status: 404 });
  }
  return supplier;
};

const getAllObjectsFromSupplier = async (supplierName) => {
  const supplier = await Supplier.findOne({
    attributes: [
      "id",
      "supplierName",
      "supplierAddress",
      "supplierPhone",
      "supplierEmail",
      "createdAt",
      "updatedAt",
    ],
    where: {
      supplierName,
    },
  });
  if (!supplier) {
    return res
      .status(404)
      .send({ msg: "Nu exista acest furnizor", status: 404 });
  }
  const corks = await Cork.findAll({
    attributes: ["id", "corkName", "idSupplier", "createdAt", "updatedAt"],
    where: {
      idSupplier: supplier.id,
    },
  });
  const labels = await Label.findAll({
    attributes: ["id", "labelName", "idSupplier", "createdAt", "updatedAt"],
    where: {
      idSupplier: supplier.id,
    },
  });
  const bottles = await Bottle.findAll({
    attributes: ["id", "bottleName", "idSupplier", "createdAt", "updatedAt"],
    where: {
      idSupplier: supplier.id,
    },
  });
  const ingredients = await Ingredient.findAll({
    attributes: [
      "id",
      "ingredientName",
      "idSupplier",
      "createdAt",
      "updatedAt",
    ],
    where: {
      idSupplier: supplier.id,
    },
  });
  const result = { corks, labels, bottles, ingredients };
  return result;
};

const getAllSupplierAndObjects = async (keyWordSearch) => {
  let suppliers;

  suppliers = await Supplier.findAll({
    attributes: [
      "id",
      "supplierName",
      "supplierAddress",
      "supplierPhone",
      "supplierEmail",
      "createdAt",
      "updatedAt",
    ],
  });
  if (!suppliers) {
    return res
      .status(404)
      .send({ msg: "Nu exista niciun furnizor", status: 404 });
  }
  if (keyWordSearch) {
    console.log("nu pe altfel");
    const result = [];
    for (let i = 0; i < suppliers.length; i++) {
      const corks = await Cork.findAll({
        attributes: ["id", "corkName", "idSupplier", "createdAt", "updatedAt"],
        where: {
          [Op.and]: [
            {
              idSupplier: suppliers[i].id,
            },
            {
              corkName: {
                [Op.like]: `%${keyWordSearch}%`,
              },
            },
          ],
        },
      });
      const labels = await Label.findAll({
        attributes: ["id", "labelName", "idSupplier", "createdAt", "updatedAt"],
        where: {
          [Op.and]: [
            {
              idSupplier: suppliers[i].id,
            },
            {
              labelName: {
                [Op.like]: `%${keyWordSearch}%`,
              },
            },
          ],
        },
      });
      const bottles = await Bottle.findAll({
        attributes: [
          "id",
          "bottleName",
          "idSupplier",
          "createdAt",
          "updatedAt",
        ],
        where: {
          [Op.and]: [
            {
              idSupplier: suppliers[i].id,
            },
            {
              bottleName: {
                [Op.like]: `%${keyWordSearch}%`,
              },
            },
          ],
        },
      });
      const ingredients = await Ingredient.findAll({
        attributes: [
          "id",
          "ingredientName",
          "idSupplier",
          "createdAt",
          "updatedAt",
        ],
        where: {
          [Op.and]: [
            {
              idSupplier: suppliers[i].id,
            },
            {
              ingredientName: {
                [Op.like]: `%${keyWordSearch}%`,
              },
            },
          ],
        },
      });

      for (let j = 0; j < corks.length; j++) result.push(corks[j]);
      for (let j = 0; j < labels.length; j++) result.push(labels[j]);
      for (let j = 0; j < bottles.length; j++) {
        result.push(bottles[j]);
      }
      for (let j = 0; j < ingredients.length; j++) result.push(ingredients[j]);
    }
    return result;
  } else {
    const result = [];
    for (let i = 0; i < suppliers.length; i++) {
      const corks = await Cork.findAll({
        attributes: ["id", "corkName", "idSupplier", "createdAt", "updatedAt"],
        where: {
          idSupplier: suppliers[i].id,
        },
      });
      const labels = await Label.findAll({
        attributes: ["id", "labelName", "idSupplier", "createdAt", "updatedAt"],
        where: {
          idSupplier: suppliers[i].id,
        },
      });
      const bottles = await Bottle.findAll({
        attributes: [
          "id",
          "bottleName",
          "idSupplier",
          "createdAt",
          "updatedAt",
        ],
        where: {
          idSupplier: suppliers[i].id,
        },
      });
      const ingredients = await Ingredient.findAll({
        attributes: [
          "id",
          "ingredientName",
          "idSupplier",
          "createdAt",
          "updatedAt",
        ],
        where: {
          idSupplier: suppliers[i].id,
        },
      });

      //adauga toate array-urile de obiecte intr-un singur array
      for (let j = 0; j < corks.length; j++) result.push(corks[j]);
      for (let j = 0; j < labels.length; j++) result.push(labels[j]);
      for (let j = 0; j < bottles.length; j++) {
        result.push(bottles[j]);
      }
      for (let j = 0; j < ingredients.length; j++) result.push(ingredients[j]);
    }
    return result;
  }
};

const deleteObject = async (idObj, objType) => {
  switch (objType) {
    case "Cork":
      const cork = await Cork.findOne({
        attributes: ["id", "corkName", "idSupplier", "createdAt", "updatedAt"],
        where: {
          id: idObj,
        },
      });
      if (!cork) {
        return res
          .status(404)
          .send({ msg: "Nu exista acest dop", status: 404 });
      }
      await cork.destroy();
      break;
    case "Label":
      const label = await Label.findOne({
        attributes: ["id", "labelName", "idSupplier", "createdAt", "updatedAt"],
        where: {
          id: idObj,
        },
      });
      if (!label) {
        return res
          .status(404)
          .send({ msg: "Nu exista acesta eticheta", status: 404 });
      }
      await label.destroy();
      break;
    case "Bottle":
      const bottle = await Bottle.findOne({
        attributes: [
          "id",
          "bottleName",
          "idSupplier",
          "createdAt",
          "updatedAt",
        ],
        where: {
          id: idObj,
        },
      });
      if (!bottle) {
        return res
          .status(404)
          .send({ msg: "Nu exista aceasta sticla", status: 404 });
      }
      await bottle.destroy();
      break;
    case "Ingredient":
      const ingredient = await Ingredient.findOne({
        attributes: [
          "id",
          "ingredientName",
          "idSupplier",
          "createdAt",
          "updatedAt",
        ],
        where: {
          id: idObj,
        },
      });
      if (!ingredient) {
        return res
          .status(404)
          .send({ msg: "Nu exista acest ingredient", status: 404 });
      }
      await ingredient.destroy();
      break;
    default:
      return res
        .status(404)
        .send({ msg: "Nu exista acest obiect", status: 404 });
  }
  return res
    .status(200)
    .send({ msg: "Obiectul a fost sters cu succes", status: 200 });
};

module.exports = {
  createSupplierAndObject,
  getSupplierById,
  getAllObjectsFromSupplier,
  deleteObject,
  getAllSupplierAndObjects,
};
