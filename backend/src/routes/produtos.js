const express = require("express");

const router = express.Router();

const produtosController = require("../controllers/produtosController");

router.get("/", produtosController.listarProdutos);
router.post("/", produtosController.criarProduto);
router.put("/:id", produtosController.editarProduto);
router.delete("/:id", produtosController.excluirProduto);

module.exports = router;