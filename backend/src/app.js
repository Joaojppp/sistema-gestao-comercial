const express = require ('express');
const cors = require('cors');

const clientesRoutes = require('./routes/clientes');
const produtosRoutes = require('./routes/produtos');
const vendasRoutes = require('./routes/vendas');
const dashboardRouter = require("./routes/dashboard");

const app = express();

app.use(cors()); 
app.use(express.json());

app.use("/clientes", clientesRoutes);
app.use("/produtos", produtosRoutes);
app.use("/vendas", vendasRoutes);
app.use("/dashboard", dashboardRouter);

app.get('/', (req, res) => {
    res.json({
        mensagem:'API Sistema Gestão funcionando!'
    });
}); 

module.exports = app;