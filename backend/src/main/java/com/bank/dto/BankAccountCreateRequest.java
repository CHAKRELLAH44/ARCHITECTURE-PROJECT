package com.bank.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class BankAccountCreateRequest {
    @NotBlank(message = "Le RIB est obligatoire")
    @Pattern(regexp = "^[0-9]{24}$", message = "Le RIB doit contenir exactement 24 chiffres")
    private String rib;
    
    @NotBlank(message = "Le numéro d'identité du client est obligatoire")
    private String numeroIdentiteClient;
}

