import React from "react";
import "./Register.css";

const Register: React.FC = () => {
  return (
    <div className="register-container">
      <h1 className="register-title">Se connecter</h1>
      <form className="register-form">
        <input
          type="email"
          placeholder="Email"
          className="register-input"
        />
        <input
          type="password"
          placeholder="Mot de passe"
          className="register-input"
        />
        <button type="submit" className="register-button">
          Se connecter
        </button>
      </form>
      <h1 className="register-title">S'inscrire</h1>
      <form className="register-form">
        <input
          type="text"
          placeholder="Email"
          className="register-input"
        />
        <input
          type="text"
          placeholder="Mot de passe"
          className="register-input"
        />
        <button type="submit" className="register-button">
          S'inscrire
        </button>
      </form>
    </div>
  );
};

export default Register;