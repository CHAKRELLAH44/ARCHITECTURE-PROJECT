package com.bank.config;

import com.bank.model.User;
import com.bank.model.UserProfile;
import com.bank.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) {
        // Créer un utilisateur AGENT_GUICHET par défaut
        if (userRepository.findByLogin("agent@bank.com").isEmpty()) {
            User agent = new User();
            agent.setLogin("agent@bank.com");
            agent.setPassword(passwordEncoder.encode("agent123"));
            agent.setProfile(UserProfile.AGENT_GUICHET);
            userRepository.save(agent);
            System.out.println("Agent guichet créé: agent@bank.com / agent123");
        }
    }
}

