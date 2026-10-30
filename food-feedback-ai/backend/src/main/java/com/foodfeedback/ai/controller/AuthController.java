package com.foodfeedback.ai.controller;

import com.foodfeedback.ai.model.UserAccount;
import com.foodfeedback.ai.service.RestaurantOperationsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final RestaurantOperationsService operationsService;

    @Autowired
    public AuthController(RestaurantOperationsService operationsService) {
        this.operationsService = operationsService;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.getOrDefault("username", "manager");
        String password = credentials.getOrDefault("password", "admin123");
        Map<String, Object> resp = operationsService.login(username, password);
        return ResponseEntity.ok(resp);
    }

    @GetMapping("/me")
    public ResponseEntity<UserAccount> getMe(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        UserAccount me = operationsService.getMe(authHeader);
        return ResponseEntity.ok(me);
    }

    @GetMapping("/demo-users")
    public ResponseEntity<List<Map<String, Object>>> getDemoUsers() {
        return ResponseEntity.ok(operationsService.getDemoUsers());
    }
}
