import React from 'react';
import './css/Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} RoboTrainer. All rights reserved.</p>
        <nav className="footer-nav">
          <a href="/contact">Kontakt</a>
          <a href="/impressum">Impressum</a>
          {/*<a href="/glossar">Glossar</a> */}
        </nav>
      </div>
    </footer>
  );
};

export default Footer;