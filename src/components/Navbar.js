import { Link, useLocation, useNavigate } from "react-router-dom"; 
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { faHome, faList, faCog } from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
    const [showSidebar, setShowSidebar] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false); 

    useEffect(() => {
       
        const user = sessionStorage.getItem('authenticatedUser');
        if (user) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem('authenticatedUser'); 
        setIsLoggedIn(false);
        navigate("/Auth"); 
    };

    const commonLinks = [
        { name: "Accueil", path: "/", icon: faHome },
        { name: "Recettes", path: "/recipes", icon: faList },
        { name: "Paramètres", path: "/settings", icon: faCog },
        { name: "search", path: "/search", icon: faCog },
    ];



    const loggedInLinks = [
        { name: "Mon Compte", path: "/RecetteForm", icon: faCog },
        { name: " déconnecter", path: "/", icon: faCog, onClick: handleLogout },
    ];

    const loggedOutLinks = [
        { name: "Se connecter", path: "/Auth", icon: faCog },
    ];

    const closeSidebar = () => {
        setShowSidebar(false);
    };

    return (
        <>
            <div className="navbar container">
                <Link to="/" className="logo">F<span>oo</span>diesHub</Link>
                <div className="nav-links">
                    {commonLinks.map((link) => (
                        <Link
                            className={location.pathname === link.path ? "active" : ""}
                            to={link.path}
                            key={link.name}
                        >
                            {link.name}
                        </Link>
                    ))}
                    {(isLoggedIn ? loggedInLinks : loggedOutLinks).map((link) => (
                        <Link
                            className={location.pathname === link.path ? "active" : ""}
                            to={link.path}
                            key={link.name}
                            onClick={link.onClick} 
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>
                <div 
                    onClick={() => setShowSidebar(true)} 
                    className={showSidebar ? "sidebar-btn active" : "sidebar-btn"}
                >
                    <div className="bar"></div>
                    <div className="bar"></div>
                    <div className="bar"></div>
                </div>
            </div>
            {showSidebar && <Sidebar close={closeSidebar} links={[...commonLinks, ...(isLoggedIn ? loggedInLinks : loggedOutLinks)]} />}
        </>
    );
}
