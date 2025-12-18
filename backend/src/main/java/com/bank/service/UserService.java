package com.bank.service;

import com.bank.dto.ChangePasswordRequest;
import com.bank.model.User;
import com.bank.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public User findByLogin(String login) {
        return userRepository.findByLogin(login).orElse(null);
    }
    
    @Transactional
    public void changePassword(String login, ChangePasswordRequest request) {
        User user = findByLogin(login);
        if (user == null) {
            throw new RuntimeException("Utilisateur non trouvé");
        }
        
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("Ancien mot de passe incorrect");
        }
        
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
    
    public void saveUser(User user) {
        userRepository.save(user);
    }
}

