const pool = require("../config/db");

async function listarVendas(req, res) {

    try {

        const [vendas] = await pool.query(`
            SELECT 
                vendas.id,
                clientes.nome AS cliente,
                vendas.data_venda,
                vendas.valor_total
            FROM vendas 
            INNER JOIN clientes
                ON vendas.cliente_id = clientes.id
            ORDER BY vendas.id DESC 
        `);

        res.json(vendas);

        } catch (error) {

            console.error(error);

            res.status(500).json({
                erro: "Erro ao listar vendas"
            });

        }
}

async function criarVenda(req, res) {

    const connection = await pool.getConnection();

    try{

        const { cliente_id, itens } = req.body;

        await connection.beginTransaction();

        let valorTotal = 0;

        for (const item  of itens) {

            const [produto] = await connection.query(
                "SELECT preco, estoque FROM produtos WHERE id = ?",
                [item.produto_id]
            );

            if (produto.length === 0) {

                throw new Error("Prouto não encontrado.");

            }

            if (produto[0].estoque < item.quantidade) {

                throw new Error("Estoque insuficiente.");

            }

            valorTotal +=
                Number(produto[0].preco) *
                Number(item.quantidade);

        }

        const [venda] = await connection.query(

            "INSERT INTO vendas (cliente_id, valor_total) VALUES (?, ?)",

            [cliente_id, valorTotal]

        );

        const vendaId = venda.insertId;

        for (const item of itens) {

            const [produto] = await connection.query(

                "SELECT preco FROM produtos WHERE id = ?",

                [item.produto_id]
            );

            await connection.query(

                `INSERT INTO itens_venda
                (venda_id, produto_id, quantidade, preco_unitario)
                VALUES (?, ?, ?, ?)`,

                [
                    vendaId,
                    item.produto_id,
                    item.quantidade,
                    produto[0].preco
                ]

            );

            await connection.query(

                `UPDATE produtos
                SET estoque = estoque - ?
                WHERE id =?`,

                [
                    item.quantidade,
                    item.produto_id
                ]
            );

        }

        await connection.commit();

        res.status(201).json({

            mensagem:"Venda cadastrada com sucesso."

        });

    } catch (error) {

        await connection.rollback();

        console.error(error);

        res.status(500).json({

            erro: error.message 

        });
    
    } finally {

        connection.release();
    }

}

async function buscarVenda(req, res) {

    const { id } = req.params;

    try { 

        const [venda] = await pool.query(

            `SELECT
                vendas.id,
                clientes.nome AS cliente,
                vendas.data_venda,
                vendas.valor_total
            FROM vendas
            INNER JOIN clientes
                ON clientes.id = vendas.cliente_id
            WHERE vendas.id = ?`,

            [id]

        );
        
        const [produtos] = await pool.query(

            `SELECT
                produtos.nome,
                itens_venda.quantidade,
                itens_venda.preco_unitario
            FROM itens_venda
            INNER JOIN produtos
                ON produtos.id = itens_venda.produto_id
            WHERE itens_venda.venda_id = ?`,

            [id]

        );

        res.json({

            venda: venda[0],

            produtos

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            erro: "Erro ao buscar venda."

        });

    }

}

async function excluirVenda(req, res) {

    const connection = await pool.getConnection();

    try {

        const { id } = req.params;

        await connection.beginTransaction();

        const [itens] = await connection.query(

            `SELECT 
                    produto_id,
                    quantidade
            FROM itens_venda
            WHERE venda_id = ?`,

            [id]

        );

        for (const item of itens) {

            await connection.query(

                `UPDATE produtos
                SET estoque = estoque + ?
                WHERE id = ?`,
            [
                item.quantidade,
                item.produto_id
            ]

        );

    }

await connection.query(

     `DELETE FROM itens_venda WHERE venda_id = ?`,

    [id]

);

await connection.query(

    "DELETE FROM vendas WHERE id = ?",

    [id]

);

await connection.commit();

res.json({

    mensagem: "Venda excluída  com sucesso."

});

    
} catch (error) {

    await connection.rollback();

    console.error(error);

    res.status(500).json({

        erro: "Erro ao excluir venda."

    });

} finally {

    connection.release();

}

}

module.exports = {
    listarVendas,
    criarVenda,
    buscarVenda,
    excluirVenda
}