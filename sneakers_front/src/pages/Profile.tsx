import React from "react";
import { supabase } from "../supabaseClient";
import "./Profile.css";

interface ProfileProps {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  setUserEmail: (email: string | null) => void;
}

const Profile: React.FC<ProfileProps> = ({ isLoggedIn, setIsLoggedIn, setUserEmail }) => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setUserEmail(null);
    localStorage.removeItem('userEmail');
    localStorage.removeItem('isAdmin');
    window.location.href = "/";
  };

  return (
    <div className="profile-container">
      {isLoggedIn ? (
        <>
          <button className="order_button">Mes commandes</button>
          <button className="cart_button">Mon panier</button>
          <button className="info_button">Mes informations</button>
          <button type="button" className="logout_button" onClick={handleLogout}>
            Se déconnecter
          </button>
        </>
      ) : (
        <a href="/register">
          <button className="login_button">Se connecter ou s'inscrire</button>
        </a>
      )}
    </div>
  );
};

export default Profile;
