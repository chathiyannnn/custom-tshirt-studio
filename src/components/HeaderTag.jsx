import React from 'react';
import { ShoppingBag, Search, Tag, Building2, ShieldAlert } from 'lucide-react';

export default function HeaderTag({
  onOpenSearchModal, onOpenCart, onOpenGuide,
  onOpenBulkModal, onOpenAdmin, cartCount = 0
}) {
  return (
    <header style={{
      background: 'var(--white)',
      borderBottom: '1px solid var(--cream-deep)',
      boxShadow: 'var(--shadow-sm)',
      position: 'sticky', top: 0, zIndex: 100
    }}>
      <div className="site-header-inner">

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div style={{
            width: 36, height: 36,
            background: 'linear-gradient(135deg, var(--gold-light), var(--gold-dark))',
            borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'var(--shadow-gold)'
          }}>
            <Tag size={16} color="white" />
          </div>
          <div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.28rem', fontWeight: 800,
              color: 'var(--brown)', lineHeight: 1, letterSpacing: '-0.01em'
            }}>
              Pri<span style={{ color: 'var(--gold)' }}>shirt</span>
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.52rem',
              color: 'var(--brown-light)', letterSpacing: '0.12em', textTransform: 'uppercase'
            }}>Print Your Shirt</div>
          </div>
        </div>

        <button
          onClick={onOpenSearchModal}
          className="header-search"
          aria-label="Search artwork"
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--cream-deep)'; }}
        >
          <Search size={15} color="var(--gold)" />
          <span className="header-search-label" style={{ fontSize: '0.8rem', color: 'var(--brown-faint)', fontFamily: 'var(--font-body)' }}>
            Search artwork, logos, graphics…
          </span>
          <span className="badge-gold header-kbd">Ctrl+K</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <button onClick={onOpenBulkModal} className="btn-ghost" aria-label="Bulk orders">
            <Building2 size={15} />
            <span className="header-bulk-label">Bulk</span>
          </button>
          <button onClick={onOpenAdmin} className="btn-ghost" title="Admin" aria-label="Admin">
            <ShieldAlert size={15} color="var(--gold-dark)" />
          </button>
          <button
            onClick={onOpenCart}
            aria-label="Open cart"
            style={{
              position: 'relative', background: 'var(--brown)', color: 'var(--cream)',
              border: 'none', borderRadius: 'var(--r-md)', padding: '9px 12px',
              display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer',
              fontWeight: 700, fontSize: '0.82rem', boxShadow: 'var(--shadow-md)',
              minHeight: 40
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--brown-mid)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--brown)'; }}
          >
            <ShoppingBag size={16} />
            <span className="header-cart-label">Cart</span>
            {cartCount > 0 && (
              <span style={{
                background: 'var(--gold)', color: '#fff',
                width: 18, height: 18, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.62rem', fontWeight: 900, fontFamily: 'var(--font-mono)'
              }}>{cartCount}</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
