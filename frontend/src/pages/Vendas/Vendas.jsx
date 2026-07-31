import { useEffect, useState } from "react";
import axios from "axios"

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"

import Layout from "../../components/Layout/Layout";
import "../../styles/vendas.css";

function Vendas() {

    const [clientes, setClientes] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [vendas, setVendas] = useState([]);

    const [clienteSelecionado, setClienteSelecionado] = useState("");
    const [vendaSelecionada, setVendaSelecionada] = useState(null);
    const [mostrarDetalhes, setMostrarDetalhes] = useState(false);
    const [pesquisaVenda, setPesquisaVenda] = useState("");
    const [itensVenda, setItensVenda] = useState([
    

        {
            produto_id: "",
            quantidade: 1
        }
    ]);

    useEffect(() => {

        carregarClientes();
        carregarProdutos();
        carregarVendas();

    }, []);

    async function carregarClientes() {

        try {

            const resposta = await axios.get(
                "http://localhost:3001/clientes"
            );

            setClientes(resposta.data);

        } catch (error) {

            console.error(error);

        }

    }

    async function carregarProdutos() {

        try {

            const resposta = await axios.get(
                "http://localhost:3001/produtos"
            );

            setProdutos(resposta.data);

        } catch (error) {

            console.error(error);

        }
    
    }

    async function carregarVendas () {

        try {

            const resposta = await axios.get(
                "http://localhost:3001/vendas"

            );

            setVendas(resposta.data);

        } catch (error) {

            console.error (error);

        }

    }

    async function visualizarVenda(id) {

        try {

            const resposta = await axios.get(
                `http://localhost:3001/vendas/${id}`
            );

            console.log(resposta.data);

            setVendaSelecionada(resposta.data);

            setMostrarDetalhes(true);

        } catch (error) {

            console.error(error);

            toast.error("Erro ao carregar venda.");

        }

    }

    function gerarPDF() {

        const doc = new jsPDF();

        doc.setFontSize(18);

        doc.text("Sistema Gestão Comercial", 14, 18);

        doc.setFontSize(12);

        doc.text(
            `Venda #${vendaSelecionada.venda.id}`,
            14,
            30

        );

        doc.text(
            `Data: ${new Date( 
                vendaSelecionada.venda.data_venda
            ).toLocaleDateString("pt-BR")}`,
            14,
            46
        );

        autoTable(doc, {

    startY: 55,

    head: [[
        "Produto",
        "Quantidade",
        "Preço"
    ]],

    body: vendaSelecionada.produtos.map((produto) => [

        produto.nome,

        produto.quantidade,

        `R$ ${Number(produto.preco_unitario).toFixed(2)}`

    ])

});

console.log(doc.lastAutoTable);

const finalY = doc.lastAutoTable?.finalY || 70;

doc.text(

    `Total: R$ ${Number(
        vendaSelecionada.venda.valor_total
    ).toFixed(2)}`,

    14,

    finalY + 15

);

doc.save(`Venda-${vendaSelecionada.venda.id}.pdf`);

    }

    async function excluirVenda(id) {

        const confirmar = window.confirm(
            "Deseja realmente excluir esta venda?"
        );

        if (!confirmar) {

            return;

        }

        try {

            await axios.delete(
                `http://localhost:3001/vendas/${id}`
            );

            await carregarVendas();

            await carregarProdutos();

            toast.success("Venda excluída com sucesso!");

        } catch (error) {

            console.error(error);

            toast.error("Erro ao excluir venda.");

        }

    }

    function alterarItem(indice, campo, valor) {

        const novosItens = [...itensVenda];

        novosItens[indice][campo] = valor;

        setItensVenda(novosItens);

    }

    function adicionarItem() {

        setItensVenda([
            ...itensVenda,
        {
            produto_id: "",
            quantidade: 1
        }
    ]);
}

    function removerItem(indice) {

        if (itensVenda.length === 1) {

            return;

        }

        const novosItens = itensVenda.filter((_, i) => i !== indice);

        setItensVenda(novosItens);

    }

    function calcularTotal() {

        let total = 0;

        itensVenda.forEach((item) => {

            const produto = produtos.find(
                (p) => p.id == item.produto_id
            );

            if(produto) {

                total += Number(produto.preco) * Number(item.quantidade);

            }

        });

        return total;

    }

    async function salvarVenda() {

        if(!clienteSelecionado) {

            alert("Selecionando um cliente.");

            return;

        }

        if (itensVenda.length === 0) {

            alert("Adicionando pelo menos um produto.");

            return;

        }

        try {   

            await axios.post(

                "http://localhost:3001/vendas",

                {

                    cliente_id: clienteSelecionado,

                    itens: itensVenda

                }

            );

            await carregarProdutos();

            await carregarVendas();

            await carregarClientes();

            toat.success("Venda cadastrada com sucesso!");

            setClienteSelecionado("");

            setItensVenda([
                {
                    produto_id: "",
                    quantidade: 1
                }

            ]);

        } catch (error) {

            console.error(error);

            toast.error("Erro ao cadastrar venda.");

        }

    }

    return (

    <Layout>

             <div className="vendas-container">

                 <h2>Nova Venda</h2>

                  <div className="formulario-venda">

                    <label>Cliente</label>

                    <select
                        value={clienteSelecionado}
                        onChange={(e) => setClienteSelecionado(e.target.value)}
                    >

                        <option value="">
                            Selecionar um cliente
                        </option>

                        {clientes.map((cliente) => (

                            <option
                                key={cliente.id}
                                value={cliente.id}
                            >
                                {cliente.nome}
                            </option>

                        ))}

                    </select>

                    <table className="tabela-vendas">

                        <thead>

                            <tr>

                                <th>Produto</th>

                                <th>Quantidade</th>

                                <th>Ações</th>

                            </tr>

                        </thead>

                            <tbody>

                            {itensVenda.map((item, indice) => (

                             <tr key={indice}>

                             <td>

                            <select
                                    value={item.produto_id}
                                     onChange={(e) =>
                                     alterarItem(
                                    indice,
                                     "produto_id",
                                e.target.value
                            )
                        }
                    >

                        <option value="">
                            Selecione um produto
                        </option>

                        {produtos.map((produto) => (

                            <option
                                key={produto.id}
                            value={produto.id}
                        >
                            {produto.nome}
                        </option>

                    ))}

                </select>

            </td>

            <td>

                <input
                    type="number"
                    min="1"
                    value={item.quantidade}
                    onChange={(e) =>
                        alterarItem(
                            indice,
                            "quantidade",
                            e.target.value
                        )
                    }
                />

                             </td>

                             <td>

                                <button
                                 onClick={() => removerItem(indice  )}
                                >

                                Remover

                                </button>

                            </td>

                         </tr>

                         ))}

                    </tbody>

                    </table>

                    <button onClick={adicionarItem}>

                        + Adicionar Produto

                    </button>

                    <h3>
                       
                        Total: R$ {calcularTotal().toFixed(2)}
                        
                    </h3>

                    <button onClick={salvarVenda}>

                        Salvar Venda

                    </button>

                    <h2>Histórico de Vendas</h2>

                     <input
                        type="text"
                        placeholder="Pesquisar por cliente..."
                        value={pesquisaVenda}
                        onChange={(e) => setPesquisaVenda(e.target.value)}
                    />

            <table className="tabela-vendas">

        <thead>

        <tr>

            <th>ID</th>
            <th>Cliente</th>
            <th>Data</th>
            <th>Total</th>
            <th>Ações</th>

        </tr>

    </thead>

    <tbody>

        {vendas
            .filter((venda) =>
                venda.cliente
                    .toLowerCase()
                    .includes(pesquisaVenda.toLowerCase())
                )
                .map((venda) => (

            <tr key={venda.id}>

                <td>{venda.id}</td>

                <td>{venda.cliente}</td>

                <td>

                    {new Date(venda.data_venda).toLocaleDateString("pt-BR")}

                </td>

                <td>

                    R$ {Number(venda.valor_total).toFixed(2)}

                </td>

                <td>

                <button
                    onClick={() => visualizarVenda(venda.id)}
                >

                    Ver
                </button>

                <button 
                    onClick={() => excluirVenda(venda.id)}
                    style={{
                        marginLeft: "10px",
                        background: "#d32f2f",
                        color: "#fff"
                    }}
                >
                    Excluir
                </button>

                </td>

            </tr>

        ))}

    </tbody>

        </table>

             </div> {/* formulario-venda */}


        </div> {/* vendas-container */}

        {mostrarDetalhes && vendaSelecionada && (

            <div className="modal">

                <div className="modal-conteudo">

                    <h2>
                        Venda #{vendaSelecionada.venda.id}

                    </h2>

                    <p>

                        <strong>Cliente</strong>{" "}
                        {vendaSelecionada.venda.cliente}

                    </p>

                    <p>

                        <strong>Data:</strong>{" "}
                        {new Date(
                            vendaSelecionada.venda.data_venda
                        ).toLocaleDateString("pt-BR")}

                    </p>

                    <h3>Produtos</h3>

                    <table className="tabela-vendas">

                        <thead>

                            <tr>

                                <th>Produto</th>

                                <th>Quantidade</th>

                                <th>Preço Unitário</th>

                                <th>Subtotal</th>

                            </tr>

                        </thead>

                        <tbody>

                            {vendaSelecionada.produtos.map((produto, index) => (

                                <tr key={index}>

                                    <td>{produto.nome}</td>

                                    <td>{produto.quantidade}</td>

                                    <td>

                                        R$ {Number(produto.preco_unitario).toFixed(2)}

                                    </td>

                                    <td>

                                        R$ {(Number(produto.preco_unitario) * Number(produto.quantidade)).toFixed(2)}

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                    <h3>

                        Total: R${" "} 

                        {Number(
                            vendaSelecionada.venda.valor_total
                        ).toFixed(2)}

                    </h3>

                    <button onClick={gerarPDF}>

                        Gerar PDF

                    </button>

                    <button

                        onClick={() => {

                            setMostrarDetalhes(false);

                            setVendaSelecionada(null);

                        }}

                    >

                        Fechar

                    </button>

                </div>

            </div>

        )}

        </Layout>

   
    );
}

export default Vendas;