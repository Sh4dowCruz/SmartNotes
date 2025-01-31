/*Serin*/
import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

function Footer() {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
  return (
    <footer className="footer">
      <div className="footer-table">
      <div className="footer-content">
        <h1><Link to="/">Smart Notes</Link></h1>
        <p>An innovative tool designed to let students can their notes and organize them into study matierials.</p>
      </div>
      <div className="footer-navigation">
        <nav className='footer-navigation-1'>
          <Link to="/generate">Get Started</Link>
          <br />
          <Link to="/dashboard">Dashboard</Link>
        </nav>
        <nav className='footer-navigation-2'>
          <Link to="/about-us">About</Link>
          <br />
          <a onClick={() => isAuthenticated ? logout({ returnTo: window.location.origin }) : loginWithRedirect()}> {isAuthenticated ? "Log Out" : "Log In"}</a>
        </nav>
      </div>
      </div>
      <p className='copyright'>© Smart Notes. All rights reserved.</p>
    </footer>
  );
}

export default Footer;