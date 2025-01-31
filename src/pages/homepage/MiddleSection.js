import React from "react";
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import './MiddleSection.css';
import './Button.css'

function MiddleSection() {
    const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
    return (
        <div className='middle-container'>
            <h1>Transform your notes</h1>
            <p>Into Dynamic Study Guides</p>
            <div className="middle-btns">
                <button 
                className='btns' >
                <Link to="/generate">Generate</Link>
                </button>
                <button 
                className='btns'>
                <a onClick={() => isAuthenticated ? logout({ returnTo: window.location.origin }) : loginWithRedirect()}> {isAuthenticated ? "Log Out" : "Log In"}</a>
                </button>
            </div>
        </div>
    )
};

export default MiddleSection;