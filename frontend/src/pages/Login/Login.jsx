import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../../styles/login.css";

function Login() {

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const navigate = useNavigate();

    function entrar(){

        // por enquanto apenas entra no sistema
        navigate("/dashboard");

    }

    return(

        <div className="login-container">

            <div className="login-box">

                <h1>Sistema Comercial</h1>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Senha"
                    value={senha}
                    onChange={(e)=>setSenha(e.target.value)}
                />

                <button onClick={entrar}>

                    Entrar

                </button>

            </div>

        </div>

    );

}

export default Login;