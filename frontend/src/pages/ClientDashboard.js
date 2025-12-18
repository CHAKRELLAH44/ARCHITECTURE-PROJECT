import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import './ClientDashboard.css';

const ClientDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [selectedRib, setSelectedRib] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboard();
  }, [selectedRib]);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const params = selectedRib ? { rib: selectedRib } : {};
      const response = await axios.get('/api/dashboard', { params });
      setDashboard(response.data);
      if (!selectedRib && response.data.comptes && response.data.comptes.length > 0) {
        setSelectedRib(response.data.rib);
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        logout();
        navigate('/login');
      } else {
        setError(err.response?.data?.message || 'Erreur lors du chargement du tableau de bord');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAccountChange = (e) => {
    setSelectedRib(e.target.value);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleChangePassword = () => {
    navigate('/change-password');
  };

  const handleNewTransfer = () => {
    navigate('/dashboard/client/transfer');
  };

  if (loading) {
    return (
      <div className="container">
        <div className="card">Chargement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="card">
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="container">
        <div className="card">Aucun compte disponible</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="navbar-content">
          <h1>Espace Client</h1>
          <div className="navbar-actions">
            <button className="btn btn-secondary" onClick={handleChangePassword}>
              Changer mot de passe
            </button>
            <button className="btn btn-secondary" onClick={handleLogout}>
              Déconnexion
            </button>
          </div>
        </div>
      </nav>

      <div className="container">
        <div className="card">
          <h2>Tableau de bord</h2>
          
          {dashboard.comptes && dashboard.comptes.length > 1 && (
            <div className="form-group">
              <label htmlFor="account-select">Sélectionner un compte</label>
              <select
                id="account-select"
                value={selectedRib}
                onChange={handleAccountChange}
              >
                {dashboard.comptes.map((compte) => (
                  <option key={compte.id} value={compte.rib}>
                    {compte.rib} - Solde: {compte.solde.toFixed(2)} €
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="account-info">
            <div className="info-item">
              <label>RIB:</label>
              <span>{dashboard.rib}</span>
            </div>
            <div className="info-item">
              <label>Solde:</label>
              <span className="balance">{dashboard.solde.toFixed(2)} €</span>
            </div>
          </div>

          <div className="operations-section">
            <div className="section-header">
              <h3>Les dix dernières opérations</h3>
              <button className="btn btn-primary" onClick={handleNewTransfer}>
                Nouveau virement
              </button>
            </div>

            {dashboard.operations && dashboard.operations.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>Intitulé</th>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Montant</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.operations.map((operation) => (
                    <tr key={operation.id}>
                      <td>{operation.intitule}</td>
                      <td>
                        <span className={`badge ${operation.type === 'DEBIT' ? 'badge-debit' : 'badge-credit'}`}>
                          {operation.type}
                        </span>
                      </td>
                      <td>{new Date(operation.dateOperation).toLocaleDateString('fr-FR')}</td>
                      <td className={operation.type === 'DEBIT' ? 'amount-debit' : 'amount-credit'}>
                        {operation.type === 'DEBIT' ? '-' : '+'}{operation.montant.toFixed(2)} €
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Aucune opération disponible</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;

