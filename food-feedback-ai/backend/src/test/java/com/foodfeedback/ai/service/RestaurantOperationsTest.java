package com.foodfeedback.ai.service;

import com.foodfeedback.ai.model.ComplaintTicket;
import com.foodfeedback.ai.model.RestaurantBranch;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

public class RestaurantOperationsTest {

    private PriorityScoringService priorityService;
    private TrendDetectionService trendService;
    private RestaurantOperationsService operationsService;

    @BeforeEach
    public void setup() {
        priorityService = new PriorityScoringService();
        trendService = new TrendDetectionService();
        operationsService = new RestaurantOperationsService(null, priorityService);
        operationsService.init();
    }

    @Test
    public void testPriorityFormulaStandardCase() {
        // Formula: P = 0.4*S + 0.3*F + 0.3*T
        // S = 50, F = 80, T = 60 -> P = 20 + 24 + 18 = 62.0
        PriorityScoringService.PriorityResult res = priorityService.calculatePriority(50.0, 80.0, 60.0);
        assertEquals(62.0, res.getTotalScore(), 0.001);
        assertEquals(20.0, res.getSeverityContribution(), 0.001);
        assertEquals(24.0, res.getFrequencyContribution(), 0.001);
        assertEquals(18.0, res.getTrendContribution(), 0.001);
        assertEquals("High", res.getPriorityLevel()); // >= 55.0 is High
    }

    @Test
    public void testPriorityZeroAndMaxInputs() {
        // All zeros
        PriorityScoringService.PriorityResult zero = priorityService.calculatePriority(0.0, 0.0, 0.0);
        assertEquals(0.0, zero.getTotalScore(), 0.001);
        assertEquals("Low", zero.getPriorityLevel());

        // All max (100)
        PriorityScoringService.PriorityResult max = priorityService.calculatePriority(100.0, 100.0, 100.0);
        assertEquals(100.0, max.getTotalScore(), 0.001);
        assertEquals("Critical", max.getPriorityLevel()); // >= 75.0 is Critical
    }

    @Test
    public void testPriorityMissingAndInvalidInputs() {
        // Missing (null) values default to neutral 50.0
        PriorityScoringService.PriorityResult nulls = priorityService.calculatePriority(null, null, null);
        assertEquals(50.0, nulls.getTotalScore(), 0.001);
        assertEquals("Medium", nulls.getPriorityLevel()); // >= 35.0 is Medium

        // Values exceeding bounds should be clamped to [0, 100]
        PriorityScoringService.PriorityResult clamped = priorityService.calculatePriority(150.0, -20.0, 120.0);
        // 0.4*100 + 0.3*0 + 0.3*100 = 40 + 0 + 30 = 70.0
        assertEquals(70.0, clamped.getTotalScore(), 0.001);
        assertEquals("High", clamped.getPriorityLevel());
    }

    @Test
    public void testTrendDetectionWithTimestamps() {
        List<String> dates = List.of(
                "2026-10-25 10:00:00",
                "2026-10-25 14:00:00",
                "2026-10-26 12:00:00",
                "invalid-timestamp",
                ""
        );
        Map<String, Integer> counts = trendService.aggregateDailyCounts(dates);
        assertTrue(counts.containsKey("2026-10-25"));
        assertEquals(2, counts.get("2026-10-25"));
        assertEquals(1, counts.get("2026-10-26"));
    }

    @Test
    public void testDepartmentRoutingAllSixDepartments() {
        // 1. Food Temperature -> Kitchen (Dept 1)
        ComplaintTicket t1 = submitTestFeedback("Food Temperature", "Soup was freezing cold", 1);
        assertEquals(1L, t1.getDepartmentId());
        assertEquals("Kitchen & Culinary", t1.getDepartmentName());

        // 2. Staff Behaviour -> Service (Dept 2)
        ComplaintTicket t2 = submitTestFeedback("Staff Behaviour", "Waiter was extremely rude and unhelpful", 1);
        assertEquals(2L, t2.getDepartmentId());
        assertEquals("Service & Hospitality", t2.getDepartmentName());

        // 3. Billing Errors -> Billing (Dept 3)
        ComplaintTicket t3 = submitTestFeedback("Billing Errors", "Charged twice for the butter chicken on the bill", 1);
        assertEquals(3L, t3.getDepartmentId());
        assertEquals("Billing & Cashier", t3.getDepartmentName());

        // 4. Packaging Problems -> Packaging (Dept 4)
        ComplaintTicket t4 = submitTestFeedback("Packaging Problems", "Curry leaked and container seal was broken", 2);
        assertEquals(4L, t4.getDepartmentId());
        assertEquals("Packaging & Dispatch", t4.getDepartmentName());

        // 5. Delivery Delays -> Delivery (Dept 5)
        ComplaintTicket t5 = submitTestFeedback("Delivery Delays", "Rider was an hour late and courier drove slowly", 1);
        assertEquals(5L, t5.getDepartmentId());
        assertEquals("Delivery Operations", t5.getDepartmentName());

        // 6. Ambiguous / Unclassified -> Executive Management (Dept 6)
        ComplaintTicket t6 = submitTestFeedback("Other", "Overall terrible experience with everything", 1);
        assertEquals(6L, t6.getDepartmentId());
        assertEquals("Executive Management", t6.getDepartmentName());
    }

    @Test
    public void testManagerVerificationEnforcement() {
        // Create a ticket
        ComplaintTicket ticket = submitTestFeedback("Food Quality", "Chicken was raw inside", 1);
        assertNotNull(ticket);
        assertEquals("Open", ticket.getStatus());

        // Record investigation and corrective action
        operationsService.recordCorrectiveAction(ticket.getId(), "Undercooked batch probe failure", "Retrained grill station", "Daily probe logs", "Chef Suresh");
        ComplaintTicket pendingTicket = operationsService.getComplaints(null, null, null, null, null, null)
                .stream().filter(t -> t.getId().equals(ticket.getId())).findFirst().orElse(null);
        assertNotNull(pendingTicket);
        assertEquals("Resolved Pending Verification", pendingTicket.getStatus());

        // Manager formal verification approves resolution
        ComplaintTicket verified = operationsService.verifyResolution(ticket.getId(), true, "Approved after inspecting temperature logs", "Kavita Nair (Branch Manager)");
        assertNotNull(verified);
        assertEquals("Resolved", verified.getStatus());
        assertNotNull(verified.getVerifiedAt());
        assertEquals("Kavita Nair (Branch Manager)", verified.getVerifiedByName());
    }

    private ComplaintTicket submitTestFeedback(String category, String comment, int rating) {
        Map<String, Object> data = new HashMap<>();
        data.put("customer_name", "Test Diner");
        data.put("customer_phone", "9998887776");
        data.put("overall_comment", comment);

        Map<String, Object> item = new HashMap<>();
        item.put("item_name", "Dum Biryani");
        item.put("rating", rating);
        item.put("issue_category", category);
        item.put("comment", comment);
        data.put("items", List.of(item));

        Map<String, Object> res = operationsService.submitFeedback(data);
        List<String> tktNums = (List<String>) res.get("tickets_created");
        assertFalse(tktNums.isEmpty());
        String tktNum = tktNums.get(0);

        return operationsService.getComplaints(null, null, null, null, null, null)
                .stream().filter(t -> t.getTicketNumber().equals(tktNum)).findFirst().orElse(null);
    }
}
