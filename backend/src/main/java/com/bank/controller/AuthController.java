package com.bank.controller;

import com.bank.dto.ChangePasswordRequest;
import com.bank.dto.LoginRequest;
import com.bank.dto.LoginResponse;
import com.bank.model.User;
import com.bank.service.UserService;
import com.bank.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Contrôleur pour l'authentification
 * Gère la connexion et le changement de mot de passe
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder; // Pour vérifier les mots de passe cryptés

    @Autowired
    private JwtUtil jwtUtil; // Pour générer les tokens JWT

    /**
     * Endpoint de connexion
     * @param request contient login et password
     * @return JWT token + profil utilisateur (AGENT_GUICHET ou CLIENT)
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        // Chercher l'utilisateur par login
        User user = userService.findByLogin(request.getLogin());

        // Vérifier si l'utilisateur existe et si le mot de passe est correct
        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401).body("Login ou mot de passe erronés");
        }

        // Générer le token JWT
        String token = jwtUtil.generateToken(user.getLogin(), user.getProfile().name());
        return ResponseEntity.ok(new LoginResponse(token, user.getProfile().name(), user.getLogin()));
    }

    /**
     * Endpoint pour changer le mot de passe
     * Nécessite d'être authentifié (token JWT dans le header)
     */
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @RequestBody ChangePasswordRequest request,
            @RequestHeader("Authorization") String authHeader) {
        try {
            // Extraire le token du header "Bearer <token>"
            String token = authHeader.substring(7);
            String login = jwtUtil.getLoginFromToken(token);

            // Changer le mot de passe
            userService.changePassword(login, request);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Mot de passe changé avec succès");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }
}

