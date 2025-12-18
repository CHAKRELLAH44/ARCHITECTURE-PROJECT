package com.bank.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "clients")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Client {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String nom;
    
    @Column(nullable = false)
    private String prenom;
    
    @Column(unique = true, nullable = false)
    private String numeroIdentite;
    
    @Column(nullable = false)
    private LocalDate dateAnniversaire;
    
    @Column(unique = true, nullable = false)
    private String adresseMail;
    
    @Column(nullable = false)
    private String adressePostale;
    
    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL)
    private List<BankAccount> comptes = new ArrayList<>();
}

