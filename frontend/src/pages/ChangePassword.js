import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import './ChangePassword.css';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    try {
      await axios.post('/api/auth/change-password', {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      });
      setSuccess('Mot de passe changé avec succès');
      setTimeout(() => {
        logout();
        navigate('/login');
      }, 2000);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        logout();
        navigate('/login');
      } else {
        setError(err.response?.data?.message || 'Erreur lors du changement de mot de passe');
      }
    }
  };

  const handleBack = () => {
    if (user?.profile === 'CLIENT') {
      navigate('/dashboard/client');
    } else {
      navigate('/dashboard/agent');
    }
  };

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="navbar-content">
          <h1>Changer le mot de passe</h1>
          <button className="btn btn-secondary" onClick={handleBack}>
            Retour
          </button>
        </div>
      </nav>

      <div className="container">
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="oldPassword">Ancien mot de passe *</label>
              <input
                type="password"
                id="oldPassword"
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">Nouveau mot de passe *</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmer le nouveau mot de passe *</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <button type="submit" className="btn btn-primary">
              Changer le mot de passe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;

