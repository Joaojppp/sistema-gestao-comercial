const express = require("express");

const router = express.Router();

const vendasController = require("../controllers/vendasController");

router.get("/", vendasController.listarVendas);

router.get("/:id", vendasController.buscarVenda);

router.post("/", vendasController.criarVenda);

router.delete("/:id", vendasController.excluirVenda);

module.exports = router;