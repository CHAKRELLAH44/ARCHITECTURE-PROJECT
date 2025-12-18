import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import './AgentDashboard.css';

/**
 * Dashboard de l'agent guichet
 * Permet de créer des clients et des comptes bancaires
 */
const AgentDashboard = () => {
  const [activeTab, setActiveTab] = useState('client'); // Onglet actif (client ou account)
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleChangePassword = () => {
    navigate('/change-password');
  };

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="navbar-content">
          <h1>Espace Agent Guichet</h1>
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
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'client' ? 'active' : ''}`}
            onClick={() => setActiveTab('client')}
          >
            Ajouter nouveau client
          </button>
          <button
            className={`tab ${activeTab === 'account' ? 'active' : ''}`}
            onClick={() => setActiveTab('account')}
          >
            Nouveau compte bancaire
          </button>
          <button
            className={`tab ${activeTab === 'depot' ? 'active' : ''}`}
            onClick={() => setActiveTab('depot')}
          >
            Dépôt / Retrait
          </button>
        </div>

        <div className="card">
          {activeTab === 'client' ? (
            <AddClientForm />
          ) : activeTab === 'account' ? (
            <AddAccountForm />
          ) : (
            <DepotRetraitForm />
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Formulaire de création d'un nouveau client
 * Envoie les données au backend qui crée le client et son compte utilisateur
 */
const AddClientForm = () => {
  // État du formulaire avec tous les champs
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    numeroIdentite: '',
    dateAnniversaire: '',
    adresseMail: '',
    adressePostale: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Mettre à jour l'état quand l'utilisateur tape dans un champ
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Soumettre le formulaire au backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // Envoyer les données au backend (POST /api/clients)
      await axios.post('/api/clients', formData);
      setSuccess('Client créé avec succès. Les identifiants ont été envoyés par email.');

      // Réinitialiser le formulaire
      setFormData({
        nom: '',
        prenom: '',
        numeroIdentite: '',
        dateAnniversaire: '',
        adresseMail: '',
        adressePostale: '',
      });
    } catch (err) {
      // Afficher l'erreur retournée par le backend
      console.error('Erreur complète:', err);
      console.error('Réponse:', err.response);
      const errorMessage = err.response?.data?.message || err.response?.data || err.message || 'Erreur lors de la création du client';
      setError(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
    }
  };

  return (
    <div>
      <h2>Ajouter un nouveau client</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="nom">Nom *</label>
            <input
              type="text"
              id="nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="prenom">Prénom *</label>
            <input
              type="text"
              id="prenom"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="numeroIdentite">Numéro d'identité *</label>
            <input
              type="text"
              id="numeroIdentite"
              name="numeroIdentite"
              value={formData.numeroIdentite}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="dateAnniversaire">Date d'anniversaire *</label>
            <input
              type="date"
              id="dateAnniversaire"
              name="dateAnniversaire"
              value={formData.dateAnniversaire}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="adresseMail">Adresse mail *</label>
          <input
            type="email"
            id="adresseMail"
            name="adresseMail"
            value={formData.adresseMail}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="adressePostale">Adresse postale *</label>
          <textarea
            id="adressePostale"
            name="adressePostale"
            value={formData.adressePostale}
            onChange={handleChange}
            rows="3"
            required
          />
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <button type="submit" className="btn btn-primary">
          Créer
        </button>
      </form>
    </div>
  );
};

const AddAccountForm = () => {
  const [formData, setFormData] = useState({
    rib: '',
    numeroIdentiteClient: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
      await axios.post('/api/accounts', formData);
      setSuccess('Compte bancaire créé avec succès.');
      setFormData({
        rib: '',
        numeroIdentiteClient: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création du compte');
    }
  };

  return (
    <div>
      <h2>Nouveau compte bancaire</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="rib">RIB (24 chiffres) *</label>
          <input
            type="text"
            id="rib"
            name="rib"
            value={formData.rib}
            onChange={handleChange}
            pattern="[0-9]{24}"
            maxLength="24"
            required
            placeholder="123456789012345678901234"
          />
        </div>

        <div className="form-group">
          <label htmlFor="numeroIdentiteClient">Numéro d'identité du client *</label>
          <input
            type="text"
            id="numeroIdentiteClient"
            name="numeroIdentiteClient"
            value={formData.numeroIdentiteClient}
            onChange={handleChange}
            required
          />
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <button type="submit" className="btn btn-primary">
          Créer
        </button>
      </form>
    </div>
  );
};

/**
 * Formulaire pour effectuer un dépôt ou un retrait
 */
const DepotRetraitForm = () => {
  const [formData, setFormData] = useState({
    rib: '',
    montant: '',
    type: 'DEPOT' // Par défaut: dépôt
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');

      // Envoyer la requête au backend
      const response = await axios.post('http://localhost:8080/api/depot-retrait', formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setSuccess(response.data.message);

      // Réinitialiser le formulaire
      setFormData({
        rib: '',
        montant: '',
        type: 'DEPOT'
      });
    } catch (err) {
      console.error('Erreur dépôt/retrait:', err);
      const errorMessage = err.response?.data || err.message || 'Erreur lors de l\'opération';
      setError(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
    }
  };

  return (
    <div>
      <h2>Dépôt / Retrait</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="rib">RIB du compte *</label>
          <input
            type="text"
            id="rib"
            name="rib"
            value={formData.rib}
            onChange={handleChange}
            pattern="[0-9]{24}"
            maxLength="24"
            required
            placeholder="123456789012345678901234"
          />
        </div>

        <div className="form-group">
          <label htmlFor="montant">Montant (€) *</label>
          <input
            type="number"
            id="montant"
            name="montant"
            value={formData.montant}
            onChange={handleChange}
            min="0.01"
            step="0.01"
            required
            placeholder="100.00"
          />
        </div>

        <div className="form-group">
          <label htmlFor="type">Type d'opération *</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="DEPOT">Dépôt</option>
            <option value="RETRAIT">Retrait</option>
          </select>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <button type="submit" className="btn btn-primary">
          {formData.type === 'DEPOT' ? 'Effectuer le dépôt' : 'Effectuer le retrait'}
        </button>
      </form>
    </div>
  );
};

export default AgentDashboard;

