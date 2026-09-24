import React, { useState, useEffect } from 'react';
import { Search, Upload, X, Check, Download, ShieldCheck, Sparkles } from 'lucide-react';

const CURATED = [
  { id: 'c1', title: 'Abstract Gold Lines',    category: 'Abstract',  url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80' },
  { id: 'c2', title: 'Japanese Minimal Art',   category: 'Art',       url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&auto=format&fit=crop&q=80' },
  { id: 'c3', title: 'Retro Sunset Ocean',     category: 'Nature',    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop&q=80' },
  { id: 'c4', title: 'Geometric Emblem',       category: 'Logo',      url: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=500&auto=format&fit=crop&q=80' },
  { id: 'c5', title: 'Minimal Architecture',   category: 'Abstract',  url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&auto=format&fit=crop&q=80' },
  { id: 'c6', title: 'Cosmic Galaxy',          category: 'Space',     url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=500&auto=format&fit=crop&q=80' },
  { id: 'c7', title: 'Urban Typography',       category: 'Type',      url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80' },
  { id: 'c8', title: 'Majestic Eagle',         category: 'Nature',    url: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=500&auto=format&fit=crop&q=80' },
];

const CATS = ['All', 'Abstract', 'Art', 'Nature', 'Logo', 'Space', 'Type'];

export default function ImageSearchModal({ isOpen, onClose, onImportImage }) {
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState('All');
  const [results, setResults] = useState(CURATED);
  const [loading, setLoading] = useState(false);
  const [imported, setImported] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    setResults(CURATED);
    setQuery('');
    setActiveCat('All');
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSearch = e => {
    e.preventDefault();
    if (!query.trim()) { setResults(CURATED); return; }
    setLoading(true);
    setTimeout(() => {
      const filtered = CURATED.filter(i =>
        i.title.toLowerCase().includes(query.toLowerCase()) ||
        i.category.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
      setLoading(false);
    }, 400);
  };

  const handleCat = cat => {
    setActiveCat(cat);
    setResults(cat === 'All' ? CURATED : CURATED.filter(i => i.category === cat));
  };

  const handleUpload = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      alert('Please upload JPEG, PNG or WebP only.');
      return;
    }
    const reader = new FileReader();
    reader.onload = ev => { onImportImage(ev.target.result); onClose(); };
    reader.readAsDataURL(file);
  };

  const handleImport = img => {
    setImported(img.id);
    onImportImage(img.url);
    setTimeout(() => { setImported(null); onClose(); }, 400);
  };

  return (
    <div className="modal-overlay">
      <div style={{
        width: '100%', maxWidth: '860px', maxHeight: '88vh',
        background: 'var(--white)',
        borderRadius: 'var(--r-xl)',
        border: '1px solid var(--cream-deep)',
        boxShadow: 'var(--shadow-lg)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--cream-deep)',
          display: 'flex', alignItems: 'center', gap: '12px',
          background: 'var(--cream)'
        }}>
          <div style={{
            width: '38px', height: '38px',
            background: 'linear-gradient(135deg, var(--gold-light), var(--gold-dark))',
            borderRadius: 'var(--r-sm)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Sparkles size={18} color="white" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--brown)' }}>
              Artwork Library
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--brown-light)', fontFamily: 'var(--font-mono)' }}>
              Licensed Unsplash stock · Upload your own PNG
            </div>
          </div>
          <button onClick={onClose} className="btn-ghost">
            <X size={18} />
          </button>
        </div>

        {/* Search + Upload */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--cream-deep)', background: 'var(--ivory)' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={15} color="var(--gold)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                className="input-field"
                style={{ paddingLeft: '38px' }}
                placeholder="Search artwork (lion, mandala, retro wave, etc.)…"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>
            <button className="btn-brown" type="submit" style={{ padding: '10px 20px', fontSize: '0.8rem' }}>Search</button>
            <label className="btn-outline" style={{ cursor: 'pointer' }}>
              <Upload size={14} /> Upload
              <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleUpload} style={{ display: 'none' }} />
            </label>
          </form>

          {/* Copyright note */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '7px 12px', background: 'rgba(201,168,76,0.08)',
            borderRadius: 'var(--r-sm)', border: '1px solid rgba(201,168,76,0.2)',
            fontSize: '0.7rem', color: 'var(--gold-dark)', fontWeight: 500
          }}>
            <ShieldCheck size={13} /> All stock images are royalty-free licensed for commercial printing.
          </div>

          {/* Category chips */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingTop: '12px' }}>
            {CATS.map(cat => (
              <button
                key={cat}
                onClick={() => handleCat(cat)}
                style={{
                  padding: '5px 14px',
                  borderRadius: 'var(--r-full)',
                  border: activeCat === cat ? '1.5px solid var(--gold)' : '1.5px solid var(--cream-deep)',
                  background: activeCat === cat ? 'var(--brown)' : 'var(--white)',
                  color: activeCat === cat ? 'var(--cream)' : 'var(--brown-mid)',
                  fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
                  whiteSpace: 'nowrap', flexShrink: 0, transition: 'all 0.15s'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div style={{
          flex: 1, overflowY: 'auto', padding: '20px 24px',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '14px',
          alignContent: 'start'
        }}>
          {loading ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '48px', color: 'var(--brown-light)' }}>
              <div style={{ width: '28px', height: '28px', border: '3px solid var(--gold)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
              Searching…
            </div>
          ) : results.map(img => (
            <div
              key={img.id}
              style={{
                borderRadius: 'var(--r-md)',
                overflow: 'hidden',
                border: '1.5px solid var(--cream-deep)',
                background: 'var(--white)',
                boxShadow: 'var(--shadow-sm)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-gold)'; e.currentTarget.style.borderColor = 'var(--gold)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.borderColor = 'var(--cream-deep)'; }}
            >
              <div style={{ position: 'relative', aspectRatio: '1', overflow: 'hidden', background: 'var(--cream)' }}>
                <img src={img.url} alt={img.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(62,32,16,0.6)', opacity: 0, transition: 'opacity 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '0'}
                >
                  <button
                    className="btn-gold"
                    onClick={() => handleImport(img)}
                    style={{ padding: '8px 14px', fontSize: '0.72rem' }}
                  >
                    {imported === img.id ? <><Check size={13} /> Added!</> : <><Download size={13} /> Add to Tee</>}
                  </button>
                </div>
              </div>
              <div style={{ padding: '10px 10px 12px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--brown)', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {img.title}
                </div>
                <span className="badge-gold" style={{ fontSize: '0.62rem' }}>{img.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
