package com.bank.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ClientCreateRequest {
    @NotBlank(message = "Le nom est obligatoire")
    private String nom;
    
    @NotBlank(message = "Le prénom est obligatoire")
    private String prenom;
    
    @NotBlank(message = "Le numéro d'identité est obligatoire")
    private String numeroIdentite;
    
    @NotNull(message = "La date d'anniversaire est obligatoire")
    private LocalDate dateAnniversaire;
    
    @NotBlank(message = "L'adresse mail est obligatoire")
    @Email(message = "L'adresse mail doit être valide")
    private String adresseMail;
    
    @NotBlank(message = "L'adresse postale est obligatoire")
    private String adressePostale;
}

