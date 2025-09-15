import React from 'react';
import './Navbar.css';
import flowerIcon from '../assets/images/flower-icon.png'; // Mettre la vraie image de la fleur si tu l'as

const Navbar: React.FC = () => {
  return (
    <header>
      <div className="navbar-top">
        <h1 className="logo">FLOA</h1>
        <p className="slogan">Un pétale après l’autre</p>
        <img src={flowerIcon} alt="Flower Icon" className="flower-icon" />
      </div>
      <nav className="navbar-menu">
        <ul>
          <li><a href="#nouveautes">Nouveautés</a></li>
          <li><a href="#femmes">Femmes</a></li>
          <li><a href="#hommes">Hommes</a></li>
          <li><a href="#enfants">Enfants</a></li>
          <li><a href="#promo">Promo</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;