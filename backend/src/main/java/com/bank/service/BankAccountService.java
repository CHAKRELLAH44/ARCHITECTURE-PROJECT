package com.bank.service;

import com.bank.dto.BankAccountCreateRequest;
import com.bank.dto.BankAccountDTO;
import com.bank.model.AccountStatus;
import com.bank.model.BankAccount;
import com.bank.model.Client;
import com.bank.repository.BankAccountRepository;
import com.bank.service.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BankAccountService {
    
    @Autowired
    private BankAccountRepository bankAccountRepository;
    
    @Autowired
    private ClientService clientService;
    
    @Transactional
    public BankAccountDTO createAccount(BankAccountCreateRequest request) {
        // Vérifier que le client existe (RG_8)
        Client client = clientService.findByNumeroIdentite(request.getNumeroIdentiteClient());
        
        // Vérifier que le RIB n'existe pas déjà
        if (bankAccountRepository.findByRib(request.getRib()).isPresent()) {
            throw new RuntimeException("Ce RIB existe déjà");
        }
        
        // Le RIB est validé par la validation (@Pattern dans le DTO) - RG_9
        
        // Créer le compte avec statut "Ouvert" (RG_10)
        BankAccount account = new BankAccount();
        account.setRib(request.getRib());
        account.setClient(client);
        account.setStatut(AccountStatus.OUVERT);
        account.setSolde(java.math.BigDecimal.ZERO);
        
        account = bankAccountRepository.save(account);
        
        return mapToDTO(account);
    }
    
    public BankAccount findByRib(String rib) {
        return bankAccountRepository.findByRib(rib)
                .orElseThrow(() -> new RuntimeException("Compte bancaire non trouvé"));
    }
    
    public List<BankAccountDTO> getClientAccounts(Client client) {
        List<BankAccount> accounts = bankAccountRepository.findByClient(client);
        return accounts.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    
    public BankAccountDTO getAccountByRib(String rib) {
        BankAccount account = findByRib(rib);
        return mapToDTO(account);
    }
    
    public BankAccountDTO mapToDTO(BankAccount account) {
        BankAccountDTO dto = new BankAccountDTO();
        dto.setId(account.getId());
        dto.setRib(account.getRib());
        dto.setSolde(account.getSolde());
        dto.setStatut(account.getStatut().name());
        dto.setClientId(account.getClient().getId());
        return dto;
    }
}
