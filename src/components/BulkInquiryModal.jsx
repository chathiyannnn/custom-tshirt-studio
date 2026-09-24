import React, { useState } from 'react';
import { Building2, Calculator, Send, CheckCircle, Package } from 'lucide-react';

export default function BulkInquiryModal({ isOpen, onClose, onShowToast }) {
  const [formData, setFormData] = useState({
    name: '',
    org: '',
    phone: '',
    quantity: 50,
    deadline: '',
    notes: ''
  });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  // Calculate tier pricing
  const calculateTierPrice = (qty) => {
    if (qty >= 500) return 299;
    if (qty >= 200) return 349;
    if (qty >= 100) return 399;
    if (qty >= 50) return 449;
    return 499;
  };

  const estimatedUnitPrice = calculateTierPrice(formData.quantity);
  const estimatedTotal = estimatedUnitPrice * formData.quantity;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      onShowToast('📩 Bulk Inquiry Sent! Our corporate team will WhatsApp you within 2 hours.');
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="modal-overlay">
      <div className="panel-dark w-full max-w-lg p-6 space-y-5 border border-white/10 text-slate-100 shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Building2 className="text-amber-400" size={22} />
            <div>
              <h3 className="text-lg font-display uppercase tracking-wide text-white">Bulk & Corporate Orders</h3>
              <p className="text-[11px] font-mono text-slate-400">Custom Screen-Printing for Tech Teams, Colleges & Events</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white font-mono font-bold text-lg">✕</button>
        </div>

        {submitted ? (
          <div className="py-10 text-center space-y-3">
            <CheckCircle size={48} className="mx-auto text-emerald-400 animate-bounce" />
            <h4 className="text-xl font-display text-white">Inquiry Received!</h4>
            <p className="text-xs font-mono text-slate-300">
              We're preparing your custom sample kit & discount quote for {formData.quantity} units.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Your Full Name *</label>
                <input
                  required
                  type="text"
                  placeholder="Rahul Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-white focus:border-amber-400 outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Company / Organization *</label>
                <input
                  required
                  type="text"
                  placeholder="TechCorp / IIT Delhi"
                  value={formData.org}
                  onChange={(e) => setFormData(prev => ({ ...prev, org: e.target.value }))}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-white focus:border-amber-400 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">WhatsApp Number *</label>
                <input
                  required
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-white focus:border-amber-400 outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Estimated Quantity (Tees)</label>
                <input
                  type="number"
                  min="20"
                  max="5000"
                  value={formData.quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 20 }))}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-white focus:border-amber-400 outline-none"
                />
              </div>
            </div>

            {/* Instant Tier Estimator Card */}
            <div className="panel-sub p-3 rounded-xl border border-amber-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calculator size={18} className="text-amber-400" />
                <div>
                  <span className="text-[10px] text-slate-400 block">Tier Pricing ({formData.quantity} units)</span>
                  <span className="text-base font-bold text-amber-400">₹{estimatedUnitPrice} <span className="text-[10px] text-slate-400 font-normal">/ unit</span></span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">Estimated Order Total</span>
                <span className="text-lg font-bold text-white font-mono">₹{estimatedTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Event / Delivery Target Date</label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-white focus:border-amber-400 outline-none"
              />
            </div>

            <button
              type="submit"
              className="btn-mustard w-full justify-center py-3 text-sm"
            >
              <Send size={16} /> Submit Bulk Order Request
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
