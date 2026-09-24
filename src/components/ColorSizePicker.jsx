import React from 'react';
import { Palette, Maximize2, Info, Check } from 'lucide-react';

export default function ColorSizePicker({
  selectedColor, onSelectColor,
  selectedSize,  onSelectSize,
  onOpenSizeGuide
}) {
  const colors = [
    { name: 'Onyx Black',      hex: '#1A1A1A',   light: false },
    { name: 'Flannel Red',     hex: '#7a1010',   light: false },
    { name: 'Pure White',      hex: '#F8F8F8',   light: true  },
    { name: 'Sand Beige',      hex: '#C8A97E',   light: true  },
    { name: 'Chocolate Brown', hex: '#4E2C12',   light: false },
    { name: 'Camel Gold',      hex: '#C9A84C',   light: false },
    { name: 'Warm Ivory',      hex: '#F5EFE0',   light: true  },
    { name: 'Espresso',        hex: '#2C1A0E',   light: false },
    { name: 'Champagne',       hex: '#E8D5A3',   light: true  },
    { name: 'Warm Gray',       hex: '#8B7D6E',   light: false },
    { name: 'Midnight',        hex: '#1C1C2E',   light: false },
  ];

  const sizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];

  const selectedColorObj = colors.find(c => c.hex === selectedColor);

  return (
    <div className="card" style={{ padding: '20px' }}>
      {/* Color Picker */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Palette size={15} color="var(--gold-dark)" />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--brown)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Fabric Colour
            </span>
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--brown-mid)', fontFamily: 'var(--font-mono)' }}>
            {selectedColorObj?.name || 'Select'}
          </span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {colors.map(c => {
            const isSelected = selectedColor === c.hex;
            return (
              <button
                key={c.hex}
                title={c.name}
                onClick={() => onSelectColor(c.hex)}
                style={{
                  width: '34px', height: '34px',
                  borderRadius: '50%',
                  backgroundColor: c.hex,
                  border: isSelected ? '2.5px solid var(--gold)' : '2px solid var(--cream-deep)',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                  boxShadow: isSelected ? 'var(--shadow-gold)' : 'var(--shadow-sm)',
                  transition: 'all 0.2s ease',
                  outline: isSelected ? '2px solid var(--gold-light)' : 'none',
                  outlineOffset: '2px'
                }}
                onMouseEnter={e => { if (!isSelected) e.currentTarget.style.transform = 'scale(1.08)'; }}
                onMouseLeave={e => { if (!isSelected) e.currentTarget.style.transform = 'scale(1)'; }}
              >
                {isSelected && (
                  <Check size={14} color={c.light ? 'var(--brown)' : 'white'} strokeWidth={3} />
                )}
              </button>
            );
          })}
        </div>

        <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--brown-light)', fontFamily: 'var(--font-mono)' }}>HEX</span>
          <input
            value={selectedColor}
            onChange={e => {
              const v = e.target.value;
              if (/^#([0-9a-fA-F]{0,6})$/.test(v)) onSelectColor(v);
            }}
            maxLength={7}
            style={{
              width: '110px',
              padding: '6px 8px',
              borderRadius: 'var(--r-sm)',
              border: '1.5px solid var(--cream-deep)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              color: 'var(--brown)',
            }}
          />
          <input
            type="color"
            value={/^#[0-9a-fA-F]{6}$/.test(selectedColor) ? selectedColor : '#1A1A1A'}
            onChange={e => onSelectColor(e.target.value)}
            style={{ width: 34, height: 28, border: 'none', background: 'none', cursor: 'pointer' }}
          />
        </div>
      </div>

      {/* Divider */}
      <div className="divider-gold" style={{ marginBottom: '18px' }} />

      {/* Size Picker */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Maximize2 size={15} color="var(--gold-dark)" />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--brown)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Size
            </span>
          </div>
          <button
            onClick={onOpenSizeGuide}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '4px',
              fontSize: '0.75rem', color: 'var(--gold-dark)', fontWeight: 600,
              textDecoration: 'underline'
            }}
          >
            <Info size={13} /> Size Guide
          </button>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {sizes.map(size => {
            const isSelected = selectedSize === size;
            return (
              <button
                key={size}
                onClick={() => onSelectSize(size)}
                style={{
                  padding: '8px 14px',
                  borderRadius: 'var(--r-sm)',
                  border: isSelected ? '2px solid var(--gold)' : '1.5px solid var(--cream-deep)',
                  background: isSelected ? 'var(--brown)' : 'var(--white)',
                  color: isSelected ? 'var(--cream)' : 'var(--brown)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: isSelected ? 'var(--shadow-md)' : 'none',
                  transition: 'all 0.2s ease',
                  letterSpacing: '0.04em'
                }}
                onMouseEnter={e => { if (!isSelected) { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.background = 'var(--cream)'; }}}
                onMouseLeave={e => { if (!isSelected) { e.currentTarget.style.borderColor = 'var(--cream-deep)'; e.currentTarget.style.background = 'var(--white)'; }}}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Fabric Quality Badge */}
      <div style={{
        marginTop: '16px',
        padding: '10px 14px',
        background: 'var(--cream)',
        borderRadius: 'var(--r-sm)',
        border: '1px solid var(--cream-deep)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span style={{ fontSize: '1rem' }}>🏅</span>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brown)' }}>240 GSM Bio-Washed Cotton</div>
          <div style={{ fontSize: '0.68rem', color: 'var(--brown-light)', fontFamily: 'var(--font-mono)' }}>
            Pre-shrunk · Zero-crack print · Preshrunk
          </div>
        </div>
      </div>
    </div>
  );
}
