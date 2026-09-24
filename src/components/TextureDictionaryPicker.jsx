import React, { useRef } from 'react';
import { Layers, Upload, Sparkles, Check, Image as ImageIcon } from 'lucide-react';
import { OPENIV_TEXTURE_PRESETS } from '../utils/textureGen';

export default function TextureDictionaryPicker({
  selectedTextureId,
  onSelectTextureId,
  customTextureUrl,
  onUploadCustomTexture
}) {
  const fileInputRef = useRef(null);

  const handleFileChange = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      onUploadCustomTexture(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="card" style={{ padding: '20px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '14px',
        paddingBottom: '12px',
        borderBottom: '1px solid var(--cream-deep)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Layers size={16} color="var(--gold-dark)" />
          <span style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            color: 'var(--brown)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em'
          }}>
            OpenIV Fabric Textures (.ytd)
          </span>
        </div>
        <span className="badge-gold" style={{ fontSize: '0.62rem' }}>GTA V Textures</span>
      </div>

      {/* Description */}
      <p style={{ fontSize: '0.74rem', color: 'var(--brown-light)', marginBottom: '14px', lineHeight: 1.5 }}>
        Choose a GTA V clothing texture dictionary skin or upload a custom fabric pattern map to wrap around the shirt and sleeves.
      </p>

      {/* Preset Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '14px' }}>
        {OPENIV_TEXTURE_PRESETS.map(preset => {
          const isSelected = selectedTextureId === preset.id && !customTextureUrl;
          return (
            <button
              key={preset.id}
              onClick={() => onSelectTextureId(preset.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 10px',
                borderRadius: 'var(--r-md)',
                border: isSelected ? '2px solid var(--gold)' : '1px solid var(--cream-deep)',
                background: isSelected ? 'var(--cream)' : 'var(--white)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
                boxShadow: isSelected ? 'var(--shadow-gold)' : 'none'
              }}
            >
              {/* Swatch */}
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                backgroundColor: preset.primary,
                border: '1.5px solid rgba(0,0,0,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {isSelected && <Check size={14} color="#fff" strokeWidth={3} />}
              </div>

              {/* Info */}
              <div style={{ overflow: 'hidden' }}>
                <div style={{
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  color: isSelected ? 'var(--brown)' : 'var(--brown-mid)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {preset.name}
                </div>
                <div style={{
                  fontSize: '0.62rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--gold-dark)'
                }}>
                  {preset.ytdName}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Custom Texture Upload Button */}
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: 'var(--r-md)',
            border: customTextureUrl ? '2px solid var(--gold)' : '1.5px dashed var(--gold)',
            background: customTextureUrl ? 'var(--cream)' : 'rgba(201,168,76,0.06)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            color: 'var(--brown)',
            fontSize: '0.78rem',
            fontWeight: 700,
            transition: 'all 0.2s ease'
          }}
        >
          <Upload size={14} color="var(--gold-dark)" />
          {customTextureUrl ? 'Custom Pattern Applied ✓ (Upload Another)' : '[+] Add Texture Map (.ytd / Image)'}
        </button>
      </div>
    </div>
  );
}
