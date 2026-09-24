import React from 'react';
import { ArrowDown } from 'lucide-react';

export default function HangTagCTA({ onClick }) {
  return (
    <div onClick={onClick}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', marginTop: 12 }}>
      {/* Thread */}
      <div style={{
        width: 2, height: 36,
        background: 'repeating-linear-gradient(180deg,var(--gold) 0,var(--gold) 5px,var(--cream-deep) 5px,var(--cream-deep) 10px)'
      }} />

      {/* Tag */}
      <div
        className="hang-tag fade-up"
        style={{
          width: 280, padding: '28px 24px', textAlign: 'center',
          transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1)'
        }}
        onMouseEnter={e => { e.currentTarget.style.transform='rotate(-2deg) scale(1.04)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform='rotate(0) scale(1)'; }}
      >
        <div className="hang-tag-hole" style={{ margin: '0 auto 16px' }} />

        <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.64rem', fontFamily:'var(--font-mono)', color:'var(--brown-light)', textTransform:'uppercase', letterSpacing:'0.1em', borderBottom:'1px dashed var(--cream-deep)', paddingBottom:10, marginBottom:14 }}>
          <span>Prishirt No.001</span>
          <span>240 GSM Cotton</span>
        </div>

        <div style={{ fontFamily:'var(--font-display)', fontSize:'1.48rem', fontWeight:800, color:'var(--brown)', lineHeight:1.2, marginBottom:6 }}>
          Design Your<br/>
          <span style={{ color:'var(--gold)', fontStyle:'italic' }}>Custom Tee</span>
        </div>

        <p style={{ fontSize:'0.74rem', color:'var(--brown-light)', marginBottom:16 }}>
          Tap to open 3D Design Studio
        </p>

        <div style={{ borderTop:'1px dashed var(--cream-deep)', paddingTop:12, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ textAlign:'left' }}>
            <div style={{ fontSize:'0.58rem', fontFamily:'var(--font-mono)', color:'var(--brown-light)', textTransform:'uppercase' }}>From</div>
            <div className="price-tag" style={{ fontSize:'1.1rem' }}>₹699</div>
          </div>
          <div style={{
            width:36, height:36, background:'linear-gradient(135deg,var(--gold-light),var(--gold-dark))',
            borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow:'var(--shadow-gold)', color:'white'
          }}>
            <ArrowDown size={16} />
          </div>
        </div>
      </div>
    </div>
  );
}
