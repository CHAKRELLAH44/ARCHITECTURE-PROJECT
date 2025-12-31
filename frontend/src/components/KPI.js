import React from 'react';
import './KPI.css';

const KpiCard = ({label, value, unit}) => (
  <div className="kpi-card">
    <div className="kpi-value">{value}{unit && <span className="kpi-unit">{unit}</span>}</div>
    <div className="kpi-label">{label}</div>
  </div>
);

const KPI = ({data}) => {
  return (
    <div className="kpi-container">
      <KpiCard label="Clients" value={data.clients} />
      <KpiCard label="Comptes" value={data.accounts} />
      <KpiCard label="Dépôts (€)" value={data.deposits.toLocaleString('fr-FR', {maximumFractionDigits: 2})} />
    </div>
  );
};

export default KPI;
