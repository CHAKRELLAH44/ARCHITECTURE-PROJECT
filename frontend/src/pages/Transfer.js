import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import './Transfer.css';

const Transfer = () => {
  const [formData, setFormData] = useState({
    ribSource: '',
    ribDestinataire: '',
    montant: '',
    motif: '',
  });
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await axios.get('/api/dashboard');
      if (response.data.comptes && response.data.comptes.length > 0) {
        setAccounts(response.data.comptes);
        if (response.data.comptes.length === 1) {
          setFormData({ ...formData, ribSource: response.data.comptes[0].rib });
        } else if (response.data.rib) {
          setFormData({ ...formData, ribSource: response.data.rib });
        }
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        logout();
        navigate('/login');
      } else {
        setError('Erreur lors du chargement des comptes');
      }
    } finally {
      setLoading(false);
    }
  };

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

    try {
      await axios.post('/api/transfers', {
        ribSource: formData.ribSource,
        ribDestinataire: formData.ribDestinataire,
        montant: parseFloat(formData.montant),
        motif: formData.motif,
      });
      setSuccess('Virement effectué avec succès');
      setFormData({
        ribSource: formData.ribSource,
        ribDestinataire: '',
        montant: '',
        motif: '',
      });
      setTimeout(() => {
        navigate('/dashboard/client');
      }, 2000);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        logout();
        navigate('/login');
      } else {
        setError(err.response?.data?.message || 'Erreur lors du virement');
      }
    }
  };

  const handleBack = () => {
    navigate('/dashboard/client');
  };

  if (loading) {
    return (
      <div className="container">
        <div className="card">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="navbar-content">
          <h1>Nouveau virement</h1>
          <button className="btn btn-secondary" onClick={handleBack}>
            Retour
          </button>
        </div>
      </nav>

      <div className="container">
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="ribSource">RIB Source *</label>
              {accounts.length > 1 ? (
                <select
                  id="ribSource"
                  name="ribSource"
                  value={formData.ribSource}
                  onChange={handleChange}
                  required
                >
                  <option value="">Sélectionner un compte</option>
                  {accounts.map((account) => (
                    <option key={account.id} value={account.rib}>
                      {account.rib} - Solde: {account.solde.toFixed(2)} €
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  id="ribSource"
                  name="ribSource"
                  value={formData.ribSource}
                  readOnly
                  disabled
                  style={{ backgroundColor: '#f5f5f5' }}
                />
              )}
            </div>

            <div className="form-group">
              <label htmlFor="montant">Montant *</label>
              <input
                type="number"
                id="montant"
                name="montant"
                value={formData.montant}
                onChange={handleChange}
                step="0.01"
                min="0.01"
                required
                placeholder="0.00"
              />
            </div>

            <div className="form-group">
              <label htmlFor="ribDestinataire">RIB Destinataire *</label>
              <input
                type="text"
                id="ribDestinataire"
                name="ribDestinataire"
                value={formData.ribDestinataire}
                onChange={handleChange}
                pattern="[0-9]{24}"
                maxLength="24"
                required
                placeholder="123456789012345678901234"
              />
            </div>

            <div className="form-group">
              <label htmlFor="motif">Motif</label>
              <textarea
                id="motif"
                name="motif"
                value={formData.motif}
                onChange={handleChange}
                rows="3"
                placeholder="Raison du virement (optionnel)"
              />
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <button type="submit" className="btn btn-primary">
              Valider
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Transfer;

