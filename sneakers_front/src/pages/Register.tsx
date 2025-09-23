import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import "./Register.css";

interface RegisterProps {
  setIsLoggedIn: (value: boolean) => void;
  setUserEmail: (email: string | null) => void;
}

const Register: React.FC<RegisterProps> = ({ setIsLoggedIn, setUserEmail }) => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [error, setError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [registerIsAdmin, setRegisterIsAdmin] = useState(false);
  const [hasAcceptedCGU, setHasAcceptedCGU] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setProfileMessage("");
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });
    if (error) {
      setError(error.message);
      setLoginSuccess(false);
      setProfileMessage('');
      return;
    }

    const email = data?.user?.email ?? loginEmail;
    const userId = data?.user?.id;
    let userIsAdmin = Boolean(data?.user?.user_metadata?.is_admin);

    if (userId) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', userId)
        .maybeSingle();

      if (!profileError) {
        userIsAdmin = Boolean(profile?.is_admin);
      }
    }

    setError("");
    setProfileMessage(userIsAdmin ? "Connecté en tant qu'administrateur" : "Connecté");
    setIsLoggedIn(true);
    setUserEmail(email ?? null);
    if (email) {
      localStorage.setItem("userEmail", email);
    }
    if (userIsAdmin) {
      localStorage.setItem('isAdmin', 'true');
    } else {
      localStorage.removeItem('isAdmin');
    }
    setLoginSuccess(true);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginSuccess(false);
    setError("");
    setProfileMessage("");

    if (!hasAcceptedCGU) {
      setProfileMessage('');
      setError("Vous devez accepter les CGU pour créer un compte.");
      return;
    }
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: registerEmail,
      password: registerPassword,
      options: {
        data: {
          is_admin: registerIsAdmin,
        },
      },
    });
    if (signUpError) {
      setError(signUpError.message);
      setProfileMessage('');
      return;
    }

    const userId = signUpData.user?.id;

    if (userId) {
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          is_admin: registerIsAdmin,
        });

      if (profileError) {
        setError(profileError.message);
        setProfileMessage('');
        return;
      }
    }

    setError("");
    setProfileMessage(
      registerIsAdmin
        ? "Compte administrateur créé. Vérifiez vos emails pour confirmer."
        : "Compte créé. Vérifiez vos emails pour confirmer."
    );
    setHasAcceptedCGU(false);
    if (registerIsAdmin) {
      localStorage.setItem('isAdmin', 'true');
    } else {
      localStorage.removeItem('isAdmin');
    }
  };

  return (
    <div className="register-container">
      <h1 className="register-title">Se connecter</h1>
      <form className="register-form" onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          className="register-input"
          value={loginEmail}
          onChange={e => setLoginEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          className="register-input"
          value={loginPassword}
          onChange={e => setLoginPassword(e.target.value)}
        />
        <button type="submit" className="register-button">
          Se connecter
        </button>
      </form>
      {loginSuccess && (
        <div style={{ color: "green" }}>{profileMessage || "Connecté avec succès !"}</div>
      )}
      <h1 className="register-title">S'inscrire</h1>
      <form className="register-form" onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Email"
          className="register-input"
          value={registerEmail}
          onChange={e => setRegisterEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          className="register-input"
          value={registerPassword}
          onChange={e => setRegisterPassword(e.target.value)}
        />
        <button type="submit" className="register-button">
          S'inscrire
        </button>
        <label className="checkbox-container register-cgu">
          <input
            type="checkbox"
            checked={hasAcceptedCGU}
            onChange={event => setHasAcceptedCGU(event.target.checked)}
          />
          <span>
            J'accepte les <span className="cgu-highlight">conditions générales d'utilisation</span>
          </span>
        </label>
        <label className="checkbox-container">
          <input
            type="checkbox"
            checked={registerIsAdmin}
            onChange={event => setRegisterIsAdmin(event.target.checked)}
          />
          <span>Créer un compte administrateur</span>
        </label>
      </form>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {!error && profileMessage && !loginSuccess && (
        <div style={{ color: "green" }}>{profileMessage}</div>
      )}
    </div>
  );
};

export default Register;
