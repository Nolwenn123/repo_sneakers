import React from 'react';
import './Navbar.css';
import flowerIcon from '../assets/images/flower-icon.png';
import floalogo from '../assets/images/FLOA.png'; // Mettre la vraie image de la fleur si tu l'as
import profileIcon from '../assets/images/profil_icon.png'; // Ajoute ton image profil ici
import cartIcon from '../assets/images/panier_icon.png';

const Navbar: React.FC = () => {
  return (
    <header>
      <div className="navbar-top">
        <img src={floalogo} alt="FLOA logo" className="floa-logo" />        
        <p className="slogan">Un pétale après l’autre</p>
        <img src={flowerIcon} alt="Flower Icon" className="flower-icon" />
      </div>
       <nav className="navbar-menu">
        <div className="navbar-links">
          <ul>
            <li><a href="#nouveautes">Nouveautés</a></li>
            <li><a href="#femmes">Femmes</a></li>
            <li><a href="#hommes">Hommes</a></li>
            <li><a href="#enfants">Enfants</a></li>
            <li><a href="#promo">Promo</a></li>
          </ul>
        </div>
        <div className="navbar-icons">
          <a href="#profil"><img src={profileIcon} alt="Profil" className="navbar-icon" /></a>
          <a href="#panier"><img src={cartIcon} alt="Panier" className="navbar-icon" /></a>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;