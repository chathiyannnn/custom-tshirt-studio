import React, { useState } from 'react';
import { ShieldAlert, Download, MessageSquare, Filter, PackageCheck, Truck, CheckCircle2, ChevronRight } from 'lucide-react';
import { downloadDataURL } from '../utils/printExporter';

export default function AdminDashboard({ isOpen, onClose, orders, onUpdateOrderStatus, onShowToast }) {
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'received' | 'printing' | 'shipped' | 'delivered'
  const [selectedOrder, setSelectedOrder] = useState(null);

  if (!isOpen) return null;

  // Filter orders
  const filteredOrders = statusFilter === 'all'
    ? orders
    : orders.filter(o => o.status === statusFilter);

  const handleDownloadPrintFile = (dataUrl, filename) => {
    if (!dataUrl) {
      onShowToast('⚠️ No decal layers were placed for this side.');
      return;
    }
    downloadDataURL(dataUrl, filename);
    onShowToast('⬇️ Print file downloaded at 300 DPI!');
  };

  const handleAdvanceStatus = (orderId, currentStatus) => {
    const nextStatusMap = {
      received: 'printing',
      printing: 'shipped',
      shipped: 'delivered',
      delivered: 'delivered'
    };
    const nextStatus = nextStatusMap[currentStatus] || 'printing';
    onUpdateOrderStatus(orderId, nextStatus);

    onShowToast(`📲 WhatsApp Alert Sent: Order ${orderId} updated to [${nextStatus.toUpperCase()}]`);
  };

  return (
    <div className="modal-overlay">
      <div className="panel-dark w-full max-w-4xl max-h-[85vh] flex flex-col p-6 space-y-4 border border-amber-500/30 text-slate-100 shadow-2xl relative overflow-hidden">
        {/* Admin Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <ShieldAlert size={22} className="text-amber-400" />
            <div>
              <h3 className="text-xl font-display uppercase tracking-wide text-white flex items-center gap-2">
                INKTAG Owner Admin <span className="bg-amber-400/20 text-amber-300 text-[10px] font-mono px-2 py-0.5 rounded border border-amber-400/30">Founders Area</span>
              </h3>
              <p className="text-[11px] font-mono text-slate-400">Order Dispatch, Print File Downloads & WhatsApp Automation</p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-white font-mono font-bold text-lg">✕</button>
        </div>

        {/* Main Grid: Orders List & Detail View */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 overflow-hidden min-h-[400px]">
          {/* Left Column: Filterable Orders List */}
          <div className="md:col-span-5 flex flex-col space-y-3 border-r border-white/10 pr-3">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[10px] font-mono">
              {['all', 'received', 'printing', 'shipped', 'delivered'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-lg uppercase font-bold transition-colors whitespace-nowrap ${
                    statusFilter === st ? 'bg-amber-400 text-slate-950 shadow' : 'bg-slate-900 text-slate-400 border border-white/5 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Orders Feed */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {filteredOrders.length === 0 ? (
                <div className="p-6 text-center text-xs font-mono text-slate-500">
                  No orders found in status [{statusFilter.toUpperCase()}].
                </div>
              ) : (
                filteredOrders.map((ord) => (
                  <div
                    key={ord.id}
                    onClick={() => setSelectedOrder(ord)}
                    className={`p-3 rounded-xl border text-xs font-mono cursor-pointer transition-colors ${
                      selectedOrder?.id === ord.id ? 'bg-amber-500/10 border-amber-400' : 'bg-slate-900/80 border-white/5 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-white">{ord.id}</span>
                      <span className="text-[10px] font-bold text-amber-400 uppercase bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/20">
                        {ord.status}
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Size: {ord.size} • {ord.date}</span>
                      <span className="font-bold text-slate-200">₹{ord.amount}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Selected Order Detail View & Print Exporter */}
          <div className="md:col-span-7 flex flex-col justify-between overflow-y-auto p-3 bg-slate-900/60 rounded-xl border border-white/5 font-mono text-xs">
            {selectedOrder ? (
              <div className="space-y-4">
                <div className="flex justify-between items-start border-b border-white/10 pb-3">
                  <div>
                    <h4 className="text-base font-bold text-white flex items-center gap-1.5">
                      Order {selectedOrder.id}
                    </h4>
                    <span className="text-[11px] text-slate-400">Placed on: {selectedOrder.date}</span>
                  </div>
                  <span className="bg-amber-400 text-slate-950 px-3 py-1 rounded-full font-bold uppercase text-[10px]">
                    {selectedOrder.status}
                  </span>
                </div>

                {/* Customer Shipping & Contact details */}
                <div className="panel-sub p-3 rounded-xl space-y-1 text-slate-300">
                  <span className="text-[10px] text-amber-400 uppercase font-bold block">Shipping & Contact Info</span>
                  <p className="font-bold text-white">{selectedOrder.shipping_address?.name || 'Customer'}</p>
                  <p className="text-slate-400">{selectedOrder.shipping_address?.street}, {selectedOrder.shipping_address?.city}, {selectedOrder.shipping_address?.state} - {selectedOrder.shipping_address?.pincode}</p>
                  <p className="text-amber-300 flex items-center gap-1 pt-1">
                    <MessageSquare size={13} /> WhatsApp: {selectedOrder.user_phone || selectedOrder.shipping_address?.phone}
                  </p>
                </div>

                {/* Garment Spec */}
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="panel-sub p-2 rounded-xl">
                    <span className="text-[9px] text-slate-400 block uppercase">GARMENT SIZE</span>
                    <span className="text-sm font-bold text-white">{selectedOrder.size}</span>
                  </div>
                  <div className="panel-sub p-2 rounded-xl">
                    <span className="text-[9px] text-slate-400 block uppercase">COLOR SHADE</span>
                    <div className="w-5 h-5 rounded-full mx-auto mt-1 border border-white/20" style={{ backgroundColor: selectedOrder.colorHex || '#ffffff' }} />
                  </div>
                </div>

                {/* Download Print Ready Files (300 DPI) */}
                <div className="space-y-2">
                  <span className="text-[10px] text-amber-400 font-bold uppercase block">Print-Ready Manufacturing Files</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleDownloadPrintFile(selectedOrder.print_files?.front, `${selectedOrder.id}_FRONT_300DPI.png`)}
                      className="btn-cobalt py-2 px-3 justify-center text-[11px]"
                    >
                      <Download size={14} /> Front Print PNG
                    </button>
                    <button
                      onClick={() => handleDownloadPrintFile(selectedOrder.print_files?.back, `${selectedOrder.id}_BACK_300DPI.png`)}
                      className="btn-cobalt py-2 px-3 justify-center text-[11px]"
                    >
                      <Download size={14} /> Back Print PNG
                    </button>
                  </div>
                </div>

                {/* Advance Status Button */}
                <div className="pt-3 border-t border-white/10 flex justify-between items-center">
                  <span className="text-[10px] text-slate-400">Advance Workflow:</span>
                  <button
                    onClick={() => handleAdvanceStatus(selectedOrder.id, selectedOrder.status)}
                    className="btn-mustard py-2 px-4 text-xs"
                  >
                    Advance Status & Fire WhatsApp Alert <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="m-auto text-center space-y-2 py-12 text-slate-500">
                <PackageCheck size={36} className="mx-auto text-slate-600" />
                <p>Select an order from the list on the left to view customer details and download 300 DPI print-ready PNG files.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
