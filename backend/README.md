# Backend - Application Bancaire Spring Boot

## Description

Backend REST API développé avec Spring Boot pour l'application bancaire.

## Technologies

- Spring Boot 3.2.0
- Spring Security
- JWT (JSON Web Tokens)
- Spring Data JPA
- H2 Database
- Lombok
- Spring Mail

## Structure

```
src/main/java/com/bank/
├── config/          # Configuration (DataInitializer, MethodSecurityConfig)
├── controller/      # Contrôleurs REST (Auth, Client, Account, Dashboard, Transfer)
├── dto/            # Data Transfer Objects
├── exception/      # Gestion globale des erreurs
├── model/          # Entités JPA (User, Client, BankAccount, Transaction)
├── repository/     # Repositories Spring Data
├── security/       # Configuration sécurité et filtre JWT
├── service/        # Services métier
└── util/           # Utilitaires (JWT, PasswordGenerator)
```

## Configuration

Les paramètres de configuration se trouvent dans `application.properties` :

- Port : 8080
- Base de données H2 en mémoire
- JWT secret et expiration
- Configuration CORS
- Configuration email (optionnelle)

## Lancement

```bash
mvn spring-boot:run
```

## Endpoints API

Tous les endpoints nécessitent une authentification JWT sauf `/api/auth/login` et `/h2-console/**`.

## Console H2

Accédez à la console H2 à l'adresse : `http://localhost:8080/h2-console`

- JDBC URL: `jdbc:h2:mem:bankdb`
- Username: `sa`
- Password: (vide)

