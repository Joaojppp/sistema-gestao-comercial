import { Link, useLocation } from "react-router-dom";

import {
    FaHome,
    FaUsers,
    FaBoxOpen,
    FaShoppingCart,
    FaChartLine
} from "react-icons/fa";

function Sidebar() {

    const location = useLocation();

    return (

        <aside className="sidebar">

            <h2>

                <FaChartLine style={{ marginRight: "10px" }} />

                Gestão Comercial

            </h2>

            <nav>

                <ul>

                    <li>

                        <Link
                            to="/dashboard"
                            className={location.pathname === "/dashboard" ? "ativo" : ""}
                        >

                            <FaHome />

                            Dashboard

                        </Link>

                    </li>

                    <li>

                        <Link
                            to="/clientes"
                            className={location.pathname === "/clientes" ? "ativo" : ""}
                        >

                            <FaUsers />

                            Clientes

                        </Link>

                    </li>

                    <li>

                        <Link
                            to="/produtos"
                            className={location.pathname === "/produtos" ? "ativo" : ""}
                        >

                            <FaBoxOpen />

                            Produtos

                        </Link>

                    </li>

                    <li>

                        <Link
                            to="/vendas"
                            className={location.pathname === "/vendas" ? "ativo" : ""}
                        >

                            <FaShoppingCart />

                            Vendas

                        </Link>

                    </li>

                </ul>

            </nav>

        </aside>

    );

}

export default Sidebar;