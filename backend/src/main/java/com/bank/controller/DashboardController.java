package com.bank.controller;

import com.bank.dto.DashboardDTO;
import com.bank.model.User;
import com.bank.service.DashboardService;
import com.bank.service.UserService;
import com.bank.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:3000")
public class DashboardController {
    
    @Autowired
    private DashboardService dashboardService;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_CLIENT')")
    public ResponseEntity<?> getDashboard(
            @RequestParam(required = false) String rib,
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7);
            String login = jwtUtil.getLoginFromToken(token);
            User user = userService.findByLogin(login);
            
            if (user == null || user.getClient() == null) {
                return ResponseEntity.status(403).body("Vous n'avez pas le droit d'accéder à cette fonctionnalité. Veuillez contacter votre administrateur");
            }
            
            DashboardDTO dashboard = dashboardService.getDashboard(user.getClient(), rib);
            return ResponseEntity.ok(dashboard);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }
}

