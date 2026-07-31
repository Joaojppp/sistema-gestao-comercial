const pool = require("../config/db");

async function listarProdutos(req, res) {

    try {

        const { nome } = req.query;

        let sql = "SELECT * FROM produtos";

        let parametros = []

        if (nome) {

            sql += " WHERE nome LIKE ?";

            parametros.push(`%${nome}%`);
        }

        const [produtos] = await pool.query(

            sql,

            parametros

        );

        res.json(produtos);

    } catch (error) {

        console.error(error);

        res.status(500).json({

            erro: "Erro ao buscar produtos."
        });

    }

}

async function criarProduto(req, res) {

    try {

        const { nome, descricao, preco, estoque } = req.body;

        const [resultado] = await pool.query(
        "INSERT INTO produtos (nome, descricao, preco, estoque) VALUES (?, ? ,?, ?)",
        [nome, descricao, preco, estoque]

    );

    res.json({
        id: resultado.insertId,
        nome,
        descricao,
        preco,
        estoque
    });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            erro: "Erro ao cadastrar produto."
        });

    }

}

async function editarProduto(req, res) {

        try{

            const { id } = req.params;

            const { nome, descricao, preco, estoque } = req.body;

            await pool.query(
                "UPDATE produtos SET nome = ?, descricao = ?, preco = ?, estoque = ? WHERE id = ?",
                [nome, descricao, preco, estoque, id]
            );

            res.json({
                mensagem: "Produto atualizado com sucesso."
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                erro: "Erro ao atualizar produto."
            });

        }
    
    }

    async function excluirProduto(req, res) {

    try {

        const { id } = req.params;

        await pool.query(
            "DELETE FROM produtos WHERE id = ?",
            [id]
        );

        res.json({
            mensagem: "Produto excluído com sucesso."
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            erro: "Erro ao excluir produto."
        });

    }

}

module.exports = {
    listarProdutos,
    criarProduto,
    editarProduto,
    excluirProduto
}