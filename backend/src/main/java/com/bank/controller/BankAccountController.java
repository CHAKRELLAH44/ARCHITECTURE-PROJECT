package com.bank.controller;

import com.bank.dto.BankAccountCreateRequest;
import com.bank.dto.BankAccountDTO;
import com.bank.service.BankAccountService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/accounts")
@CrossOrigin(origins = "http://localhost:3000")
public class BankAccountController {
    
    @Autowired
    private BankAccountService bankAccountService;
    
    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_AGENT_GUICHET')")
    public ResponseEntity<?> createAccount(
            @Valid @RequestBody BankAccountCreateRequest request,
            @RequestHeader("Authorization") String authHeader) {
        try {
            BankAccountDTO account = bankAccountService.createAccount(request);
            return ResponseEntity.ok(account);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }
}

