import React, { useState, useCallback } from 'react';
import HeaderTag       from './components/HeaderTag';
import HangTagCTA      from './components/HangTagCTA';
import Tshirt3DCanvas  from './components/Tshirt3DCanvas';
import CameraShortcuts from './components/CameraShortcuts';
import ColorSizePicker from './components/ColorSizePicker';
import DecalControls   from './components/DecalControls';
import GarmentSelector, { GARMENT_BASE_PRICES, GARMENT_DEFAULT_COLORS } from './components/GarmentSelector';
import ImageSearchModal from './components/ImageSearchModal';
import AuthOtpModal    from './components/AuthOtpModal';
import CheckoutModal   from './components/CheckoutModal';
import CartDrawer      from './components/CartDrawer';
import FounderGuideModal from './components/FounderGuideModal';
import SizeGuideModal  from './components/SizeGuideModal';
import BulkInquiryModal from './components/BulkInquiryModal';
import AdminDashboard  from './components/AdminDashboard';
import ReviewsSection  from './components/ReviewsSection';
import BottomNavbar    from './components/BottomNavbar';

import {
  ShoppingBag, Zap, Heart, Truck, ShieldCheck,
  Star, ChevronRight, Award, Clock, Package, Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  const [shirtColor,    setShirtColor]    = useState('#F8F8F8');
  const [selectedSize,  setSelectedSize]  = useState('L');
  const [garmentType,   setGarmentType]   = useState('tshirt');
  const [activeSide,    setActiveSide]    = useState('front');
  const [cameraAngle,   setCameraAngle]   = useState('front');
  const [snapVersion,   setSnapVersion]   = useState(0);   // increments to trigger one-shot camera snap

  const [decals,       setDecals]       = useState([{
    id: 'decal-default',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    placement: 'front', x: 0, y: 0, scale: 1, rotation: 0, opacity: 1
  }]);
  const [activeDecalId, setActiveDecalId] = useState('decal-default');

  const [userPhone,      setUserPhone]      = useState('');
  const [isAuthed,       setIsAuthed]       = useState(false);
  const [cartItems,      setCartItems]      = useState([]);
  const [orders,         setOrders]         = useState([]);
  const [savedDesigns,   setSavedDesigns]   = useState([]);
  const [toast,          setToast]          = useState('');

  /* Modals */
  const [showSearch,   setShowSearch]   = useState(false);
  const [showAuth,     setShowAuth]     = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showCart,     setShowCart]     = useState(false);
  const [showGuide,    setShowGuide]    = useState(false);
  const [showSize,     setShowSize]     = useState(false);
  const [showBulk,     setShowBulk]    = useState(false);
  const [showAdmin,    setShowAdmin]    = useState(false);
  const [showOrders,   setShowOrders]   = useState(false);

  /* Price */
  const hasFront  = decals.some(d => (d.placement || 'front') === 'front');
  const hasBack   = decals.some(d => d.placement === 'back');
  const sides     = (hasFront ? 1 : 0) + (hasBack ? 1 : 0) || 1;
  const xxl       = ['2XL', '3XL'].includes(selectedSize);
  const basePrice = GARMENT_BASE_PRICES[garmentType] || 699;
  const price     = basePrice + (sides > 1 ? 200 : 0) + (xxl ? 100 : 0);
  const mrp       = Math.round(price * 1.45);

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(''), 3500); };

  const handleImport = useCallback(url => {
    const d = { id: `d-${Date.now()}`, url, placement: activeSide, x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 };
    setDecals(p => [...p, d]);
    setActiveDecalId(d.id);
    showToast('✓ Graphic added to tee');
  }, [activeSide]);

  const handleUpdateDecal = useCallback((id, upd) => {
    setDecals(p => p.map(d => d.id === id ? { ...d, ...upd } : d));
  }, []);
  const handleRemoveDecal = id => {
    setDecals(p => p.filter(d => d.id !== id));
    if (activeDecalId === id) setActiveDecalId(null);
  };

  const handleAddToCart = () => {
    const titles = {
      hoodie: 'Pullover Hoodie',
      zipjacket: 'Zip-Up Hooded Jacket',
      buttonshirt: 'Button-Up Shirt',
      longsleeve: 'Full-Sleeve Tee',
      tshirt: 'T-Shirt',
    };
    const item = { id: `c-${Date.now()}`, title: `Custom ${titles[garmentType] || 'T-Shirt'}`, colorHex: shirtColor, size: selectedSize, price, quantity: 1 };
    setCartItems(p => [...p, item]);
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.85 } });
    showToast('Added to cart!');
  };

  const handleSaveDesign = () => {
    const d = { id: `sd-${Date.now()}`, name: `Design #${savedDesigns.length + 1}`, shirtColor, selectedSize, garmentType, decals, date: new Date().toLocaleDateString() };
    setSavedDesigns(p => [d, ...p]);
    showToast('✓ Design saved to collection');
  };

  const S = {
    page: { minHeight: '100vh', background: 'var(--cream)', color: 'var(--brown)', fontFamily: 'var(--font-body)' },
    hero: {
      background: 'linear-gradient(180deg, var(--white) 0%, var(--cream) 100%)',
      borderBottom: '1px solid var(--cream-deep)',
      padding: '40px 24px 32px', position: 'relative', overflow: 'hidden'
    },
    maxW: { maxWidth: '1280px', margin: '0 auto', padding: '0 24px' },
    section: { maxWidth: '1280px', margin: '0 auto', padding: '48px 24px' },
    label: {
      fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase',
      letterSpacing: '0.12em', color: 'var(--gold-dark)',
      fontFamily: 'var(--font-mono)', marginBottom: '4px', display: 'block'
    },
    sectionTitle: {
      fontFamily: 'var(--font-display)', fontSize: '2rem',
      fontWeight: 800, color: 'var(--brown)', lineHeight: 1.2
    }
  };

  return (
    <div style={S.page}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: '80px', right: '24px', zIndex: 9999,
          background: 'var(--brown)', color: 'var(--cream)',
          padding: '12px 20px', borderRadius: 'var(--r-md)',
          boxShadow: 'var(--shadow-lg)', fontSize: '0.82rem', fontWeight: 600,
          borderLeft: '4px solid var(--gold)'
        }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <HeaderTag
        onOpenSearchModal={() => setShowSearch(true)}
        onOpenCart={() => setShowCart(true)}
        onOpenGuide={() => setShowGuide(true)}
        onOpenBulkModal={() => setShowBulk(true)}
        onOpenAdmin={() => setShowAdmin(true)}
        cartCount={cartItems.length}
      />

      {/* ── Hero ───────────────────────────── */}
      <section style={S.hero}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <span style={S.label}>Custom Apparel · Premium Quality · Express Delivery</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: 800, color: 'var(--brown)', lineHeight: 1.15, maxWidth: '700px', marginBottom: '16px' }}>
            Your Design.<br />
            <span className="text-gold-shimmer">Beautifully Printed.</span>
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--brown-mid)', maxWidth: '520px', marginBottom: '12px', lineHeight: 1.7 }}>
            240 GSM bio-washed cotton, 3D live proofing, and zero-crack screen prints — delivered to your door in 48 hours.
          </p>

          {/* Trust badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', marginBottom: '8px' }}>
            {[
              { icon: '🏅', text: '240 GSM Cotton' },
              { icon: '⚡', text: '48-Hr Dispatch' },
              { icon: '🎨', text: '3D Preview' },
              { icon: '✅', text: 'Zero-Crack Print' },
            ].map(b => (
              <div key={b.text} style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '6px 14px', background: 'var(--white)',
                borderRadius: 'var(--r-full)', border: '1px solid var(--cream-deep)',
                fontSize: '0.78rem', fontWeight: 600, color: 'var(--brown-mid)',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <span>{b.icon}</span>
                <span>{b.text}</span>
              </div>
            ))}
          </div>

          <HangTagCTA onClick={() => document.getElementById('studio')?.scrollIntoView({ behavior: 'smooth' })} />
        </div>
      </section>

      {/* ── Trust Strip ─────────────────────── */}
      <div style={{ background: 'var(--brown)', padding: '12px 0', overflow: 'hidden' }}>
        <div className="marquee-track" style={{ display: 'flex', gap: '48px', whiteSpace: 'nowrap' }}>
          {[...Array(2)].map((_, i) => (
            <React.Fragment key={i}>
              {['240 GSM COTTON', '48-HOUR DISPATCH', 'ZERO-CRACK DTF PRINTS', '300 DPI PRINT FILES', 'BIO-WASHED FABRIC', 'WHATSAPP TRACKING', 'FREE SHIPPING > ₹999', 'CASH ON DELIVERY'].map(t => (
                <span key={t} style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
                  letterSpacing: '0.14em', color: 'var(--cream-deep)',
                  display: 'inline-flex', alignItems: 'center', gap: '16px'
                }}>
                  {t} <span style={{ color: 'var(--gold)' }}>★</span>
                </span>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── 3D Design Studio ───────────────── */}
      <section id="studio" style={{ ...S.section }}>
        <div style={{ marginBottom: '32px' }}>
          <span style={S.label}>3D Design Studio</span>
          <h2 style={{ ...S.sectionTitle, marginBottom: '8px' }}>Customise Your Tee in Real-Time 3D</h2>
          <p style={{ color: 'var(--brown-light)', fontSize: '0.875rem' }}>
            Rotate 360°, inspect your garment, and place graphics live.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>

          {/* LEFT — 3D Viewer (Full Size) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="card" style={{ overflow: 'hidden' }}>
              <div style={{
                padding: '14px 20px', background: 'var(--white)',
                borderBottom: '1px solid var(--cream-deep)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <div>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--brown)' }}>3D Garment Preview</span>
                  <div style={{ fontSize: '0.68rem', color: 'var(--brown-light)', fontFamily: 'var(--font-mono)' }}>Live studio · drag to rotate freely</div>
                </div>
                <span className="badge-gold">Live 3D</span>
              </div>
              <Tshirt3DCanvas
                shirtColor={shirtColor}
                decals={decals}
                cameraTargetAngle={cameraAngle}
                snapVersion={snapVersion}
                garmentType={garmentType}
                activeDecalId={activeDecalId}
                onUpdateDecalXY={(id, x, y) => handleUpdateDecal(id, { x, y })}
                onAddTexture={handleImport}
              />
              <div style={{ padding: '12px 16px', borderTop: '1px solid var(--cream-deep)' }}>
                <CameraShortcuts
                  currentAngle={cameraAngle}
                  onSelectAngle={a => {
                    setCameraAngle(a);
                    setSnapVersion(v => v + 1);
                    if (a === 'front' || a === 'back') setActiveSide(a);
                  }}
                />
              </div>
            </div>
          </div>

          {/* RIGHT — Controls Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Garment Type Selector */}
            <GarmentSelector
              selected={garmentType}
              onSelect={id => {
                setGarmentType(id);
                if (GARMENT_DEFAULT_COLORS[id]) setShirtColor(GARMENT_DEFAULT_COLORS[id]);
              }}
            />

            {/* Colour & Size */}
            <ColorSizePicker
              selectedColor={shirtColor} onSelectColor={setShirtColor}
              selectedSize={selectedSize} onSelectSize={setSelectedSize}
              onOpenSizeGuide={() => setShowSize(true)}
            />

            {/* Layer Inspector */}
            <DecalControls
              decals={decals} activeDecalId={activeDecalId}
              setActiveDecalId={setActiveDecalId}
              onUpdateDecal={handleUpdateDecal}
              onRemoveDecal={handleRemoveDecal}
              onOpenSearchModal={() => setShowSearch(true)}
            />

            {/* Price & Buy Sticky Panel */}
            <div className="card" style={{ padding: '20px', border: '1.5px solid var(--gold)', boxShadow: 'var(--shadow-gold)' }}>
              <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--cream-deep)' }}>
                <span style={S.label}>Live Price Estimate</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                  <span className="price-tag" style={{ fontSize: '2rem' }}>₹{price}</span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--brown-light)', textDecoration: 'line-through' }}>₹{mrp}</span>
                  <span className="badge-gold" style={{ fontSize: '0.65rem' }}>SAVE 31%</span>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--brown-light)', marginTop: '4px' }}>
                  Includes 240 GSM tee + print on {sides} side{sides > 1 ? 's' : ''} + GST
                </div>
              </div>

              {/* CTAs */}
              <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                <button
                  className="btn-gold"
                  onClick={handleAddToCart}
                  style={{ flex: 1, justifyContent: 'center', padding: '13px', fontSize: '0.85rem' }}
                >
                  <ShoppingBag size={16} /> Add to Cart
                </button>
                <button
                  className="btn-brown"
                  onClick={() => setShowCheckout(true)}
                  style={{ flex: 1, justifyContent: 'center', padding: '13px', fontSize: '0.85rem' }}
                >
                  <Zap size={16} /> Buy Now
                </button>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={handleSaveDesign}
                  className="btn-ghost"
                  style={{ flex: 1, justifyContent: 'center', fontSize: '0.75rem', padding: '8px' }}
                >
                  <Heart size={13} /> Save Design
                </button>
              </div>

              <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--cream-deep)', display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--brown-light)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Truck size={12} color="var(--gold-dark)" /> Free delivery &gt; ₹999</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><ShieldCheck size={12} color="var(--gold-dark)" /> 7-day easy returns</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Fabric & Features ──────────────── */}
      <section style={{ background: 'var(--white)', borderTop: '1px solid var(--cream-deep)', borderBottom: '1px solid var(--cream-deep)' }}>
        <div style={{ ...S.section }}>
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 40px' }}>
            <span style={S.label}>Why Prishirt</span>
            <h2 style={S.sectionTitle}>Crafted Like Luxury Streetwear</h2>
            <p style={{ color: 'var(--brown-light)', fontSize: '0.875rem', marginTop: '8px' }}>
              We obsess over fabric, fit, and print quality so your custom tee feels like high-end retail.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            {[
              { icon: '🧵', title: '240 GSM Combed Cotton', desc: 'Dense, substantial fabric with a structured drape that holds its shape wash after wash.' },
              { icon: '🌿', title: 'Bio-Washed & Pre-Shrunk', desc: 'Treated with natural enzymes for an ultra-soft hand feel with under 2% residual shrinkage.' },
              { icon: '🖨️', title: 'High-Density Screen Print', desc: 'Premium plastisol & DTF inks cured at 160°C for vibrant colors that never crack or fade.' },
              { icon: '⚡', title: '48-Hour Dispatch', desc: 'Direct-to-garment digital workflow enables same-week dispatch on every custom order.' },
            ].map(f => (
              <div key={f.title} className="card" style={{ padding: '24px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: '2.2rem', marginBottom: '14px' }}>{f.icon}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: 'var(--brown)', marginBottom: '8px' }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--brown-light)', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it Works ───────────────────── */}
      <section style={{ ...S.section }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span style={S.label}>Simple 3-Step Flow</span>
            <h2 style={S.sectionTitle}>From Screen to Doorstep in 48 Hours</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {[
              { step: '01', icon: '🎨', title: 'Design in 3D', desc: 'Upload your artwork or pick licensed graphics. Place, resize, and rotate on any side of the tee — the 3D preview updates live.' },
              { step: '02', icon: '✅', title: 'Confirm & Pay', desc: 'Verify your phone via WhatsApp OTP. Review pricing, enter your delivery address, and pay securely via UPI, Card, or Cash on Delivery.' },
              { step: '03', icon: '📦', title: 'We Print & Ship', desc: 'Your 300 DPI print file goes straight to our press. Your order ships within 48 hours and you get WhatsApp updates at every step.' },
            ].map(s => (
              <div key={s.step} className="card" style={{ padding: '28px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{s.icon}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--gold-dark)', fontWeight: 700, letterSpacing: '0.12em', marginBottom: '6px' }}>
                  STEP {s.step}
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700, color: 'var(--brown)', marginBottom: '10px' }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--brown-light)', lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Reviews ─────────────────────────── */}
      <ReviewsSection onShowToast={showToast} />

      {/* ── Bulk Orders CTA ─────────────────── */}
      <section style={{ background: 'var(--brown)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ ...S.section, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>
          <div>
            <span style={{ ...S.label, color: 'var(--gold)' }}>Colleges · Corporates · Events</span>
            <h2 style={{ ...S.sectionTitle, color: 'var(--cream)' }}>Bulk & Corporate Orders</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--brown-faint)', marginTop: '6px' }}>
              50+ tees? Get tiered pricing from ₹299/unit with custom sizing across styles.
            </p>
          </div>
          <button className="btn-gold" onClick={() => setShowBulk(true)} style={{ padding: '14px 32px', fontSize: '0.88rem', flexShrink: 0 }}>
            Get Bulk Quote <ChevronRight size={16} />
          </button>
        </div>
      </section>

      {/* ── Modals ─────────────────────────── */}
      <ImageSearchModal isOpen={showSearch} onClose={() => setShowSearch(false)} onImportImage={handleImport} />

      <AuthOtpModal
        isOpen={showAuth} onClose={() => setShowAuth(false)}
        designSummary={{ size: selectedSize, price }}
        onConfirmOrder={phone => { setUserPhone(phone); setIsAuthed(true); showToast('Phone verified ✓'); setShowCheckout(true); }}
      />

      <CheckoutModal
        isOpen={showCheckout} onClose={() => setShowCheckout(false)}
        cartItems={cartItems.length > 0 ? cartItems : [{ id: 'c0', price, quantity: 1, colorHex: shirtColor, size: selectedSize }]}
        decals={decals} shirtColor={shirtColor} selectedSize={selectedSize} userPhone={userPhone}
        onOrderComplete={newOrder => {
          setOrders(p => [newOrder, ...p]);
          setCartItems([]);
          showToast(`Order ${newOrder.id} placed! WhatsApp notification sent.`);
        }}
      />

      <CartDrawer
        isOpen={showCart} onClose={() => setShowCart(false)}
        cartItems={cartItems}
        onRemoveCartItem={idx => setCartItems(p => p.filter((_, i) => i !== idx))}
        onOpenCheckout={() => setShowCheckout(true)}
      />

      <FounderGuideModal isOpen={showGuide} onClose={() => setShowGuide(false)} />
      <SizeGuideModal    isOpen={showSize}  onClose={() => setShowSize(false)}  />
      <BulkInquiryModal  isOpen={showBulk}  onClose={() => setShowBulk(false)}  onShowToast={showToast} />
      <AdminDashboard
        isOpen={showAdmin} onClose={() => setShowAdmin(false)}
        orders={orders}
        onUpdateOrderStatus={(id, st) => setOrders(p => p.map(o => o.id === id ? { ...o, status: st } : o))}
        onShowToast={showToast}
      />

      {/* Orders Panel */}
      {showOrders && (
        <div className="modal-overlay">
          <div style={{ width: '100%', maxWidth: '480px', background: 'var(--white)', borderRadius: 'var(--r-xl)', padding: '28px', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Package size={20} color="var(--gold-dark)" />
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700, color: 'var(--brown)' }}>Your Orders</span>
              </div>
              <button className="btn-ghost" onClick={() => setShowOrders(false)}>✕</button>
            </div>
            {orders.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--brown-light)', padding: '32px 0', fontSize: '0.85rem' }}>
                No orders yet. Design and order your custom tee!
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '320px', overflowY: 'auto' }}>
                {orders.map(o => (
                  <div key={o.id} style={{ padding: '12px 14px', background: 'var(--cream)', borderRadius: 'var(--r-md)', border: '1px solid var(--cream-deep)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', fontWeight: 700, color: 'var(--brown)' }}>{o.id}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--brown-light)' }}>Size: {o.size} · {o.date}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div className="price-tag" style={{ fontSize: '0.9rem' }}>₹{o.amount}</div>
                      <span className="badge-gold" style={{ fontSize: '0.6rem' }}>{o.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button className="btn-brown" onClick={() => setShowOrders(false)} style={{ width: '100%', justifyContent: 'center', marginTop: '16px' }}>Close</button>
          </div>
        </div>
      )}

      <BottomNavbar
        cartCount={cartItems.length}
        onOpenCart={() => setShowCart(true)}
        onOpenOrders={() => setShowOrders(true)}
        onOpenSavedDesigns={() => showToast(`You have ${savedDesigns.length} saved design(s)`)}
      />
    </div>
  );
}
