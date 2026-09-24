import React, { useState } from 'react';
import { Layers, Move, Sparkles } from 'lucide-react';

export default function Canvas2DLayout({
  shirtColor, activeSide, setActiveSide,
  decals, activeDecalId, setActiveDecalId,
  onUpdateDecal, onRemoveDecal, onOpenSearchModal
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const currentDecals = decals.filter(d => (d.placement || 'front') === activeSide);
  const activeDecal   = decals.find(d => d.id === activeDecalId);

  const onMouseDown = (e, id) => {
    e.stopPropagation();
    setActiveDecalId(id);
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };
  const onMouseMove = e => {
    if (!isDragging || !activeDecal) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    onUpdateDecal(activeDecal.id, {
      x: Math.max(-130, Math.min(130, (activeDecal.x || 0) + dx * 0.8)),
      y: Math.max(-150, Math.min(150, (activeDecal.y || 0) + dy * 0.8))
    });
    setDragStart({ x: e.clientX, y: e.clientY });
  };
  const onMouseUp = () => setIsDragging(false);

  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      {/* Header + Side Tabs */}
      <div style={{
        padding: '14px 16px',
        background: 'var(--cream)',
        borderBottom: '1px solid var(--cream-deep)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Layers size={15} color="var(--gold-dark)" />
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--brown)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Design Canvas <span style={{ color: 'var(--gold-dark)', fontFamily: 'var(--font-mono)' }}>({activeSide.toUpperCase()})</span>
          </span>
        </div>
        <div style={{ display: 'flex', gap: '4px', background: 'var(--white)', borderRadius: 'var(--r-sm)', padding: '3px', border: '1px solid var(--cream-deep)' }}>
          {['front', 'back'].map(s => (
            <button
              key={s}
              onClick={() => setActiveSide(s)}
              style={{
                padding: '5px 14px',
                borderRadius: '6px',
                border: 'none',
                background: activeSide === s ? 'var(--brown)' : 'transparent',
                color: activeSide === s ? 'var(--cream)' : 'var(--brown-light)',
                fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer',
                textTransform: 'uppercase', letterSpacing: '0.05em',
                transition: 'all 0.15s ease'
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Canvas */}
      <div
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '4/5',
          backgroundColor: shirtColor,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: isDragging ? 'grabbing' : 'default',
          userSelect: 'none',
          overflow: 'hidden'
        }}
      >
        {/* Print area guide */}
        <div style={{
          position: 'absolute',
          inset: '10%',
          border: '1px dashed rgba(201,168,76,0.4)',
          borderRadius: '8px',
          pointerEvents: 'none',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '8px 10px'
        }}>
          <span style={{ fontSize: '8px', fontFamily: 'var(--font-mono)', color: 'rgba(201,168,76,0.7)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>15" × 18" Print Area</span>
          <span style={{ fontSize: '8px', fontFamily: 'var(--font-mono)', color: 'rgba(201,168,76,0.4)', textTransform: 'uppercase', alignSelf: 'flex-end' }}>DTF Grid</span>
        </div>

        {currentDecals.length === 0 ? (
          <div style={{ textAlign: 'center', pointerEvents: 'none', zIndex: 1 }}>
            <Sparkles size={28} color="rgba(201,168,76,0.6)" style={{ margin: '0 auto 8px', display: 'block' }} />
            <p style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'rgba(201,168,76,0.8)' }}>
              No graphics on <strong>{activeSide}</strong> side
            </p>
            <button
              onClick={onOpenSearchModal}
              style={{
                marginTop: '10px',
                background: 'rgba(201,168,76,0.15)',
                border: '1px solid rgba(201,168,76,0.4)',
                color: 'rgba(201,168,76,0.9)',
                padding: '6px 14px', borderRadius: 'var(--r-sm)',
                fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer',
                pointerEvents: 'auto'
              }}
            >
              + Add Graphic
            </button>
          </div>
        ) : (
          currentDecals.map(d => {
            const isActive = d.id === activeDecalId;
            return (
              <div
                key={d.id}
                onMouseDown={e => onMouseDown(e, d.id)}
                style={{
                  position: 'absolute',
                  transform: `translate(${d.x || 0}px, ${d.y || 0}px) rotate(${d.rotation || 0}deg) scale(${d.scale || 1})`,
                  opacity: d.opacity ?? 1,
                  cursor: 'grab',
                  outline: isActive ? '2px solid var(--gold)' : 'none',
                  outlineOffset: '4px',
                  borderRadius: '4px'
                }}
              >
                <img src={d.url} alt="" style={{ width: '120px', height: '120px', objectFit: 'contain', pointerEvents: 'none', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' }} />
                {isActive && (
                  <div style={{
                    position: 'absolute', top: '-12px', right: '-12px',
                    width: '22px', height: '22px',
                    background: 'var(--gold)', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Move size={11} color="white" />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
