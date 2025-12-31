import React from 'react';
import Hero from '../components/Hero';

const Landing = () => {
  return (
    <div>
      <Hero />
      <div style={{padding: '2rem', maxWidth: 1000, margin: '0 auto'}}>
        <h2>À propos de JOSKA-BANK</h2>
        <p>Solution de démonstration : gestion simplifiée des clients et opérations bancaires. Interface front-end propre et prête pour des intégrations backend.</p>
      </div>
    </div>
  );
};

export default Landing;
