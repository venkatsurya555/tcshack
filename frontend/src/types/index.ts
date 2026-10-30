export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: 'super_admin' | 'restaurant_manager' | 'department_manager' | 'department_staff' | 'customer';
  department_id?: number | null;
  department_name?: string | null;
  branch_id?: number | null;
  branch_name?: string | null;
  phone?: string | null;
  is_active: boolean;
  created_at: string;
}

export interface DemoUser {
  username: string;
  full_name: string;
  role: string;
  department: string;
  department_code?: string;
  branch: string;
  default_password: string;
}

export interface Branch {
  id: number;
  name: string;
  code: string;
  address: string;
  city: string;
  phone: string;
  is_active: boolean;
}

export interface Department {
  id: number;
  code: string;
  name: string;
  description?: string;
  sla_hours: number;
  is_active: boolean;
}

export interface OrderItem {
  id: number;
  order_id: number;
  menu_item_id?: number;
  item_name: string;
  quantity: number;
  price_each: number;
  subtotal: number;
}

export interface Order {
  id: number;
  order_number: string;
  branch_id: number;
  branch_name?: string;
  customer_name: string;
  customer_phone?: string;
  customer_email?: string;
  table_number?: string;
  order_channel: string;
  bill_total: number;
  status: string;
  feedback_submitted: boolean;
  created_at: string;
  items: OrderItem[];
  qr_token?: string;
  qr_status?: string;
}

export interface QRToken {
  id: number;
  token: string;
  order_id: number;
  order_number: string;
  branch_id: number;
  branch_name: string;
  status: 'active' | 'used' | 'expired' | 'revoked';
  expires_at: string;
  feedback_url: string;
  qr_code_image?: string;
}

export interface ItemFeedbackInput {
  order_item_id: number;
  rating: number;
  issue_category?: string;
  follow_up_response?: string;
  comment?: string;
}

export interface FeedbackRecord {
  id: number;
  feedback_number: string;
  submission_id: number;
  date_time: string;
  order_id: number;
  order_number: string;
  branch_id: number;
  branch_name: string;
  item_name: string;
  rating: number;
  customer_comment?: string;
  customer_name?: string;
  customer_phone?: string;
  channel: string;
  issue_category: string;
  assigned_department?: string;
  has_complaint: boolean;
  ticket_number?: string;
  ticket_id?: number;
  ticket_status?: string;
}

export interface TicketStatusHistory {
  id: number;
  old_status?: string;
  new_status: string;
  changed_by_name?: string;
  notes?: string;
  created_at: string;
}

export interface InvestigationNote {
  id: number;
  user_name: string;
  note_type: string;
  note: string;
  created_at: string;
}

export interface ComplaintTicket {
  id: number;
  ticket_number: string;
  order_id: number;
  order_number?: string;
  branch_id: number;
  branch_name?: string;
  department_id: number;
  department_name?: string;
  department_code?: string;
  assigned_staff_id?: number;
  assigned_staff_name?: string;
  item_name?: string;
  issue_category: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: string;
  customer_name?: string;
  customer_phone?: string;
  customer_comment?: string;
  sla_deadline: string;
  is_overdue: boolean;
  time_elapsed_minutes: number;
  acknowledged_at?: string;
  resolved_at?: string;
  verified_at?: string;
  verified_by_name?: string;
  root_cause?: string;
  corrective_action?: string;
  preventive_action?: string;
  reassignment_reason?: string;
  reopen_reason?: string;
  customer_satisfaction_score?: number;
  customer_satisfaction_comment?: string;
  created_at: string;
  updated_at: string;
}

export interface TicketDetail extends ComplaintTicket {
  status_history: TicketStatusHistory[];
  investigation_notes: InvestigationNote[];
  order?: Order;
  original_feedback?: {
    rating: number;
    comment?: string;
    follow_up_response?: string;
    issue_category?: string;
  };
}

export interface DashboardKPIs {
  total_feedback: number;
  average_customer_rating: number;
  total_complaints: number;
  open_complaints: number;
  in_progress_complaints: number;
  resolved_complaints: number;
  overdue_complaints: number;
  resolution_rate: number;
  average_resolution_time_hours: number;
}

export interface AnalyticsReport {
  kpis: DashboardKPIs;
  feedback_trend: Array<{ date: string; feedback_count: number; avg_rating: number }>;
  rating_distribution: Array<{ rating: string; stars: number; count: number }>;
  complaints_by_category: Array<{ category: string; count: number }>;
  complaints_by_department: Array<{ department: string; count: number }>;
  complaint_status_breakdown: Array<{ status: string; count: number }>;
  resolution_time_trends: Array<{ week: string; target_hours: number; actual_hours: number }>;
  top_reported_items: Array<{ item_name: string; complaint_count: number }>;
  sla_compliance_rate: number;
  reopen_rate: number;
  satisfaction_avg: number;
}

export interface MenuItem {
  id: number;
  name: string;
  category: string;
  description?: string;
  price: number;
  is_available: boolean;
  branch_id?: number;
  created_at: string;
  average_rating?: number;
  total_feedbacks?: number;
  total_complaints?: number;
}

export interface CustomerNotification {
  id: number;
  ticket_id: number;
  ticket_number?: string;
  customer_name?: string;
  customer_phone?: string;
  event_type: string;
  title: string;
  message: string;
  channel: string;
  is_read: boolean;
  delivery_status: string;
  created_at: string;
}

export interface RoutingRule {
  id: number;
  issue_category: string;
  department_id: number;
  department_name?: string;
  department_code?: string;
  default_priority: string;
  sla_hours: number;
  is_active: boolean;
}

export interface AppSetting {
  id: number;
  key: string;
  value: string;
  description?: string;
  updated_at: string;
}

export interface ComplaintGroup {
  id: string;
  label: string;
  description: string;
  reviewCount: number;
  percentage: number;
  sentimentSummary: Record<string, number>;
  representativeExamples: string[];
  outlierGroup: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewItem {
  id: string;
  text: string;
  sentiment: string;
  sentimentConfidence: number;
  groupId: string;
  groupLabel: string;
  similarityToCentroid: number;
  outlier: boolean;
  source: string;
  createdAt: string;
  processingStatus: string;
}

export interface AIClusterStats {
  totalReviews: number;
  totalGroups: number;
  negativePercentage: number;
  mostFrequentCategory: string;
  ungroupedCount: number;
  sentimentDistribution: Record<string, number>;
  categoryBreakdown: Array<{ id: string; label: string; count: number; percentage: number; outlier: boolean }>;
}

