import React from 'react';
import './SuccessModal.css';

/**
 * Modal de succès avec bouton de téléchargement PDF
 * Affiche un message de confirmation et permet de télécharger un reçu
 */
const SuccessModal = ({ isOpen, onClose, title, message, onDownloadPDF }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Icône de succès */}
        <div className="success-icon">
          <svg width="80" height="80" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="36" fill="#4CAF50" />
            <path
              d="M28 40 L36 48 L52 32"
              stroke="white"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Titre */}
        <h2 className="modal-title">{title}</h2>

        {/* Message */}
        <p className="modal-message">{message}</p>

        {/* Boutons */}
        <div className="modal-buttons">
          <button className="btn btn-primary" onClick={onDownloadPDF}>
            📄 Télécharger le reçu (PDF)
          </button>
          <button className="btn btn-secondary" onClick={onClose}>
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;

