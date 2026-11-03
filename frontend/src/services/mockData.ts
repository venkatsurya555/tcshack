import {
  User, DemoUser, Branch, Department, DashboardKPIs, AnalyticsReport,
  FeedbackRecord, ComplaintTicket, TicketDetail, AIClusterStats, ComplaintGroup,
  MenuItem, Order, QRToken, CustomerNotification, RoutingRule, AppSetting
} from '../types';

export const MOCK_BRANCHES: Branch[] = [
  { id: 1, name: 'The Royal Rasoi - Indiranagar', code: 'BLR-IND-01', address: '100 Feet Road, HAL 2nd Stage, Indiranagar', city: 'Bengaluru', phone: '+91 80 4123 4567', is_active: 1 },
  { id: 2, name: 'The Royal Rasoi - Koramangala', code: 'BLR-KOR-02', address: '80 Feet Road, 4th Block, Koramangala', city: 'Bengaluru', phone: '+91 80 4234 5678', is_active: 1 },
  { id: 3, name: 'The Royal Rasoi - Whitefield', code: 'BLR-WHI-03', address: 'ITPB Main Road, Whitefield', city: 'Bengaluru', phone: '+91 80 4345 6789', is_active: 1 },
  { id: 4, name: 'Student Mess & Canteen Hall 4', code: 'UNIV-MESS-04', address: 'Campus Central Dining, Block B', city: 'Bengaluru', phone: '+91 80 2345 6789', is_active: 1 }
];

export const MOCK_DEPARTMENTS: Department[] = [
  { id: 1, code: 'kitchen', name: 'Kitchen & Culinary', description: 'Food prep, taste, temperature, recipe standards', sla_hours: 2, is_active: 1 },
  { id: 2, code: 'service', name: 'Service & Hospitality', description: 'Wait time, staff politeness, table cleanliness', sla_hours: 1, is_active: 1 },
  { id: 3, code: 'billing', name: 'Billing & Cashier', description: 'Overcharging, wrong item billed, payment gateway delays', sla_hours: 1, is_active: 1 },
  { id: 4, code: 'packaging', name: 'Packaging & Delivery', description: 'Spillages, cold deliveries, crushed boxes', sla_hours: 2, is_active: 1 },
  { id: 5, code: 'hygiene', name: 'Sanitation & Mess Hall', description: 'Dish washing, clean cutleries, pest checks', sla_hours: 1, is_active: 1 }
];

export const MOCK_DEMO_USERS: DemoUser[] = [
  { username: 'manager', role: 'BRANCH_MANAGER', branch_id: 1, full_name: 'Kavita Nair (Branch Manager)' },
  { username: 'admin', role: 'SUPER_ADMIN', full_name: 'Super Admin (Operations)' },
  { username: 'chef_suresh', role: 'DEPARTMENT_STAFF', department_id: 1, full_name: 'Chef Suresh Rao (Kitchen Lead)' },
  { username: 'priya_service', role: 'DEPARTMENT_STAFF', department_id: 2, full_name: 'Priya Menon (Guest Relations)' }
];

export const MOCK_CURRENT_USER: User = {
  id: 1,
  username: 'manager',
  email: 'manager@royalrasoi.com',
  full_name: 'Kavita Nair (Branch Manager)',
  role: 'BRANCH_MANAGER',
  branch_id: 1,
  department_id: undefined,
  is_active: 1
};

export const MOCK_KPIS: DashboardKPIs = {
  total_feedbacks: 18,
  avg_rating: 3.6,
  total_complaints: 5,
  open_complaints: 1,
  in_progress_complaints: 1,
  resolved_complaints: 2,
  overdue_complaints: 3,
  resolution_rate_percent: 40.0,
  avg_resolution_hours: 1.8
};

export const MOCK_CHARTS: AnalyticsReport = {
  kpis: MOCK_KPIS,
  trend: [
    { date: '2026-10-24', avg_rating: 4.2, total_reviews: 4, complaint_count: 0 },
    { date: '2026-10-25', avg_rating: 3.9, total_reviews: 3, complaint_count: 1 },
    { date: '2026-10-26', avg_rating: 4.5, total_reviews: 5, complaint_count: 0 },
    { date: '2026-10-27', avg_rating: 3.1, total_reviews: 6, complaint_count: 2 },
    { date: '2026-10-28', avg_rating: 3.4, total_reviews: 5, complaint_count: 1 },
    { date: '2026-10-29', avg_rating: 3.8, total_reviews: 8, complaint_count: 1 },
    { date: '2026-10-30', avg_rating: 4.1, total_reviews: 7, complaint_count: 0 }
  ],
  ratings_breakdown: {
    '5 Stars': 7,
    '4 Stars': 5,
    '3 Stars': 2,
    '2 Stars': 2,
    '1 Star': 2
  },
  complaint_categories: [
    { category: 'Food Quality & Taste', count: 3 },
    { category: 'Food Temperature', count: 2 },
    { category: 'Service Delay', count: 2 },
    { category: 'Billing Mismatch', count: 1 }
  ],
  sla_compliance_rate: 85.5
};

export const MOCK_FEEDBACKS: FeedbackRecord[] = [
  {
    id: 1,
    feedback_id: 'FB-2026-006',
    order_id: 106,
    order_number: 'ORD-2026-106',
    branch_name: 'The Royal Rasoi - Indiranagar',
    customer_name: 'Live Guest Tester',
    created_at: '2026-10-29T09:48:35Z',
    items: [
      { menu_item_name: 'Paneer Tikka Angara', rating: 2, comment: 'Slightly burnt edges, lacked curd marinade tenderness', issue_category: 'Food Quality' },
      { menu_item_name: 'Dum Handi Chicken Biryani', rating: 5, comment: 'Aromatic and fresh, meat was super juicy', issue_category: 'Satisfied' }
    ]
  },
  {
    id: 2,
    feedback_id: 'FB-2026-005',
    order_id: 105,
    order_number: 'ORD-2026-105',
    branch_name: 'The Royal Rasoi - Indiranagar',
    customer_name: 'Rohan Kulkarni',
    created_at: '2026-10-29T09:24:43Z',
    items: [
      { menu_item_name: 'Dum Handi Chicken Biryani', rating: 1, comment: 'Chicken biryani was served lukewarm and dry', issue_category: 'Food Quality' }
    ]
  },
  {
    id: 3,
    feedback_id: 'FB-2026-004',
    order_id: 104,
    order_number: 'ORD-2026-104',
    branch_name: 'The Royal Rasoi - Indiranagar',
    customer_name: 'Divya Subramanian',
    created_at: '2026-10-29T05:54:43Z',
    items: [
      { menu_item_name: 'Dal Makhani Royale', rating: 1, comment: 'Over salted, could not finish the portion', issue_category: 'Taste and Freshness' }
    ]
  },
  {
    id: 4,
    feedback_id: 'FB-2026-003',
    order_id: 103,
    order_number: 'ORD-2026-103',
    branch_name: 'The Royal Rasoi - Indiranagar',
    customer_name: 'Vikramaditya Hegde',
    created_at: '2026-10-28T22:04:43Z',
    items: [
      { menu_item_name: 'Murgh Ghee Roast', rating: 1, comment: 'Table was neglected for 35 mins before water was offered', issue_category: 'Service Delay' }
    ]
  },
  {
    id: 5,
    feedback_id: 'FB-2026-002',
    order_id: 102,
    order_number: 'ORD-2026-102',
    branch_name: 'The Royal Rasoi - Indiranagar',
    customer_name: 'Pooja Sharma',
    created_at: '2026-10-28T16:14:43Z',
    items: [
      { menu_item_name: 'Butter Chicken Delhi 6', rating: 2, comment: 'Tasted okay but needed hot reheating, gravy was oily', issue_category: 'Food Temperature' }
    ]
  }
];

export const MOCK_COMPLAINTS: ComplaintTicket[] = [
  {
    id: 5,
    ticket_number: 'TKT-2026-005',
    order_id: 106,
    order_number: 'ORD-2026-106',
    customer_name: 'Live Guest Tester',
    customer_phone: '+91 98765 43210',
    menu_item_name: 'Paneer Tikka Angara',
    issue_category: 'Food Quality',
    priority: 'HIGH',
    status: 'NEW',
    assigned_department: 'Billing & Cashier',
    assigned_staff_name: 'Kiran Kumar',
    sla_deadline: '2026-10-29T11:48:35Z',
    is_overdue: true,
    created_at: '2026-10-29T09:48:35Z'
  },
  {
    id: 4,
    ticket_number: 'TKT-2026-004',
    order_id: 105,
    order_number: 'ORD-2026-105',
    customer_name: 'Rohan Kulkarni',
    customer_phone: '+91 99887 76655',
    menu_item_name: 'Dum Handi Chicken Biryani',
    issue_category: 'Food Quality',
    priority: 'HIGH',
    status: 'RESOLVED',
    assigned_department: 'Kitchen & Culinary',
    assigned_staff_name: 'Chef Suresh Rao',
    sla_deadline: '2026-10-29T11:24:43Z',
    is_overdue: false,
    created_at: '2026-10-29T09:24:43Z'
  },
  {
    id: 3,
    ticket_number: 'TKT-2026-003',
    order_id: 104,
    order_number: 'ORD-2026-104',
    customer_name: 'Divya Subramanian',
    customer_phone: '+91 97654 32109',
    menu_item_name: 'Dal Makhani Royale',
    issue_category: 'Taste and Freshness',
    priority: 'MEDIUM',
    status: 'INVESTIGATING',
    assigned_department: 'Kitchen & Culinary',
    assigned_staff_name: 'Chef Suresh Rao',
    sla_deadline: '2026-10-29T07:54:43Z',
    is_overdue: true,
    created_at: '2026-10-29T05:54:43Z'
  },
  {
    id: 2,
    ticket_number: 'TKT-2026-002',
    order_id: 103,
    order_number: 'ORD-2026-103',
    customer_name: 'Vikramaditya Hegde',
    customer_phone: '+91 98123 45678',
    menu_item_name: 'Murgh Ghee Roast',
    issue_category: 'Service Delay',
    priority: 'HIGH',
    status: 'ASSIGNED',
    assigned_department: 'Service & Hospitality',
    assigned_staff_name: 'Priya Menon',
    sla_deadline: '2026-10-29T00:04:43Z',
    is_overdue: true,
    created_at: '2026-10-28T22:04:43Z'
  }
];

export const MOCK_AI_STATS: AIClusterStats = {
  total_reviews: 14,
  total_clusters: 6,
  negative_ratio_percent: 78.6,
  top_complaint_category: 'Food Temperature Issues'
};

export const MOCK_AI_GROUPS: ComplaintGroup[] = [
  {
    id: 'grp-1',
    label: 'Lukewarm & Cold Food Deliveries',
    severity: 'HIGH',
    suggestedDepartment: 'Kitchen & Culinary',
    representativeText: 'The tandoori chicken arrived lukewarm and the gravy was cold',
    memberCount: 5,
    averageSentimentScore: -0.82,
    detectedAt: '2026-10-29T10:00:00Z'
  },
  {
    id: 'grp-2',
    label: 'Inattentive Table Hospitality & Wait Times',
    severity: 'MEDIUM',
    suggestedDepartment: 'Service & Hospitality',
    representativeText: 'Waitstaff was completely inattentive, waited 25 mins just to order water',
    memberCount: 4,
    averageSentimentScore: -0.65,
    detectedAt: '2026-10-29T09:30:00Z'
  },
  {
    id: 'grp-3',
    label: 'Gravy & Beverage Spillage in Transit',
    severity: 'MEDIUM',
    suggestedDepartment: 'Packaging & Delivery',
    representativeText: 'Discovered spillage all over the packaging container bag',
    memberCount: 3,
    averageSentimentScore: -0.74,
    detectedAt: '2026-10-29T08:15:00Z'
  },
  {
    id: 'grp-4',
    label: 'High Salt Levels in Curries & Soups',
    severity: 'LOW',
    suggestedDepartment: 'Kitchen & Culinary',
    representativeText: 'Dal was extremely salty, tasted like excess brine was added',
    memberCount: 2,
    averageSentimentScore: -0.58,
    detectedAt: '2026-10-28T21:00:00Z'
  }
];

export const MOCK_MENU: MenuItem[] = [
  { id: 1, name: 'Dum Handi Chicken Biryani', category: 'Main Course', price: 340, description: 'Fragrant Basmati rice cooked in dum sealed pot with succulent chicken', is_active: 1, branch_id: 1 },
  { id: 2, name: 'Paneer Tikka Angara', category: 'Starters', price: 280, description: 'Cottage cheese cubes charred in clay tandoor with bell peppers', is_active: 1, branch_id: 1 },
  { id: 3, name: 'Dal Makhani Royale', category: 'Main Course', price: 260, description: 'Slow-cooked black lentils overnight in churned butter and cream', is_active: 1, branch_id: 1 },
  { id: 4, name: 'Murgh Ghee Roast', category: 'Starters', price: 360, description: 'Mangalorean spice roast pan-fried in pure coastal ghee', is_active: 1, branch_id: 1 },
  { id: 5, name: 'Butter Chicken Delhi 6', category: 'Main Course', price: 350, description: 'Tandoori chicken pulled in silky velvet tomato cashew gravy', is_active: 1, branch_id: 1 },
  { id: 6, name: 'Special Mess Thali (Lunch)', category: 'Student Mess Special', price: 90, description: 'Roti, Dal, Paneer/Veg Curry, Rice, Curd, and Sweet', is_active: 1, branch_id: 4 }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 106,
    order_number: 'ORD-2026-106',
    branch_id: 1,
    table_number: 'T-14',
    customer_name: 'Live Guest Tester',
    customer_phone: '+91 98765 43210',
    total_amount: 620,
    status: 'COMPLETED',
    created_at: '2026-10-29T09:40:00Z',
    items: [
      { id: 1, order_id: 106, menu_item_id: 2, menu_item_name: 'Paneer Tikka Angara', quantity: 1, unit_price: 280 },
      { id: 2, order_id: 106, menu_item_id: 1, menu_item_name: 'Dum Handi Chicken Biryani', quantity: 1, unit_price: 340 }
    ]
  },
  {
    id: 105,
    order_number: 'ORD-2026-105',
    branch_id: 1,
    table_number: 'T-08',
    customer_name: 'Rohan Kulkarni',
    customer_phone: '+91 99887 76655',
    total_amount: 340,
    status: 'COMPLETED',
    created_at: '2026-10-29T09:15:00Z',
    items: [
      { id: 3, order_id: 105, menu_item_id: 1, menu_item_name: 'Dum Handi Chicken Biryani', quantity: 1, unit_price: 340 }
    ]
  }
];

export const MOCK_NOTIFICATIONS: CustomerNotification[] = [
  { id: 1, recipient_type: 'CUSTOMER', recipient_contact: '+91 98765 43210', notification_type: 'TICKET_ACKNOWLEDGED', channel: 'SMS', content: 'Your feedback regarding Paneer Tikka Angara has been escalated to Kitchen Lead Chef Suresh.', is_read: 0, created_at: '2026-10-29T09:49:00Z' },
  { id: 2, recipient_type: 'MANAGER', recipient_contact: 'manager@royalrasoi.com', notification_type: 'SLA_BREACH_WARNING', channel: 'EMAIL', content: 'URGENT: Ticket #TKT-2026-003 is approaching SLA deadline in 15 minutes.', is_read: 1, created_at: '2026-10-29T07:39:00Z' }
];

export const MOCK_SETTINGS: AppSetting[] = [
  { key: 'sla_kitchen_hours', value: '2', description: 'Kitchen standard resolution turnaround' },
  { key: 'sla_service_hours', value: '1', description: 'Front-of-house hospitality turnaround' },
  { key: 'sms_notifications_enabled', value: 'true', description: 'Send real-time SMS to diners on bill submission' }
];

export const MOCK_ROUTING_RULES: RoutingRule[] = [
  { id: 1, issue_category: 'Food Quality', target_department_id: 1, auto_assign: 1, default_priority: 'HIGH' },
  { id: 2, issue_category: 'Service Delay', target_department_id: 2, auto_assign: 1, default_priority: 'HIGH' },
  { id: 3, issue_category: 'Billing', target_department_id: 3, auto_assign: 1, default_priority: 'MEDIUM' },
  { id: 4, issue_category: 'Hygiene & Cleanliness', target_department_id: 5, auto_assign: 1, default_priority: 'CRITICAL' }
];
