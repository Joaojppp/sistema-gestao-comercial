import { BrowserRouter, Routes, Route } from "react-router-dom"

import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import Clientes from "../pages/Clientes/Clientes";
import Produtos from "../pages/Produtos/Produtos";
import Vendas from "../pages/Vendas/Vendas";

function AppRoutes(){
    return(
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/produtos" element={<Produtos />} />
            <Route path="/vendas" element={<Vendas />} />

         </Routes>
        </BrowserRouter>

 );
}

export default AppRoutes;