import React, { useEffect, useState } from 'react';
import {
  BrainCircuit,
  Sparkles,
  Sliders,
  Layers,
  ThumbsDown,
  ThumbsUp,
  Search,
  RefreshCw,
  Send,
  HelpCircle,
  Target
} from 'lucide-react';
import { api } from '../services/api';
import { ComplaintGroup, ReviewItem, AIClusterStats } from '../types';

export const AIReviewIntelligence: React.FC = () => {
  const [stats, setStats] = useState<AIClusterStats | null>(null);
  const [groups, setGroups] = useState<ComplaintGroup[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [sentimentFilter, setSentimentFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [similarityThreshold, setSimilarityThreshold] = useState<number>(0.65);
  const [isReclustering, setIsReclustering] = useState(false);
  const [newReviewText, setNewReviewText] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, groupsData, reviewsData] = await Promise.all([
        api.getAIStats(),
        api.getAIGroups(),
        api.getAIReviews({ groupId: selectedGroup, sentiment: sentimentFilter, search: searchQuery, size: 50 })
      ]);
      setStats(statsData);
      setGroups(groupsData);
      setReviews(reviewsData.content || []);
      setTotalReviews(reviewsData.totalElements || 0);
    } catch (err) {
      console.error('Failed to load AI review intelligence:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedGroup, sentimentFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  const handleRecluster = async () => {
    try {
      setIsReclustering(true);
      await api.reclusterAIGroups(similarityThreshold);
      await loadData();
    } catch (err) {
      console.error('Reclustering failed:', err);
    } finally {
      setIsReclustering(false);
    }
  };

  const handleSubmitNewReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;
    try {
      setIsSubmittingReview(true);
      const created = await api.createAIReview(newReviewText.trim(), 'AI_TEST_BENCH');
      setNewReviewText('');
      setSubmissionSuccess(`Classified as "${created.groupLabel}" (${created.sentiment}) with ${(created.similarityToCentroid * 100).toFixed(1)}% confidence`);
      setTimeout(() => setSubmissionSuccess(null), 5000);
      await loadData();
    } catch (err) {
      console.error('Failed to submit review:', err);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 select-none">
      {/* Top Banner with Warm Espresso & Amber Gradient */}
      <div className="bg-gradient-to-br from-[#24170f] via-[#2f1f14] to-[#1c120a] border border-amber-600/40 rounded-2xl p-6 shadow-xl relative overflow-hidden text-amber-50">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold mb-3">
              <BrainCircuit className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>AI Semantic Intelligence & Taste Analytics</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight font-retro">
              Semantic Review Clustering & Root Cause AI
            </h1>
            <p className="text-sm text-amber-200/80 mt-1 max-w-2xl leading-relaxed">
              Unsupervised Agglomerative NLP clustering groups high-volume raw customer & student mess feedback by underlying root issues, 
              detecting recurring taste, hygiene, and portion pain points automatically.
            </p>
          </div>

          {/* Quick Recluster Control with Warm Amber Glow */}
          <div className="bg-[#180f0a]/90 border border-amber-600/30 rounded-2xl p-4 flex flex-col gap-2.5 min-w-[280px] shadow-inner">
            <div className="flex items-center justify-between text-xs text-amber-200 font-semibold">
              <span className="flex items-center space-x-1.5">
                <Sliders className="w-3.5 h-3.5 text-amber-400" />
                <span>Cosine Similarity Threshold:</span>
              </span>
              <span className="font-bold text-amber-400 text-sm">{(similarityThreshold * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.50"
              max="0.85"
              step="0.05"
              value={similarityThreshold}
              onChange={(e) => setSimilarityThreshold(parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <button
              onClick={handleRecluster}
              disabled={isReclustering}
              className="mt-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer shadow-md hover:scale-[1.02] active:scale-98"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isReclustering ? 'animate-spin' : ''}`} />
              <span>{isReclustering ? 'Clustering Feedback...' : 'Re-Run Clustering Engine'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Minimalist High-Readability KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#ebdcc6] rounded-2xl p-5 shadow-[0_2px_8px_rgba(66,46,32,0.04)] hover:-translate-y-1 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#7a583e]">Total Analyzed</span>
            <span className="p-2 rounded-xl bg-amber-50 text-amber-800 border border-amber-200/80"><Layers className="w-4 h-4" /></span>
          </div>
          <p className="text-2xl font-bold text-[#2b1d14] mt-2">{stats ? stats.totalReviews : '--'}</p>
          <p className="text-xs text-[#8e6e55] mt-1 font-medium">Customer & student reviews processed</p>
        </div>

        <div className="bg-white border border-[#ebdcc6] rounded-2xl p-5 shadow-[0_2px_8px_rgba(66,46,32,0.04)] hover:-translate-y-1 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#7a583e]">Semantic Clusters</span>
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200/80"><BrainCircuit className="w-4 h-4" /></span>
          </div>
          <p className="text-2xl font-bold text-emerald-700 mt-2">{stats ? stats.totalGroups : '--'}</p>
          <p className="text-xs text-[#8e6e55] mt-1 font-medium">Autonomous food complaint themes identified</p>
        </div>

        <div className="bg-white border border-[#ebdcc6] rounded-2xl p-5 shadow-[0_2px_8px_rgba(66,46,32,0.04)] hover:-translate-y-1 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#7a583e]">Negative Ratio</span>
            <span className="p-2 rounded-xl bg-rose-50 text-rose-800 border border-rose-200/80"><ThumbsDown className="w-4 h-4" /></span>
          </div>
          <p className="text-2xl font-bold text-[#b9220a] mt-2">{stats ? `${stats.negativePercentage}%` : '--'}</p>
          <p className="text-xs text-[#8e6e55] mt-1 font-medium">Complaint sentiment volume</p>
        </div>

        <div className="bg-white border border-[#ebdcc6] rounded-2xl p-5 shadow-[0_2px_8px_rgba(66,46,32,0.04)] hover:-translate-y-1 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#7a583e]">Primary Issue Driver</span>
            <span className="p-2 rounded-xl bg-amber-100 text-amber-900 border border-amber-300"><Target className="w-4 h-4" /></span>
          </div>
          <p className="text-base font-bold text-amber-800 mt-2 truncate">{stats ? stats.mostFrequentCategory : '--'}</p>
          <p className="text-xs text-[#8e6e55] mt-1 font-medium">Highest frequency complaint category</p>
        </div>
      </div>

      {/* Live AI Review Ingestion Sandbox */}
      <div className="bg-[#24170f] border border-amber-600/40 rounded-2xl p-5 text-amber-50 shadow-md">
        <div className="flex items-center space-x-2 mb-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-bold text-amber-100 font-retro tracking-wide">Live AI Feedback Analysis Sandbox</h2>
        </div>
        <p className="text-xs text-amber-200/75 mb-3 font-medium">
          Type or paste any dining or student mess comment to watch the AI evaluate sentiment and assign it to the matching semantic cluster in real-time.
        </p>

        <form onSubmit={handleSubmitNewReview} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={newReviewText}
            onChange={(e) => setNewReviewText(e.target.value)}
            placeholder="e.g., 'The tandoori chicken arrived lukewarm and the dal tasted completely bland...'"
            className="flex-1 px-4 py-2 bg-[#140d08] border border-[#442c1d] rounded-xl text-sm text-amber-50 placeholder:text-amber-200/40 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
          />
          <button
            type="submit"
            disabled={isSubmittingReview || !newReviewText.trim()}
            className="flex items-center justify-center space-x-2 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer shadow-md hover:scale-105 active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmittingReview ? 'Analyzing...' : 'Analyze & Cluster'}</span>
          </button>
        </form>

        {submissionSuccess && (
          <div className="mt-3 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center space-x-2 animate-fadeIn">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>{submissionSuccess}</span>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-[#3d2719]">
          <span className="text-[11px] text-amber-300/80 font-semibold">Quick Test Prompts:</span>
          {[
            'Soup was served freezing cold, had to send it back to kitchen.',
            'Waitstaff was completely inattentive and took 35 mins to bring the bill.',
            'Dal tadka was way too salty and rotis were hard like rubber.'
          ].map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setNewReviewText(prompt)}
              className="text-[11px] px-3 py-1 rounded-lg bg-[#2c1b12] hover:bg-[#382317] text-amber-200 border border-amber-700/40 transition-all hover:scale-105 active:scale-95 cursor-pointer font-medium"
            >
              "{prompt.slice(0, 38)}..."
            </button>
          ))}
        </div>
      </div>

      {/* Semantic Groups Grid with Cream Surface and Hover Elevation */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-amber-700" />
            <h2 className="text-base font-bold text-[#2b1d14] font-retro">Identified Semantic Clusters</h2>
          </div>
          {selectedGroup && (
            <button
              onClick={() => setSelectedGroup('')}
              className="text-xs text-amber-700 hover:text-amber-900 font-bold cursor-pointer underline"
            >
              Clear Group Filter (Show All)
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((group) => {
            const isSelected = selectedGroup === group.id;
            const pos = group.sentimentSummary?.POSITIVE || 0;
            const neg = group.sentimentSummary?.NEGATIVE || 0;
            const neu = group.sentimentSummary?.NEUTRAL || 0;

            return (
              <div
                key={group.id}
                onClick={() => setSelectedGroup(isSelected ? '' : group.id)}
                className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#faf4ea] border-2 border-amber-500 shadow-md scale-102 ring-2 ring-amber-500/20'
                    : 'bg-white border-[#ebdcc6] hover:border-amber-400 hover:-translate-y-1 hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-sm font-bold text-[#2b1d14] tracking-tight">{group.label}</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 shrink-0">
                      {group.reviewCount} reviews ({group.percentage}%)
                    </span>
                  </div>
                  <p className="text-xs text-[#73533c] leading-relaxed mb-4 font-medium">{group.description}</p>

                  {/* Representative customer snippets */}
                  {group.representativeExamples && group.representativeExamples.length > 0 && (
                    <div className="space-y-1.5 mb-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#8e6e55]">Customer & Student Voices:</span>
                      {group.representativeExamples.slice(0, 2).map((example, i) => (
                        <div key={i} className="text-[11px] text-[#4d3627] bg-[#faf4ea] p-2.5 rounded-xl border border-[#ebdcc6] italic font-medium">
                          "{example}"
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Sentiment distribution bar */}
                <div className="pt-3 border-t border-[#f3e9db] flex items-center justify-between text-[11px]">
                  <div className="flex items-center space-x-3 font-bold">
                    <span className="text-rose-700 flex items-center space-x-1">
                      <ThumbsDown className="w-3.5 h-3.5" />
                      <span>{neg}</span>
                    </span>
                    <span className="text-emerald-700 flex items-center space-x-1">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{pos}</span>
                    </span>
                    <span className="text-[#8e6e55] flex items-center space-x-1">
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>{neu}</span>
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold ${isSelected ? 'text-amber-700' : 'text-[#8e6e55]'}`}>
                    {isSelected ? 'Filtering Active ✓' : 'Click to filter'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews Explorer Table with High-Contrast Readability */}
      <div className="bg-white border border-[#ebdcc6] rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(66,46,32,0.04)]">
        <div className="p-4 border-b border-[#ebdcc6] bg-[#faf4ea] flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-[#2b1d14] font-retro">Semantic Review Ledger</h2>
            <p className="text-xs text-[#73533c] font-medium">Showing {reviews.length} of {totalReviews} processed customer & student reviews</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={sentimentFilter}
              onChange={(e) => setSentimentFilter(e.target.value)}
              className="px-3 py-1.5 bg-white border border-[#decbb3] rounded-xl text-xs text-[#2b1d14] font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/40 cursor-pointer"
            >
              <option value="">All Sentiments</option>
              <option value="NEGATIVE">Negative Only</option>
              <option value="POSITIVE">Positive Only</option>
              <option value="NEUTRAL">Neutral Only</option>
            </select>

            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search reviews..."
                className="pl-8 pr-3 py-1.5 bg-white border border-[#decbb3] rounded-xl text-xs text-[#2b1d14] placeholder:text-[#9c7d66] focus:outline-none focus:ring-2 focus:ring-amber-500/40 w-48 font-medium"
              />
              <Search className="w-3.5 h-3.5 text-amber-700/60 absolute left-2.5 top-2.5" />
            </form>
          </div>
        </div>

        <div className="overflow-x-auto tomato-sauce-scrollbar">
          <table className="w-full text-left text-xs text-[#3d2a1b]">
            <thead className="bg-[#faf4ea]/60 text-[#7a583e] uppercase text-[10px] font-bold tracking-wider border-b border-[#ebdcc6]">
              <tr>
                <th className="px-4 py-3.5">ID</th>
                <th className="px-4 py-3.5">Customer & Student Feedback Content</th>
                <th className="px-4 py-3.5">Assigned Cluster</th>
                <th className="px-4 py-3.5">Sentiment</th>
                <th className="px-4 py-3.5">Similarity</th>
                <th className="px-4 py-3.5">Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3e9db] font-medium">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-[#9c7d66]">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-amber-600" />
                    Loading semantic review ledger...
                  </td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-[#9c7d66]">
                    No reviews matched the current filters.
                  </td>
                </tr>
              ) : (
                reviews.map((r) => (
                  <tr key={r.id} className="hover:bg-[#faf4ea]/80 transition-colors">
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="font-mono font-bold text-[#7a583e]">{r.id}</span>
                    </td>
                    <td className="px-4 py-3.5 max-w-md">
                      <span className="text-[#2b1d14] font-medium">{r.text}</span>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-300">
                        {r.groupLabel || 'Ungrouped'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          r.sentiment === 'NEGATIVE'
                            ? 'bg-[#fde8e5] text-[#b9220a] border border-[#f5b8af]'
                            : r.sentiment === 'POSITIVE'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-[#faf3e8] text-[#7a583e] border border-[#ebdcc6]'
                        }`}
                      >
                        {r.sentiment} ({(r.sentimentConfidence * 100).toFixed(0)}%)
                      </span>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap font-mono text-[#7a583e] font-semibold">
                      {(r.similarityToCentroid * 100).toFixed(1)}%
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap text-[#8e6e55] font-semibold">
                      {r.source}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
