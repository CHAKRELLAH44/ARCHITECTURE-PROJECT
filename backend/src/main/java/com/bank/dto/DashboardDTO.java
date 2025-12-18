package com.bank.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
public class DashboardDTO {
    private String rib;
    private BigDecimal solde;
    private List<TransactionDTO> operations;
    private List<BankAccountDTO> comptes;
}

