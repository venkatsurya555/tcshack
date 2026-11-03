import {
  User, DemoUser, Branch, Department, Order, QRToken,
  FeedbackRecord, ComplaintTicket, TicketDetail, DashboardKPIs,
  AnalyticsReport, MenuItem, CustomerNotification, RoutingRule, AppSetting,
  ComplaintGroup, ReviewItem, AIClusterStats
} from '../types';
import {
  MOCK_BRANCHES, MOCK_DEPARTMENTS, MOCK_DEMO_USERS, MOCK_CURRENT_USER,
  MOCK_KPIS, MOCK_CHARTS, MOCK_FEEDBACKS, MOCK_COMPLAINTS, MOCK_AI_STATS,
  MOCK_AI_GROUPS, MOCK_MENU, MOCK_ORDERS, MOCK_NOTIFICATIONS, MOCK_SETTINGS,
  MOCK_ROUTING_RULES
} from './mockData';

const API_BASE = '/api/v1';

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const res = await fetch(url, { ...options, headers });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Backend is offline or running on static hosting (e.g. GitHub Pages)
    }

    // Graceful fallback for static GitHub Pages and offline demo
    return this.getMockFallback<T>(endpoint, options);
  }

  private getMockFallback<T>(endpoint: string, options: RequestInit): T {
    const clean = endpoint.split('?')[0];

    if (clean === '/auth/demo-users') return MOCK_DEMO_USERS as unknown as T;
    if (clean === '/auth/me') return MOCK_CURRENT_USER as unknown as T;
    if (clean === '/auth/login') {
      return { access_token: 'mock-jwt-token-active', user: MOCK_CURRENT_USER } as unknown as T;
    }
    if (clean === '/settings/branches') return MOCK_BRANCHES as unknown as T;
    if (clean === '/departments') return MOCK_DEPARTMENTS as unknown as T;
    if (clean === '/dashboard/kpis') return MOCK_KPIS as unknown as T;
    if (clean === '/dashboard/charts') return MOCK_CHARTS as unknown as T;
    if (clean === '/feedback') return MOCK_FEEDBACKS as unknown as T;
    if (clean === '/complaints') return MOCK_COMPLAINTS as unknown as T;
    if (clean === '/ai/dashboard/stats') return MOCK_AI_STATS as unknown as T;
    if (clean === '/ai/groups') return MOCK_AI_GROUPS as unknown as T;
    if (clean === '/ai/groups/recluster') {
      return { message: 'Reclustering complete', clusters: MOCK_AI_GROUPS.length } as unknown as T;
    }
    if (clean === '/ai/reviews') {
      const reviews = MOCK_AI_GROUPS.map((g, idx) => ({
        id: `rev-${idx + 1}`,
        reviewText: g.representativeText,
        detectedSentiment: 'NEGATIVE' as const,
        sentimentScore: g.averageSentimentScore,
        confidenceScore: 0.92,
        extractedDepartment: g.suggestedDepartment,
        extractedIssue: g.label,
        groupId: g.id,
        createdAt: g.detectedAt,
        source: 'DINER_FEEDBACK'
      }));
      return { content: reviews, totalElements: reviews.length, totalPages: 1 } as unknown as T;
    }
    if (clean === '/menu') return MOCK_MENU as unknown as T;
    if (clean === '/orders') return MOCK_ORDERS as unknown as T;
    if (clean.startsWith('/orders/')) {
      const id = parseInt(clean.replace('/orders/', '')) || 106;
      const order = MOCK_ORDERS.find(o => o.id === id) || MOCK_ORDERS[0];
      return order as unknown as T;
    }
    if (clean === '/notifications') return MOCK_NOTIFICATIONS as unknown as T;
    if (clean === '/settings') return MOCK_SETTINGS as unknown as T;
    if (clean === '/settings/routing-rules') return MOCK_ROUTING_RULES as unknown as T;
    if (clean.startsWith('/complaints/track/')) {
      return {
        ticket: MOCK_COMPLAINTS[0],
        history: [
          { status: 'NEW', timestamp: '2026-10-29T09:48:35Z', notes: 'Ticket registered from diner submission' },
          { status: 'ASSIGNED', timestamp: '2026-10-29T09:50:00Z', notes: 'Assigned to kitchen team lead' }
        ]
      } as unknown as T;
    }
    if (clean.startsWith('/complaints/')) {
      return {
        ticket: MOCK_COMPLAINTS[0],
        order: MOCK_ORDERS[0],
        investigation_notes: [
          { id: 1, ticket_id: 5, staff_name: 'Chef Suresh Rao', note: 'Checked tandoor marinade batch temp; recalibrated clay oven rack.', note_type: 'investigation', created_at: '2026-10-29T10:15:00Z' }
        ],
        status_history: [
          { id: 1, ticket_id: 5, old_status: 'NEW', new_status: 'ASSIGNED', changed_by_name: 'Kavita Nair', notes: 'Initial triage', created_at: '2026-10-29T09:50:00Z' }
        ]
      } as unknown as T;
    }
    if (clean.startsWith('/qr/validate/')) {
      return {
        valid: true,
        message: 'Valid QR token',
        order: MOCK_ORDERS[0],
        branch_name: 'The Royal Rasoi - Indiranagar'
      } as unknown as T;
    }
    if (clean === '/feedback/submit') {
      return { success: true, message: 'Feedback recorded successfully', feedback_id: 'FB-2026-007' } as unknown as T;
    }

    return [] as unknown as T;
  }

  // Auth
  async login(username: string, password: string): Promise<{ access_token: string; user: User }> {
    const data = await this.request<{ access_token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
    this.setToken(data.access_token);
    return data;
  }

  async getMe(): Promise<User> {
    return this.request<User>('/auth/me');
  }

  async getDemoUsers(): Promise<DemoUser[]> {
    return this.request<DemoUser[]>('/auth/demo-users');
  }

  // Dashboard
  async getKPIs(branchId?: number, departmentId?: number, days = 30): Promise<DashboardKPIs> {
    const params = new URLSearchParams();
    if (branchId) params.append('branch_id', branchId.toString());
    if (departmentId) params.append('department_id', departmentId.toString());
    params.append('days', days.toString());
    return this.request<DashboardKPIs>(`/dashboard/kpis?${params.toString()}`);
  }

  async getCharts(branchId?: number, departmentId?: number, days = 30): Promise<AnalyticsReport> {
    const params = new URLSearchParams();
    if (branchId) params.append('branch_id', branchId.toString());
    if (departmentId) params.append('department_id', departmentId.toString());
    params.append('days', days.toString());
    return this.request<AnalyticsReport>(`/dashboard/charts?${params.toString()}`);
  }

  // Orders
  async getOrders(params?: { search?: string; branch_id?: number; status?: string }): Promise<Order[]> {
    const q = new URLSearchParams();
    if (params?.search) q.append('search', params.search);
    if (params?.branch_id) q.append('branch_id', params.branch_id.toString());
    if (params?.status) q.append('status', params.status);
    return this.request<Order[]>(`/orders?${q.toString()}`);
  }

  async getOrder(orderId: number): Promise<Order> {
    return this.request<Order>(`/orders/${orderId}`);
  }

  async createOrder(orderData: any): Promise<Order> {
    return this.request<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  }

  async generateOrderQR(orderId: number): Promise<any> {
    return this.request(`/orders/${orderId}/qr`, { method: 'POST' });
  }

  // QR
  async getQRTokens(branchId?: number, statusFilter?: string): Promise<QRToken[]> {
    const q = new URLSearchParams();
    if (branchId) q.append('branch_id', branchId.toString());
    if (statusFilter) q.append('status_filter', statusFilter);
    return this.request<QRToken[]>(`/qr/tokens?${q.toString()}`);
  }

  async validateQRToken(token: string): Promise<{ valid: boolean; message: string; order?: Order; branch_name?: string }> {
    return this.request(`/qr/validate/${token}`);
  }

  async getQRPreview(token: string): Promise<any> {
    return this.request(`/qr/${token}/preview`);
  }

  async revokeQRToken(token: string): Promise<any> {
    return this.request(`/qr/${token}/revoke`, { method: 'POST' });
  }

  // Customer Feedback
  async submitFeedback(data: any): Promise<any> {
    return this.request('/feedback/submit', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async getFeedbacks(params?: { search?: string; branch_id?: number; rating?: number; category?: string }): Promise<FeedbackRecord[]> {
    const q = new URLSearchParams();
    if (params?.search) q.append('search', params.search);
    if (params?.branch_id) q.append('branch_id', params.branch_id.toString());
    if (params?.rating) q.append('rating', params.rating.toString());
    if (params?.category) q.append('category', params.category);
    return this.request<FeedbackRecord[]>(`/feedback?${q.toString()}`);
  }

  // Complaints
  async getComplaints(params?: {
    search?: string;
    status_filter?: string;
    priority?: string;
    department_id?: number;
    branch_id?: number;
    overdue_only?: boolean;
  }): Promise<ComplaintTicket[]> {
    const q = new URLSearchParams();
    if (params?.search) q.append('search', params.search);
    if (params?.status_filter) q.append('status_filter', params.status_filter);
    if (params?.priority) q.append('priority', params.priority);
    if (params?.department_id) q.append('department_id', params.department_id.toString());
    if (params?.branch_id) q.append('branch_id', params.branch_id.toString());
    if (params?.overdue_only) q.append('overdue_only', 'true');
    return this.request<ComplaintTicket[]>(`/complaints?${q.toString()}`);
  }

  async getTicketDetail(ticketId: number): Promise<TicketDetail> {
    return this.request<TicketDetail>(`/complaints/${ticketId}`);
  }

  async trackTicketPublic(ticketNumber: string): Promise<any> {
    return this.request(`/complaints/track/${ticketNumber}`);
  }

  async updateTicketStatus(ticketId: number, status: string, notes?: string): Promise<any> {
    return this.request(`/complaints/${ticketId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes })
    });
  }

  async assignTicket(ticketId: number, data: { department_id?: number; assigned_staff_id?: number; reassignment_reason?: string }): Promise<any> {
    return this.request(`/complaints/${ticketId}/assign`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }

  async addInvestigationNote(ticketId: number, note: string, note_type = 'investigation'): Promise<any> {
    return this.request(`/complaints/${ticketId}/investigation`, {
      method: 'POST',
      body: JSON.stringify({ note, note_type })
    });
  }

  async recordCorrectiveAction(ticketId: number, data: { root_cause: string; corrective_action: string; preventive_action?: string }): Promise<any> {
    return this.request(`/complaints/${ticketId}/corrective-action`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async verifyResolution(ticketId: number, approved: boolean, verification_notes?: string): Promise<any> {
    return this.request(`/complaints/${ticketId}/verify`, {
      method: 'POST',
      body: JSON.stringify({ approved, verification_notes })
    });
  }

  async reopenTicket(ticketId: number, reason: string): Promise<any> {
    return this.request(`/complaints/${ticketId}/reopen?reopen_reason=${encodeURIComponent(reason)}`, {
      method: 'POST'
    });
  }

  async submitSatisfaction(ticketId: number, score: number, comment?: string): Promise<any> {
    return this.request(`/complaints/${ticketId}/satisfaction`, {
      method: 'POST',
      body: JSON.stringify({ score, comment })
    });
  }

  // Department Operations
  async getDepartments(): Promise<Department[]> {
    return this.request<Department[]>('/departments');
  }

  async getDepartmentOperations(deptCode: string, branchId?: number): Promise<any> {
    const q = new URLSearchParams();
    if (branchId) q.append('branch_id', branchId.toString());
    return this.request(`/departments/${deptCode}/operations?${q.toString()}`);
  }

  // Menu
  async getMenuItems(branchId?: number, category?: string, search?: string): Promise<MenuItem[]> {
    const q = new URLSearchParams();
    if (branchId) q.append('branch_id', branchId.toString());
    if (category) q.append('category', category);
    if (search) q.append('search', search);
    return this.request<MenuItem[]>(`/menu?${q.toString()}`);
  }

  async toggleMenuAvailability(itemId: number): Promise<any> {
    return this.request(`/menu/${itemId}/toggle-availability`, { method: 'PATCH' });
  }

  async createMenuItem(itemData: any): Promise<MenuItem> {
    return this.request<MenuItem>('/menu', {
      method: 'POST',
      body: JSON.stringify(itemData)
    });
  }

  // Notifications
  async getNotifications(unreadOnly = false): Promise<CustomerNotification[]> {
    return this.request<CustomerNotification[]>(`/notifications?unread_only=${unreadOnly}`);
  }

  async markNotificationRead(notifId: number): Promise<any> {
    return this.request(`/notifications/${notifId}/read`, { method: 'PATCH' });
  }

  async getDeliveryLogs(): Promise<any[]> {
    return this.request('/notifications/delivery-logs');
  }

  // Staff
  async getStaff(departmentId?: number, branchId?: number): Promise<User[]> {
    const q = new URLSearchParams();
    if (departmentId) q.append('department_id', departmentId.toString());
    if (branchId) q.append('branch_id', branchId.toString());
    return this.request<User[]>(`/staff?${q.toString()}`);
  }

  async getStaffWorkload(): Promise<any[]> {
    return this.request('/staff/workload');
  }

  async createStaff(staffData: any): Promise<User> {
    return this.request<User>('/staff', {
      method: 'POST',
      body: JSON.stringify(staffData)
    });
  }

  async toggleStaffStatus(userId: number): Promise<any> {
    return this.request(`/staff/${userId}/toggle-status`, { method: 'PATCH' });
  }

  // Settings
  async getSettings(): Promise<AppSetting[]> {
    return this.request<AppSetting[]>('/settings');
  }

  async updateSetting(key: string, value: string): Promise<AppSetting> {
    return this.request<AppSetting>(`/settings/${key}`, {
      method: 'PUT',
      body: JSON.stringify({ value })
    });
  }

  async getRoutingRules(): Promise<RoutingRule[]> {
    return this.request<RoutingRule[]>('/settings/routing-rules');
  }

  async updateRoutingRule(ruleId: number, ruleData: any): Promise<RoutingRule> {
    return this.request<RoutingRule>(`/settings/routing-rules/${ruleId}`, {
      method: 'PUT',
      body: JSON.stringify(ruleData)
    });
  }

  async getBranches(): Promise<Branch[]> {
    return this.request<Branch[]>('/settings/branches');
  }

  // AI Semantic Review Intelligence
  async getAIGroups(): Promise<ComplaintGroup[]> {
    return this.request<ComplaintGroup[]>('/ai/groups');
  }

  async getAIReviews(params?: { groupId?: string; sentiment?: string; search?: string; page?: number; size?: number }): Promise<{ content: ReviewItem[]; totalElements: number; totalPages: number }> {
    const q = new URLSearchParams();
    if (params?.groupId) q.append('groupId', params.groupId);
    if (params?.sentiment) q.append('sentiment', params.sentiment);
    if (params?.search) q.append('search', params.search);
    if (params?.page !== undefined) q.append('page', params.page.toString());
    if (params?.size !== undefined) q.append('size', params.size.toString());
    return this.request(`/ai/reviews?${q.toString()}`);
  }

  async reclusterAIGroups(similarityThreshold = 0.65): Promise<any> {
    return this.request('/ai/groups/recluster', {
      method: 'POST',
      body: JSON.stringify({ similarityThreshold })
    });
  }

  async getAIStats(): Promise<AIClusterStats> {
    return this.request<AIClusterStats>('/ai/dashboard/stats');
  }

  async createAIReview(text: string, source = 'LIVE_SIMULATOR'): Promise<ReviewItem> {
    return this.request<ReviewItem>('/ai/reviews', {
      method: 'POST',
      body: JSON.stringify({ text, source })
    });
  }
}

export const api = new ApiService();

