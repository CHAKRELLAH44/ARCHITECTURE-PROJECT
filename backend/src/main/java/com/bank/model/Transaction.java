package com.bank.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String intitule;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType type;
    
    @Column(nullable = false)
    private BigDecimal montant;
    
    @Column(nullable = false)
    private LocalDateTime dateOperation = LocalDateTime.now();
    
    @ManyToOne
    @JoinColumn(name = "account_id", nullable = false)
    private BankAccount compte;
    
    @Column
    private String motif;
    
    @Column
    private String ribDestinataire;
}

