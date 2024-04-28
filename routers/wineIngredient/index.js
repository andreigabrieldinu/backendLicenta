const express = require("express");
const {
  addGrape,
  paginationGrapeByName,
  paginationGrape,
  deleteGrape,
} = require("../../services/grapes");
const { WineIngredient, Ingredient } = require("../../models");
const { Wine } = require("../../models");
const { Op } = require("sequelize");

const wineIgredientRouter = express.Router();

wineIgredientRouter.post("/", async (req, res) => {
  const { ingredientName, wineName, administratedQuantity } = req.body;

  const ingredient = await Ingredient.findOne({
    where: {
      ingredientName: ingredientName,
    },
  });

  const wine = await Wine.findOne({
    where: {
      wineName,
    },
  });

  if (!ingredient) {
    return res.status(404).send({ msg: "Ingredientul nu exista", status: 404 });
  }
  if (!wine) {
    return res.status(404).send({ msg: "Vinul nu exista", status: 404 });
  }

  if (wine.wineStatus === "must") {
    if (
      ingredient.ingredientName === "Acid metatartric" ||
      ingredient.ingredientName === "Sorbat de potasiu" ||
      ingredient.ingredientName === "Guma Arabica"
    ) {
      return res.status(404).send({
        msg: "Nu se poate adauga acest ingredient in faza de must",
        status: 404,
      });
    }
  }

  if (wine.wineStatus !== "must") {
    if (
      ingredient.ingredientName === "Enzime" ||
      ingredient.ingredientName === "Sulf18" ||
      ingredient.ingredientName === "Drojdie"
    ) {
      return res.status(404).send({
        msg: "Nu se poate adauga acest ingredient intr-o alta faza decat cea de must",
        status: 404,
      });
    }
  }

  const wineIngredient = await WineIngredient.findOne({
    where: {
      idIngredient: ingredient.id,
      wineName,
    },
  });

  if (wineIngredient) {
    return res.status(404).send({
      msg: "Ingredientul exista deja pe vin",
      status: 404,
    });
  }

  const newWineIngredient = await WineIngredient.create({
    idIngredient: ingredient.id,
    wineName,
    administratedQuantity,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return res.status(201).send({
    msg: "Ingredientul a fost adaugat cu succes pe vin",
    status: 201,
    newWineIngredient,
  });
});

wineIgredientRouter.get("/", async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) - 1 || 0;
    const size = Number.parseInt(req.query.size) || 6;

    let keyWordSearch = "";
    if (req.query.search) {
      keyWordSearch = req.query.search.toString().toLocaleLowerCase();
    }
    let wineIngredients;
    let ingredients;
    let response;
    if (keyWordSearch !== "") {
      wineIngredients = await WineIngredient.findAll({
        where: {
          wineName: {
            [Op.like]: `%${keyWordSearch}%`,
          },
        },
      });
      let ingredients = await Ingredient.findAll();
      const total = await WineIngredient.count({
        where: {
          wineName: {
            [Op.like]: `%${keyWordSearch}%`,
          },
        },
      });
      for (let i = 0; i < wineIngredients.length; i++) {
        for (let j = 0; j < ingredients.length; j++) {
          if (wineIngredients[i].idIngredient === ingredients[j].id) {
            wineIngredients[i].dataValues.ingredientName =
              ingredients[j].ingredientName;
          }
        }
      }

      response = {
        wineIngredients,
        total,
        page: page,
        size,
      };
      return res.status(200).send(response);
    } else {
      wineIngredients = await WineIngredient.findAll({
        limit: size,
        offset: page * size,
      });
      ingredients = await Ingredient.findAll();
      for (let i = 0; i < wineIngredients.length; i++) {
        for (let j = 0; j < ingredients.length; j++) {
          if (wineIngredients[i].idIngredient === ingredients[j].id) {
            wineIngredients[i].dataValues.ingredientName =
              ingredients[j].ingredientName;
          }
        }
      }

      const total = await WineIngredient.count();

      response = {
        wineIngredients,
        total: total,
        page: page + 1,
        size,
      };
      return res.status(200).send(response);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Ceva a mers gresit", status: 500 });
  }
});

wineIgredientRouter.delete("/:idIngredient/:wineName", async (req, res) => {
  const { idIngredient, wineName } = req.params;
  const wineIngredient = await WineIngredient.findOne({
    where: {
      idIngredient,
      wineName,
    },
  });
  if (!wineIngredient) {
    return res.status(404).send({ msg: "Ingredientul nu exista", status: 404 });
  }
  const wineIngredientDeleted = await WineIngredient.destroy({
    where: {
      idIngredient,
      wineName,
    },
  });
  return res.status(200).send({
    msg: "Ingredientul a fost sters cu succes",
    status: 200,
  });
});

module.exports = wineIgredientRouter;
