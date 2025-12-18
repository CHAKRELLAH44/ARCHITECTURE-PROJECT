import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, profile }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (profile && user.profile !== profile) {
    return (
      <div className="container">
        <div className="card">
          <div className="error-message">
            Vous n'avez pas le droit d'accéder à cette fonctionnalité. Veuillez contacter votre administrateur.
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;

