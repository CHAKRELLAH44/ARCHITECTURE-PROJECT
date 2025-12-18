# Frontend - Application Bancaire React

## Description

Frontend développé avec React pour l'application bancaire.

## Technologies

- React 18
- React Router DOM 6
- Axios
- Context API

## Structure

```
src/
├── components/     # Composants réutilisables (ProtectedRoute)
├── context/        # Context React (AuthContext)
├── pages/          # Pages de l'application
│   ├── Login.js
│   ├── ClientDashboard.js
│   ├── AgentDashboard.js
│   ├── ChangePassword.js
│   └── Transfer.js
├── App.js          # Composant principal avec routing
└── index.js        # Point d'entrée
```

## Installation

```bash
npm install
```

## Lancement

```bash
npm start
```

L'application sera accessible sur `http://localhost:3000`

## Configuration

L'application est configurée pour communiquer avec le backend sur `http://localhost:8080` via le proxy défini dans `package.json`.

## Pages

- **Login** : Page de connexion
- **ClientDashboard** : Tableau de bord client avec opérations et virements
- **AgentDashboard** : Interface agent pour créer clients et comptes
- **ChangePassword** : Changement de mot de passe
- **Transfer** : Formulaire de virement

## Authentification

L'authentification est gérée via JWT stocké dans le localStorage. Le token est automatiquement inclus dans les requêtes axios.

