import jsPDF from 'jspdf';

// Theme colors (match app CSS)
const COLORS = {
  primary: [30, 58, 95],      // #1e3a5f
  accent: [255, 140, 66],     // #ff8c42
  muted: [100, 116, 139],     // #64748b
  success: [16, 185, 129],    // #10b981
  black: [0, 0, 0],
  lightGray: [200, 200, 200]
};

const PAGE = { width: 210, height: 297 };

function drawHeader(doc, title, subtitle) {
  // Header background
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 0, PAGE.width, 28, 'F');

  // Bank name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont(undefined, 'bold');
  doc.text('JOSKA-BANK', PAGE.width / 2, 10, { align: 'center' });

  // Subtitle (small)
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text(subtitle, PAGE.width / 2, 20, { align: 'center' });

  // Thin accent bar
  doc.setFillColor(...COLORS.accent);
  doc.rect(15, 28, PAGE.width - 30, 3, 'F');
}

function footer(doc){
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.muted);
  doc.setFont(undefined, 'normal');
  doc.text('JOSKA-BANK • https://joska-bank.example', PAGE.width / 2, PAGE.height - 18, { align: 'center' });
  doc.text('Document généré automatiquement — conservez pour vos archives', PAGE.width / 2, PAGE.height - 12, { align: 'center' });
}

export const generateVirementPDF = (data) => {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  drawHeader(doc, 'Reçu de virement', 'Banque Professionnelle - Service Client');

  // Card area
  doc.setDrawColor(...COLORS.lightGray);
  doc.roundedRect(15, 35, PAGE.width - 30, 110, 4, 4);

  let y = 48;

  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(...COLORS.primary);
  doc.text('Détails de la transaction', 20, y);

  y += 8;
  doc.setDrawColor(...COLORS.lightGray);
  doc.line(20, y, PAGE.width - 20, y);

  y += 8;
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');

  const items = [
    { label: 'Date et heure', value: data.date },
    { label: 'Numéro de transaction', value: data.transactionId || 'N/A' },
    { label: 'Émetteur (RIB)', value: data.ribSource },
    { label: 'Bénéficiaire (RIB)', value: data.ribDestinataire },
    { label: 'Motif', value: data.motif || 'Non spécifié' }
  ];

  items.forEach(it => {
    doc.setTextColor(...COLORS.muted);
    doc.setFont(undefined, 'bold');
    doc.text(it.label + ' :', 20, y);

    doc.setTextColor(...COLORS.black);
    doc.setFont(undefined, 'normal');
    doc.text(String(it.value), 80, y);

    y += 8;
  });

  // Amount emphasized
  y += 6;
  doc.setFont(undefined, 'bold');
  doc.setTextColor(...COLORS.accent);
  doc.setFontSize(16);
  doc.text(`${data.montant.toFixed(2)} €`, 20, y);

  // Status
  y += 12;
  doc.setFillColor(...COLORS.success);
  doc.roundedRect(20, y, PAGE.width - 40, 10, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text('✓ TRANSACTION RÉUSSIE', PAGE.width / 2, y + 7, { align: 'center' });

  // Footer
  footer(doc);

  const fileName = `recu_virement_${new Date().getTime()}.pdf`;
  doc.save(fileName);
};

export const generateDepotRetraitPDF = (data) => {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const isDepot = data.type === 'DEPOT';

  drawHeader(doc, isDepot ? 'Reçu de dépôt' : 'Reçu de retrait', 'Banque Professionnelle - Service Client');

  // Card area
  doc.setDrawColor(...COLORS.lightGray);
  doc.roundedRect(15, 35, PAGE.width - 30, 110, 4, 4);

  let y = 48;

  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(...COLORS.primary);
  doc.text("Détails de l'opération", 20, y);

  y += 8;
  doc.setDrawColor(...COLORS.lightGray);
  doc.line(20, y, PAGE.width - 20, y);

  y += 8;
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');

  const details = [
    { label: 'Date et heure', value: data.date },
    { label: 'Type d\'opération', value: isDepot ? 'Dépôt en espèces' : 'Retrait en espèces' },
    { label: 'RIB du compte', value: data.rib },
    { label: 'Effectué par', value: data.agent || 'Agent de guichet' }
  ];

  details.forEach(item => {
    doc.setTextColor(...COLORS.muted);
    doc.setFont(undefined, 'bold');
    doc.text(item.label + ' :', 20, y);

    doc.setTextColor(...COLORS.black);
    doc.setFont(undefined, 'normal');
    doc.text(String(item.value), 80, y);

    y += 8;
  });

  // Amount emphasized
  y += 6;
  doc.setFont(undefined, 'bold');
  doc.setTextColor(...COLORS.accent);
  doc.setFontSize(16);
  doc.text(`${data.montant.toFixed(2)} €`, 20, y);

  // Status
  y += 12;
  doc.setFillColor(...COLORS.success);
  doc.roundedRect(20, y, PAGE.width - 40, 10, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text('✓ OPÉRATION RÉUSSIE', PAGE.width / 2, y + 7, { align: 'center' });

  // Footer
  footer(doc);

  const fileName = `recu_${isDepot ? 'depot' : 'retrait'}_${new Date().getTime()}.pdf`;
  doc.save(fileName);
};

