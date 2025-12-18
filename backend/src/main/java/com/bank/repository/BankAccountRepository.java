package com.bank.repository;

import com.bank.model.BankAccount;
import com.bank.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BankAccountRepository extends JpaRepository<BankAccount, Long> {
    Optional<BankAccount> findByRib(String rib);
    List<BankAccount> findByClient(Client client);
    List<BankAccount> findByClientOrderByDernierMouvementDesc(Client client);
}

