package com.bank.controller;

import com.bank.dto.TransferRequest;
import com.bank.model.User;
import com.bank.service.TransactionService;
import com.bank.service.UserService;
import com.bank.util.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/transfers")
@CrossOrigin(origins = "http://localhost:3000")
public class TransferController {
    
    @Autowired
    private TransactionService transactionService;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_CLIENT')")
    public ResponseEntity<?> createTransfer(
            @Valid @RequestBody TransferRequest request,
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7);
            String login = jwtUtil.getLoginFromToken(token);
            User user = userService.findByLogin(login);
            
            if (user == null || user.getClient() == null) {
                return ResponseEntity.status(403).body("Vous n'avez pas le droit d'accéder à cette fonctionnalité. Veuillez contacter votre administrateur");
            }
            
            // Utiliser le RIB source du compte du client
            String ribSource = request.getRibSource();
            
            transactionService.executeTransfer(request, ribSource);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Virement effectué avec succès");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }
}

