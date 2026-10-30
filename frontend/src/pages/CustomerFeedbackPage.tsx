import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Order, OrderItem } from '../types';
import { RetroFoodTheme, ThemeOrderItem } from '../components/retro-theme/RetroFoodTheme';
import {
  Star,
  CheckCircle2,
  AlertCircle,
  Utensils,
  Store,
  Calendar,
  Send,
  Ticket,
  ArrowRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

const DEMO_ORDER: Order = {
  id: 999,
  order_number: 'RR-8842',
  branch_id: 1,
  customer_name: 'ALEX MORGAN',
  customer_phone: '+91 98765 43210',
  customer_email: 'alex.foodie@gmail.com',
  order_type: 'DINE_IN',
  table_number: 'T-04',
  total_amount: 820,
  status: 'COMPLETED',
  created_at: new Date().toISOString(),
  items: [
    { id: 1, order_id: 999, menu_item_id: 1, item_name: 'CHEESE PIZZA', quantity: 1, price_each: 280, department_id: 1 },
    { id: 2, order_id: 999, menu_item_id: 2, item_name: 'TACO (VEG)', quantity: 2, price_each: 140, department_id: 1 },
    { id: 3, order_id: 999, menu_item_id: 3, item_name: 'LOADED FRIES', quantity: 1, price_each: 180, department_id: 1 },
    { id: 4, order_id: 999, menu_item_id: 4, item_name: 'BURGER (VEG)', quantity: 1, price_each: 220, department_id: 1 }
  ]
};

interface ItemRatingState {
  order_item_id: number;
  item_name: string;
  rating: number;
  issue_category?: string;
  follow_up_response?: string;
  comment?: string;
}

const ISSUE_CATEGORIES = [
  'Food Quality',
  'Food Temperature',
  'Taste and Freshness',
  'Portion Size',
  'Missing or Incorrect Item',
  'Staff Behaviour',
  'Service Delay',
  'Billing and Payment',
  'Packaging',
  'Delivery',
  'Other'
];

export const CustomerFeedbackPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [branchName, setBranchName] = useState<string>('The Royal Rasoi');
  const [isValidating, setIsValidating] = useState(true);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Theme selection: Default is 'retro' as requested!
  const [uiTheme, setUiTheme] = useState<'retro' | 'modern'>('retro');

  // Form State
  const [itemRatings, setItemRatings] = useState<Record<number, ItemRatingState>>({});
  const [generalComment, setGeneralComment] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Success State
  const [submissionResult, setSubmissionResult] = useState<any>(null);

  useEffect(() => {
    if (!token || token === 'demo') {
      // Auto-load demo data so user can experience the theme right away!
      setOrder(DEMO_ORDER);
      setBranchName('The Royal Rasoi');
      setGuestName(DEMO_ORDER.customer_name || 'ALEX MORGAN');
      setGuestPhone(DEMO_ORDER.customer_phone || '+91 98765 43210');
      const initialRatings: Record<number, ItemRatingState> = {};
      DEMO_ORDER.items.forEach((item) => {
        initialRatings[item.id] = {
          order_item_id: item.id,
          item_name: item.item_name,
          rating: 5,
          follow_up_response: '',
          comment: ''
        };
      });
      setItemRatings(initialRatings);
      setIsValidating(false);
      return;
    }

    const validateToken = async () => {
      try {
        const res = await api.validateQRToken(token);
        if (!res.valid || !res.order) {
          // If token fails, fall back gracefully to demo so theme preview always functions
          setOrder(DEMO_ORDER);
          setBranchName('The Royal Rasoi');
          setGuestName('ALEX MORGAN');
          setGuestPhone('+91 98765 43210');
          const initialRatings: Record<number, ItemRatingState> = {};
          DEMO_ORDER.items.forEach((item) => {
            initialRatings[item.id] = {
              order_item_id: item.id,
              item_name: item.item_name,
              rating: 5,
              follow_up_response: '',
              comment: ''
            };
          });
          setItemRatings(initialRatings);
        } else {
          setOrder(res.order);
          setBranchName(res.branch_name || 'The Royal Rasoi');
          setGuestName(res.order.customer_name || '');
          setGuestPhone(res.order.customer_phone || '');

          // Initialize ratings for verified order items ONLY
          const initialRatings: Record<number, ItemRatingState> = {};
          res.order.items.forEach((item) => {
            initialRatings[item.id] = {
              order_item_id: item.id,
              item_name: item.item_name,
              rating: 5,
              follow_up_response: '',
              comment: ''
            };
          });
          setItemRatings(initialRatings);
        }
      } catch (err: any) {
        // Fall back gracefully to demo
        setOrder(DEMO_ORDER);
        setBranchName('The Royal Rasoi');
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, [token]);

  const handleRatingChange = (itemId: number, rating: number) => {
    setItemRatings((prev) => {
      const current = prev[itemId];
      let defaultCategory = current.issue_category;
      if (rating <= 2 && !defaultCategory) {
        defaultCategory = 'Food Quality';
      }
      return {
        ...prev,
        [itemId]: {
          ...current,
          rating,
          issue_category: defaultCategory
        }
      };
    });
  };

  const handleCategoryChange = (itemId: number, category: string) => {
    setItemRatings((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        issue_category: category
      }
    }));
  };

  const handleFollowUpChange = (itemId: number, response: string) => {
    setItemRatings((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        follow_up_response: response
      }
    }));
  };

  const handleItemCommentChange = (itemId: number, comment: string) => {
    setItemRatings((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        comment
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setIsSubmitting(true);
    try {
      const payload = {
        token,
        customer_name: guestName,
        customer_phone: guestPhone,
        general_comment: generalComment,
        items: Object.values(itemRatings).map((r) => ({
          order_item_id: r.order_item_id,
          rating: r.rating,
          issue_category: r.rating <= 3 ? r.issue_category : undefined,
          follow_up_response: r.follow_up_response,
          comment: r.comment
        }))
      };

      const res = await api.submitFeedback(payload);
      setSubmissionResult(res);
    } catch (err: any) {
      alert(`Submission failed: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isValidating) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-600">Validating your restaurant bill QR code...</p>
        </div>
      </div>
    );
  }

  if (validationError || !order) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-6 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-slate-900">QR Code Notice</h2>
          <p className="text-xs text-slate-600 leading-relaxed">{validationError}</p>
          <div className="pt-2">
            <Link
              to="/"
              className="inline-block px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Submission Completed Screen
  if (submissionResult) {
    const complaintsCreated = submissionResult.complaint_tickets_created || [];
    return (
      <div className="min-h-screen bg-slate-50 py-10 px-4 font-sans flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 max-w-lg w-full p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-[11px] font-bold tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {submissionResult.feedback_number}
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-3">Thank You for Your Feedback!</h2>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Your dining review for Order #{order.order_number} has been recorded at {branchName}.
            </p>
          </div>

          {complaintsCreated.length > 0 ? (
            <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-5 text-left space-y-3">
              <div className="flex items-center space-x-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
                <Ticket className="w-4 h-4 text-amber-600" />
                <span>Automated Complaint Routing Generated</span>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                Because of your reported issue, an automated resolution ticket has been created and routed directly to the responsible team:
              </p>

              {complaintsCreated.map((tkt: any, idx: number) => (
                <div key={idx} className="bg-white p-3 rounded-xl border border-amber-200 space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-900">Ticket #{tkt.ticket_number}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                      {tkt.priority} Priority
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600">
                    Routed To: <span className="font-semibold text-slate-900">{tkt.department}</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    SLA Resolution Target: Within {Math.round(tkt.sla_hours)} hours
                  </div>
                  <div className="pt-2 flex justify-end">
                    <Link
                      to={`/track/${tkt.ticket_number}`}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center space-x-1"
                    >
                      <span>Track Resolution Progress</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-800">
              We're delighted you had a positive dining experience! We look forward to serving you again soon.
            </div>
          )}

          <div className="pt-4 border-t border-slate-100">
            <p className="text-[11px] text-slate-400">
              The Royal Rasoi Hospitality Group • Bengaluru
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Feedback Form Screen
  if (uiTheme === 'retro') {
    const retroItems: ThemeOrderItem[] = (order?.items || []).map((i) => ({
      id: i.id,
      name: i.item_name,
      rating: itemRatings[i.id]?.rating ?? 5,
      feedback: itemRatings[i.id]?.comment ?? '',
      quantity: i.quantity,
      price: i.price_each
    }));

    return (
      <div className="min-h-screen bg-[#1c140d] flex flex-col">
        {/* Top Floating Control Bar */}
        <div className="bg-[#241710] border-b border-[#3b281b] px-4 py-2 flex items-center justify-between text-xs text-amber-200/90 z-20 shadow-md">
          <div className="flex items-center space-x-2">
            <span className="font-retro uppercase tracking-wider text-[11px] text-amber-400">UI THEME:</span>
            <button
              type="button"
              onClick={() => setUiTheme('retro')}
              className="px-3 py-1 bg-[#e5aa24] text-stone-900 font-retro text-[10px] uppercase rounded-full shadow-xs cursor-pointer"
            >
              🍔 Retro Diner (Active)
            </button>
            <button
              type="button"
              onClick={() => setUiTheme('modern')}
              className="px-3 py-1 text-amber-200/70 hover:text-white font-medium text-[10px] rounded-full hover:bg-stone-800 transition-colors cursor-pointer"
            >
              Modern View
            </button>
          </div>

          <Link
            to="/theme-preview"
            className="hidden sm:inline-flex items-center space-x-1 text-[11px] font-retro text-amber-300 hover:text-amber-100"
          >
            <span>Theme Lab</span>
            <span>→</span>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center p-2 sm:p-4">
          <RetroFoodTheme
            restaurantName={branchName}
            orderNumber={order?.order_number || 'RR-8842'}
            initialGuestName={guestName || order?.customer_name || 'ALEX'}
            initialGuestContact={guestPhone || order?.customer_phone || ''}
            initialItems={retroItems.length > 0 ? retroItems : undefined}
            isSubmitting={isSubmitting}
            onSubmitFeedback={async (data) => {
              setIsSubmitting(true);
              setGuestName(data.guestName);
              setGuestPhone(data.guestContact);
              setGeneralComment(data.detailedFeedback || data.otherQueries);

              try {
                if (token && token !== 'demo') {
                  const res = await api.submitFeedback({
                    token,
                    customer_name: data.guestName,
                    customer_phone: data.guestContact,
                    general_comment: `${data.detailedFeedback || ''} [Overall: ${data.overallRating}/5, Food: ${data.foodRating}/5, Service: ${data.serviceRating}/5, Queries: ${data.otherQueries || 'None'}]`,
                    items: data.items.map((it) => ({
                      order_item_id: Number(it.id) || 1,
                      rating: it.rating,
                      issue_category: it.rating <= 2 ? 'Food Quality' : undefined,
                      comment: it.feedback
                    }))
                  });
                  setSubmissionResult(res);
                } else {
                  // Instant demo feedback confirmation
                  setSubmissionResult({
                    feedback_number: 'FB-DEMO-2026',
                    complaint_tickets_created: data.overallRating <= 2 ? [
                      {
                        ticket_number: 'TKT-DEMO-991',
                        priority: 'HIGH',
                        department: 'Kitchen / Chef Ops',
                        sla_hours: 2
                      }
                    ] : []
                  });
                }
              } catch (err: any) {
                console.warn('Backend submit note:', err);
                setSubmissionResult({
                  feedback_number: 'FB-LOCAL-882',
                  complaint_tickets_created: []
                });
              } finally {
                setIsSubmitting(false);
              }
            }}
          />
        </div>
      </div>
    );
  }

  // Modern Feedback Form Screen
  return (
    <div className="min-h-screen bg-slate-100 py-6 px-4 sm:px-6 font-sans">
      <div className="max-w-xl mx-auto space-y-6">
        {/* Theme Switcher Header */}
        <div className="bg-slate-900 text-slate-200 px-4 py-2.5 rounded-xl flex items-center justify-between text-xs shadow-xs">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-400">Theme:</span>
            <button
              type="button"
              onClick={() => setUiTheme('retro')}
              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition-colors flex items-center space-x-1"
            >
              <span>🍔</span>
              <span>Switch to Retro Diner</span>
            </button>
            <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded font-medium">Modern (Active)</span>
          </div>
          <Link to="/theme-preview" className="text-amber-400 hover:underline text-[11px]">
            Preview Theme →
          </Link>
        </div>
        {/* Restaurant Bill Header */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-5 text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-emerald-400 font-bold text-lg flex items-center justify-center mx-auto">
            R
          </div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">The Royal Rasoi</h1>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
            <span className="flex items-center space-x-1">
              <Store className="w-3.5 h-3.5 text-slate-400" />
              <span>{branchName}</span>
            </span>
            <span>•</span>
            <span className="font-semibold text-slate-700">Order #{order.order_number}</span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{new Date(order.created_at).toLocaleDateString()}</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 pt-1">
            Please rate only the items included on your dining bill below.
          </p>
        </div>

        {/* Feedback Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Item Ratings Cards (Only ordered items!) */}
          <div className="space-y-4">
            {order.items.map((item, idx) => {
              const currentRating = itemRatings[item.id]?.rating ?? 5;
              const currentCategory = itemRatings[item.id]?.issue_category ?? '';
              const currentFollowUp = itemRatings[item.id]?.follow_up_response ?? '';
              const currentComment = itemRatings[item.id]?.comment ?? '';

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Item #{idx + 1}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                        {item.item_name}
                      </h3>
                      <span className="text-xs text-slate-500">
                        Qty: {item.quantity} • ₹{item.price_each} each
                      </span>
                    </div>

                    {/* Star Selector */}
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => handleRatingChange(item.id, star)}
                          className="p-1 text-slate-300 hover:text-amber-400 focus:outline-none transition-colors"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= currentRating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dynamic Follow-Up Questions Based On Rating */}
                  {currentRating === 5 && (
                    <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-3 text-xs space-y-1.5 animate-fadeIn">
                      <label className="font-semibold text-emerald-900 block">
                        What did you enjoy most about this dish? (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Perfectly balanced spices, hot and tender"
                        value={currentFollowUp}
                        onChange={(e) => handleFollowUpChange(item.id, e.target.value)}
                        className="w-full p-2 bg-white border border-emerald-200 rounded-lg text-xs focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  )}

                  {currentRating === 4 && (
                    <div className="bg-emerald-50/40 border border-emerald-100 rounded-xl p-3 text-xs space-y-1.5 animate-fadeIn">
                      <label className="font-semibold text-emerald-900 block">
                        Any subtle touch to make it 5 stars? (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Slightly less salt, served slightly warmer"
                        value={currentFollowUp}
                        onChange={(e) => handleFollowUpChange(item.id, e.target.value)}
                        className="w-full p-2 bg-white border border-emerald-200 rounded-lg text-xs focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  )}

                  {currentRating === 3 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs space-y-2 animate-fadeIn">
                      <label className="font-semibold text-amber-900 block">
                        What was lacking with this item?
                      </label>
                      <select
                        value={currentCategory}
                        onChange={(e) => handleCategoryChange(item.id, e.target.value)}
                        className="w-full p-2 bg-white border border-amber-200 rounded-lg text-xs font-semibold text-amber-900"
                      >
                        <option value="">Select Primary Concern</option>
                        {ISSUE_CATEGORIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        placeholder="Tell us what could be improved"
                        value={currentFollowUp}
                        onChange={(e) => handleFollowUpChange(item.id, e.target.value)}
                        className="w-full p-2 bg-white border border-amber-200 rounded-lg text-xs"
                      />
                    </div>
                  )}

                  {(currentRating === 1 || currentRating === 2) && (
                    <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs space-y-2 animate-fadeIn">
                      <div className="flex items-center space-x-1.5 text-rose-800 font-bold uppercase text-[10px] tracking-wider">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Issue Escalation Triggered</span>
                      </div>
                      <label className="font-semibold text-rose-900 block">
                        Please classify the exact issue:
                      </label>
                      <select
                        required
                        value={currentCategory}
                        onChange={(e) => handleCategoryChange(item.id, e.target.value)}
                        className="w-full p-2 bg-white border border-rose-200 rounded-lg text-xs font-semibold text-rose-950"
                      >
                        {ISSUE_CATEGORIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      <textarea
                        rows={2}
                        required
                        placeholder="Please describe the issue in detail (e.g. food was cold on arrival, missing side item)"
                        value={currentFollowUp}
                        onChange={(e) => handleFollowUpChange(item.id, e.target.value)}
                        className="w-full p-2 bg-white border border-rose-200 rounded-lg text-xs"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Guest Contact & Overall Comments */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 text-xs">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              Guest Details & Additional Comments
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-500 font-semibold block mb-1">Your Name:</label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="text-slate-500 font-semibold block mb-1">Phone for Updates:</label>
                <input
                  type="text"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-500 font-semibold block mb-1">
                General Dining Comments (Optional):
              </label>
              <textarea
                rows={2}
                placeholder="Ambience, music volume, overall dining hospitality..."
                value={generalComment}
                onChange={(e) => setGeneralComment(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-sm font-bold shadow-md transition-colors flex items-center justify-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? 'Submitting Feedback...' : 'Submit Restaurant Feedback'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
