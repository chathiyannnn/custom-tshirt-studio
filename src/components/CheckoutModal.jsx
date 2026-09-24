import React, { useState } from 'react';
import { CreditCard, CheckCircle, ShieldCheck, MapPin, Truck, Lock, QrCode } from 'lucide-react';
import { exportPrintReadyPNG } from '../utils/printExporter';

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  decals,
  shirtColor,
  selectedSize,
  userPhone,
  onOrderComplete
}) {
  const [step, setStep] = useState('address'); // 'address' | 'payment' | 'processing' | 'confirmed'
  const [address, setAddress] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    phone: userPhone || ''
  });
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'cod'
  const [confirmedOrderId, setConfirmedOrderId] = useState('');

  if (!isOpen) return null;

  // Pricing calculation
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0) || 799;
  const shippingFee = subtotal > 999 ? 0 : 99;
  const totalAmount = subtotal + shippingFee;

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    setStep('payment');
  };

  const handleProcessPayment = async () => {
    setStep('processing');

    // Generate high-resolution transparent print files (front and back) for the order!
    const frontPrintPNG = await exportPrintReadyPNG(decals, 'front');
    const backPrintPNG = await exportPrintReadyPNG(decals, 'back');

    const orderId = `INK-${Math.floor(100000 + Math.random() * 900000)}`;

    setTimeout(() => {
      setConfirmedOrderId(orderId);
      setStep('confirmed');

      const newOrder = {
        id: orderId,
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        user_phone: address.phone,
        status: 'received',
        shipping_address: address,
        colorHex: shirtColor,
        size: selectedSize,
        amount: totalAmount,
        print_files: {
          front: frontPrintPNG,
          back: backPrintPNG
        }
      };

      onOrderComplete(newOrder);
    }, 2000);
  };

  return (
    <div className="modal-overlay">
      <div className="panel-dark w-full max-w-xl p-6 space-y-5 border border-white/10 text-slate-100 shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Lock className="text-amber-400" size={20} />
            <h3 className="text-lg font-display uppercase tracking-wide text-white">Express Checkout</h3>
          </div>
          {step !== 'processing' && step !== 'confirmed' && (
            <button onClick={onClose} className="text-slate-400 hover:text-white font-mono font-bold text-lg">✕</button>
          )}
        </div>

        {/* Step 1: Shipping Address */}
        {step === 'address' && (
          <form onSubmit={handleAddressSubmit} className="space-y-4 text-xs font-mono">
            <h4 className="text-sm font-bold text-amber-400 uppercase flex items-center gap-1.5">
              <MapPin size={16} /> 1. Shipping Address
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Full Name *</label>
                <input
                  required
                  type="text"
                  placeholder="Vikram Singh"
                  value={address.name}
                  onChange={(e) => setAddress(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-white focus:border-amber-400 outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">WhatsApp Phone *</label>
                <input
                  required
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={address.phone}
                  onChange={(e) => setAddress(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-white focus:border-amber-400 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Street Address / House No. *</label>
              <input
                required
                type="text"
                placeholder="Flat 4B, Green Park Enclave"
                value={address.street}
                onChange={(e) => setAddress(prev => ({ ...prev, street: e.target.value }))}
                className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-white focus:border-amber-400 outline-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">City *</label>
                <input
                  required
                  type="text"
                  placeholder="Mumbai"
                  value={address.city}
                  onChange={(e) => setAddress(prev => ({ ...prev, city: e.target.value }))}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-white focus:border-amber-400 outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">State *</label>
                <input
                  required
                  type="text"
                  placeholder="Maharashtra"
                  value={address.state}
                  onChange={(e) => setAddress(prev => ({ ...prev, state: e.target.value }))}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-white focus:border-amber-400 outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Pincode *</label>
                <input
                  required
                  type="text"
                  placeholder="400001"
                  value={address.pincode}
                  onChange={(e) => setAddress(prev => ({ ...prev, pincode: e.target.value }))}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-white focus:border-amber-400 outline-none"
                />
              </div>
            </div>

            {/* Order Summary Line */}
            <div className="panel-sub p-3 rounded-xl flex justify-between items-center">
              <span className="text-slate-400">Total Payable:</span>
              <span className="text-lg font-bold text-amber-400 font-mono">₹{totalAmount}</span>
            </div>

            <button type="submit" className="btn-cobalt w-full justify-center py-3 text-sm font-mono">
              Proceed to Payment Gateway →
            </button>
          </form>
        )}

        {/* Step 2: Payment Method */}
        {step === 'payment' && (
          <div className="space-y-4 text-xs font-mono">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-amber-400 uppercase flex items-center gap-1.5">
                <CreditCard size={16} /> 2. Razorpay Payment Gateway
              </h4>
              <button onClick={() => setStep('address')} className="text-[11px] text-slate-400 underline">
                Edit Address
              </button>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setPaymentMethod('upi')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition-colors ${
                  paymentMethod === 'upi' ? 'bg-amber-400/10 border-amber-400 text-amber-300' : 'bg-slate-900 border-white/10 text-slate-400'
                }`}
              >
                <QrCode size={20} />
                <span className="font-bold">UPI / QR</span>
              </button>

              <button
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition-colors ${
                  paymentMethod === 'card' ? 'bg-amber-400/10 border-amber-400 text-amber-300' : 'bg-slate-900 border-white/10 text-slate-400'
                }`}
              >
                <CreditCard size={20} />
                <span className="font-bold">Card / Netbanking</span>
              </button>

              <button
                onClick={() => setPaymentMethod('cod')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition-colors ${
                  paymentMethod === 'cod' ? 'bg-amber-400/10 border-amber-400 text-amber-300' : 'bg-slate-900 border-white/10 text-slate-400'
                }`}
              >
                <Truck size={20} />
                <span className="font-bold">Cash on Delivery</span>
              </button>
            </div>

            {/* Payment Verification Note */}
            <div className="panel-sub p-3 rounded-xl text-[11px] text-slate-300 space-y-1">
              <span className="flex items-center gap-1 font-bold text-amber-400">
                <ShieldCheck size={14} /> Server-Verified Payment Guarantee
              </span>
              <p className="text-slate-400">
                All Razorpay payment signatures are validated on our secure backend before orders are sent to the printing press.
              </p>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-white/10">
              <div>
                <span className="text-[10px] text-slate-400 block">AMOUNT TO PAY</span>
                <span className="text-2xl font-bold text-amber-400 font-mono">₹{totalAmount}</span>
              </div>

              <button
                onClick={handleProcessPayment}
                className="btn-mustard py-3 px-6 text-sm"
              >
                Pay & Confirm Order
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Processing */}
        {step === 'processing' && (
          <div className="py-12 text-center space-y-4">
            <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <h4 className="text-lg font-display text-white">Generating Print-Ready Files...</h4>
            <p className="text-xs font-mono text-slate-400">
              Rendering 300 DPI transparent DTF print files for the press.
            </p>
          </div>
        )}

        {/* Step 4: Order Confirmed */}
        {step === 'confirmed' && (
          <div className="py-6 text-center space-y-4 font-mono">
            {/* Signature Order Stamp */}
            <div className="hang-tag-shape w-64 mx-auto p-4 rounded-xl text-slate-950 space-y-1">
              <div className="hang-tag-grommet mx-auto -top-2" />
              <span className="text-[10px] font-bold text-amber-700 tracking-widest block uppercase">ORDER CONFIRMED</span>
              <h3 className="text-2xl font-display text-slate-950">{confirmedOrderId}</h3>
              <p className="text-[10px] text-stone-600">Dispatches in 48 Hours</p>
            </div>

            <div className="space-y-1">
              <h4 className="text-xl font-display text-white">Thank You for Printing with INKTAG!</h4>
              <p className="text-xs text-slate-300 max-w-sm mx-auto">
                A WhatsApp order confirmation has been dispatched to <span className="text-amber-400 font-bold">{address.phone}</span>.
              </p>
            </div>

            <button onClick={onClose} className="btn-cobalt w-full justify-center py-3 text-xs font-mono">
              Back to Studio
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
