package com.bank.controller;

import com.bank.dto.ClientCreateRequest;
import com.bank.dto.ClientDTO;
import com.bank.model.User;
import com.bank.model.UserProfile;
import com.bank.service.ClientService;
import com.bank.service.UserService;
import com.bank.util.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * Contrôleur pour la gestion des clients
 * Accessible uniquement aux agents guichet
 */
@RestController
@RequestMapping("/api/clients")
@CrossOrigin(origins = "http://localhost:3000")
public class ClientController {

    @Autowired
    private ClientService clientService;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * Créer un nouveau client
     * Nécessite le rôle AGENT_GUICHET
     * Crée automatiquement un compte utilisateur et envoie les identifiants par email
     */
    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_AGENT_GUICHET')")
    public ResponseEntity<?> createClient(
            @Valid @RequestBody ClientCreateRequest request,
            @RequestHeader("Authorization") String authHeader) {
        try {
            System.out.println("=== Création client ===");
            System.out.println("Request: " + request);

            // Créer le client et son compte utilisateur
            ClientDTO client = clientService.createClient(request);
            return ResponseEntity.ok(client);
        } catch (Exception e) {
            System.err.println("Erreur création client: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }
}

