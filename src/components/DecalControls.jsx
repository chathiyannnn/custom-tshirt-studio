import React from 'react';
import { Layers, Plus, ZoomIn, RotateCw, Move, Trash2, Image } from 'lucide-react';

export default function DecalControls({
  decals, activeDecalId, setActiveDecalId,
  onUpdateDecal, onRemoveDecal, onOpenSearchModal
}) {
  const activeDecal = decals.find(d => d.id === activeDecalId);

  return (
    <div className="card" style={{ padding: '20px' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '16px',
        paddingBottom: '14px',
        borderBottom: '1px solid var(--cream-deep)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Layers size={15} color="var(--gold-dark)" />
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--brown)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Graphic Layers ({decals.length})
          </span>
        </div>
        <button
          onClick={onOpenSearchModal}
          style={{
            background: 'var(--brown)', color: 'var(--cream)',
            border: 'none', borderRadius: 'var(--r-sm)',
            padding: '6px 12px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '5px',
            fontSize: '0.75rem', fontWeight: 700
          }}
        >
          <Plus size={13} /> Add
        </button>
      </div>

      {decals.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '32px 16px' }}>
          <div style={{
            width: '52px', height: '52px',
            background: 'var(--cream)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 12px',
            border: '1.5px dashed var(--gold)'
          }}>
            <Image size={22} color="var(--gold)" />
          </div>
          <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--brown)', marginBottom: '4px' }}>
            No graphics yet
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--brown-light)', marginBottom: '16px' }}>
            Search or upload your artwork to place on the tee
          </p>
          <button className="btn-gold" onClick={onOpenSearchModal} style={{ padding: '10px 20px', fontSize: '0.78rem' }}>
            <Plus size={14} /> Browse Artwork
          </button>
        </div>
      ) : (
        <>
          {/* Layer Chips */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '12px' }}>
            {decals.map((d, idx) => (
              <button
                key={d.id}
                onClick={() => setActiveDecalId(d.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '6px 10px',
                  borderRadius: 'var(--r-sm)',
                  border: d.id === activeDecalId ? '1.5px solid var(--gold)' : '1.5px solid var(--cream-deep)',
                  background: d.id === activeDecalId ? 'var(--cream)' : 'var(--white)',
                  color: 'var(--brown)',
                  cursor: 'pointer',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{
                  width: '22px', height: '22px', borderRadius: '4px',
                  overflow: 'hidden', border: '1px solid var(--cream-deep)',
                  flexShrink: 0
                }}>
                  <img src={d.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                Layer {idx + 1} · {d.placement}
              </button>
            ))}
          </div>

          {/* Active Layer Controls */}
          {activeDecal && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Placement */}
              <div>
                <label style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--brown-light)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '8px' }}>
                  Print Zone
                </label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {['front', 'back', 'left', 'right'].map(zone => (
                    <button
                      key={zone}
                      onClick={() => onUpdateDecal(activeDecal.id, { placement: zone })}
                      style={{
                        flex: 1, padding: '7px 4px',
                        borderRadius: 'var(--r-sm)',
                        border: activeDecal.placement === zone ? '1.5px solid var(--gold)' : '1.5px solid var(--cream-deep)',
                        background: activeDecal.placement === zone ? 'var(--brown)' : 'var(--cream)',
                        color: activeDecal.placement === zone ? 'var(--cream)' : 'var(--brown)',
                        fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase',
                        cursor: 'pointer', transition: 'all 0.15s ease',
                        letterSpacing: '0.04em'
                      }}
                    >
                      {zone}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sliders */}
              {[
                { icon: <ZoomIn size={13} />, label: 'Scale', key: 'scale', min: 0.3, max: 2.5, step: 0.05, display: v => `${Math.round(v * 100)}%` },
                { icon: <RotateCw size={13} />, label: 'Rotate', key: 'rotation', min: -180, max: 180, step: 5, display: v => `${v}°` },
                { icon: <Move size={13} />, label: 'Horizontal', key: 'x', min: -150, max: 150, step: 1, display: v => `${v}px` },
                { icon: <Move size={13} />, label: 'Vertical', key: 'y', min: -150, max: 150, step: 1, display: v => `${v}px` },
              ].map(ctrl => (
                <div key={ctrl.key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: 'var(--brown-mid)', fontWeight: 600 }}>
                      {ctrl.icon} {ctrl.label}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--gold-dark)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                      {ctrl.display(activeDecal[ctrl.key] ?? (ctrl.key === 'scale' ? 1 : 0))}
                    </span>
                  </div>
                  <input
                    type="range" min={ctrl.min} max={ctrl.max} step={ctrl.step}
                    value={activeDecal[ctrl.key] ?? (ctrl.key === 'scale' ? 1 : 0)}
                    onChange={e => {
                      const val = ctrl.key === 'scale' ? parseFloat(e.target.value) : parseInt(e.target.value);
                      onUpdateDecal(activeDecal.id, { [ctrl.key]: val });
                    }}
                    style={{ width: '100%' }}
                  />
                </div>
              ))}

              {/* Remove */}
              <button
                onClick={() => onRemoveDecal(activeDecal.id)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  padding: '9px', borderRadius: 'var(--r-sm)',
                  background: 'rgba(192,57,43,0.06)',
                  border: '1.5px solid rgba(192,57,43,0.2)',
                  color: 'var(--danger)',
                  fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(192,57,43,0.12)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(192,57,43,0.06)'}
              >
                <Trash2 size={14} /> Remove Selected Layer
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
