package com.bank.repository;

import com.bank.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
    Optional<Client> findByNumeroIdentite(String numeroIdentite);
    Optional<Client> findByAdresseMail(String adresseMail);
}

