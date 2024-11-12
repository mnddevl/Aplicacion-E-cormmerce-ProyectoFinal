import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import '../../styles/navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faUser, faShoppingCart, faAddressCard, faCoffee, faShop } from '@fortawesome/free-solid-svg-icons';
import logoNav from "../../img/logoNav.png";
import { Link } from 'react-router-dom';
import LoginNavbar from "./loginNavbar";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false); 
    const [showLoginModal, setShowLoginModal] = useState(false); 
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();
    
    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLoginClick = () => {
        setShowLoginModal(true); 
    };

    const handleCloseModal = () => {
        setShowLoginModal(false); 
    };

    const handleLogout = () => {
        sessionStorage.removeItem('token');
        setIsAuthenticated(false);
        navigate('/');
    };

    const handleAccountClick = () => {
        navigate('/usuarioView');
    };

    return (
        <div> 
            <nav className="navbar">
                <div className="navbar-left">
                    <Link to="/">
                        <img src={logoNav} alt="Logo" className="logo" />
                    </Link>
                </div>
                <button className="hamburger-menu" id="hamburger-menu" onClick={toggleMenu}>
                    <FontAwesomeIcon icon={faBars} />
                </button>
                <div className={`navbar-content ${isMenuOpen ? 'active d-lg-block' : 'd-none d-lg-block'}`} id="navbar-content">

                    <div className="navbar-right">
                        <div className="dropdown">
                            <Link to="/quienSomos" className="btn productos-btn">
                                <FontAwesomeIcon icon={faShop} /> Nuestro café
                            </Link>
                        </div>

                        <div className="dropdown">
                            <Link to="/pesosProductos" className="btn productos-btn">
                                <FontAwesomeIcon icon={faCoffee} /> Productos
                            </Link>
                        </div>

                        <div className="dropdown">
                            <Link to="/carritoCompra" className="btn cart-btn">
                                <FontAwesomeIcon icon={faShoppingCart} /> Carrito
                            </Link>
                        </div>

                        {!isAuthenticated && (
                            <div className="dropdown">
                                <Link to="/registrar" className="btn productos-btn">
                                    <FontAwesomeIcon icon={faAddressCard} /> Registrar
                                </Link>
                            </div>
                        )}

                        <div className="dropdown">
                            {isAuthenticated ? (
                                <div className="dropdown">
                                    <button className="btn login-btn">
                                        <FontAwesomeIcon icon={faUser} /> Mi Cuenta
                                    </button>
                                    <div className="dropdown-content">
                                        <button onClick={handleAccountClick} className="btn">
                                            Editar Usuario
                                        </button>
                                        <button onClick={handleLogout} className="btn">
                                            Cerrar Sesión
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button className="btn login-btn" onClick={handleLoginClick}>
                                    <FontAwesomeIcon icon={faUser} /> Iniciar sesión
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
            
            {showLoginModal && <LoginNavbar handleCloseModal={handleCloseModal} setIsAuthenticated={setIsAuthenticated} />} 
        </div>
    );
};

export default Navbar;
