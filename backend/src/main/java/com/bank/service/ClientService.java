package com.bank.service;

import com.bank.dto.ClientCreateRequest;
import com.bank.dto.ClientDTO;
import com.bank.model.Client;
import com.bank.model.User;
import com.bank.model.UserProfile;
import com.bank.repository.ClientRepository;
import com.bank.repository.UserRepository;
import com.bank.util.PasswordGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service pour la gestion des clients
 * Gère la création de clients et leurs comptes utilisateurs
 */
@Service
public class ClientService {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; // Pour crypter les mots de passe

    @Autowired
    private EmailService emailService; // Pour envoyer les identifiants

    /**
     * Créer un nouveau client avec son compte utilisateur
     * @param request données du client (nom, prénom, email, etc.)
     * @return ClientDTO avec les informations du client créé
     */
    @Transactional
    public ClientDTO createClient(ClientCreateRequest request) {
        // Vérifier que le numéro d'identité n'existe pas déjà
        if (clientRepository.findByNumeroIdentite(request.getNumeroIdentite()).isPresent()) {
            throw new RuntimeException("Le numéro d'identité existe déjà");
        }

        // Vérifier que l'email n'existe pas déjà
        if (clientRepository.findByAdresseMail(request.getAdresseMail()).isPresent()) {
            throw new RuntimeException("L'adresse mail existe déjà");
        }

        // Créer l'entité Client avec les données reçues
        Client client = new Client();
        client.setNom(request.getNom());
        client.setPrenom(request.getPrenom());
        client.setNumeroIdentite(request.getNumeroIdentite());
        client.setDateAnniversaire(request.getDateAnniversaire());
        client.setAdresseMail(request.getAdresseMail());
        client.setAdressePostale(request.getAdressePostale());

        // Sauvegarder le client en base de données
        client = clientRepository.save(client);

        // Créer le compte utilisateur pour ce client
        String login = request.getAdresseMail(); // L'email sert de login
        String generatedPassword = PasswordGenerator.generate(); // Générer un mot de passe aléatoire

        User user = new User();
        user.setLogin(login);
        user.setPassword(passwordEncoder.encode(generatedPassword)); // Crypter le mot de passe
        user.setProfile(UserProfile.CLIENT); // Profil CLIENT (pas AGENT)
        user.setClient(client); // Lier l'utilisateur au client
        userRepository.save(user);

        // Envoyer les identifiants par email (en dev: affiche dans la console)
        emailService.sendCredentials(request.getAdresseMail(), login, generatedPassword);

        return mapToDTO(client);
    }
    
    public Client findByNumeroIdentite(String numeroIdentite) {
        return clientRepository.findByNumeroIdentite(numeroIdentite)
                .orElseThrow(() -> new RuntimeException("Client non trouvé"));
    }
    
    private ClientDTO mapToDTO(Client client) {
        ClientDTO dto = new ClientDTO();
        dto.setId(client.getId());
        dto.setNom(client.getNom());
        dto.setPrenom(client.getPrenom());
        dto.setNumeroIdentite(client.getNumeroIdentite());
        dto.setDateAnniversaire(client.getDateAnniversaire());
        dto.setAdresseMail(client.getAdresseMail());
        dto.setAdressePostale(client.getAdressePostale());
        return dto;
    }
}

