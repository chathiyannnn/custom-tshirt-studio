import React, { useState } from 'react';
import { Ruler, Check } from 'lucide-react';

export default function SizeGuideModal({ isOpen, onClose }) {
  const [unit, setUnit] = useState('inches'); // 'inches' | 'cm'

  if (!isOpen) return null;

  const measurements = [
    { size: 'S', chest: unit === 'inches' ? '38"' : '96 cm', length: unit === 'inches' ? '27"' : '68 cm', shoulder: unit === 'inches' ? '17"' : '43 cm' },
    { size: 'M', chest: unit === 'inches' ? '40"' : '101 cm', length: unit === 'inches' ? '28"' : '71 cm', shoulder: unit === 'inches' ? '18"' : '45 cm' },
    { size: 'L', chest: unit === 'inches' ? '42"' : '106 cm', length: unit === 'inches' ? '29"' : '73 cm', shoulder: unit === 'inches' ? '19"' : '48 cm' },
    { size: 'XL', chest: unit === 'inches' ? '44"' : '111 cm', length: unit === 'inches' ? '30"' : '76 cm', shoulder: unit === 'inches' ? '20"' : '50 cm' },
    { size: '2XL', chest: unit === 'inches' ? '46"' : '116 cm', length: unit === 'inches' ? '31"' : '78 cm', shoulder: unit === 'inches' ? '21"' : '53 cm' }
  ];

  return (
    <div className="modal-overlay">
      <div className="panel-dark w-full max-w-lg p-6 space-y-4 border border-white/10 text-slate-100 shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Ruler className="text-amber-400" size={20} />
            <h3 className="text-lg font-display uppercase tracking-wide text-white">Heavyweight Oversized Fit Guide</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white font-mono font-bold text-lg">✕</button>
        </div>

        {/* Measurement Diagram Visual */}
        <div className="panel-sub p-4 rounded-xl flex items-center justify-around border border-amber-500/20">
          <div className="w-32 h-36 bg-slate-900 border border-amber-500/40 rounded-xl relative flex flex-col items-center justify-center text-[10px] font-mono text-amber-300 select-none">
            <div className="w-full text-center border-b border-amber-500/30 pb-1">
              Shoulder (A)
            </div>
            <div className="my-auto font-bold text-white text-xs">
              Chest Width (B)
            </div>
            <div className="w-full text-center border-t border-amber-500/30 pt-1">
              Garment Length (C)
            </div>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <span className="text-amber-400 font-bold block">fit details:</span>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              • 240 GSM pre-shrunk combed cotton.<br />
              • Relaxed streetwear drop-shoulder cut.<br />
              • Order your true size for oversized feel, or one size down for slim fit.
            </p>
          </div>
        </div>

        {/* Unit Toggle */}
        <div className="flex justify-end gap-2 text-xs font-mono">
          <button
            onClick={() => setUnit('inches')}
            className={`px-3 py-1 rounded-lg border ${unit === 'inches' ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400 border-white/10'}`}
          >
            INCHES
          </button>
          <button
            onClick={() => setUnit('cm')}
            className={`px-3 py-1 rounded-lg border ${unit === 'cm' ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400 border-white/10'}`}
          >
            CM
          </button>
        </div>

        {/* Measurement Table */}
        <table className="w-full text-xs font-mono text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-amber-400">
              <th className="py-2">SIZE</th>
              <th className="py-2">CHEST (B)</th>
              <th className="py-2">LENGTH (C)</th>
              <th className="py-2">SHOULDER (A)</th>
            </tr>
          </thead>
          <tbody>
            {measurements.map((m) => (
              <tr key={m.size} className="border-b border-white/5 hover:bg-slate-900/60 transition-colors">
                <td className="py-2 font-bold text-white">{m.size}</td>
                <td className="py-2 text-slate-300">{m.chest}</td>
                <td className="py-2 text-slate-300">{m.length}</td>
                <td className="py-2 text-slate-300">{m.shoulder}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <button onClick={onClose} className="btn-cobalt w-full justify-center py-2.5 text-xs font-mono">
          <Check size={14} /> Got It, Back to Studio
        </button>
      </div>
    </div>
  );
}
