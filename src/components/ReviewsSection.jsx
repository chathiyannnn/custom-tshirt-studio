import React, { useState } from 'react';
import { Star, Camera, CheckCircle, ThumbsUp } from 'lucide-react';

const INITIAL_REVIEWS = [
  {
    id: 1, name: 'Aarav Mehta', rating: 5,
    date: '2 days ago', size: 'Size XL · Onyx Black',
    comment: 'The 240 GSM fabric feels incredible. Print is razor-sharp with zero cracking after multiple washes. Packaging was premium too!',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&auto=format&fit=crop&q=80',
    likes: 24
  },
  {
    id: 2, name: 'Priya Sharma', rating: 5,
    date: '1 week ago', size: 'Size M · Warm Ivory',
    comment: 'The 3D preview matched my actual shirt perfectly. WhatsApp updates kept me informed every step. Delivery was 36 hours!',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&auto=format&fit=crop&q=80',
    likes: 18
  },
  {
    id: 3, name: 'Rohan Kapoor', rating: 5,
    date: '2 weeks ago', size: 'Size L · Camel Gold',
    comment: 'Ordered 60 custom tees for our college fest. Bulk pricing was amazing and quality was consistent across all sizes.',
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&auto=format&fit=crop&q=80',
    likes: 31
  }
];

export default function ReviewsSection({ onShowToast }) {
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if (!comment.trim()) return;
    setReviews(p => [{
      id: Date.now(), name: name || 'Happy Customer', rating: 5,
      date: 'Just now', size: 'Size L · Custom',
      comment,
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
      likes: 0
    }, ...p]);
    setName(''); setComment('');
    onShowToast('Review posted! Thank you ⭐');
  };

  return (
    <section style={{
      background: 'var(--ivory)',
      borderTop: '1px solid var(--cream-deep)',
      padding: '60px 24px'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '36px', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--gold-dark)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '4px' }}>
              Real Customers · Verified Prints
            </span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: 'var(--brown)' }}>
              Community Reviews
            </h2>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            background: 'var(--white)', border: '1px solid var(--cream-deep)',
            borderRadius: 'var(--r-md)', padding: '10px 18px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', color: 'var(--gold)' }}>
              {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
            </div>
            <span style={{ fontWeight: 800, color: 'var(--brown)', fontFamily: 'var(--font-mono)' }}>4.9 / 5.0</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--brown-light)' }}>· 1,420+ prints</span>
          </div>
        </div>

        {/* Review Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          {reviews.map(r => (
            <div key={r.id} className="card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              {/* Photo */}
              <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                <img src={r.image} alt={r.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{
                  position: 'absolute', bottom: '10px', left: '10px',
                  background: 'rgba(255,255,255,0.92)',
                  borderRadius: 'var(--r-sm)', padding: '4px 10px',
                  display: 'flex', alignItems: 'center', gap: '4px',
                  fontSize: '0.68rem', fontWeight: 600, color: 'var(--success)'
                }}>
                  <CheckCircle size={11} /> Verified Buyer
                </div>
              </div>
              <div style={{ padding: '18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--brown)', fontSize: '0.88rem' }}>{r.name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--brown-light)', fontFamily: 'var(--font-mono)' }}>{r.size}</div>
                  </div>
                  <div style={{ display: 'flex', color: 'var(--gold)' }}>
                    {[...Array(r.rating)].map((_, i) => <Star key={i} size={13} fill="currentColor" />)}
                  </div>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--brown-mid)', lineHeight: 1.7, flex: 1, marginBottom: '14px' }}>
                  "{r.comment}"
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--cream-deep)', fontSize: '0.7rem', color: 'var(--brown-faint)', fontFamily: 'var(--font-mono)' }}>
                  <span>{r.date}</span>
                  <button
                    onClick={() => { setReviews(p => p.map(x => x.id === r.id ? { ...x, likes: x.likes + 1 } : x)); }}
                    style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--brown-light)', fontSize: '0.7rem', fontFamily: 'var(--font-mono)' }}
                  >
                    <ThumbsUp size={12} /> {r.likes}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Post a Review */}
        <div className="card" style={{ maxWidth: '560px', margin: '0 auto', padding: '28px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <Camera size={18} color="var(--gold-dark)" />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--brown)' }}>
              Share Your Experience
            </h3>
          </div>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input className="input-field" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
            <textarea
              className="input-field"
              placeholder="Tell us how your custom tee turned out…"
              value={comment}
              onChange={e => setComment(e.target.value)}
              rows={3}
              style={{ resize: 'vertical', fontFamily: 'var(--font-body)' }}
            />
            <button className="btn-gold" type="submit" style={{ alignSelf: 'flex-start', padding: '11px 24px', fontSize: '0.82rem' }}>
              Post Review
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
