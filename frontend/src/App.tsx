import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';

// Dashboard Pages
import { Overview } from './pages/Overview';
import { FeedbackManagement } from './pages/FeedbackManagement';
import { ComplaintsManagement } from './pages/ComplaintsManagement';
import { DepartmentOperations } from './pages/DepartmentOperations';
import { OrderManagement } from './pages/OrderManagement';
import { MenuManagement } from './pages/MenuManagement';
import { QRManagement } from './pages/QRManagement';
import { NotificationsCenter } from './pages/NotificationsCenter';
import { AnalyticsReports } from './pages/AnalyticsReports';
import { StaffManagement } from './pages/StaffManagement';
import { SettingsPage } from './pages/SettingsPage';
import { AIReviewIntelligence } from './pages/AIReviewIntelligence';

// Customer Facing Pages
import { CustomerFeedbackPage } from './pages/CustomerFeedbackPage';
import { ComplaintTrackingPage } from './pages/ComplaintTrackingPage';
import { ThemePreviewPage } from './pages/ThemePreviewPage';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Customer Facing Portal (Mobile-First Standalone) */}
          <Route path="/feedback/:token" element={<CustomerFeedbackPage />} />
          <Route path="/track/:ticketNumber" element={<ComplaintTrackingPage />} />
          <Route path="/theme-preview" element={<ThemePreviewPage />} />
          <Route path="/diner-review" element={<ThemePreviewPage />} />

          {/* Admin & Department Operations Dashboard */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Overview />} />
            <Route path="feedback" element={<FeedbackManagement />} />
            <Route path="complaints" element={<ComplaintsManagement />} />
            <Route path="department-ops" element={<DepartmentOperations />} />
            <Route path="ai-clusters" element={<AIReviewIntelligence />} />
            <Route path="orders" element={<OrderManagement />} />
            <Route path="menu" element={<MenuManagement />} />
            <Route path="qr-management" element={<QRManagement />} />
            <Route path="notifications" element={<NotificationsCenter />} />
            <Route path="analytics" element={<AnalyticsReports />} />
            <Route path="staff" element={<StaffManagement />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
