import { useState, useEffect } from "react";
import axios from "axios";

import Layout from "../../components/Layout/Layout";
import "../../styles/clientes.css";

import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

function Clientes() {

    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [telefone, setTelefone] = useState("");

    const [clienteEditando, setClienteEditando] = useState(null);
    const [pesquisa, setPesquisa] = useState("");

    const [clientes, setClientes] = useState([]);

    useEffect(() => {

        carregarClientes();

    }, [pesquisa]);

    async function carregarClientes() {


        try {

            const resposta = await axios.get(
                `${API_URL}/clientes?nome=${pesquisa}`
            );

            setClientes(resposta.data);
            console.log(resposta.data);

        } catch (error) {

            console.error(error);

        }
    }


    async function salvarCliente() {

    if (!nome || !email || !telefone) {
        alert("Preencha todos os campos!");
        return;
    }

        if (clienteEditando) {

            try{

        await axios.put(
            `${API_URL}/clientes/${clienteEditando.id}`,
            {
                nome,
                email,
                telefone
            }
        );

        await carregarClientes();

        setClienteEditando(null);

        setNome("");
        setEmail("");
        setTelefone("");

        setMostrarFormulario(false);

        return;

    } catch (error) {

        console.error(error);

        toast.error("Erro ao editar cliente.");

        return;

        }
     }
    
    try{

        await axios.post(`${API_URL}/clientes`, {
            nome,
            email,
            telefone
        });

        await carregarClientes();

        setNome("");
        setEmail("");
        setTelefone("");

        setMostrarFormulario(false);

    } catch (error) {

        console.error(error);

        toast.error("Erro ao cadastrar cliente.");
    }
    
    }

     async function excluirCliente(id) {

        try {

            await axios.delete(`${API_URL}/clientes/${id}`);

            await carregarClientes();

        } catch (error) {

            console.error(error);

            toast.error("Erro ao excluir cliente.");
        }
    
    }

    function editarCliente(cliente){

        setNome(cliente.nome);

        setEmail(cliente.email);

        setTelefone(cliente.telefone);

        setClienteEditando(cliente);

        setMostrarFormulario(true);

    }

    return (

        <Layout>

            <label>Pesquisar cliente: </label>

            <input
                type="text"
                placeholder="Digite o nome..."
                value={pesquisa}
                onChange={(e) => setPesquisa(e.target.value)}
            />

            <div className="clientes-container">

                <h2>Clientes</h2>

                <button
                    className="btn-novo"
                    onClick={() => setMostrarFormulario(true)}
                >
                    + Novo Cliente
                </button>

                {mostrarFormulario && (

                    <div className="formulario-cliente">

                        <h3>Cadastrar Cliente</h3>

                        <input
                            type="text"
                            placeholder="Nome"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                        />

                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <input
                            type="text"
                            placeholder="Telefone"
                            value={telefone}
                            onChange={(e) => setTelefone(e.target.value)}
                        />

                        <button onClick={salvarCliente}>
                            Salvar Cliente
                        </button>

                    </div>

                )}

                <table className="tabela-clientes">

                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Telefone</th>
                            <th>Ações</th>
                        </tr>
                    </thead>

                    <tbody>

                        {clientes.map((cliente) => (

                            <tr key={cliente.id}>

                                <td>{cliente.nome}</td>

                                <td>{cliente.email}</td>

                                <td>{cliente.telefone}</td>

                                <td>
                                    
                                    <button
                                    onClick={() => editarCliente(cliente)}
                                    >
                                        Editar                                        
                                    </button>


                                    <button 
                                        onClick={() => excluirCliente(cliente.id)}
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

export default Clientes;