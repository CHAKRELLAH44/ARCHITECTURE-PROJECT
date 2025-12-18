import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Contexte d'authentification partagé dans toute l'application
export const AuthContext = createContext();

/**
 * Provider d'authentification
 * Gère la connexion, déconnexion et le stockage du token JWT
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Utilisateur connecté (null si déconnecté)
  const [loading, setLoading] = useState(true); // État de chargement initial

  // Au chargement de l'app, vérifier si un utilisateur est déjà connecté
  useEffect(() => {
    const token = localStorage.getItem('token');
    const profile = localStorage.getItem('profile'); // AGENT_GUICHET ou CLIENT
    const login = localStorage.getItem('login');

    if (token && profile && login) {
      setUser({ token, profile, login });
    }
    setLoading(false);
  }, []);

  /**
   * Fonction de connexion
   * Stocke le token JWT et les infos utilisateur dans localStorage
   */
  const login = (token, profile, login) => {
    localStorage.setItem('token', token);
    localStorage.setItem('profile', profile);
    localStorage.setItem('login', login);
    setUser({ token, profile, login });

    // Configurer axios pour envoyer le token dans toutes les requêtes
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  /**
   * Fonction de déconnexion
   * Supprime le token et redirige vers la page de login
   */
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('profile');
    localStorage.removeItem('login');
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  // Configurer axios au chargement de l'application
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Ajouter le token JWT à toutes les requêtes HTTP
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    // Intercepteur pour gérer les erreurs 401 (token expiré ou invalide)
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          logout(); // Déconnecter l'utilisateur
          window.location.href = '/login'; // Rediriger vers login
        }
        return Promise.reject(error);
      }
    );

    // Nettoyer l'intercepteur quand le composant est démonté
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

