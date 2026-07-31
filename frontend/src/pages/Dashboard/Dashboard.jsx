import axios from "axios";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import "../../styles/dashboard.css";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

import {
    FaUsers,
    FaBoxOpen,
    FaShoppingCart,
    FaDollarSign,
    FaExclamationTriangle
} from "react-icons/fa";

import { Bar } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);


function Dashboard() {

    const [dados, setDados] = useState({
        clientes: 0,
        produtos: 0,
        vendas: 0,
        faturamento: 0,
        estoqueBaixo: 0,
    });

    const [estoqueBaixo, setEstoqueBaixo] = useState([]);

    const [maisVendidos, setMaisVendidos] = useState([]);

    const [grafico, setGrafico] = useState([]);

    useEffect(() => {

        carregarDashboard();
        carregarGrafico();
        carregarEstoqueBaixo();
        carregarMaisVendidos();

    }, []);

    async function carregarDashboard() {

        try {

            const resposta = await axios.get(
                `${API_URL}/dashboard`
            );

            setDados(resposta.data);

        } catch (error) {

            console.error(error);

        }

    }

    async function carregarGrafico() {

        try {

            const resposta = await axios.get(
                `${API_URL}/dashboard/grafico`
            );

            setGrafico(resposta.data);

        } catch (error) {

            console.error(error);

        }

    }

    async function carregarEstoqueBaixo() {

        try {

            const resposta = await axios.get(

                `${API_URL}/dashboard/estoque-baixo`
            
            );

            setEstoqueBaixo(resposta.data);

        } catch (error) {

            console.error(error);
        }

    }

    async function carregarMaisVendidos() {

        try {

            const resposta = await axios.get(

                `${API_URL}/dashboard/mais-vendidos`

            );

            setMaisVendidos(resposta.data);

        } catch (error) {

            console.error(error);

        }

    }

    const dadosGrafico = {

    labels: grafico.map(item => `Mês ${item.mes}`),

    datasets: [

        {

            label: "Vendas",

            data: grafico.map(item => item.total)

        }

    ]

};

    return (

    <Layout>

        <div className="dashboard">

            <h1>Dashboard</h1>

            <div className="card-dashboard">

                <div
                    className="icone-card"
                    style={{ background: "#2563eb" }}
                >
                    <FaUsers />
                </div>

                <h3>Clientes</h3>

                <h2>{dados.clientes}</h2>

                
             </div>

             <div className="card-dashboard">
                    
                <div
                    className="icone-card"
                    style={{ background: "#7c3aed"}}
                >
                    <FaBoxOpen />
                </div>

                <h3>Produtos</h3>

                <h2>{dados.produtos}</h2>
                
             </div>

             <div className="card-dashboard">

                <div 
                    className="icone-card"
                    style={{ background: "#16e34a" }}
                >
                    <FaShoppingCart />
                </div>

                <h3>Vendas</h3>

                <h2>{dados.vendas}</h2>

            </div>

            <div className="card-dashboard">

                <div 
                    className="icone-card"
                    style= {{ background: "#f59e0b" }}
                >
                    <FaDollarSign />
                </div>

                <h3>Faturamentos</h3>

                <h2>

                    R$ {Number(dados.faturamento).toFixed(2)}
                    
                </h2>

            </div>

            <div className="card-dashboard">

                <div
                    className="icone-card"
                    style={{ background: "#dc2626" }}
                >
                    <FaExclamationTriangle />
                </div>

                <h3>Estoque Baixo</h3>

                <h2>{dados.estoqueBaixo}</h2>

            </div>

            <h2 style={{ marginTop: "40px" }}>
                Produtos com estoque baixo
            </h2>

            <table className="tabela-dashboard">

                <thead>

                    <tr>

                        <th>Produto</th>
                        <th>Estoque</th>

                    </tr>

                </thead>

                <tbody>

                    {estoqueBaixo.length === 0 ? (

                        <tr>

                            <td colSpan="2">

                                Nenhum produto com estoque baixo.

                            </td>

                        </tr>

                    ) : (

                        estoqueBaixo.map((produto) => (

                            <tr key={produto.id}>

                                <td>{produto.nome}</td>

                                <td>

                                    <span
                                        style={{
                                            backgroundColor: "#ef4444",
                                            color: "#fff",
                                            padding: "4px 10px",
                                            borderRadius: "20px",
                                            fontWeight: "bold"

                                        }}
                                        >
                                            {produto.estoque}
                                        </span>

                                </td>

                            </tr>

                        ))

                    )}

                </tbody>

            </table>

            <h2 style={{ marginTop:"40px"}}>
                Produtos mais vendidos
            </h2>

            <table className="tabela-dashboard">

                <thead>

                    <tr>

                        <th>Ranking</th>

                        <th>Produto</th>

                        <th>Quantidade</th>

                    </tr>

                </thead>

                <tbody>

                    {maisVendidos.map((produto,index) => (

                        <tr key={produto.nome}>

                            <td>

                                {index === 0 
                                    ? "🥇"
                                    : index === 1
                                    ? "🥈"
                                    : index === 2
                                    ? "🥉"
                                    : index + 1}

                            </td>

                            <td>{produto.nome}</td>

                            <td>{produto.total_vendido}</td>

                        </tr>

                    ))}

                </tbody>

            </table>

            <h2 style={{ marginTop: "40px" }}>
                Vendas por mês
            </h2>

            <div
                style={{
                    background: "#fff",
                    padding: "20px",
                    borderRadius: "10px",
                    marginTop: "20px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
                }}
            >

                <Bar data={dadosGrafico} />

            </div>

        </div>

    </Layout>

    );

}

export default Dashboard;