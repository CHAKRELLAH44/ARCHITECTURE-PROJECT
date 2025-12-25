import jsPDF from 'jspdf';

/**
 * Génère un reçu PDF pour un virement
 * @param {Object} data - Données du virement
 */
export const generateVirementPDF = (data) => {
  const doc = new jsPDF();

  // En-tête avec thème JOSKA-BANK (beige/brown avec accent orange)
  doc.setFillColor(218, 165, 32); // Golden brown
  doc.rect(0, 0, 210, 40, 'F');

  doc.setTextColor(44, 24, 16); // Dark brown text
  doc.setFontSize(24);
  doc.setFont(undefined, 'bold');
  doc.text('JOSKA-BANK', 105, 15, { align: 'center' });

  doc.setFontSize(18);
  doc.setFont(undefined, 'normal');
  doc.text('REÇU DE VIREMENT', 105, 28, { align: 'center' });

  doc.setFontSize(10);
  doc.setTextColor(139, 69, 19); // Brown text
  doc.text('Banque Professionnelle - Service Client', 105, 35, { align: 'center' });
  
  // Réinitialiser la couleur du texte
  doc.setTextColor(0, 0, 0);
  
  // Informations de la transaction
  let y = 60;
  
  // Titre section
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('Détails de la transaction', 20, y);
  y += 15;
  
  // Ligne de séparation
  doc.setDrawColor(200, 200, 200);
  doc.line(20, y, 190, y);
  y += 10;
  
  // Détails
  doc.setFontSize(12);
  doc.setFont(undefined, 'normal');
  
  const details = [
    { label: 'Date et heure', value: data.date },
    { label: 'Numéro de transaction', value: data.transactionId || 'N/A' },
    { label: '', value: '' }, // Espace
    { label: 'Émetteur (RIB)', value: data.ribSource },
    { label: 'Bénéficiaire (RIB)', value: data.ribDestinataire },
    { label: '', value: '' }, // Espace
    { label: 'Montant', value: `${data.montant.toFixed(2)} €`, bold: true },
    { label: 'Motif', value: data.motif || 'Non spécifié' }
  ];
  
  details.forEach(item => {
    if (item.label === '') {
      y += 5;
      return;
    }
    
    doc.setFont(undefined, 'bold');
    doc.text(item.label + ' :', 20, y);
    
    doc.setFont(undefined, item.bold ? 'bold' : 'normal');
    if (item.bold) {
      doc.setFontSize(14);
      doc.setTextColor(41, 128, 185);
    }
    doc.text(item.value, 80, y);
    
    if (item.bold) {
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
    }
    
    y += 10;
  });
  
  // Statut
  y += 10;
  doc.setFillColor(76, 175, 80);
  doc.roundedRect(20, y, 170, 15, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('✓ TRANSACTION RÉUSSIE', 105, y + 10, { align: 'center' });
  
  // Pied de page
  doc.setTextColor(150, 150, 150);
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text('Ce document est un reçu officiel de transaction bancaire.', 105, 270, { align: 'center' });
  doc.text('Conservez-le pour vos archives.', 105, 280, { align: 'center' });
  
  // Télécharger le PDF
  const fileName = `recu_virement_${new Date().getTime()}.pdf`;
  doc.save(fileName);
};

/**
 * Génère un reçu PDF pour un dépôt ou retrait
 * @param {Object} data - Données de l'opération
 */
export const generateDepotRetraitPDF = (data) => {
  const doc = new jsPDF();

  const isDepot = data.type === 'DEPOT';
  const color = isDepot ? [255, 107, 53] : [218, 165, 32]; // Orange pour dépôt, golden brown pour retrait

  // En-tête avec thème JOSKA-BANK (beige/brown avec accent orange)
  doc.setFillColor(218, 165, 32); // Golden brown
  doc.rect(0, 0, 210, 40, 'F');

  doc.setTextColor(44, 24, 16); // Dark brown text
  doc.setFontSize(24);
  doc.setFont(undefined, 'bold');
  doc.text('JOSKA-BANK', 105, 15, { align: 'center' });

  doc.setFontSize(18);
  doc.setFont(undefined, 'normal');
  doc.text(`REÇU DE ${isDepot ? 'DÉPÔT' : 'RETRAIT'}`, 105, 28, { align: 'center' });

  doc.setFontSize(10);
  doc.setTextColor(139, 69, 19); // Brown text
  doc.text('Banque Professionnelle - Service Client', 105, 35, { align: 'center' });
  
  // Réinitialiser la couleur du texte
  doc.setTextColor(0, 0, 0);
  
  // Informations de la transaction
  let y = 60;
  
  // Titre section
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('Détails de l\'opération', 20, y);
  y += 15;
  
  // Ligne de séparation
  doc.setDrawColor(200, 200, 200);
  doc.line(20, y, 190, y);
  y += 10;
  
  // Détails
  doc.setFontSize(12);
  doc.setFont(undefined, 'normal');
  
  const details = [
    { label: 'Date et heure', value: data.date },
    { label: 'Type d\'opération', value: isDepot ? 'Dépôt en espèces' : 'Retrait en espèces' },
    { label: '', value: '' }, // Espace
    { label: 'RIB du compte', value: data.rib },
    { label: '', value: '' }, // Espace
    { label: 'Montant', value: `${data.montant.toFixed(2)} €`, bold: true },
    { label: 'Effectué par', value: data.agent || 'Agent de guichet' }
  ];
  
  details.forEach(item => {
    if (item.label === '') {
      y += 5;
      return;
    }
    
    doc.setFont(undefined, 'bold');
    doc.text(item.label + ' :', 20, y);
    
    doc.setFont(undefined, item.bold ? 'bold' : 'normal');
    if (item.bold) {
      doc.setFontSize(14);
      doc.setTextColor(...color);
    }
    doc.text(item.value, 80, y);
    
    if (item.bold) {
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
    }
    
    y += 10;
  });
  
  // Statut
  y += 10;
  doc.setFillColor(...color);
  doc.roundedRect(20, y, 170, 15, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('✓ OPÉRATION RÉUSSIE', 105, y + 10, { align: 'center' });
  
  // Pied de page
  doc.setTextColor(150, 150, 150);
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text('Ce document est un reçu officiel d\'opération bancaire.', 105, 270, { align: 'center' });
  doc.text('Conservez-le pour vos archives.', 105, 280, { align: 'center' });
  
  // Télécharger le PDF
  const fileName = `recu_${isDepot ? 'depot' : 'retrait'}_${new Date().getTime()}.pdf`;
  doc.save(fileName);
};

