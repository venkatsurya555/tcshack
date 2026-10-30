package com.foodfeedback.ai.controller;

import com.foodfeedback.ai.model.CustomerNotification;
import com.foodfeedback.ai.service.RestaurantOperationsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/notifications")
public class NotificationController {

    private final RestaurantOperationsService operationsService;

    @Autowired
    public NotificationController(RestaurantOperationsService operationsService) {
        this.operationsService = operationsService;
    }

    @GetMapping
    public ResponseEntity<List<CustomerNotification>> getNotifications(
            @RequestParam(defaultValue = "false") boolean unread_only
    ) {
        return ResponseEntity.ok(operationsService.getNotifications(unread_only));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<CustomerNotification> markAsRead(@PathVariable("id") Long id) {
        CustomerNotification n = operationsService.markNotificationRead(id);
        if (n == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(n);
    }

    @GetMapping("/delivery-logs")
    public ResponseEntity<List<Map<String, Object>>> getDeliveryLogs() {
        return ResponseEntity.ok(operationsService.getDeliveryLogs());
    }
}
