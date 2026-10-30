package com.foodfeedback.ai.controller;

import com.foodfeedback.ai.model.QRToken;
import com.foodfeedback.ai.service.RestaurantOperationsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/qr")
public class QRController {

    private final RestaurantOperationsService operationsService;

    @Autowired
    public QRController(RestaurantOperationsService operationsService) {
        this.operationsService = operationsService;
    }

    @GetMapping("/tokens")
    public ResponseEntity<List<QRToken>> getQRTokens(
            @RequestParam(required = false) Long branch_id,
            @RequestParam(required = false) String status_filter
    ) {
        return ResponseEntity.ok(operationsService.getQRTokens(branch_id, status_filter));
    }

    @GetMapping("/validate/{token}")
    public ResponseEntity<Map<String, Object>> validateToken(@PathVariable("token") String token) {
        return ResponseEntity.ok(operationsService.validateQRToken(token));
    }

    @GetMapping("/{token}/preview")
    public ResponseEntity<Map<String, Object>> getPreview(@PathVariable("token") String token) {
        Map<String, Object> val = operationsService.validateQRToken(token);
        return ResponseEntity.ok(val);
    }

    @PostMapping("/{token}/revoke")
    public ResponseEntity<Map<String, Object>> revokeToken(@PathVariable("token") String token) {
        return ResponseEntity.ok(operationsService.revokeQRToken(token));
    }
}
