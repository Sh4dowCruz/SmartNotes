/*Serin*/
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import "./Navbar.css"

function Navbar() {
    const navigate = useNavigate();

    const handleGenerate = () => {
        navigate('/generate');
    }

    const handleDashboard = () => {
        navigate('/dashboard');
    }

    const handleAboutUs = () => {
        navigate('/about-us');
    }

    const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
    
    return (
        <header className="header">
            <nav className="navbar">
                <div className="home">
                    <Link to="/">SMART NOTES</Link>
                </div>
                <div className="nav-links">
                    <button onClick={handleAboutUs}>About Us</button>
                    <button onClick={handleGenerate}>Upload</button>
                </div>
                <div className="auth">
                    <button onClick={handleDashboard}>Dashboard</button>
                    {!isAuthenticated && (
                        <button onClick={loginWithRedirect}>Log in</button>
                    )}
                    {isAuthenticated && <button onClick={logout}>Log out</button>}
                </div>
            </nav>
        </header>
    );
}

export default Navbar;
