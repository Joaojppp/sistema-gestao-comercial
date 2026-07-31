import { useState,useEffect } from "react";
import axios from "axios";

import Layout from "../../components/Layout/Layout";
import "../../styles/produtos.css";

function Produtos() {

    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [preco, setPreco] = useState("");
    const [estoque, setEstoque] = useState("");

    const [produtoEditando, setProdutoEditando] = useState(null);
    const [pesquisa, setPesquisa] = useState("");

    const [produtos, setProdutos] = useState([]);

    useEffect(() => {

        carregarProdutos();

    }, [pesquisa]);

    async function carregarProdutos() {

        try {

            const resposta = await axios.get(

                `http://localhost:3001/produtos?nome=${pesquisa}`

            );

            setProdutos(resposta.data);
            
        } catch (error) {

            console.error(error);

        }
    }

    async function salvarProduto() {

    if (!nome || !descricao || !preco || !estoque) {
        alert("Preencha todos os campos!");
        return;
    }

        if (produtoEditando) {

            try{

        await axios.put(
            `http://localhost:3001/produtos/${produtoEditando.id}`,
            {
                nome,
                descricao,
                preco,
                estoque
            }
        );

        await carregarProdutos();

        setProdutoEditando(null);

        setNome("");
        setDescricao("");
        setPreco("");
        setEstoque("");

        setMostrarFormulario(false);

        return;

    } catch (error) {

        console.error(error);

        toast.error("Erro ao editar produto.");

        return;

        }
     }
    
    try{

        await axios.post("http://localhost:3001/produtos", {
            nome,
            preco,
            descricao,
            estoque
        });

        await carregarProdutos();

        setNome("");
        setPreco("");
        setDescricao("");
        setEstoque("");

        setMostrarFormulario(false);

    } catch (error) {

        console.error(error);

        toast.error("Erro ao cadastrar produto.");
    }
    
    }

    async function excluirProduto(id) {

        if (!window.confirm("Deseja realmente excluir este produto?")) {
            return;
        }

        try {

            await axios.delete(
             `http://localhost:3001/produtos/${id}`
            );

            await carregarProdutos();

        } catch (error) {

            console.error(error);

            toast.error("Erro ao excluir produto.");

        }

    }
    
    function editarProduto(produto){

        setNome(produto.nome);

        setDescricao(produto.descricao);

        setPreco(produto.preco);

        setEstoque(produto.estoque);

        setProdutoEditando(produto);

        setMostrarFormulario(true);

    }

    return (

        <Layout>

            <label>Pesquisar produto: </label>

            <input
                type="text"
                placeholder="Digite o nome"
                value={pesquisa}
                onChange={(e) => setPesquisa(e.target.value)}
            />

            <div className="produtos-container">

                <h2>Produtos</h2>

                <button
                    className="btn-novo"
                    onClick={() => {

                        setProdutoEditando(null);

                        setNome("");
                        setDescricao("");
                        setPreco("");
                        setEstoque("");

                        setMostrarFormulario(true);

                    }}
                >
                    + Novo Produto
                </button>

                {mostrarFormulario && (

                    <div className="formulario-produto">

                        <h3>{produtoEditando ? "Editar Produto" : "Cadastrar Produto"}</h3>

                        <input
                            type="text"
                            placeholder="Nome"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                        />

                        <input
                            type="text"
                            placeholder="Descrição"
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                        />

                        <input
                            type="number"
                            placeholder="Preço"
                            value={preco}
                            onChange={(e) => setPreco(e.target.value)}
                        />

                        <input
                            type="number"
                            placeholder="Estoque"
                            value={estoque}
                            onChange={(e) => setEstoque(e.target.value)}
                        />

                        <button onClick={salvarProduto}>
                            {produtoEditando ? "Atualizar Produto" : "Salvar Produto"}
                        </button>

                    </div>

                )}

                <table className="tabela-produtos">

                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Descrição</th>
                            <th>Preço</th>
                            <th>Estoque</th>
                            <th>Ações   </th>
                        </tr>
                    </thead>

                    <tbody>

                        {produtos.map((produto) => (

                            <tr key={produto.id}>

                                <td>{produto.nome}</td>

                                <td>{produto.descricao}</td>

                                <td>{Number(produto.preco).toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL"
                                })}
                                </td>

                                <td>{produto.estoque}</td>

                                <td>
                                    
                                    <button
                                    onClick={() => editarProduto(produto)}
                                    >
                                        Editar                                        
                                    </button>


                                    <button 
                                        onClick={() => excluirProduto(produto.id)}
                                    >
                                        Excluir

                                    </button>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </Layout>

    );

}

export default Produtos;