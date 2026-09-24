import React from 'react';

const GARMENTS = [
  {
    id: 'tshirt',
    label: 'T-Shirt',
    sublabel: 'Crew neck',
    emoji: '👕',
    desc: 'Fitted short sleeve — colour + your print',
    price: 699,
    defaultColor: '#F8F8F8',
  },
  {
    id: 'longsleeve',
    label: 'Full Sleeve',
    sublabel: 'Crew neck',
    emoji: '👔',
    desc: 'Long sleeve tee — no hood, colour + your print',
    price: 899,
    defaultColor: '#F8F8F8',
  },
  {
    id: 'hoodie',
    label: 'Hoodie',
    sublabel: 'Pullover',
    emoji: '🧣',
    desc: 'Baggy hood, kangaroo pocket, rib cuffs',
    price: 1299,
    defaultColor: '#1A1A1A',
  },
  {
    id: 'zipjacket',
    label: 'Zip-Up Hoodie',
    sublabel: 'Open zip',
    emoji: '🧥',
    desc: 'Same hoodie cut with a front zip',
    price: 1499,
    defaultColor: '#1A1A1A',
  },
];

export default function GarmentSelector({ selected, onSelect }) {
  return (
    <div style={{
      background: 'var(--white)',
      border: '1px solid var(--cream-deep)',
      borderRadius: 'var(--r-lg)',
      padding: '20px',
      boxShadow: 'var(--shadow-sm)'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
        <span style={{ fontSize: '1rem' }}>👕</span>
        <span style={{
          fontSize: '0.8rem', fontWeight: 700,
          color: 'var(--brown)',
          textTransform: 'uppercase',
          letterSpacing: '0.06em'
        }}>
          Garment Type
        </span>
      </div>

      {/* Garment cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {GARMENTS.map(g => {
          const isActive = selected === g.id;
          return (
            <button
              key={g.id}
              onClick={() => onSelect(g.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '12px 14px',
                borderRadius: 'var(--r-md)',
                border: isActive ? '2px solid var(--gold)' : '1.5px solid var(--cream-deep)',
                background: isActive ? 'var(--cream)' : 'var(--white)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
                boxShadow: isActive ? 'var(--shadow-gold)' : 'none',
                width: '100%'
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = 'var(--gold)';
                  e.currentTarget.style.background = 'rgba(201,168,76,0.04)';
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = 'var(--cream-deep)';
                  e.currentTarget.style.background = 'var(--white)';
                }
              }}
            >
              {/* Emoji icon */}
              <div style={{
                width: '42px', height: '42px', flexShrink: 0,
                background: isActive
                  ? 'linear-gradient(135deg, var(--gold-light), var(--gold-dark))'
                  : 'var(--cream)',
                borderRadius: 'var(--r-sm)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.4rem',
                boxShadow: isActive ? 'var(--shadow-gold)' : 'none',
                transition: 'all 0.2s ease'
              }}>
                {g.emoji}
              </div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                  <span style={{
                    fontSize: '0.85rem', fontWeight: 700,
                    color: isActive ? 'var(--brown)' : 'var(--brown-mid)'
                  }}>
                    {g.label}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: 'var(--gold-dark)'
                  }}>
                    ₹{g.price}
                  </span>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--brown-light)' }}>
                  {g.desc}
                </div>
              </div>

              {/* Active check */}
              {isActive && (
                <div style={{
                  width: '18px', height: '18px', flexShrink: 0,
                  background: 'var(--gold)',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontSize: '0.62rem', fontWeight: 900
                }}>
                  ✓
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export const GARMENT_BASE_PRICES = {
  tshirt: 699,
  longsleeve: 899,
  hoodie: 1299,
  zipjacket: 1499,
  buttonshirt: 899,
};

export const GARMENT_DEFAULT_COLORS = Object.fromEntries(
  GARMENTS.map(g => [g.id, g.defaultColor])
);
