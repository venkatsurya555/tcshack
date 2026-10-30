package com.foodfeedback.ai.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.foodfeedback.ai.model.*;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Service
public class RestaurantOperationsService {

    private static final Logger log = LoggerFactory.getLogger(RestaurantOperationsService.class);
    private static final DateTimeFormatter ISO_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    private final ObjectMapper mapper = new ObjectMapper()
            .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

    private final ReviewService reviewService;

    // Concurrent in-memory storage
    private final Map<Long, RestaurantBranch> branches = new ConcurrentHashMap<>();
    private final Map<Long, Department> departments = new ConcurrentHashMap<>();
    private final Map<String, Department> departmentsByCode = new ConcurrentHashMap<>();
    private final Map<Long, UserAccount> users = new ConcurrentHashMap<>();
    private final Map<String, UserAccount> usersByUsername = new ConcurrentHashMap<>();
    private final Map<Long, MenuItem> menuItems = new ConcurrentHashMap<>();
    private final Map<Long, Order> orders = new ConcurrentHashMap<>();
    private final Map<String, Order> ordersByNumber = new ConcurrentHashMap<>();
    private final Map<Long, OrderItem> orderItems = new ConcurrentHashMap<>();
    private final Map<String, QRToken> qrTokens = new ConcurrentHashMap<>();
    private final Map<Long, QRToken> qrTokensByOrderId = new ConcurrentHashMap<>();
    private final Map<Long, ComplaintTicket> tickets = new ConcurrentHashMap<>();
    private final Map<String, ComplaintTicket> ticketsByNumber = new ConcurrentHashMap<>();
    private final List<CustomerNotification> notifications = Collections.synchronizedList(new ArrayList<>());
    private final Map<Long, FeedbackSubmission> feedbacks = new ConcurrentHashMap<>();
    private final Map<Long, ItemFeedback> itemFeedbacks = new ConcurrentHashMap<>();
    private final List<RoutingRule> routingRules = Collections.synchronizedList(new ArrayList<>());
    private final Map<String, AppSetting> settings = new ConcurrentHashMap<>();

    // ID Counters
    private final AtomicLong orderIdGen = new AtomicLong(100);
    private final AtomicLong orderItemIdGen = new AtomicLong(200);
    private final AtomicLong qrIdGen = new AtomicLong(100);
    private final AtomicLong ticketIdGen = new AtomicLong(100);
    private final AtomicLong feedbackIdGen = new AtomicLong(100);
    private final AtomicLong itemFeedbackIdGen = new AtomicLong(200);
    private final AtomicLong notifIdGen = new AtomicLong(100);
    private final AtomicLong historyIdGen = new AtomicLong(100);
    private final AtomicLong noteIdGen = new AtomicLong(100);
    private final AtomicLong staffIdGen = new AtomicLong(100);
    private final AtomicLong menuIdGen = new AtomicLong(100);

    private final PriorityScoringService priorityScoringService;

    @Autowired
    public RestaurantOperationsService(
            @Autowired(required = false) ReviewService reviewService,
            @Autowired(required = false) PriorityScoringService priorityScoringService) {
        this.reviewService = reviewService;
        this.priorityScoringService = priorityScoringService != null ? priorityScoringService : new PriorityScoringService();
    }

    @PostConstruct
    public void init() {
        log.info("Initializing RestaurantOperationsService from seed-data.json...");
        try {
            ClassPathResource res = new ClassPathResource("seed-data.json");
            if (res.exists()) {
                try (InputStream is = res.getInputStream()) {
                    JsonNode root = mapper.readTree(is);

                    // 1. Branches
                    if (root.has("restaurant_branches")) {
                        List<RestaurantBranch> list = mapper.convertValue(root.get("restaurant_branches"), new TypeReference<List<RestaurantBranch>>() {});
                        for (RestaurantBranch b : list) {
                            branches.put(b.getId(), b);
                        }
                    }

                    // 2. Departments
                    if (root.has("departments")) {
                        List<Department> list = mapper.convertValue(root.get("departments"), new TypeReference<List<Department>>() {});
                        for (Department d : list) {
                            departments.put(d.getId(), d);
                            if (d.getCode() != null) {
                                departmentsByCode.put(d.getCode().toLowerCase(), d);
                            }
                        }
                    }

                    // 3. Users
                    if (root.has("users")) {
                        List<UserAccount> list = mapper.convertValue(root.get("users"), new TypeReference<List<UserAccount>>() {});
                        for (UserAccount u : list) {
                            enrichUser(u);
                            users.put(u.getId(), u);
                            usersByUsername.put(u.getUsername().toLowerCase(), u);
                            if (u.getId() >= staffIdGen.get()) staffIdGen.set(u.getId() + 1);
                        }
                    }

                    // 4. Menu Items
                    if (root.has("menu_items")) {
                        List<MenuItem> list = mapper.convertValue(root.get("menu_items"), new TypeReference<List<MenuItem>>() {});
                        for (MenuItem m : list) {
                            menuItems.put(m.getId(), m);
                            if (m.getId() >= menuIdGen.get()) menuIdGen.set(m.getId() + 1);
                        }
                    }

                    // 5. Order Items
                    if (root.has("order_items")) {
                        List<OrderItem> list = mapper.convertValue(root.get("order_items"), new TypeReference<List<OrderItem>>() {});
                        for (OrderItem oi : list) {
                            orderItems.put(oi.getId(), oi);
                            if (oi.getId() >= orderItemIdGen.get()) orderItemIdGen.set(oi.getId() + 1);
                        }
                    }

                    // 6. Orders
                    if (root.has("orders")) {
                        List<Order> list = mapper.convertValue(root.get("orders"), new TypeReference<List<Order>>() {});
                        for (Order o : list) {
                            // Link branch name
                            RestaurantBranch b = branches.get(o.getBranchId());
                            if (b != null) o.setBranchName(b.getName());
                            // Link items
                            List<OrderItem> oItems = new ArrayList<>();
                            for (OrderItem oi : orderItems.values()) {
                                if (Objects.equals(oi.getOrderId(), o.getId())) {
                                    oItems.add(oi);
                                }
                            }
                            o.setItems(oItems);
                            orders.put(o.getId(), o);
                            if (o.getOrderNumber() != null) ordersByNumber.put(o.getOrderNumber(), o);
                            if (o.getId() >= orderIdGen.get()) orderIdGen.set(o.getId() + 1);
                        }
                    }

                    // 7. QR Tokens
                    if (root.has("qr_tokens")) {
                        List<QRToken> list = mapper.convertValue(root.get("qr_tokens"), new TypeReference<List<QRToken>>() {});
                        for (QRToken q : list) {
                            RestaurantBranch b = branches.get(q.getBranchId());
                            if (b != null) q.setBranchName(b.getName());
                            Order ord = orders.get(q.getOrderId());
                            if (ord != null) {
                                q.setOrderNumber(ord.getOrderNumber());
                                ord.setQrToken(q.getToken());
                                ord.setQrStatus(q.getStatus());
                            }
                            q.setFeedbackUrl("http://localhost:5173/feedback/" + q.getToken());
                            qrTokens.put(q.getToken(), q);
                            qrTokensByOrderId.put(q.getOrderId(), q);
                            if (q.getId() >= qrIdGen.get()) qrIdGen.set(q.getId() + 1);
                        }
                    }

                    // 8. Routing Rules
                    if (root.has("routing_rules")) {
                        List<RoutingRule> list = mapper.convertValue(root.get("routing_rules"), new TypeReference<List<RoutingRule>>() {});
                        for (RoutingRule r : list) {
                            Department d = departments.get(r.getDepartmentId());
                            routingRules.add(r);
                        }
                    }
                    if (routingRules.isEmpty()) {
                        initDefaultRoutingRules();
                    }

                    // 9. Application Settings
                    if (root.has("application_settings")) {
                        List<AppSetting> list = mapper.convertValue(root.get("application_settings"), new TypeReference<List<AppSetting>>() {});
                        for (AppSetting s : list) {
                            settings.put(s.getKey(), s);
                        }
                    }

                    // 10. Complaint Tickets
                    if (root.has("complaint_tickets")) {
                        List<ComplaintTicket> list = mapper.convertValue(root.get("complaint_tickets"), new TypeReference<List<ComplaintTicket>>() {});
                        for (ComplaintTicket t : list) {
                            enrichTicket(t);
                            tickets.put(t.getId(), t);
                            if (t.getTicketNumber() != null) ticketsByNumber.put(t.getTicketNumber(), t);
                            if (t.getId() >= ticketIdGen.get()) ticketIdGen.set(t.getId() + 1);
                        }
                    }

                    // 11. Ticket Status History
                    if (root.has("ticket_status_history")) {
                        List<TicketStatusHistory> list = mapper.convertValue(root.get("ticket_status_history"), new TypeReference<List<TicketStatusHistory>>() {});
                        for (TicketStatusHistory h : list) {
                            if (h.getChangedByUserId() != null) {
                                UserAccount u = users.get(h.getChangedByUserId());
                                if (u != null) h.setChangedByName(u.getFullName());
                            }
                            ComplaintTicket t = tickets.get(h.getTicketId());
                            if (t != null) {
                                t.getStatusHistory().add(h);
                            }
                            if (h.getId() >= historyIdGen.get()) historyIdGen.set(h.getId() + 1);
                        }
                    }

                    // 12. Investigation Notes
                    if (root.has("investigation_notes")) {
                        List<InvestigationNote> list = mapper.convertValue(root.get("investigation_notes"), new TypeReference<List<InvestigationNote>>() {});
                        for (InvestigationNote n : list) {
                            ComplaintTicket t = tickets.get(n.getTicketId());
                            if (t != null) {
                                t.getInvestigationNotes().add(n);
                            }
                            if (n.getId() >= noteIdGen.get()) noteIdGen.set(n.getId() + 1);
                        }
                    }

                    // 13. Customer Notifications
                    if (root.has("customer_notifications")) {
                        List<CustomerNotification> list = mapper.convertValue(root.get("customer_notifications"), new TypeReference<List<CustomerNotification>>() {});
                        for (CustomerNotification n : list) {
                            ComplaintTicket t = tickets.get(n.getTicketId());
                            if (t != null) n.setTicketNumber(t.getTicketNumber());
                            notifications.add(n);
                            if (n.getId() >= notifIdGen.get()) notifIdGen.set(n.getId() + 1);
                        }
                    }

                    // 14. Feedback Submissions & Items
                    if (root.has("item_feedback")) {
                        List<ItemFeedback> list = mapper.convertValue(root.get("item_feedback"), new TypeReference<List<ItemFeedback>>() {});
                        for (ItemFeedback ifb : list) {
                            itemFeedbacks.put(ifb.getId(), ifb);
                            if (ifb.getId() >= itemFeedbackIdGen.get()) itemFeedbackIdGen.set(ifb.getId() + 1);
                        }
                    }

                    if (root.has("feedback_submissions")) {
                        List<FeedbackSubmission> list = mapper.convertValue(root.get("feedback_submissions"), new TypeReference<List<FeedbackSubmission>>() {});
                        for (FeedbackSubmission fs : list) {
                            for (ItemFeedback ifb : itemFeedbacks.values()) {
                                if (Objects.equals(ifb.getSubmissionId(), fs.getId())) {
                                    fs.getItems().add(ifb);
                                }
                            }
                            feedbacks.put(fs.getId(), fs);
                            if (fs.getId() >= feedbackIdGen.get()) feedbackIdGen.set(fs.getId() + 1);
                        }
                    }

                    // Activate demo token for live demo feedback submission
                    QRToken demoToken = qrTokens.get("demo-token-5-ord-2026-105");
                    if (demoToken != null) {
                        demoToken.setStatus("active");
                        demoToken.setExpiresAt(LocalDateTime.now().plusDays(7).format(ISO_FMT));
                        Order o = orders.get(demoToken.getOrderId());
                        if (o != null) {
                            o.setFeedbackSubmitted(false);
                            o.setQrStatus("active");
                        }
                    }

                    log.info("Loaded {} branches, {} departments, {} users, {} menu items, {} orders, {} tickets, {} notifications.",
                            branches.size(), departments.size(), users.size(), menuItems.size(), orders.size(), tickets.size(), notifications.size());
                }
            } else {
                log.warn("seed-data.json not found on classpath; fallback defaults will be created.");
            }
        } catch (Exception e) {
            log.error("Failed to load seed-data.json: {}", e.getMessage(), e);
        }
    }

    private void initDefaultRoutingRules() {
        addRoutingRule(1L, "Food Quality", 1L, 2, "High");
        addRoutingRule(2L, "Food Temperature", 1L, 2, "High");
        addRoutingRule(3L, "Poor Food Preparation", 1L, 2, "High");
        addRoutingRule(4L, "Taste and Freshness", 1L, 2, "Medium");
        addRoutingRule(5L, "Staff Behaviour", 2L, 2, "High");
        addRoutingRule(6L, "Long Waiting Times", 2L, 2, "Medium");
        addRoutingRule(7L, "Slow Service", 2L, 2, "Medium");
        addRoutingRule(8L, "Billing Errors", 3L, 1, "High");
        addRoutingRule(9L, "Billing and Pricing", 3L, 1, "Medium");
        addRoutingRule(10L, "Packaging Problems", 4L, 2, "Medium");
        addRoutingRule(11L, "Container Leakage", 4L, 2, "Medium");
        addRoutingRule(12L, "Delivery Delays", 5L, 2, "High");
        addRoutingRule(13L, "Unclassified / Management Review", 6L, 4, "Medium");
    }

    private void addRoutingRule(Long id, String cat, Long deptId, int sla, String priority) {
        RoutingRule r = new RoutingRule();
        r.setId(id);
        r.setIssueCategory(cat);
        r.setDepartmentId(deptId);
        r.setSlaHours(sla);
        r.setDefaultPriority(priority);
        Department d = departments.get(deptId);
        if (d != null) {
            r.setDepartmentName(d.getName());
            r.setDepartmentCode(d.getCode());
        }
        routingRules.add(r);
    }

    private void enrichUser(UserAccount u) {
        if (u.getDepartmentId() != null) {
            Department d = departments.get(u.getDepartmentId());
            if (d != null) u.setDepartmentName(d.getName());
        }
        if (u.getBranchId() != null) {
            RestaurantBranch b = branches.get(u.getBranchId());
            if (b != null) u.setBranchName(b.getName());
        }
    }

    private void enrichTicket(ComplaintTicket t) {
        if (t.getBranchId() != null) {
            RestaurantBranch b = branches.get(t.getBranchId());
            if (b != null) t.setBranchName(b.getName());
        }
        if (t.getDepartmentId() != null) {
            Department d = departments.get(t.getDepartmentId());
            if (d != null) {
                t.setDepartmentName(d.getName());
                t.setDepartmentCode(d.getCode());
            }
        }
        if (t.getOrderId() != null) {
            Order o = orders.get(t.getOrderId());
            if (o != null) t.setOrderNumber(o.getOrderNumber());
        }
        if (t.getAssignedStaffId() != null) {
            UserAccount u = users.get(t.getAssignedStaffId());
            if (u != null) t.setAssignedStaffName(u.getFullName());
        }
        if (t.getVerifiedByUserId() != null) {
            UserAccount u = users.get(t.getVerifiedByUserId());
            if (u != null) t.setVerifiedByName(u.getFullName());
        }

        // SLA calculation
        calculateTicketSla(t);
    }

    private void calculateTicketSla(ComplaintTicket t) {
        if (t.getCreatedAt() != null) {
            try {
                String clean = t.getCreatedAt().replace('T', ' ');
                if (clean.length() > 19) clean = clean.substring(0, 19);
                LocalDateTime created = LocalDateTime.parse(clean, ISO_FMT);
                LocalDateTime now = LocalDateTime.now();
                long minutes = Duration.between(created, now).toMinutes();
                t.setTimeElapsedMinutes((int) Math.max(0, minutes));

                if (t.getSlaDeadline() != null && !"Resolved".equalsIgnoreCase(t.getStatus())) {
                    String cleanDeadline = t.getSlaDeadline().replace('T', ' ');
                    if (cleanDeadline.length() > 19) cleanDeadline = cleanDeadline.substring(0, 19);
                    LocalDateTime deadline = LocalDateTime.parse(cleanDeadline, ISO_FMT);
                    t.setOverdue(now.isAfter(deadline));
                } else {
                    t.setOverdue(false);
                }
            } catch (Exception ignored) {
                t.setTimeElapsedMinutes(45);
                t.setOverdue(false);
            }
        }
    }

    // ---------------- AUTH ----------------
    public Map<String, Object> login(String username, String password) {
        UserAccount user = usersByUsername.get(username.toLowerCase());
        if (user == null) {
            // Check if matches any demo user
            for (UserAccount u : users.values()) {
                if (u.getUsername().equalsIgnoreCase(username)) {
                    user = u;
                    break;
                }
            }
        }
        if (user == null) {
            // Default to manager
            user = usersByUsername.get("manager");
            if (user == null && !users.isEmpty()) {
                user = users.values().iterator().next();
            }
        }

        String token = "jwt-demo-token-" + (user != null ? user.getUsername() : "user") + "-" + UUID.randomUUID().toString().substring(0, 8);
        Map<String, Object> res = new HashMap<>();
        res.put("access_token", token);
        res.put("token_type", "bearer");
        res.put("user", user);
        return res;
    }

    public UserAccount getMe(String authHeader) {
        if (authHeader != null && authHeader.contains("jwt-demo-token-")) {
            String sub = authHeader.substring(authHeader.indexOf("jwt-demo-token-") + 15);
            String[] parts = sub.split("-");
            if (parts.length > 0) {
                UserAccount u = usersByUsername.get(parts[0].toLowerCase());
                if (u != null) return u;
            }
        }
        return usersByUsername.getOrDefault("manager", users.values().stream().findFirst().orElse(null));
    }

    public List<Map<String, Object>> getDemoUsers() {
        List<Map<String, Object>> list = new ArrayList<>();
        for (UserAccount u : users.values()) {
            Map<String, Object> item = new HashMap<>();
            item.put("username", u.getUsername());
            item.put("full_name", u.getFullName());
            item.put("role", u.getRole());
            item.put("department", u.getDepartmentName() != null ? u.getDepartmentName() : "General Management");
            Department d = u.getDepartmentId() != null ? departments.get(u.getDepartmentId()) : null;
            item.put("department_code", d != null ? d.getCode() : "management");
            item.put("branch", u.getBranchName() != null ? u.getBranchName() : "Indiranagar Hub");
            item.put("default_password", "admin123");
            list.add(item);
        }
        return list;
    }

    // ---------------- BRANCHES & DEPARTMENTS ----------------
    public List<RestaurantBranch> getBranches() {
        return new ArrayList<>(branches.values());
    }

    public List<Department> getDepartments() {
        return new ArrayList<>(departments.values());
    }

    public Map<String, Object> getDepartmentOperations(String deptCode, Long branchId) {
        Department dept = departmentsByCode.get(deptCode.toLowerCase());
        Long deptId = dept != null ? dept.getId() : null;

        List<ComplaintTicket> deptTickets = tickets.values().stream()
                .filter(t -> deptId == null || Objects.equals(t.getDepartmentId(), deptId))
                .filter(t -> branchId == null || Objects.equals(t.getBranchId(), branchId))
                .sorted(Comparator.comparing(ComplaintTicket::getCreatedAt).reversed())
                .collect(Collectors.toList());

        long pending = deptTickets.stream().filter(t -> "Open".equalsIgnoreCase(t.getStatus()) || "Assigned".equalsIgnoreCase(t.getStatus())).count();
        long inProgress = deptTickets.stream().filter(t -> "Under Investigation".equalsIgnoreCase(t.getStatus()) || "Action In Progress".equalsIgnoreCase(t.getStatus())).count();
        long resolved = deptTickets.stream().filter(t -> "Resolved".equalsIgnoreCase(t.getStatus()) || "Resolved Pending Verification".equalsIgnoreCase(t.getStatus())).count();
        long overdue = deptTickets.stream().filter(ComplaintTicket::isOverdue).count();

        Map<String, Object> res = new HashMap<>();
        res.put("department", dept);
        res.put("pending_count", pending);
        res.put("in_progress_count", inProgress);
        res.put("resolved_count", resolved);
        res.put("overdue_count", overdue);
        res.put("tickets", deptTickets);
        return res;
    }

    // ---------------- MENU ----------------
    public List<MenuItem> getMenuItems(Long branchId, String category, String search) {
        return menuItems.values().stream()
                .filter(m -> branchId == null || m.getBranchId() == null || Objects.equals(m.getBranchId(), branchId))
                .filter(m -> category == null || category.isEmpty() || category.equalsIgnoreCase(m.getCategory()))
                .filter(m -> search == null || search.isEmpty() || m.getName().toLowerCase().contains(search.toLowerCase()))
                .collect(Collectors.toList());
    }

    public MenuItem createMenuItem(MenuItem item) {
        long id = menuIdGen.incrementAndGet();
        item.setId(id);
        item.setCreatedAt(LocalDateTime.now().format(ISO_FMT));
        item.setAverageRating(5.0);
        item.setTotalFeedbacks(1);
        item.setTotalComplaints(0);
        menuItems.put(id, item);
        return item;
    }

    public MenuItem toggleMenuAvailability(Long id) {
        MenuItem item = menuItems.get(id);
        if (item != null) {
            item.setAvailable(!item.isAvailable());
        }
        return item;
    }

    // ---------------- ORDERS & QR ----------------
    public List<Order> getOrders(String search, Long branchId, String status) {
        return orders.values().stream()
                .filter(o -> branchId == null || Objects.equals(o.getBranchId(), branchId))
                .filter(o -> status == null || status.isEmpty() || status.equalsIgnoreCase(o.getStatus()))
                .filter(o -> search == null || search.isEmpty()
                        || o.getOrderNumber().toLowerCase().contains(search.toLowerCase())
                        || (o.getCustomerName() != null && o.getCustomerName().toLowerCase().contains(search.toLowerCase()))
                        || (o.getTableNumber() != null && o.getTableNumber().toLowerCase().contains(search.toLowerCase())))
                .sorted(Comparator.comparing(Order::getId).reversed())
                .collect(Collectors.toList());
    }

    public Order getOrder(Long id) {
        return orders.get(id);
    }

    public Order createOrder(Map<String, Object> orderData) {
        long orderId = orderIdGen.incrementAndGet();
        String orderNum = "ORD-2026-" + orderId;
        String now = LocalDateTime.now().format(ISO_FMT);

        Order order = new Order();
        order.setId(orderId);
        order.setOrderNumber(orderNum);
        order.setCreatedAt(now);

        if (orderData.containsKey("branch_id")) {
            long bId = Long.parseLong(orderData.get("branch_id").toString());
            order.setBranchId(bId);
            RestaurantBranch b = branches.get(bId);
            if (b != null) order.setBranchName(b.getName());
        } else {
            order.setBranchId(1L);
            order.setBranchName("The Royal Rasoi - Indiranagar");
        }

        order.setCustomerName((String) orderData.getOrDefault("customer_name", "Guest Diner"));
        order.setCustomerPhone((String) orderData.getOrDefault("customer_phone", "9876543210"));
        order.setCustomerEmail((String) orderData.getOrDefault("customer_email", "guest@example.com"));
        order.setTableNumber((String) orderData.getOrDefault("table_number", "T-01"));
        order.setOrderChannel((String) orderData.getOrDefault("order_channel", "Dine-In"));

        double total = 0.0;
        List<OrderItem> items = new ArrayList<>();
        if (orderData.containsKey("items")) {
            List<Map<String, Object>> rawItems = (List<Map<String, Object>>) orderData.get("items");
            for (Map<String, Object> ri : rawItems) {
                OrderItem oi = new OrderItem();
                long itemId = orderItemIdGen.incrementAndGet();
                oi.setId(itemId);
                oi.setOrderId(orderId);
                oi.setItemName((String) ri.get("item_name"));
                int qty = ri.containsKey("quantity") ? Integer.parseInt(ri.get("quantity").toString()) : 1;
                double price = ri.containsKey("price_each") ? Double.parseDouble(ri.get("price_each").toString()) : 250.0;
                oi.setQuantity(qty);
                oi.setPriceEach(price);
                oi.setSubtotal(qty * price);
                total += oi.getSubtotal();
                orderItems.put(itemId, oi);
                items.add(oi);
            }
        }
        order.setItems(items);
        order.setBillTotal(total > 0 ? total : 750.0);
        order.setStatus("Completed");
        order.setFeedbackSubmitted(false);

        // Generate QR Token
        long qrId = qrIdGen.incrementAndGet();
        String tokenStr = "demo-token-" + orderId + "-" + orderNum.toLowerCase();
        QRToken qr = new QRToken();
        qr.setId(qrId);
        qr.setOrderId(orderId);
        qr.setOrderNumber(orderNum);
        qr.setBranchId(order.getBranchId());
        qr.setBranchName(order.getBranchName());
        qr.setToken(tokenStr);
        qr.setStatus("active");
        qr.setCreatedAt(now);
        qr.setExpiresAt(LocalDateTime.now().plusHours(24).format(ISO_FMT));
        qr.setFeedbackUrl("http://localhost:5173/feedback/" + tokenStr);
        qr.setQrCodeImage("https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=http://localhost:5173/feedback/" + tokenStr);

        qrTokens.put(tokenStr, qr);
        qrTokensByOrderId.put(orderId, qr);

        order.setQrToken(tokenStr);
        order.setQrStatus("active");

        orders.put(orderId, order);
        ordersByNumber.put(orderNum, order);

        return order;
    }

    public QRToken generateOrderQR(Long orderId) {
        QRToken existing = qrTokensByOrderId.get(orderId);
        if (existing != null) return existing;

        Order order = orders.get(orderId);
        if (order == null) return null;

        long qrId = qrIdGen.incrementAndGet();
        String now = LocalDateTime.now().format(ISO_FMT);
        String tokenStr = "demo-token-" + orderId + "-" + order.getOrderNumber().toLowerCase();

        QRToken qr = new QRToken();
        qr.setId(qrId);
        qr.setOrderId(orderId);
        qr.setOrderNumber(order.getOrderNumber());
        qr.setBranchId(order.getBranchId());
        qr.setBranchName(order.getBranchName());
        qr.setToken(tokenStr);
        qr.setStatus("active");
        qr.setCreatedAt(now);
        qr.setExpiresAt(LocalDateTime.now().plusHours(24).format(ISO_FMT));
        qr.setFeedbackUrl("http://localhost:5173/feedback/" + tokenStr);
        qr.setQrCodeImage("https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=http://localhost:5173/feedback/" + tokenStr);

        qrTokens.put(tokenStr, qr);
        qrTokensByOrderId.put(orderId, qr);

        order.setQrToken(tokenStr);
        order.setQrStatus("active");
        return qr;
    }

    public List<QRToken> getQRTokens(Long branchId, String statusFilter) {
        return qrTokens.values().stream()
                .filter(q -> branchId == null || Objects.equals(q.getBranchId(), branchId))
                .filter(q -> statusFilter == null || statusFilter.isEmpty() || statusFilter.equalsIgnoreCase(q.getStatus()))
                .sorted(Comparator.comparing(QRToken::getId).reversed())
                .collect(Collectors.toList());
    }

    public Map<String, Object> validateQRToken(String token) {
        Map<String, Object> resp = new HashMap<>();
        QRToken qr = qrTokens.get(token);
        if (qr == null) {
            resp.put("valid", false);
            resp.put("message", "Invalid or unknown QR code token.");
            return resp;
        }

        if (!"active".equalsIgnoreCase(qr.getStatus())) {
            resp.put("valid", false);
            resp.put("message", "This bill QR code has already been used or has expired.");
            return resp;
        }

        Order ord = orders.get(qr.getOrderId());
        resp.put("valid", true);
        resp.put("message", "QR Token verified successfully. Order unlocked.");
        resp.put("order", ord);
        resp.put("branch_name", qr.getBranchName());
        resp.put("token", token);
        resp.put("feedback_url", qr.getFeedbackUrl() != null ? qr.getFeedbackUrl() : ("http://localhost:5173/feedback/" + token));
        resp.put("qr_code_image", qr.getQrCodeImage() != null ? qr.getQrCodeImage() : ("https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=http://localhost:5173/feedback/" + token));

        Map<String, Object> billPreview = new HashMap<>();
        billPreview.put("restaurant_name", "The Royal Rasoi");
        billPreview.put("branch_name", qr.getBranchName() != null ? qr.getBranchName() : "Indiranagar Hub");
        billPreview.put("branch_address", "100ft Road, Indiranagar, Bangalore");
        billPreview.put("branch_phone", "+91 80 4123 4567");
        billPreview.put("order_number", ord != null ? ord.getOrderNumber() : "ORD-2026");
        billPreview.put("table_number", ord != null ? ord.getTableNumber() : "T-01");
        billPreview.put("date", qr.getCreatedAt() != null ? qr.getCreatedAt() : LocalDateTime.now().format(ISO_FMT));
        billPreview.put("bill_total", ord != null ? ord.getBillTotal() : 0.0);

        List<Map<String, Object>> itemsList = new ArrayList<>();
        if (ord != null && ord.getItems() != null) {
            for (OrderItem oi : ord.getItems()) {
                Map<String, Object> itemMap = new HashMap<>();
                itemMap.put("qty", oi.getQuantity());
                itemMap.put("name", oi.getItemName());
                itemMap.put("subtotal", oi.getSubtotal());
                itemsList.add(itemMap);
            }
        }
        billPreview.put("items", itemsList);
        resp.put("bill_preview", billPreview);
        return resp;
    }

    public Map<String, Object> revokeQRToken(String token) {
        QRToken qr = qrTokens.get(token);
        if (qr != null) {
            qr.setStatus("revoked");
            Order ord = orders.get(qr.getOrderId());
            if (ord != null) ord.setQrStatus("revoked");
        }
        Map<String, Object> res = new HashMap<>();
        res.put("status", "SUCCESS");
        res.put("token", token);
        return res;
    }

    // ---------------- CUSTOMER FEEDBACK & ESCALATION ----------------
    public Map<String, Object> submitFeedback(Map<String, Object> data) {
        String token = (String) data.get("token");
        QRToken qr = token != null ? qrTokens.get(token) : null;
        Order order = qr != null ? orders.get(qr.getOrderId()) : null;

        if (order == null && data.containsKey("order_id")) {
            order = orders.get(Long.parseLong(data.get("order_id").toString()));
        }

        long fbId = feedbackIdGen.incrementAndGet();
        String now = LocalDateTime.now().format(ISO_FMT);
        String fbNum = "FB-2026-" + fbId;

        FeedbackSubmission sub = new FeedbackSubmission();
        sub.setId(fbId);
        sub.setFeedbackNumber(fbNum);
        sub.setCreatedAt(now);

        if (order != null) {
            sub.setOrderId(order.getId());
            sub.setBranchId(order.getBranchId());
            sub.setCustomerName(order.getCustomerName());
            sub.setCustomerPhone(order.getCustomerPhone());
            sub.setCustomerEmail(order.getCustomerEmail());
            order.setFeedbackSubmitted(true);
        }

        if (data.containsKey("customer_name")) sub.setCustomerName((String) data.get("customer_name"));
        if (data.containsKey("customer_phone")) sub.setCustomerPhone((String) data.get("customer_phone"));
        if (data.containsKey("overall_comment")) sub.setGeneralComment((String) data.get("overall_comment"));

        if (qr != null) {
            qr.setStatus("used");
            qr.setUsedAt(now);
            if (order != null) order.setQrStatus("used");
        }

        List<String> ticketsCreated = new ArrayList<>();
        List<Map<String, Object>> itemFeedbacksRaw = (List<Map<String, Object>>) data.get("items");

        int totalRating = 0;
        int ratingCount = 0;

        if (itemFeedbacksRaw != null) {
            for (Map<String, Object> itemData : itemFeedbacksRaw) {
                long ifbId = itemFeedbackIdGen.incrementAndGet();
                ItemFeedback ifb = new ItemFeedback();
                ifb.setId(ifbId);
                ifb.setSubmissionId(fbId);
                ifb.setCreatedAt(now);

                int rating = itemData.containsKey("rating") ? Integer.parseInt(itemData.get("rating").toString()) : 5;
                ifb.setRating(rating);
                totalRating += rating;
                ratingCount++;

                long orderItemId = itemData.containsKey("order_item_id") ? Long.parseLong(itemData.get("order_item_id").toString()) : 0L;
                ifb.setOrderItemId(orderItemId);

                OrderItem oi = orderItems.get(orderItemId);
                String itemName = oi != null ? oi.getItemName() : (String) itemData.getOrDefault("item_name", "Dining Item");
                ifb.setItemName(itemName);

                if (itemData.containsKey("issue_category")) ifb.setIssueCategory((String) itemData.get("issue_category"));
                if (itemData.containsKey("follow_up_response")) ifb.setFollowUpResponse((String) itemData.get("follow_up_response"));
                if (itemData.containsKey("comment")) ifb.setComment((String) itemData.get("comment"));

                itemFeedbacks.put(ifbId, ifb);
                sub.getItems().add(ifb);

                // AUTOMATIC COMPLAINT ESCALATION RULE:
                // Rating <= 2 OR (Rating == 3 with an issue category)
                if (rating <= 2 || (rating == 3 && ifb.getIssueCategory() != null && !ifb.getIssueCategory().isEmpty())) {
                    ComplaintTicket ticket = createTicketFromFeedback(sub, ifb, order);
                    ticketsCreated.add(ticket.getTicketNumber());
                }

                // Push text to AI clustering if ReviewService exists
                if (reviewService != null && ifb.getComment() != null && !ifb.getComment().trim().isEmpty()) {
                    try {
                        com.foodfeedback.ai.dto.ReviewRequest rr = new com.foodfeedback.ai.dto.ReviewRequest();
                        rr.setText(ifb.getComment().trim());
                        rr.setSource("CUSTOMER_QR_FEEDBACK");
                        reviewService.createReview(rr);
                    } catch (Exception ignored) {}
                }
            }
        }

        sub.setOverallRating(ratingCount > 0 ? (int) Math.round((double) totalRating / ratingCount) : 5);
        feedbacks.put(fbId, sub);

        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("submission_id", fbId);
        res.put("feedback_number", fbNum);
        res.put("tickets_created", ticketsCreated);
        res.put("message", ticketsCreated.isEmpty()
                ? "Thank you! Your feedback has been received."
                : "Your concern has been escalated as Ticket #" + String.join(", #", ticketsCreated) + ". Our team is resolving it.");
        return res;
    }

    private ComplaintTicket createTicketFromFeedback(FeedbackSubmission sub, ItemFeedback ifb, Order order) {
        long tId = ticketIdGen.incrementAndGet();
        String ticketNum = "TKT-2026-" + String.format("%03d", tId);
        String now = LocalDateTime.now().format(ISO_FMT);

        ComplaintTicket t = new ComplaintTicket();
        t.setId(tId);
        t.setTicketNumber(ticketNum);
        t.setCreatedAt(now);
        t.setUpdatedAt(now);
        t.setFeedbackSubmissionId(sub.getId());
        t.setItemFeedbackId(ifb.getId());
        t.setItemName(ifb.getItemName());
        t.setCustomerComment(ifb.getComment() != null ? ifb.getComment() : ifb.getFollowUpResponse());
        t.setCustomerName(sub.getCustomerName());
        t.setCustomerPhone(sub.getCustomerPhone());

        if (order != null) {
            t.setOrderId(order.getId());
            t.setOrderNumber(order.getOrderNumber());
            t.setBranchId(order.getBranchId());
            t.setBranchName(order.getBranchName());
        } else {
            t.setBranchId(1L);
            t.setBranchName("The Royal Rasoi - Indiranagar");
        }

        // Routing Rules & Category Resolution
        String rawCat = ifb.getIssueCategory();
        String commentText = (ifb.getComment() != null ? ifb.getComment() : "") + " " +
                (ifb.getFollowUpResponse() != null ? ifb.getFollowUpResponse() : "");
        String combinedLower = ((rawCat != null ? rawCat : "") + " " + commentText).toLowerCase().trim();

        RoutingRule matchedRule = null;
        if (rawCat != null && !rawCat.trim().isEmpty() && !rawCat.equalsIgnoreCase("Other") && !rawCat.equalsIgnoreCase("Unclassified")) {
            for (RoutingRule rr : routingRules) {
                if (rr.getIssueCategory().equalsIgnoreCase(rawCat.trim())) {
                    matchedRule = rr;
                    break;
                }
            }
        }

        long deptId = 6L; // Default to Executive Management for ambiguous or unclassified complaints
        int slaHours = 4;
        String detectedCategory = rawCat;

        if (matchedRule != null) {
            deptId = matchedRule.getDepartmentId();
            slaHours = matchedRule.getSlaHours();
            detectedCategory = matchedRule.getIssueCategory();
        } else {
            // Intelligent rule matching based on domain signals
            boolean hasKitchen = combinedLower.contains("temperature") || combinedLower.contains("cold") ||
                    combinedLower.contains("taste") || combinedLower.contains("cook") || combinedLower.contains("salt") ||
                    combinedLower.contains("raw") || combinedLower.contains("burn") || combinedLower.contains("stale") ||
                    combinedLower.contains("lukewarm") || combinedLower.contains("undercooked") || combinedLower.contains("overcooked") ||
                    combinedLower.contains("food preparation") || combinedLower.contains("food quality");

            boolean hasService = combinedLower.contains("service") || combinedLower.contains("wait") ||
                    combinedLower.contains("rude") || combinedLower.contains("staff") || combinedLower.contains("waiter") ||
                    combinedLower.contains("disrespect") || combinedLower.contains("slow service") ||
                    (combinedLower.contains("delay") && !combinedLower.contains("delivery"));

            boolean hasBilling = combinedLower.contains("bill") || combinedLower.contains("charge") ||
                    combinedLower.contains("payment") || combinedLower.contains("cost") || combinedLower.contains("price") ||
                    combinedLower.contains("overcharge") || combinedLower.contains("twice") || combinedLower.contains("receipt");

            boolean hasPackaging = combinedLower.contains("pack") || combinedLower.contains("spill") ||
                    combinedLower.contains("leak") || combinedLower.contains("container") || combinedLower.contains("box") ||
                    combinedLower.contains("seal") || combinedLower.contains("damaged package");

            boolean hasDelivery = combinedLower.contains("delivery") || combinedLower.contains("driver") ||
                    combinedLower.contains("transit") || combinedLower.contains("rider") || combinedLower.contains("courier");

            int matchCount = (hasKitchen ? 1 : 0) + (hasService ? 1 : 0) + (hasBilling ? 1 : 0) + (hasPackaging ? 1 : 0) + (hasDelivery ? 1 : 0);

            if (matchCount == 1) {
                if (hasKitchen) {
                    deptId = 1L;
                    slaHours = 2;
                    if (detectedCategory == null || detectedCategory.isEmpty()) {
                        detectedCategory = combinedLower.contains("temperature") || combinedLower.contains("cold") || combinedLower.contains("lukewarm")
                                ? "Food Temperature" : "Food Quality";
                    }
                } else if (hasService) {
                    deptId = 2L;
                    slaHours = 2;
                    if (detectedCategory == null || detectedCategory.isEmpty()) {
                        detectedCategory = combinedLower.contains("wait") || combinedLower.contains("slow")
                                ? "Long Waiting Times" : "Staff Behaviour";
                    }
                } else if (hasBilling) {
                    deptId = 3L;
                    slaHours = 1;
                    if (detectedCategory == null || detectedCategory.isEmpty()) detectedCategory = "Billing Errors";
                } else if (hasPackaging) {
                    deptId = 4L;
                    slaHours = 2;
                    if (detectedCategory == null || detectedCategory.isEmpty()) detectedCategory = "Packaging Problems";
                } else {
                    deptId = 5L;
                    slaHours = 2;
                    if (detectedCategory == null || detectedCategory.isEmpty()) detectedCategory = "Delivery Delays";
                }
            } else {
                // Ambiguous or zero specific matches -> Route to Executive Management
                deptId = 6L;
                slaHours = 4;
                detectedCategory = "Unclassified / Management Review";
            }
        }

        t.setIssueCategory(detectedCategory != null ? detectedCategory : "Unclassified / Management Review");

        Department dept = departments.get(deptId);
        t.setDepartmentId(deptId);
        if (dept != null) {
            t.setDepartmentName(dept.getName());
            t.setDepartmentCode(dept.getCode());
            slaHours = dept.getSlaHours();
        }

        // Calculate dynamic priority with PriorityScoringService: P = 0.4*Severity + 0.3*Frequency + 0.3*Trend
        final long effectiveDeptId = deptId;
        double severity = ifb.getRating() <= 1 ? 85.0 : (ifb.getRating() == 2 ? 65.0 : 45.0);
        long categoryCount = tickets.values().stream().filter(ex -> Objects.equals(ex.getDepartmentId(), effectiveDeptId)).count();
        double frequency = Math.min(100.0, 30.0 + (categoryCount * 10.0));
        double trend = 55.0; // Steady baseline
        PriorityScoringService.PriorityResult pResult = priorityScoringService.calculatePriority(severity, frequency, trend);
        t.setPriority(pResult.getPriorityLevel());

        t.setStatus("Open");
        t.setSlaDeadline(LocalDateTime.now().plusHours(slaHours).format(ISO_FMT));

        // Initial History
        TicketStatusHistory h = new TicketStatusHistory();
        h.setId(historyIdGen.incrementAndGet());
        h.setTicketId(tId);
        h.setNewStatus("Open");
        h.setChangedByName("Automated Routing Engine");
        h.setNotes("Ticket generated from dynamic QR item feedback (Rating: " + ifb.getRating() + "/5). Routed to " + t.getDepartmentName());
        h.setCreatedAt(now);
        t.getStatusHistory().add(h);

        // Customer Notification
        CustomerNotification notif = new CustomerNotification();
        long nId = notifIdGen.incrementAndGet();
        notif.setId(nId);
        notif.setTicketId(tId);
        notif.setTicketNumber(ticketNum);
        notif.setCustomerName(t.getCustomerName());
        notif.setCustomerPhone(t.getCustomerPhone());
        notif.setEventType("ticket_created");
        notif.setTitle("Complaint Registered #" + ticketNum);
        notif.setMessage("Hello " + t.getCustomerName() + ", your concern regarding '" + t.getItemName() + "' (" + t.getIssueCategory() + ") has been escalated as Ticket #" + ticketNum + " and routed to our " + t.getDepartmentName() + " team.");
        notif.setCreatedAt(now);
        notif.setDeliveryStatus("Delivered");
        notifications.add(0, notif);

        tickets.put(tId, t);
        ticketsByNumber.put(ticketNum, t);

        return t;
    }

    public List<Map<String, Object>> getFeedbacks(String search, Long branchId, Integer rating, String category) {
        List<Map<String, Object>> list = new ArrayList<>();
        for (FeedbackSubmission fs : feedbacks.values()) {
            if (branchId != null && !Objects.equals(fs.getBranchId(), branchId)) continue;
            for (ItemFeedback ifb : fs.getItems()) {
                if (rating != null && ifb.getRating() != rating) continue;
                if (category != null && !category.isEmpty() && !category.equalsIgnoreCase(ifb.getIssueCategory())) continue;

                Map<String, Object> rec = new HashMap<>();
                rec.put("id", ifb.getId());
                rec.put("feedback_number", fs.getFeedbackNumber());
                rec.put("submission_id", fs.getId());
                rec.put("date_time", ifb.getCreatedAt() != null ? ifb.getCreatedAt() : fs.getCreatedAt());
                rec.put("order_id", fs.getOrderId());
                Order o = fs.getOrderId() != null ? orders.get(fs.getOrderId()) : null;
                rec.put("order_number", o != null ? o.getOrderNumber() : "ORD-2026");
                rec.put("branch_id", fs.getBranchId());
                RestaurantBranch b = fs.getBranchId() != null ? branches.get(fs.getBranchId()) : null;
                rec.put("branch_name", b != null ? b.getName() : "Indiranagar Hub");
                rec.put("item_name", ifb.getItemName());
                rec.put("rating", ifb.getRating());
                rec.put("customer_comment", ifb.getComment() != null ? ifb.getComment() : ifb.getFollowUpResponse());
                rec.put("customer_name", fs.getCustomerName());
                rec.put("customer_phone", fs.getCustomerPhone());
                rec.put("channel", fs.getChannel());
                rec.put("issue_category", ifb.getIssueCategory() != null ? ifb.getIssueCategory() : "Satisfied");

                // Check if associated with ticket
                ComplaintTicket t = null;
                for (ComplaintTicket ct : tickets.values()) {
                    if (Objects.equals(ct.getItemFeedbackId(), ifb.getId())) {
                        t = ct;
                        break;
                    }
                }
                rec.put("has_complaint", t != null);
                if (t != null) {
                    rec.put("ticket_id", t.getId());
                    rec.put("ticket_number", t.getTicketNumber());
                    rec.put("ticket_status", t.getStatus());
                    rec.put("assigned_department", t.getDepartmentName());
                }

                if (search != null && !search.isEmpty()) {
                    String s = search.toLowerCase();
                    boolean match = ifb.getItemName().toLowerCase().contains(s)
                            || (fs.getCustomerName() != null && fs.getCustomerName().toLowerCase().contains(s))
                            || (rec.get("customer_comment") != null && rec.get("customer_comment").toString().toLowerCase().contains(s));
                    if (!match) continue;
                }

                list.add(rec);
            }
        }
        list.sort((a, b) -> b.get("id").toString().compareTo(a.get("id").toString()));
        return list;
    }

    // ---------------- COMPLAINTS & TICKETS ----------------
    public List<ComplaintTicket> getComplaints(String search, String statusFilter, String priority, Long deptId, Long branchId, Boolean overdueOnly) {
        return tickets.values().stream()
                .peek(this::calculateTicketSla)
                .filter(t -> branchId == null || Objects.equals(t.getBranchId(), branchId))
                .filter(t -> deptId == null || Objects.equals(t.getDepartmentId(), deptId))
                .filter(t -> priority == null || priority.isEmpty() || priority.equalsIgnoreCase(t.getPriority()))
                .filter(t -> statusFilter == null || statusFilter.isEmpty() || statusFilter.equalsIgnoreCase(t.getStatus()))
                .filter(t -> overdueOnly == null || !overdueOnly || t.isOverdue())
                .filter(t -> search == null || search.isEmpty()
                        || t.getTicketNumber().toLowerCase().contains(search.toLowerCase())
                        || (t.getCustomerName() != null && t.getCustomerName().toLowerCase().contains(search.toLowerCase()))
                        || (t.getItemName() != null && t.getItemName().toLowerCase().contains(search.toLowerCase()))
                        || (t.getIssueCategory() != null && t.getIssueCategory().toLowerCase().contains(search.toLowerCase())))
                .sorted(Comparator.comparing(ComplaintTicket::getId).reversed())
                .collect(Collectors.toList());
    }

    public Map<String, Object> getTicketDetail(Long id) {
        ComplaintTicket t = tickets.get(id);
        if (t == null) return null;

        calculateTicketSla(t);
        Map<String, Object> res = mapper.convertValue(t, new TypeReference<Map<String, Object>>() {});

        Order ord = t.getOrderId() != null ? orders.get(t.getOrderId()) : null;
        if (ord != null) res.put("order", ord);

        ItemFeedback ifb = t.getItemFeedbackId() != null ? itemFeedbacks.get(t.getItemFeedbackId()) : null;
        if (ifb != null) {
            Map<String, Object> orig = new HashMap<>();
            orig.put("rating", ifb.getRating());
            orig.put("comment", ifb.getComment());
            orig.put("follow_up_response", ifb.getFollowUpResponse());
            orig.put("issue_category", ifb.getIssueCategory());
            res.put("original_feedback", orig);
        }

        return res;
    }

    public Map<String, Object> trackTicketPublic(String ticketNumber) {
        ComplaintTicket t = ticketsByNumber.get(ticketNumber);
        if (t == null) return null;

        calculateTicketSla(t);
        Map<String, Object> res = mapper.convertValue(t, new TypeReference<Map<String, Object>>() {});
        Order ord = t.getOrderId() != null ? orders.get(t.getOrderId()) : null;
        if (ord != null) {
            res.put("order_number", ord.getOrderNumber());
            res.put("table_number", ord.getTableNumber());
        }
        return res;
    }

    public ComplaintTicket updateTicketStatus(Long ticketId, String status, String notes, String userName) {
        ComplaintTicket t = tickets.get(ticketId);
        if (t == null) return null;

        String oldStatus = t.getStatus();
        t.setStatus(status);
        String now = LocalDateTime.now().format(ISO_FMT);
        t.setUpdatedAt(now);

        if ("Acknowledged".equalsIgnoreCase(status) && t.getAcknowledgedAt() == null) {
            t.setAcknowledgedAt(now);
        }

        TicketStatusHistory h = new TicketStatusHistory();
        h.setId(historyIdGen.incrementAndGet());
        h.setTicketId(ticketId);
        h.setOldStatus(oldStatus);
        h.setNewStatus(status);
        h.setChangedByName(userName != null ? userName : "Department Staff");
        h.setNotes(notes != null ? notes : "Status updated to " + status);
        h.setCreatedAt(now);
        t.getStatusHistory().add(h);

        return t;
    }

    public ComplaintTicket assignTicket(Long ticketId, Long deptId, Long staffId, String reassignmentReason, String userName) {
        ComplaintTicket t = tickets.get(ticketId);
        if (t == null) return null;

        String now = LocalDateTime.now().format(ISO_FMT);
        t.setUpdatedAt(now);

        if (deptId != null) {
            Department d = departments.get(deptId);
            if (d != null) {
                t.setDepartmentId(deptId);
                t.setDepartmentName(d.getName());
                t.setDepartmentCode(d.getCode());
            }
        }

        if (staffId != null) {
            UserAccount u = users.get(staffId);
            if (u != null) {
                t.setAssignedStaffId(staffId);
                t.setAssignedStaffName(u.getFullName());
                t.setStatus("Assigned");

                // Customer notification
                CustomerNotification notif = new CustomerNotification();
                long nId = notifIdGen.incrementAndGet();
                notif.setId(nId);
                notif.setTicketId(t.getId());
                notif.setTicketNumber(t.getTicketNumber());
                notif.setCustomerName(t.getCustomerName());
                notif.setCustomerPhone(t.getCustomerPhone());
                notif.setEventType("ticket_assigned");
                notif.setTitle("Staff Assigned to Ticket #" + t.getTicketNumber());
                notif.setMessage("Ticket #" + t.getTicketNumber() + " has been assigned to " + u.getFullName() + " from the " + t.getDepartmentName() + " department for expedited review.");
                notif.setCreatedAt(now);
                notif.setDeliveryStatus("Delivered");
                notifications.add(0, notif);
            }
        }

        if (reassignmentReason != null) {
            t.setReassignmentReason(reassignmentReason);
        }

        TicketStatusHistory h = new TicketStatusHistory();
        h.setId(historyIdGen.incrementAndGet());
        h.setTicketId(ticketId);
        h.setNewStatus("Assigned");
        h.setChangedByName(userName != null ? userName : "Manager");
        h.setNotes("Assigned to " + t.getAssignedStaffName() + " (" + t.getDepartmentName() + ")" + (reassignmentReason != null ? ": " + reassignmentReason : ""));
        h.setCreatedAt(now);
        t.getStatusHistory().add(h);

        return t;
    }

    public Map<String, Object> addInvestigationNote(Long ticketId, String note, String noteType, String userName) {
        ComplaintTicket t = tickets.get(ticketId);
        if (t == null) return null;

        long nId = noteIdGen.incrementAndGet();
        String now = LocalDateTime.now().format(ISO_FMT);

        InvestigationNote in = new InvestigationNote();
        in.setId(nId);
        in.setTicketId(ticketId);
        in.setNote(note);
        in.setNoteType(noteType != null ? noteType : "investigation");
        in.setUserName(userName != null ? userName : "Investigator");
        in.setCreatedAt(now);

        t.getInvestigationNotes().add(in);
        t.setUpdatedAt(now);

        if ("Open".equalsIgnoreCase(t.getStatus()) || "Assigned".equalsIgnoreCase(t.getStatus())) {
            t.setStatus("Under Investigation");
        }

        Map<String, Object> res = new HashMap<>();
        res.put("status", "SUCCESS");
        res.put("note", in);
        return res;
    }

    public ComplaintTicket recordCorrectiveAction(Long ticketId, String rootCause, String correctiveAction, String preventiveAction, String userName) {
        ComplaintTicket t = tickets.get(ticketId);
        if (t == null) return null;

        String now = LocalDateTime.now().format(ISO_FMT);
        t.setRootCause(rootCause);
        t.setCorrectiveAction(correctiveAction);
        t.setPreventiveAction(preventiveAction);
        t.setStatus("Resolved Pending Verification");
        t.setResolvedAt(now);
        t.setUpdatedAt(now);

        TicketStatusHistory h = new TicketStatusHistory();
        h.setId(historyIdGen.incrementAndGet());
        h.setTicketId(ticketId);
        h.setNewStatus("Resolved Pending Verification");
        h.setChangedByName(userName != null ? userName : "Department Specialist");
        h.setNotes("Root Cause: " + rootCause + ". Corrective Action: " + correctiveAction);
        h.setCreatedAt(now);
        t.getStatusHistory().add(h);

        return t;
    }

    public ComplaintTicket verifyResolution(Long ticketId, boolean approved, String verificationNotes, String verifierName) {
        ComplaintTicket t = tickets.get(ticketId);
        if (t == null) return null;

        String now = LocalDateTime.now().format(ISO_FMT);
        t.setUpdatedAt(now);

        if (approved) {
            t.setStatus("Resolved");
            t.setVerifiedAt(now);
            t.setVerifiedByName(verifierName != null ? verifierName : "Kavita Nair (Restaurant Manager)");

            TicketStatusHistory h = new TicketStatusHistory();
            h.setId(historyIdGen.incrementAndGet());
            h.setTicketId(ticketId);
            h.setNewStatus("Resolved");
            h.setChangedByName(t.getVerifiedByName());
            h.setNotes("Resolution formally verified and approved. " + (verificationNotes != null ? verificationNotes : ""));
            h.setCreatedAt(now);
            t.getStatusHistory().add(h);

            // Customer Notification on Resolution Verified
            CustomerNotification notif = new CustomerNotification();
            long nId = notifIdGen.incrementAndGet();
            notif.setId(nId);
            notif.setTicketId(t.getId());
            notif.setTicketNumber(t.getTicketNumber());
            notif.setCustomerName(t.getCustomerName());
            notif.setCustomerPhone(t.getCustomerPhone());
            notif.setEventType("resolved_verified");
            notif.setTitle("Resolution Verified & Completed #" + t.getTicketNumber());
            notif.setMessage("Dear " + t.getCustomerName() + ", manager " + t.getVerifiedByName() + " has verified the corrective action for Ticket #" + t.getTicketNumber() + " ('" + t.getItemName() + "'): " + (t.getCorrectiveAction() != null ? t.getCorrectiveAction() : "Remediation verified fresh") + ". Thank you for helping us maintain the highest dining standards.");
            notif.setCreatedAt(now);
            notif.setDeliveryStatus("Delivered");
            notifications.add(0, notif);
        } else {
            t.setStatus("Under Investigation");
            TicketStatusHistory h = new TicketStatusHistory();
            h.setId(historyIdGen.incrementAndGet());
            h.setTicketId(ticketId);
            h.setNewStatus("Under Investigation");
            h.setChangedByName(verifierName != null ? verifierName : "Restaurant Manager");
            h.setNotes("Verification rejected: " + (verificationNotes != null ? verificationNotes : "Further corrective actions required."));
            h.setCreatedAt(now);
            t.getStatusHistory().add(h);
        }

        return t;
    }

    public ComplaintTicket reopenTicket(Long ticketId, String reason, String userName) {
        ComplaintTicket t = tickets.get(ticketId);
        if (t == null) return null;

        String now = LocalDateTime.now().format(ISO_FMT);
        t.setStatus("Reopened");
        t.setReopenReason(reason);
        t.setUpdatedAt(now);

        TicketStatusHistory h = new TicketStatusHistory();
        h.setId(historyIdGen.incrementAndGet());
        h.setTicketId(ticketId);
        h.setNewStatus("Reopened");
        h.setChangedByName(userName != null ? userName : "Guest / Manager");
        h.setNotes("Reopened: " + reason);
        h.setCreatedAt(now);
        t.getStatusHistory().add(h);

        return t;
    }

    public ComplaintTicket submitSatisfaction(Long ticketId, int score, String comment) {
        ComplaintTicket t = tickets.get(ticketId);
        if (t == null) return null;

        t.setCustomerSatisfactionScore(score);
        t.setCustomerSatisfactionComment(comment);
        t.setUpdatedAt(LocalDateTime.now().format(ISO_FMT));
        return t;
    }

    // ---------------- DASHBOARD & ANALYTICS ----------------
    public Map<String, Object> getKPIs(Long branchId, Long departmentId, int days) {
        List<ComplaintTicket> filteredTickets = tickets.values().stream()
                .peek(this::calculateTicketSla)
                .filter(t -> branchId == null || Objects.equals(t.getBranchId(), branchId))
                .filter(t -> departmentId == null || Objects.equals(t.getDepartmentId(), departmentId))
                .collect(Collectors.toList());

        long totalComplaints = filteredTickets.size();
        long openComplaints = filteredTickets.stream().filter(t -> "Open".equalsIgnoreCase(t.getStatus()) || "Assigned".equalsIgnoreCase(t.getStatus())).count();
        long inProgressComplaints = filteredTickets.stream().filter(t -> "Under Investigation".equalsIgnoreCase(t.getStatus()) || "Resolved Pending Verification".equalsIgnoreCase(t.getStatus())).count();
        long resolvedComplaints = filteredTickets.stream().filter(t -> "Resolved".equalsIgnoreCase(t.getStatus())).count();
        long overdueComplaints = filteredTickets.stream().filter(ComplaintTicket::isOverdue).count();

        double resolutionRate = totalComplaints > 0 ? ((double) resolvedComplaints / totalComplaints) * 100.0 : 85.0;

        List<ItemFeedback> fbList = new ArrayList<>(itemFeedbacks.values());
        long totalFeedback = fbList.size();
        double avgRating = fbList.isEmpty() ? 4.2 : fbList.stream().mapToInt(ItemFeedback::getRating).average().orElse(4.2);

        Map<String, Object> res = new HashMap<>();
        res.put("total_feedback", Math.max(totalFeedback, 18));
        res.put("average_customer_rating", Math.round(avgRating * 10.0) / 10.0);
        res.put("total_complaints", totalComplaints);
        res.put("open_complaints", openComplaints);
        res.put("in_progress_complaints", inProgressComplaints);
        res.put("resolved_complaints", resolvedComplaints);
        res.put("overdue_complaints", overdueComplaints);
        res.put("resolution_rate", Math.round(resolutionRate * 10.0) / 10.0);
        res.put("average_resolution_time_hours", 1.8);
        return res;
    }

    public Map<String, Object> getCharts(Long branchId, Long departmentId, int days) {
        Map<String, Object> kpis = getKPIs(branchId, departmentId, days);

        // Feedback trend
        List<Map<String, Object>> trend = new ArrayList<>();
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("MMM dd");
        LocalDateTime now = LocalDateTime.now();
        for (int i = 6; i >= 0; i--) {
            Map<String, Object> item = new HashMap<>();
            item.put("date", now.minusDays(i).format(dtf));
            item.put("feedback_count", 8 + (i * 2 % 7));
            item.put("avg_rating", 4.1 + ((i % 3) * 0.2));
            trend.add(item);
        }

        // Rating distribution
        List<Map<String, Object>> ratingDist = new ArrayList<>();
        ratingDist.add(Map.of("rating", "5 Stars", "stars", 5, "count", 48));
        ratingDist.add(Map.of("rating", "4 Stars", "stars", 4, "count", 32));
        ratingDist.add(Map.of("rating", "3 Stars", "stars", 3, "count", 14));
        ratingDist.add(Map.of("rating", "2 Stars", "stars", 2, "count", 8));
        ratingDist.add(Map.of("rating", "1 Star", "stars", 1, "count", 4));

        // Complaints by category
        Map<String, Long> catCounts = tickets.values().stream()
                .collect(Collectors.groupingBy(ComplaintTicket::getIssueCategory, Collectors.counting()));
        List<Map<String, Object>> catList = new ArrayList<>();
        catCounts.forEach((cat, cnt) -> catList.add(Map.of("category", cat, "count", cnt)));

        // Complaints by department
        Map<String, Long> deptCounts = tickets.values().stream()
                .filter(t -> t.getDepartmentName() != null)
                .collect(Collectors.groupingBy(ComplaintTicket::getDepartmentName, Collectors.counting()));
        List<Map<String, Object>> deptList = new ArrayList<>();
        deptCounts.forEach((dept, cnt) -> deptList.add(Map.of("department", dept, "count", cnt)));

        // Status breakdown
        Map<String, Long> statusCounts = tickets.values().stream()
                .collect(Collectors.groupingBy(ComplaintTicket::getStatus, Collectors.counting()));
        List<Map<String, Object>> statusList = new ArrayList<>();
        statusCounts.forEach((status, cnt) -> statusList.add(Map.of("status", status, "count", cnt)));

        // Resolution time trends
        List<Map<String, Object>> resTrends = new ArrayList<>();
        resTrends.add(Map.of("week", "Week 1", "target_hours", 2.0, "actual_hours", 2.3));
        resTrends.add(Map.of("week", "Week 2", "target_hours", 2.0, "actual_hours", 1.9));
        resTrends.add(Map.of("week", "Week 3", "target_hours", 2.0, "actual_hours", 1.7));
        resTrends.add(Map.of("week", "Week 4", "target_hours", 2.0, "actual_hours", 1.6));

        // Top reported items
        Map<String, Long> itemCounts = tickets.values().stream()
                .filter(t -> t.getItemName() != null)
                .collect(Collectors.groupingBy(ComplaintTicket::getItemName, Collectors.counting()));
        List<Map<String, Object>> topItems = new ArrayList<>();
        itemCounts.forEach((item, cnt) -> topItems.add(Map.of("item_name", item, "complaint_count", cnt)));

        Map<String, Object> rep = new HashMap<>();
        rep.put("kpis", kpis);
        rep.put("feedback_trend", trend);
        rep.put("rating_distribution", ratingDist);
        rep.put("complaints_by_category", catList);
        rep.put("complaints_by_department", deptList);
        rep.put("complaint_status_breakdown", statusList);
        rep.put("resolution_time_trends", resTrends);
        rep.put("top_reported_items", topItems);
        rep.put("sla_compliance_rate", 92.5);
        rep.put("reopen_rate", 3.2);
        rep.put("satisfaction_avg", 4.7);
        return rep;
    }

    // ---------------- NOTIFICATIONS ----------------
    public List<CustomerNotification> getNotifications(boolean unreadOnly) {
        if (!unreadOnly) return new ArrayList<>(notifications);
        return notifications.stream().filter(n -> !n.isRead()).collect(Collectors.toList());
    }

    public CustomerNotification markNotificationRead(Long id) {
        for (CustomerNotification n : notifications) {
            if (Objects.equals(n.getId(), id)) {
                n.setRead(true);
                return n;
            }
        }
        return null;
    }

    public List<Map<String, Object>> getDeliveryLogs() {
        List<Map<String, Object>> list = new ArrayList<>();
        for (CustomerNotification n : notifications) {
            Map<String, Object> logItem = new HashMap<>();
            logItem.put("id", n.getId());
            logItem.put("notification_id", n.getId());
            logItem.put("channel", n.getChannel());
            logItem.put("recipient", n.getCustomerPhone() != null ? n.getCustomerPhone() : n.getCustomerName());
            logItem.put("status", n.getDeliveryStatus());
            logItem.put("provider_response", "HTTP 200 OK - Sent via Simulated Gateway");
            logItem.put("timestamp", n.getCreatedAt());
            list.add(logItem);
        }
        return list;
    }

    // ---------------- STAFF ----------------
    public List<UserAccount> getStaff(Long deptId, Long branchId) {
        return users.values().stream()
                .filter(u -> deptId == null || Objects.equals(u.getDepartmentId(), deptId))
                .filter(u -> branchId == null || Objects.equals(u.getBranchId(), branchId))
                .collect(Collectors.toList());
    }

    public UserAccount createStaff(UserAccount staff) {
        long id = staffIdGen.incrementAndGet();
        staff.setId(id);
        staff.setCreatedAt(LocalDateTime.now().format(ISO_FMT));
        enrichUser(staff);
        users.put(id, staff);
        usersByUsername.put(staff.getUsername().toLowerCase(), staff);
        return staff;
    }

    public UserAccount toggleStaffStatus(Long id) {
        UserAccount u = users.get(id);
        if (u != null) {
            u.setActive(!u.isActive());
        }
        return u;
    }

    public List<Map<String, Object>> getStaffWorkload() {
        List<Map<String, Object>> list = new ArrayList<>();
        for (UserAccount u : users.values()) {
            if ("customer".equalsIgnoreCase(u.getRole())) continue;
            long assigned = tickets.values().stream()
                    .filter(t -> Objects.equals(t.getAssignedStaffId(), u.getId()) && !"Resolved".equalsIgnoreCase(t.getStatus()))
                    .count();
            long resolved = tickets.values().stream()
                    .filter(t -> Objects.equals(t.getAssignedStaffId(), u.getId()) && "Resolved".equalsIgnoreCase(t.getStatus()))
                    .count();

            Map<String, Object> item = new HashMap<>();
            item.put("user_id", u.getId());
            item.put("username", u.getUsername());
            item.put("full_name", u.getFullName());
            item.put("role", u.getRole());
            item.put("department_name", u.getDepartmentName());
            item.put("active_tickets", assigned);
            item.put("resolved_tickets", resolved);
            item.put("status", assigned > 3 ? "Heavy" : (assigned > 0 ? "Moderate" : "Available"));
            list.add(item);
        }
        return list;
    }

    // ---------------- SETTINGS ----------------
    public List<AppSetting> getSettings() {
        return new ArrayList<>(settings.values());
    }

    public AppSetting updateSetting(String key, String value) {
        AppSetting s = settings.get(key);
        if (s != null) {
            s.setValue(value);
            s.setUpdatedAt(LocalDateTime.now().format(ISO_FMT));
        } else {
            s = new AppSetting();
            s.setKey(key);
            s.setValue(value);
            s.setUpdatedAt(LocalDateTime.now().format(ISO_FMT));
            settings.put(key, s);
        }
        return s;
    }

    public List<RoutingRule> getRoutingRules() {
        return new ArrayList<>(routingRules);
    }

    public RoutingRule updateRoutingRule(Long ruleId, RoutingRule updated) {
        for (RoutingRule rr : routingRules) {
            if (Objects.equals(rr.getId(), ruleId)) {
                if (updated.getDepartmentId() != null) {
                    rr.setDepartmentId(updated.getDepartmentId());
                    Department d = departments.get(updated.getDepartmentId());
                    if (d != null) {
                        rr.setDepartmentName(d.getName());
                        rr.setDepartmentCode(d.getCode());
                    }
                }
                if (updated.getDefaultPriority() != null) rr.setDefaultPriority(updated.getDefaultPriority());
                if (updated.getSlaHours() > 0) rr.setSlaHours(updated.getSlaHours());
                rr.setActive(updated.isActive());
                return rr;
            }
        }
        return null;
    }
}
