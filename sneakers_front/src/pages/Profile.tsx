import React from "react";
import "./Profile.css";

const profile: React.FC = () => {
  return (
    <div className="profile-container">
        <button className="order_button">Mes commandes</button>
        <button className="cart_button">Mon panier</button>
        <button className="info_button">Mes informations</button>
        <button className="logout_button">Se déconnecter</button>
    </div>
  );
};

export default profile;