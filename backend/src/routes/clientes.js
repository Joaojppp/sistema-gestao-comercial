const express = require("express");

const router = express.Router();

const clientesController = require('../controllers/clientesController');

router.get("/", clientesController.listarClientes);

router.post("/", clientesController.criarCliente);

router.put("/:id", clientesController.editarCliente);

router.delete("/:id", clientesController.excluirCliente);

module.exports = router;