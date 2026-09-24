import React from 'react';
import { ShoppingBag, Package, Heart, MessageSquare } from 'lucide-react';

export default function BottomNavbar({ cartCount, onOpenCart, onOpenOrders, onOpenSavedDesigns }) {
  const items = [
    { icon: <ShoppingBag size={20} />, label: 'Cart', badge: cartCount, onClick: onOpenCart },
    { icon: <Package size={20} />,     label: 'Orders',  onClick: onOpenOrders },
    { icon: <Heart size={20} />,       label: 'Saved',   onClick: onOpenSavedDesigns },
    {
      icon: <MessageSquare size={20} />, label: 'Support',
      onClick: () => window.open('https://wa.me/919876543210?text=Hi+INKTAG+team,+I+have+a+query!', '_blank')
    },
  ];

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      zIndex: 99,
      background: 'var(--white)',
      borderTop: '1px solid var(--cream-deep)',
      boxShadow: '0 -4px 20px rgba(62,32,16,0.08)',
      padding: '8px 0 10px'
    }}>
      <div style={{
        maxWidth: '480px', margin: '0 auto',
        display: 'flex', justifyContent: 'space-around'
      }}>
        {items.map((item, i) => (
          <button
            key={i}
            onClick={item.onClick}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
              color: 'var(--brown-mid)',
              padding: '6px 16px',
              borderRadius: 'var(--r-md)',
              position: 'relative',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--gold-dark)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--brown-mid)'}
          >
            {item.icon}
            <span style={{ fontSize: '0.65rem', fontWeight: 600, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {item.label}
            </span>
            {item.badge > 0 && (
              <span style={{
                position: 'absolute', top: '2px', right: '10px',
                width: '16px', height: '16px',
                background: 'var(--gold)',
                color: 'white',
                borderRadius: '50%',
                fontSize: '0.6rem', fontWeight: 800,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-mono)'
              }}>{item.badge}</span>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}
