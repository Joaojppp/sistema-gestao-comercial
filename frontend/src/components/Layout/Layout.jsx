import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";
import "../../styles/layout.css";

function Layout ({children}) {

    return (

        <div className="layout">

            <Sidebar />

            <main className="content">

                <Header />

                {children}

            </main>
        </div>
    )
}

export default Layout;