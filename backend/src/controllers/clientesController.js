const pool = require("../config/db");

async function listarClientes(req, res){

    try {

        const { nome } = req.query;

        let sql = "SELECT * FROM clientes";

        let parametros = [];

        if (nome) {

            sql += " WHERE nome LIKE ?";

            parametros.push(`%${nome}%`)

        }

        const [clientes] = await pool.query(

            sql,
            parametros

        );

        res.json(clientes);

    } catch (error) {

        console.error(error);

        res.status(500).json({

            erro: "Erro ao buscar clientes."

        });

    }

}

async function criarCliente(req, res) {

    try {
    
        const { nome, email, telefone } = req.body;

        const [resultado] = await pool.query(
            "INSERT INTO clientes (nome, email, telefone) VALUES (?, ?, ?)",
            [nome, email, telefone]
        );

        res.json ({
            id: resultado.insertId,
            nome,
            email,
            telefone
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            erro: "Erro ao criar cliente."
        });
    }
}

async function excluirCliente(req, res) {

        try {

            const{ id } = req.params;

            await pool.query(
                "DELETE FROM clientes WHERE id = ?",
                [id]
            );

            res.json({
                mensagem: "Cliente excluído com sucesso."
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                erro: "Erro ao excluir cliente."
            });
        }

}

async function editarCliente(req, res) {

    try {
        
        const { id } = req.params;
        const { nome, email, telefone } = req.body;

        await pool.query(
            "UPDATE clientes SET nome = ?, email = ?, telefone = ? WHERE id = ?",
            [nome, email, telefone, id]
        );

        res.json({
            mensagem: "Cliente atualizado com sucesso."
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            erro: "Erro ao atualizar cliente."
        });
    
    }
}

module.exports = {
    listarClientes,
    criarCliente,
    excluirCliente,
    editarCliente
}