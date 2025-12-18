import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import './Login.css';

/**
 * Page de connexion
 * Permet aux agents et clients de se connecter avec leur login/mot de passe
 */
const Login = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login: loginUser } = useContext(AuthContext); // Fonction login du contexte
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Envoyer les identifiants au backend
      const response = await axios.post('/api/auth/login', {
        login,
        password,
      });

      // Récupérer le token JWT et le profil utilisateur
      const { token, profile } = response.data;
      loginUser(token, profile, login); // Sauvegarder dans le contexte

      // Rediriger selon le profil (CLIENT ou AGENT_GUICHET)
      if (profile === 'CLIENT') {
        navigate('/dashboard/client');
      } else if (profile === 'AGENT_GUICHET') {
        navigate('/dashboard/agent');
      }
    } catch (err) {
      // Afficher l'erreur si login/mot de passe incorrect
      if (err.response && err.response.data) {
        setError(err.response.data);
      } else {
        setError('Login ou mot de passe erronés');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Bienvenue</h1>
        <h2>Connexion à votre espace bancaire</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="login">Login</label>
            <input
              type="text"
              id="login"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
              placeholder="Entrez votre login"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Entrez votre mot de passe"
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="btn btn-primary btn-block">
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

