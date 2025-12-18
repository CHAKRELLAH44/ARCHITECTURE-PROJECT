package com.bank.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class BankAccountDTO {
    private Long id;
    private String rib;
    private BigDecimal solde;
    private String statut;
    private Long clientId;
}

