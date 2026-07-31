const pool = require("../config/db");

async function carregarDashboard(req, res) {

    try {

        const [[clientes]] = await pool.query(
            "SELECT COUNT(*) AS total FROM clientes"
        );

        const [[produtos]] = await pool.query(
            "SELECT COUNT(*) AS total FROM produtos"
        );

        const [[vendas]] = await pool.query(
            "SELECT COUNT(*) AS total FROM vendas"
        );

        const [[faturamento]] = await pool.query(
            "SELECT IFNULL(SUM(valor_total),0) AS total FROM vendas"
        );

        const [[estoqueBaixo]] = await pool.query(
            "SELECT COUNT(*) AS total FROM produtos WHERE estoque <= 5"
        );

        res.json({

            clientes: clientes.total,

            produtos: produtos.total,

            vendas: vendas.total,

            faturamento: faturamento.total,

            estoqueBaixo: estoqueBaixo.total
        
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            erro: "Erro ao carregar dashboard"

        });

    }

}

async function graficoVendas(req, res) {

    try {

        const [dados] = await pool.query(`

            SELECT 
                MONTH(data_venda) AS mes,
                COUNT(*) AS total
            FROM vendas
            GROUP BY MONTH(data_venda)
            ORDER BY MONTH(data_venda)

            `)
            
            res.json(dados);

        } catch (error) {

            console.error(error);

            res.status(500).json({

                erro: "Erro ao carregar gráfico"

            });

        }
    }

async function listarEstoqueBaixo(req, res) {

    try {

        const [produtos] = await pool.query(

            `SELECT
                id,
                nome,
                estoque
            FROM produtos
            WHERE estoque <= 5
            ORDER BY estoque ASC`

        );

        res.json(produtos);

    } catch (error) {

        console.error(error);

        res.status(500).json({

            erro: "Erro ao carregar produtos."

        });

    }

}

async function produtosMaisVendidos(req, res) {

    try {

        const [produtos] = await pool.query(`

            SELECT 
                produtos.nome,
                SUM(itens_venda.quantidade) AS total_vendido

            FROM itens_venda

            INNER JOIN produtos
                On produtos.id = itens_venda.produto_id

            GROUP BY produtos.id

            ORDER BY total_vendido DESC

            LIMIT 5

        `);

        res.json(produtos);

    } catch (error) {

        console.error(error);

        res.status(500).json({

            erro: "Erro ao carregar produtos mais vendidos."

        });

    }

}

module.exports = {

    carregarDashboard,
    graficoVendas,
    listarEstoqueBaixo,
    produtosMaisVendidos

};
