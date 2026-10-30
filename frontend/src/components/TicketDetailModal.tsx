import React, { useState, useEffect } from 'react';
import { TicketDetail, Department, User } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from './StatusBadge';
import {
  X,
  Clock,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Send,
  FileText,
  ShieldCheck,
  HelpCircle,
  Building,
  User as UserIcon,
  ShoppingBag
} from 'lucide-react';

interface TicketDetailModalProps {
  ticketId: number | null;
  onClose: () => void;
  onRefresh: () => void;
}

export const TicketDetailModal: React.FC<TicketDetailModalProps> = ({
  ticketId,
  onClose,
  onRefresh,
}) => {
  const { user } = useAuth();
  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [staffList, setStaffList] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Forms
  const [newStatus, setNewStatus] = useState('');
  const [statusNotes, setStatusNotes] = useState('');
  
  const [investigationNote, setInvestigationNote] = useState('');
  
  const [rootCause, setRootCause] = useState('');
  const [correctiveAction, setCorrectiveAction] = useState('');
  const [preventiveAction, setPreventiveAction] = useState('');
  
  const [assignDeptId, setAssignDeptId] = useState<number | ''>('');
  const [assignStaffId, setAssignStaffId] = useState<number | ''>('');
  const [reassignReason, setReassignReason] = useState('');
  
  const [verifyNotes, setVerifyNotes] = useState('');
  const [reopenReasonText, setReopenReasonText] = useState('');

  const [activeTab, setActiveTab] = useState<'details' | 'actions' | 'investigation' | 'history'>('details');

  const isManagerOrAdmin = user?.role === 'super_admin' || user?.role === 'restaurant_manager' || user?.role === 'department_manager';

  const loadData = async () => {
    if (!ticketId) return;
    setIsLoading(true);
    try {
      const [tkt, depts, staff] = await Promise.all([
        api.getTicketDetail(ticketId),
        api.getDepartments(),
        api.getStaff()
      ]);
      setTicket(tkt);
      setDepartments(depts);
      setStaffList(staff);
      setNewStatus(tkt.status);
      setAssignDeptId(tkt.department_id);
      setAssignStaffId(tkt.assigned_staff_id || '');
      if (tkt.root_cause) setRootCause(tkt.root_cause);
      if (tkt.corrective_action) setCorrectiveAction(tkt.corrective_action);
      if (tkt.preventive_action) setPreventiveAction(tkt.preventive_action);
    } catch (err: any) {
      alert(`Error loading ticket: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [ticketId]);

  if (!ticketId) return null;

  const handleStatusChange = async () => {
    if (!ticket) return;
    try {
      await api.updateTicketStatus(ticket.id, newStatus, statusNotes);
      setStatusNotes('');
      await loadData();
      onRefresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleAssignment = async () => {
    if (!ticket) return;
    try {
      await api.assignTicket(ticket.id, {
        department_id: assignDeptId ? Number(assignDeptId) : undefined,
        assigned_staff_id: assignStaffId ? Number(assignStaffId) : undefined,
        reassignment_reason: reassignReason || undefined,
      });
      setReassignReason('');
      await loadData();
      onRefresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleAddInvestigationNote = async () => {
    if (!ticket || !investigationNote.trim()) return;
    try {
      await api.addInvestigationNote(ticket.id, investigationNote, 'investigation');
      setInvestigationNote('');
      await loadData();
      onRefresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSubmitCorrectiveAction = async () => {
    if (!ticket) return;
    if (!rootCause.trim() || !correctiveAction.trim()) {
      alert('Please enter both Root Cause and Corrective Action.');
      return;
    }
    try {
      await api.recordCorrectiveAction(ticket.id, {
        root_cause: rootCause,
        corrective_action: correctiveAction,
        preventive_action: preventiveAction || undefined
      });
      await loadData();
      onRefresh();
      alert('Corrective action submitted for Manager Verification!');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleVerify = async (approved: boolean) => {
    if (!ticket) return;
    try {
      await api.verifyResolution(ticket.id, approved, verifyNotes);
      setVerifyNotes('');
      await loadData();
      onRefresh();
      alert(approved ? 'Resolution verified and customer notified!' : 'Resolution rejected and returned to In Progress.');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleReopen = async () => {
    if (!ticket) return;
    if (!reopenReasonText.trim()) {
      alert('Please specify the reason for reopening.');
      return;
    }
    try {
      await api.reopenTicket(ticket.id, reopenReasonText);
      setReopenReasonText('');
      await loadData();
      onRefresh();
      alert('Ticket reopened.');
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center space-x-3">
            <span className="text-lg font-bold text-slate-900 tracking-tight">
              {ticket?.ticket_number || 'Loading...'}
            </span>
            {ticket && <StatusBadge status={ticket.status} isOverdue={ticket.is_overdue} />}
            {ticket && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                ticket.priority === 'Critical' ? 'bg-rose-100 text-rose-800' :
                ticket.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                ticket.priority === 'Medium' ? 'bg-amber-100 text-amber-800' :
                'bg-slate-100 text-slate-700'
              }`}>
                {ticket.priority} Priority
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-slate-200 bg-white flex space-x-6">
          <button
            onClick={() => setActiveTab('details')}
            className={`py-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'details' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Ticket & Order Overview
          </button>
          <button
            onClick={() => setActiveTab('actions')}
            className={`py-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'actions' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Resolution & Verification
          </button>
          <button
            onClick={() => setActiveTab('investigation')}
            className={`py-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'investigation' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Investigation Notes ({ticket?.investigation_notes?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'history' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Audit History ({ticket?.status_history?.length || 0})
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 text-slate-800 space-y-6">
          {isLoading && !ticket ? (
            <div className="py-12 text-center text-slate-400">Loading complaint details...</div>
          ) : ticket ? (
            <>
              {/* TAB 1: DETAILS */}
              {activeTab === 'details' && (
                <div className="space-y-6">
                  {/* SLA & Timing banner */}
                  <div className={`p-4 rounded-xl border flex items-center justify-between ${
                    ticket.is_overdue
                      ? 'bg-rose-50 border-rose-200 text-rose-900'
                      : ticket.status === 'Resolved'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-amber-50 border-amber-200 text-amber-900'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 shrink-0" />
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider">
                          SLA Deadline: {new Date(ticket.sla_deadline).toLocaleString()}
                        </div>
                        <div className="text-xs mt-0.5">
                          Elapsed: {ticket.time_elapsed_minutes} minutes from feedback submission
                        </div>
                      </div>
                    </div>
                    {ticket.verified_at && (
                      <div className="text-right text-xs">
                        <span className="font-semibold text-emerald-700">Verified by:</span> {ticket.verified_by_name}
                      </div>
                    )}
                  </div>

                  {/* Core Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                      <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center space-x-1.5">
                        <FileText className="w-4 h-4 text-slate-400" />
                        <span>Issue Details</span>
                      </h4>
                      <div>
                        <span className="text-xs text-slate-500">Reported Item:</span>
                        <div className="text-sm font-bold text-slate-900">{ticket.item_name || 'General Feedback'}</div>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500">Category:</span>
                        <div className="text-xs font-semibold text-slate-800">{ticket.issue_category}</div>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500">Customer Comment:</span>
                        <div className="text-xs text-slate-700 italic bg-white p-2.5 rounded-lg border border-slate-200 mt-1">
                          "{ticket.customer_comment || 'No written comment provided'}"
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                      <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center space-x-1.5">
                        <ShoppingBag className="w-4 h-4 text-slate-400" />
                        <span>Order & Customer</span>
                      </h4>
                      <div>
                        <span className="text-xs text-slate-500">Order Reference:</span>
                        <div className="text-sm font-bold text-slate-900">#{ticket.order_number}</div>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500">Guest Name & Phone:</span>
                        <div className="text-xs font-semibold text-slate-800">
                          {ticket.customer_name} • {ticket.customer_phone || 'N/A'}
                        </div>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500">Branch:</span>
                        <div className="text-xs font-semibold text-slate-800">{ticket.branch_name}</div>
                      </div>
                    </div>
                  </div>

                  {/* Department & Staff Assignment Box */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-4">
                    <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center space-x-1.5">
                      <Building className="w-4 h-4 text-emerald-600" />
                      <span>Assignment & Routing Control</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-slate-500 font-medium block mb-1">
                          Responsible Department:
                        </label>
                        <select
                          value={assignDeptId}
                          onChange={(e) => setAssignDeptId(Number(e.target.value))}
                          className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-emerald-500"
                        >
                          {departments.map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.name} ({d.sla_hours}h SLA)
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-xs text-slate-500 font-medium block mb-1">
                          Assigned Staff:
                        </label>
                        <select
                          value={assignStaffId}
                          onChange={(e) => setAssignStaffId(e.target.value ? Number(e.target.value) : '')}
                          className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-emerald-500"
                        >
                          <option value="">Unassigned</option>
                          {staffList.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.full_name} ({s.role.replace('_', ' ')})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-slate-500 font-medium block mb-1">
                        Reassignment Reason (Logged in audit trail):
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Requires kitchen line chef inspection rather than floor service"
                        value={reassignReason}
                        onChange={(e) => setReassignReason(e.target.value)}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={handleAssignment}
                        className="px-3.5 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
                      >
                        Update Assignment
                      </button>
                    </div>
                  </div>

                  {/* Post-Resolution Customer Feedback */}
                  {ticket.customer_satisfaction_score && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                      <div className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-1">
                        Customer Post-Resolution Feedback
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-emerald-800">
                        <span>Rating: {'★'.repeat(ticket.customer_satisfaction_score)}</span>
                        <span>({ticket.customer_satisfaction_score}/5 stars)</span>
                      </div>
                      {ticket.customer_satisfaction_comment && (
                        <p className="text-xs text-emerald-700 italic mt-1">
                          "{ticket.customer_satisfaction_comment}"
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: ACTIONS & VERIFICATION */}
              {activeTab === 'actions' && (
                <div className="space-y-6">
                  {/* Step 1: Record Corrective Action (Staff or Manager) */}
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                        1
                      </div>
                      <h4 className="text-xs font-bold uppercase text-slate-700 tracking-wider">
                        Investigate & Document Corrective Actions
                      </h4>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Root Cause Analysis:
                      </label>
                      <textarea
                        rows={2}
                        value={rootCause}
                        onChange={(e) => setRootCause(e.target.value)}
                        placeholder="Identify exact failure point (e.g. line temperature drop, improper seasoning measurement, runner delay)"
                        className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Corrective Action Taken:
                      </label>
                      <textarea
                        rows={2}
                        value={correctiveAction}
                        onChange={(e) => setCorrectiveAction(e.target.value)}
                        placeholder="Action taken immediately (e.g. dish remade fresh, sensor recalibrated, runner coached)"
                        className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Preventive Action (Prevent Recurrence):
                      </label>
                      <textarea
                        rows={2}
                        value={preventiveAction}
                        onChange={(e) => setPreventiveAction(e.target.value)}
                        placeholder="Long term guardrail (e.g. 90-sec pass buzzer, mandatory temperature probe log)"
                        className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={handleSubmitCorrectiveAction}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-xs"
                      >
                        Submit Corrective Action (Sets to Pending Verification)
                      </button>
                    </div>
                  </div>

                  {/* Step 2: Formal Manager Verification */}
                  <div className={`p-5 rounded-xl border space-y-4 ${
                    ticket.status === 'Resolved Pending Verification'
                      ? 'bg-teal-50/70 border-teal-300'
                      : 'bg-white border-slate-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-teal-700 text-white text-xs font-bold flex items-center justify-center">
                          2
                        </div>
                        <h4 className="text-xs font-bold uppercase text-teal-950 tracking-wider flex items-center space-x-1.5">
                          <ShieldCheck className="w-4 h-4 text-teal-600" />
                          <span>Manager Resolution Verification</span>
                        </h4>
                      </div>
                      <span className="text-[11px] text-slate-500">
                        {isManagerOrAdmin ? '✓ You have Manager Verification Authority' : '⚠️ Requires Manager Role'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      By restaurant policy, complaints cannot be marked resolved until an authorized manager verifies that the root cause and corrective actions meet culinary and hospitality standards. Verification automatically sends the final notification to the customer.
                    </p>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Verification Audit Notes:
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Inspected fryer temperature logs, spoke with customer and confirmed satisfaction"
                        value={verifyNotes}
                        onChange={(e) => setVerifyNotes(e.target.value)}
                        className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="flex items-center justify-end space-x-3">
                      <button
                        disabled={!isManagerOrAdmin}
                        onClick={() => handleVerify(false)}
                        className="px-4 py-2 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold hover:bg-rose-100 disabled:opacity-50 transition-colors"
                      >
                        Reject Resolution (Return to In Progress)
                      </button>
                      <button
                        disabled={!isManagerOrAdmin}
                        onClick={() => handleVerify(true)}
                        className="px-4 py-2 bg-teal-600 text-white rounded-lg text-xs font-semibold hover:bg-teal-700 disabled:opacity-50 transition-colors shadow-xs"
                      >
                        Verify Resolution & Notify Customer
                      </button>
                    </div>
                  </div>

                  {/* Reopen Box (if resolved) */}
                  {(ticket.status === 'Resolved' || ticket.status === 'Closed') && (
                    <div className="bg-rose-50/60 p-4 rounded-xl border border-rose-200 space-y-3">
                      <h4 className="text-xs font-bold uppercase text-rose-800 tracking-wider flex items-center space-x-1.5">
                        <RotateCcw className="w-4 h-4" />
                        <span>Reopen Complaint</span>
                      </h4>
                      <input
                        type="text"
                        placeholder="Reason for reopening (e.g. customer called back reporting recurring issue)"
                        value={reopenReasonText}
                        onChange={(e) => setReopenReasonText(e.target.value)}
                        className="w-full text-xs p-2 bg-white border border-rose-200 rounded-lg focus:ring-1 focus:ring-rose-500"
                      />
                      <div className="flex justify-end">
                        <button
                          onClick={handleReopen}
                          className="px-3.5 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-semibold hover:bg-rose-700 transition-colors"
                        >
                          Reopen Ticket
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: INVESTIGATION NOTES */}
              {activeTab === 'investigation' && (
                <div className="space-y-4">
                  {/* Add Note Form */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-700 tracking-wider block">
                      Add Investigation Finding / Internal Note
                    </label>
                    <textarea
                      rows={2}
                      value={investigationNote}
                      onChange={(e) => setInvestigationNote(e.target.value)}
                      placeholder="e.g. Checked POS KOT timestamp at 20:14, runner dispatch was delayed by 18 minutes."
                      className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-500"
                    />
                    <div className="flex justify-end">
                      <button
                        onClick={handleAddInvestigationNote}
                        className="px-3.5 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 flex items-center space-x-1.5 transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Add Note & Advance to In Progress</span>
                      </button>
                    </div>
                  </div>

                  {/* Notes Feed */}
                  <div className="space-y-3">
                    {ticket.investigation_notes?.length === 0 ? (
                      <p className="text-xs text-slate-400 py-4 text-center">No investigation notes recorded yet.</p>
                    ) : (
                      ticket.investigation_notes?.map((n) => (
                        <div key={n.id} className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
                          <div className="flex items-center justify-between text-[11px] text-slate-500">
                            <span className="font-semibold text-slate-800">{n.user_name}</span>
                            <span>{new Date(n.created_at).toLocaleString()}</span>
                          </div>
                          <p className="text-xs text-slate-700 leading-relaxed">{n.note}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: AUDIT HISTORY */}
              {activeTab === 'history' && (
                <div className="space-y-3">
                  <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                    {ticket.status_history?.map((h) => (
                      <div key={h.id} className="relative">
                        <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-emerald-600 border-2 border-white ring-1 ring-emerald-600" />
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-900">
                              {h.old_status ? `${h.old_status} → ` : ''}{h.new_status}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {new Date(h.created_at).toLocaleString()}
                            </span>
                          </div>
                          <div className="text-xs text-slate-600 mt-1">{h.notes}</div>
                          <div className="text-[10px] text-slate-400 mt-1">
                            Action by: {h.changed_by_name || 'System Engine'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold hover:bg-slate-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
