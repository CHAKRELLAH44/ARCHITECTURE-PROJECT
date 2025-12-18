package com.bank.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

/**
 * DTO pour les opérations de dépôt et retrait
 */
@Data
public class DepotRetraitRequest {
    
    @NotBlank(message = "Le RIB est obligatoire")
    private String rib; // RIB du compte à créditer/débiter
    
    @NotNull(message = "Le montant est obligatoire")
    @Positive(message = "Le montant doit être positif")
    private Double montant;
    
    @NotBlank(message = "Le type d'opération est obligatoire")
    private String type; // "DEPOT" ou "RETRAIT"
}

