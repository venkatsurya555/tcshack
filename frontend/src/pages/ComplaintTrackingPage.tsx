import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import {
  Ticket,
  Clock,
  CheckCircle2,
  Building,
  ShieldCheck,
  Star,
  Send,
  ArrowLeft,
  Sparkles
} from 'lucide-react';

export const ComplaintTrackingPage: React.FC = () => {
  const { ticketNumber } = useParams<{ ticketNumber: string }>();
  const [ticket, setTicket] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Post-resolution rating state
  const [satScore, setSatScore] = useState(5);
  const [satComment, setSatComment] = useState('');
  const [satSubmitted, setSatSubmitted] = useState(false);
  const [isSubmittingSat, setIsSubmittingSat] = useState(false);

  const fetchTicket = async () => {
    if (!ticketNumber) return;
    setIsLoading(true);
    try {
      const res = await api.trackTicketPublic(ticketNumber);
      setTicket(res);
      if (res.customer_satisfaction_score) {
        setSatScore(res.customer_satisfaction_score);
        setSatComment(res.customer_satisfaction_comment || '');
        setSatSubmitted(true);
      }
    } catch (err: any) {
      setError(err.message || 'Ticket not found.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [ticketNumber]);

  const handleSatisfactionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticket) return;
    setIsSubmittingSat(true);
    try {
      // Find ticket id via detail endpoint or by tracking ticket
      const detail = await api.getComplaints({ search: ticketNumber });
      if (detail.length > 0) {
        await api.submitSatisfaction(detail[0].id, satScore, satComment);
        setSatSubmitted(true);
        alert('Thank you! Your satisfaction feedback has been recorded.');
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmittingSat(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500">Retrieving incident resolution status...</p>
        </div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-6 text-center space-y-3">
          <h2 className="text-base font-bold text-slate-900">Ticket Not Found</h2>
          <p className="text-xs text-slate-500">{error}</p>
          <Link
            to="/"
            className="inline-block mt-3 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold"
          >
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  const isResolved = ticket.status === 'Resolved' || ticket.status === 'Closed';

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 font-sans">
      <div className="max-w-xl mx-auto space-y-6">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center space-x-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>
          <span className="text-[11px] font-mono text-slate-400">Resolution Portal</span>
        </div>

        {/* Main Status Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Incident Reference
              </span>
              <h1 className="text-lg font-bold text-slate-900 mt-0.5">{ticket.ticket_number}</h1>
              <p className="text-xs text-slate-500">{ticket.branch_name}</p>
            </div>
            <StatusBadge status={ticket.status} />
          </div>

          {/* Ticket Information */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Reported Dish:</span>
              <span className="font-bold text-slate-900">{ticket.item_name || 'General Order Concern'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Issue Category:</span>
              <span className="font-semibold text-slate-800">{ticket.issue_category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Responsible Department:</span>
              <span className="font-semibold text-emerald-700">{ticket.department_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Incident Reported:</span>
              <span className="text-slate-700">{new Date(ticket.created_at).toLocaleString()}</span>
            </div>
          </div>

          {/* Corrective Action Section (shown once verified) */}
          {ticket.corrective_action ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 space-y-3">
              <div className="flex items-center space-x-2 text-emerald-950 font-bold text-xs uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verified Corrective Action</span>
              </div>
              <p className="text-xs text-emerald-900 leading-relaxed font-medium">
                "{ticket.corrective_action}"
              </p>
              <div className="text-[10px] text-emerald-700 flex items-center space-x-1">
                <span>Verified by Branch Management on {new Date(ticket.verified_at || ticket.resolved_at).toLocaleDateString()}</span>
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 flex items-center space-x-3">
              <Clock className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <span className="font-bold block">Resolution In Progress</span>
                <span className="text-[11px] text-amber-800">
                  Our {ticket.department_name} team is actively investigating the root cause. Target SLA: {new Date(ticket.sla_deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.
                </span>
              </div>
            </div>
          )}

          {/* Post-Resolution Satisfaction Rating (Only when resolved) */}
          {isResolved && (
            <div className="border-t border-slate-100 pt-6 space-y-4">
              <div className="text-center space-y-1">
                <h3 className="text-sm font-bold text-slate-900 flex items-center justify-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Rate Our Resolution Quality</span>
                </h3>
                <p className="text-xs text-slate-500">
                  How satisfied are you with how the restaurant resolved your issue?
                </p>
              </div>

              {satSubmitted ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center text-xs text-emerald-800 font-semibold">
                  Thank you! You rated this resolution {satScore}/5 stars.
                  {satComment && <p className="text-[11px] font-normal italic mt-1">"{satComment}"</p>}
                </div>
              ) : (
                <form onSubmit={handleSatisfactionSubmit} className="space-y-3">
                  <div className="flex items-center justify-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setSatScore(star)}
                        className="p-1 focus:outline-none"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= satScore ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                          }`}
                        />
                      </button>
                    ))}
                  </div>

                  <input
                    type="text"
                    placeholder="Optional comments regarding resolution speed or communication..."
                    value={satComment}
                    onChange={(e) => setSatComment(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-emerald-500"
                  />

                  <button
                    type="submit"
                    disabled={isSubmittingSat}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmittingSat ? 'Submitting...' : 'Submit Resolution Feedback'}</span>
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
