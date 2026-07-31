const express = require("express");

const router = express.Router();

const dashboardController = require("../controllers/dashboardController");

console.log(dashboardController);

router.get("/", dashboardController.carregarDashboard);

router.get("/grafico", dashboardController.graficoVendas);

router.get("/estoque-baixo", async (req, res) => {

    return dashboardController.listarEstoqueBaixo(req, res);

});

router.get("/mais-vendidos", dashboardController.produtosMaisVendidos)

module.exports = router;

