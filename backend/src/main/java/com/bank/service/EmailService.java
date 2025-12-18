package com.bank.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * Service d'envoi d'emails
 * En mode développement (sans config SMTP), affiche les emails dans la console
 * En production, envoie de vrais emails via SMTP
 */
@Service
public class EmailService {

    @Autowired(required = false) // Optional: si pas configuré, mailSender sera null
    private JavaMailSender mailSender;

    /**
     * Envoyer les identifiants de connexion à un nouveau client
     * @param email adresse email du client
     * @param login login généré (= email)
     * @param password mot de passe généré aléatoirement
     */
    public void sendCredentials(String email, String login, String password) {
        // Mode développement: afficher dans la console au lieu d'envoyer un email
        if (mailSender == null) {
            System.out.println("=== EMAIL SERVICE (DEV MODE) ===");
            System.out.println("To: " + email);
            System.out.println("Subject: Vos identifiants bancaires");
            System.out.println("Votre login: " + login);
            System.out.println("Votre mot de passe: " + password);
            System.out.println("================================");
            return;
        }

        // Mode production: envoyer un vrai email
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Vos identifiants bancaires");
        message.setText("Bonjour,\n\n" +
                "Votre compte bancaire a été créé avec succès.\n\n" +
                "Votre login: " + login + "\n" +
                "Votre mot de passe: " + password + "\n\n" +
                "Veuillez changer votre mot de passe après votre première connexion.\n\n" +
                "Cordialement,\n" +
                "Votre banque");

        mailSender.send(message);
    }
}

