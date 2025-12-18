package com.bank.controller;

import com.bank.dto.DepotRetraitRequest;
import com.bank.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

/**
 * Contrôleur pour les opérations de dépôt et retrait
 * Accessible uniquement aux agents guichet
 */
@RestController
@RequestMapping("/api/depot-retrait")
@CrossOrigin(origins = "http://localhost:3000")
public class DepotRetraitController {
    
    @Autowired
    private TransactionService transactionService;
    
    /**
     * Effectuer un dépôt ou un retrait
     * Nécessite le rôle AGENT_GUICHET
     */
    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_AGENT_GUICHET')")
    public ResponseEntity<?> depotRetrait(
            @Valid @RequestBody DepotRetraitRequest request,
            @RequestHeader("Authorization") String authHeader) {
        try {
            System.out.println("=== Dépôt/Retrait ===");
            System.out.println("RIB: " + request.getRib());
            System.out.println("Montant: " + request.getMontant());
            System.out.println("Type: " + request.getType());
            
            // Convertir le montant en BigDecimal
            BigDecimal montant = BigDecimal.valueOf(request.getMontant());
            
            // Exécuter l'opération
            transactionService.executeDepotRetrait(request.getRib(), montant, request.getType());
            
            Map<String, String> response = new HashMap<>();
            String message = "DEPOT".equals(request.getType()) 
                ? "Dépôt effectué avec succès" 
                : "Retrait effectué avec succès";
            response.put("message", message);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Erreur dépôt/retrait: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }
}

