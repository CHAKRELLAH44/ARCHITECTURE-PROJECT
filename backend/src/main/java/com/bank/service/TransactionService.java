package com.bank.service;

import com.bank.dto.TransactionDTO;
import com.bank.dto.TransferRequest;
import com.bank.model.AccountStatus;
import com.bank.model.BankAccount;
import com.bank.model.Transaction;
import com.bank.model.TransactionType;
import com.bank.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransactionService {
    
    @Autowired
    private TransactionRepository transactionRepository;
    
    @Autowired
    private BankAccountService bankAccountService;
    
    @Transactional
    public void executeTransfer(TransferRequest request, String ribSource) {
        // Récupérer les comptes
        BankAccount compteSource = bankAccountService.findByRib(ribSource);
        BankAccount compteDestinataire = bankAccountService.findByRib(request.getRibDestinataire());
        
        // Vérifier que le compte source n'est pas bloqué ou clôturé (RG_11)
        if (compteSource.getStatut() != AccountStatus.OUVERT) {
            throw new RuntimeException("Le compte bancaire est bloqué ou clôturé");
        }
        
        // Vérifier que le solde est suffisant (RG_12)
        if (compteSource.getSolde().compareTo(request.getMontant()) < 0) {
            throw new RuntimeException("Solde insuffisant");
        }
        
        // Débiter le compte source (RG_13)
        compteSource.setSolde(compteSource.getSolde().subtract(request.getMontant()));
        compteSource.setDernierMouvement(LocalDateTime.now());
        
        // Créditer le compte destinataire (RG_14)
        compteDestinataire.setSolde(compteDestinataire.getSolde().add(request.getMontant()));
        compteDestinataire.setDernierMouvement(LocalDateTime.now());
        
        // Créer la transaction de débit (RG_15)
        Transaction debit = new Transaction();
        debit.setIntitule("Virement vers " + request.getRibDestinataire());
        debit.setType(TransactionType.DEBIT);
        debit.setMontant(request.getMontant());
        debit.setCompte(compteSource);
        debit.setMotif(request.getMotif());
        debit.setRibDestinataire(request.getRibDestinataire());
        debit.setDateOperation(LocalDateTime.now());
        
        // Créer la transaction de crédit (RG_15)
        Transaction credit = new Transaction();
        credit.setIntitule("Virement en votre faveur de " + ribSource);
        credit.setType(TransactionType.CREDIT);
        credit.setMontant(request.getMontant());
        credit.setCompte(compteDestinataire);
        credit.setMotif(request.getMotif());
        credit.setRibDestinataire(request.getRibDestinataire());
        credit.setDateOperation(LocalDateTime.now());
        
        transactionRepository.save(debit);
        transactionRepository.save(credit);
    }
    
    public List<TransactionDTO> getLastTransactions(BankAccount account, int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        Page<Transaction> page = transactionRepository.findByCompteOrderByDateOperationDesc(account, pageable);
        return page.getContent().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    
    public Page<TransactionDTO> getTransactionsPaginated(BankAccount account, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Transaction> transactions = transactionRepository.findByCompteOrderByDateOperationDesc(account, pageable);
        return transactions.map(this::mapToDTO);
    }
    
    private TransactionDTO mapToDTO(Transaction transaction) {
        TransactionDTO dto = new TransactionDTO();
        dto.setId(transaction.getId());
        dto.setIntitule(transaction.getIntitule());
        dto.setType(transaction.getType().name());
        dto.setMontant(transaction.getMontant());
        dto.setDateOperation(transaction.getDateOperation());
        dto.setMotif(transaction.getMotif());
        dto.setRibDestinataire(transaction.getRibDestinataire());
        return dto;
    }
}

