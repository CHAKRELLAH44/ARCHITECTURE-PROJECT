import React from 'react';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-inner">
        <h1>JOSKA-BANK — Banque moderne et sûre</h1>
        <p>Gérez vos clients, vos comptes et vos opérations avec une interface simple et sécurisée.</p>
        <div className="hero-ctas">
          <a className="btn btn-primary" href="/login">Accéder au tableau</a>
          <a className="btn btn-secondary" href="/dashboard/agent">Voir le dashboard agent</a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
