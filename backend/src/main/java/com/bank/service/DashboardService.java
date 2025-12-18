package com.bank.service;

import com.bank.dto.BankAccountDTO;
import com.bank.dto.DashboardDTO;
import com.bank.dto.TransactionDTO;
import com.bank.model.BankAccount;
import com.bank.model.Client;
import com.bank.repository.BankAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DashboardService {
    
    @Autowired
    private BankAccountRepository bankAccountRepository;
    
    @Autowired
    private BankAccountService bankAccountService;
    
    @Autowired
    private TransactionService transactionService;
    
    public DashboardDTO getDashboard(Client client, String rib) {
        List<BankAccount> allAccounts = bankAccountRepository.findByClientOrderByDernierMouvementDesc(client);
        List<BankAccountDTO> comptesDTO = allAccounts.stream()
                .map(bankAccountService::mapToDTO)
                .toList();
        
        // Si aucun RIB spécifié, utiliser le compte le plus récemment mouvementé
        BankAccount selectedAccount;
        if (rib == null || rib.isEmpty()) {
            selectedAccount = allAccounts.isEmpty() ? null : allAccounts.get(0);
        } else {
            selectedAccount = bankAccountRepository.findByRib(rib)
                    .orElse(null);
            // Vérifier que le compte appartient au client
            if (selectedAccount != null && !selectedAccount.getClient().getId().equals(client.getId())) {
                selectedAccount = null;
            }
        }
        
        if (selectedAccount == null) {
            return new DashboardDTO("", java.math.BigDecimal.ZERO, List.of(), comptesDTO);
        }
        
        // Récupérer les 10 dernières opérations
        List<TransactionDTO> operations = transactionService.getLastTransactions(selectedAccount, 10);
        
        return new DashboardDTO(
                selectedAccount.getRib(),
                selectedAccount.getSolde(),
                operations,
                comptesDTO
        );
    }
}

