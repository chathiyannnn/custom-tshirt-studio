import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

export default function CameraShortcuts({ currentAngle, onSelectAngle }) {
  const views = [
    { id: 'front', label: 'Front',  icon: <ArrowUp    size={14} />, desc: 'Face View'  },
    { id: 'back',  label: 'Back',   icon: <ArrowDown  size={14} />, desc: 'Back View'  },
    { id: 'left',  label: 'Left',   icon: <ArrowLeft  size={14} />, desc: 'Left Side'  },
    { id: 'right', label: 'Right',  icon: <ArrowRight size={14} />, desc: 'Right Side' },
  ];

  return (
    <div>
      {/* Section label */}
      <div style={{
        textAlign: 'center',
        fontSize: '0.68rem',
        fontFamily: 'var(--font-mono)',
        color: 'var(--brown-light)',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        marginBottom: '10px'
      }}>
        📷 Camera Angle
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
        {views.map(v => {
          const isActive = currentAngle === v.id;
          return (
            <button
              key={v.id}
              onClick={() => onSelectAngle(v.id)}
              title={v.desc}
              style={{
                padding: '10px 6px',
                borderRadius: 'var(--r-md)',
                border: isActive ? '2px solid var(--gold)' : '1.5px solid var(--cream-deep)',
                background: isActive
                  ? 'linear-gradient(135deg, var(--brown) 0%, var(--brown-mid) 100%)'
                  : 'var(--white)',
                color: isActive ? 'var(--cream)' : 'var(--brown-mid)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '5px',
                boxShadow: isActive ? 'var(--shadow-gold), var(--shadow-md)' : 'var(--shadow-sm)',
                transform: isActive ? 'translateY(-1px)' : 'translateY(0)',
                transition: 'all 0.2s cubic-bezier(0.34,1.56,0.64,1)',
                letterSpacing: '0.04em',
                textTransform: 'uppercase'
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = 'var(--gold)';
                  e.currentTarget.style.background = 'var(--cream)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = 'var(--cream-deep)';
                  e.currentTarget.style.background = 'var(--white)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              <span style={{ opacity: isActive ? 1 : 0.6 }}>{v.icon}</span>
              {v.label}
              {isActive && (
                <div style={{
                  width: '18px', height: '2px',
                  background: 'var(--gold)',
                  borderRadius: '2px'
                }} />
              )}
            </button>
          );
        })}
      </div>

      <div style={{
        marginTop: '10px', textAlign: 'center',
        fontSize: '0.65rem', fontFamily: 'var(--font-mono)',
        color: 'var(--brown-faint)', letterSpacing: '0.06em'
      }}>
        Or drag the 3D model to rotate freely
      </div>
    </div>
  );
}
