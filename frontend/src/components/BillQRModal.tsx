import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { X, Printer, Download, Copy, Check, QrCode } from 'lucide-react';

interface BillQRModalProps {
  token: string | null;
  onClose: () => void;
}

export const BillQRModal: React.FC<BillQRModalProps> = ({ token, onClose }) => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!token) return;
    const fetchPreview = async () => {
      setIsLoading(true);
      try {
        const res = await api.getQRPreview(token);
        setData(res);
      } catch (err: any) {
        alert(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPreview();
  }, [token]);

  if (!token) return null;

  const handleCopy = () => {
    if (!data?.feedback_url) return;
    navigator.clipboard.writeText(data.feedback_url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (!data?.qr_code_image) return;
    const link = document.createElement('a');
    link.href = data.qr_code_image;
    link.download = `QR_${data.bill_preview?.order_number || token}.png`;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <QrCode className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Bill QR Code & Receipt Preview
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Receipt Body */}
        <div className="p-6 overflow-y-auto max-h-[75vh]">
          {isLoading || !data ? (
            <div className="py-12 text-center text-xs text-slate-400">Generating QR preview...</div>
          ) : (() => {
            const preview = data.bill_preview || {
              restaurant_name: 'The Royal Rasoi',
              branch_name: data.order?.branch_name || data.branch_name || 'Indiranagar Hub',
              branch_address: '100ft Road, Indiranagar, Bangalore',
              branch_phone: '+91 80 4123 4567',
              order_number: data.order?.order_number || 'ORD-2026',
              table_number: data.order?.table_number || 'T-01',
              date: data.order?.created_at || new Date().toLocaleString(),
              items: (data.order?.items || []).map((i: any) => ({
                qty: i.quantity || 1,
                name: i.item_name || 'Item',
                subtotal: i.subtotal || i.price_each || 0
              })),
              bill_total: data.order?.bill_total || 0
            };
            const tokenStr = data.token || token || '';
            const feedbackUrl = data.feedback_url || `http://localhost:5173/feedback/${tokenStr}`;
            const qrImage = data.qr_code_image || `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(feedbackUrl)}`;

            return (
              <div id="printable-bill" className="bg-white border border-dashed border-slate-300 p-6 rounded-xl shadow-xs font-mono text-slate-800">
                {/* Receipt Header */}
                <div className="text-center border-b border-dashed border-slate-300 pb-4">
                  <h3 className="font-bold text-base tracking-tight font-sans text-slate-900">
                    {preview.restaurant_name}
                  </h3>
                  <p className="text-[11px] text-slate-600">{preview.branch_name}</p>
                  <p className="text-[10px] text-slate-500">{preview.branch_address}</p>
                  <p className="text-[10px] text-slate-500">Ph: {preview.branch_phone}</p>
                  <div className="mt-2 text-[11px] font-semibold flex justify-between px-1">
                    <span>Order: #{preview.order_number}</span>
                    <span>Table: {preview.table_number}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 text-left px-1 mt-0.5">
                    {preview.date}
                  </div>
                </div>

                {/* Items List */}
                <div className="py-3 border-b border-dashed border-slate-300 space-y-1.5 text-xs">
                  {preview.items && preview.items.length > 0 ? (
                    preview.items.map((i: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center text-[11px]">
                        <span className="truncate pr-2">
                          {i.qty}x {i.name}
                        </span>
                        <span className="font-semibold shrink-0">₹{Number(i.subtotal || 0).toFixed(2)}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-slate-400 py-1 text-[11px]">Standard Dining Items</div>
                  )}
                </div>

                {/* Total */}
                <div className="py-3 border-b border-dashed border-slate-300 flex justify-between font-bold text-sm">
                  <span>BILL TOTAL:</span>
                  <span>₹{Number(preview.bill_total || 0).toFixed(2)}</span>
                </div>

                {/* QR Code Section */}
                <div className="text-center pt-4 flex flex-col items-center">
                  <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-1 font-sans">
                    Scan to Rate Your Meal
                  </p>
                  <p className="text-[9px] text-slate-500 mb-2 font-sans">
                    Direct item feedback & instant resolution routing
                  </p>
                  <a href={feedbackUrl} target="_blank" rel="noopener noreferrer" className="block cursor-pointer">
                    <img
                      src={qrImage}
                      alt="Bill Feedback QR Code"
                      className="w-40 h-40 border border-slate-200 rounded-lg p-1 bg-white shadow-xs hover:ring-2 hover:ring-emerald-500 transition-all"
                    />
                  </a>
                  <a
                    href={feedbackUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-xs font-bold text-emerald-600 hover:text-emerald-700 underline font-sans"
                  >
                    Open Feedback Form &rarr;
                  </a>
                  <p className="text-[9px] text-slate-400 mt-1 font-mono">
                    Token: {tokenStr.slice(0, 16)}...
                  </p>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Action Controls */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-2">
          <button
            onClick={handleCopy}
            className="flex-1 py-1.5 px-3 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-xs font-semibold text-slate-700 flex items-center justify-center space-x-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied URL!' : 'Copy Link'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex-1 py-1.5 px-3 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-xs font-semibold text-slate-700 flex items-center justify-center space-x-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PNG</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex-1 py-1.5 px-3 bg-slate-900 text-white hover:bg-slate-800 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Bill</span>
          </button>
        </div>
      </div>
    </div>
  );
};
