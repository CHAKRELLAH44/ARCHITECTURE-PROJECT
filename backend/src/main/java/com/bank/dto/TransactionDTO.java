package com.bank.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class TransactionDTO {
    private Long id;
    private String intitule;
    private String type;
    private BigDecimal montant;
    private LocalDateTime dateOperation;
    private String motif;
    private String ribDestinataire;
}

