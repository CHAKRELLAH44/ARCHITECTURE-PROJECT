import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import ClientDashboard from './pages/ClientDashboard';
import AgentDashboard from './pages/AgentDashboard';
import ChangePassword from './pages/ChangePassword';
import Transfer from './pages/Transfer';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

/**
 * Composant principal de l'application
 * Définit toutes les routes et protège les pages selon le profil utilisateur
 */
function App() {
  return (
    <AuthProvider> {/* Fournit le contexte d'authentification à toute l'app */}
      <Router>
        <div className="App">
          <Routes>
            {/* Page de connexion (accessible à tous) */}
            <Route path="/login" element={<Login />} />

            {/* Dashboard client (accessible uniquement aux CLIENT) */}
            <Route
              path="/dashboard/client"
              element={
                <ProtectedRoute profile="CLIENT">
                  <ClientDashboard />
                </ProtectedRoute>
              }
            />

            {/* Dashboard agent (accessible uniquement aux AGENT_GUICHET) */}
            <Route
              path="/dashboard/agent"
              element={
                <ProtectedRoute profile="AGENT_GUICHET">
                  <AgentDashboard />
                </ProtectedRoute>
              }
            />

            {/* Changement de mot de passe (accessible à tous les utilisateurs connectés) */}
            <Route
              path="/change-password"
              element={
                <ProtectedRoute>
                  <ChangePassword />
                </ProtectedRoute>
              }
            />

            {/* Page de virement (accessible uniquement aux CLIENT) */}
            <Route
              path="/dashboard/client/transfer"
              element={
                <ProtectedRoute profile="CLIENT">
                  <Transfer />
                </ProtectedRoute>
              }
            />

            {/* Redirection par défaut vers login */}
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

