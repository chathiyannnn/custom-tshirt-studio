import React from 'react';
import { ShoppingBag, X, Trash2, ArrowRight, Truck } from 'lucide-react';

export default function CartDrawer({ isOpen, onClose, cartItems = [], onRemoveCartItem, onOpenCheckout }) {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((a, i) => a + i.price * i.quantity, 0);
  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 99;
  const total = subtotal + shipping;

  return (
    <div className="modal-overlay" style={{ justifyContent: 'flex-end', padding: 0 }}>
      <div style={{
        width: '100%', maxWidth: '420px', height: '100%',
        background: 'var(--white)',
        borderLeft: '1px solid var(--cream-deep)',
        boxShadow: 'var(--shadow-lg)',
        display: 'flex', flexDirection: 'column',
        fontFamily: 'var(--font-body)'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          background: 'var(--cream)',
          borderBottom: '1px solid var(--cream-deep)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={20} color="var(--gold-dark)" />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700, color: 'var(--brown)' }}>
              Your Cart
            </span>
            <span className="badge-gold">{cartItems.length} items</span>
          </div>
          <button onClick={onClose} className="btn-ghost"><X size={18} /></button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--brown-light)' }}>
              <ShoppingBag size={48} color="var(--cream-deep)" style={{ marginBottom: '12px' }} />
              <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--brown-mid)', marginBottom: '4px' }}>Your cart is empty</p>
              <p style={{ fontSize: '0.8rem' }}>Design your tee and add it here</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {cartItems.map((item, idx) => (
                <div key={item.id || idx} style={{
                  display: 'flex', gap: '12px', alignItems: 'center',
                  padding: '14px', borderRadius: 'var(--r-md)',
                  background: 'var(--ivory)', border: '1px solid var(--cream-deep)'
                }}>
                  <div style={{
                    width: '52px', height: '52px', borderRadius: 'var(--r-sm)',
                    backgroundColor: item.colorHex || '#1A1A1A',
                    border: '2px solid var(--cream-deep)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.7rem', fontWeight: 700, color: 'white',
                    fontFamily: 'var(--font-mono)', flexShrink: 0
                  }}>
                    {item.size}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--brown)', marginBottom: '2px' }}>
                      {item.title || 'INKTAG Custom Tee'}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--brown-light)' }}>
                      Size: {item.size} · Qty: {item.quantity}
                    </div>
                    <div className="price-tag" style={{ fontSize: '0.9rem', marginTop: '2px' }}>
                      ₹{item.price}
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveCartItem(idx)}
                    className="btn-ghost"
                    style={{ color: 'var(--danger)', padding: '6px' }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div style={{
            padding: '20px 24px',
            borderTop: '1px solid var(--cream-deep)',
            background: 'var(--cream)'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px', fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--brown-mid)' }}>
                <span>Subtotal</span><span style={{ color: 'var(--brown)' }}>₹{subtotal}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--brown-mid)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Truck size={13} /> Shipping</span>
                <span style={{ color: shipping === 0 ? 'var(--success)' : 'var(--brown)' }}>
                  {shipping === 0 ? 'Free' : `₹${shipping}`}
                </span>
              </div>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                paddingTop: '8px', borderTop: '1px solid var(--cream-deep)',
                fontWeight: 700
              }}>
                <span style={{ color: 'var(--brown)', fontSize: '0.9rem' }}>Total</span>
                <span className="price-tag" style={{ fontSize: '1.1rem' }}>₹{total}</span>
              </div>
            </div>

            <button
              className="btn-gold"
              style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '0.85rem' }}
              onClick={() => { onClose(); onOpenCheckout(); }}
            >
              Proceed to Checkout <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
