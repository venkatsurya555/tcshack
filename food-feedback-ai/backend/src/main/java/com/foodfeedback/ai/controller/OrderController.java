package com.foodfeedback.ai.controller;

import com.foodfeedback.ai.model.Order;
import com.foodfeedback.ai.model.QRToken;
import com.foodfeedback.ai.service.RestaurantOperationsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {

    private final RestaurantOperationsService operationsService;

    @Autowired
    public OrderController(RestaurantOperationsService operationsService) {
        this.operationsService = operationsService;
    }

    @GetMapping
    public ResponseEntity<List<Order>> getOrders(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long branch_id,
            @RequestParam(required = false) String status
    ) {
        return ResponseEntity.ok(operationsService.getOrders(search, branch_id, status));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrder(@PathVariable("id") Long id) {
        Order o = operationsService.getOrder(id);
        if (o == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(o);
    }

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Map<String, Object> orderData) {
        Order created = operationsService.createOrder(orderData);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PostMapping("/{id}/qr")
    public ResponseEntity<QRToken> generateOrderQR(@PathVariable("id") Long id) {
        QRToken qr = operationsService.generateOrderQR(id);
        if (qr == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(qr);
    }
}
