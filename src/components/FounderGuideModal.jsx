import React from 'react';
import { BookOpen, Code, Server, Globe, Rocket, HelpCircle, CheckCircle, Sparkles, X } from 'lucide-react';

export default function FounderGuideModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="w-full max-w-3xl max-h-[88vh] glass-panel-glow flex flex-col overflow-hidden rounded-2xl border border-purple-500/30">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30">
              <BookOpen size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-heading">Founder's Beginner Masterclass</h2>
              <p className="text-xs text-slate-400">Everything you need to know about coding, running & launching PRISHIRT!</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg">
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-300 text-sm">
          {/* Section 1: Frontend */}
          <div className="p-5 rounded-xl glass-panel border-l-4 border-purple-500 space-y-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2 font-heading">
              <Code size={18} className="text-purple-400" />
              1. What is Frontend Coding?
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              **Frontend** is the client visual side of your website. It is what your customers interact with on their phone or laptop.
            </p>
            <ul className="text-xs space-y-1 list-disc pl-4 text-slate-400">
              <li><strong>HTML (Structure):</strong> Defines headings, text, buttons, and images.</li>
              <li><strong>CSS (Styling):</strong> Gives your website dark luxury themes, glassmorphism, colors, and smooth animations.</li>
              <li><strong>JavaScript / React (Logic):</strong> Powers the interactive 3D T-shirt model, color picking, and Google image search!</li>
            </ul>
          </div>

          {/* Section 2: Backend & WhatsApp */}
          <div className="p-5 rounded-xl glass-panel border-l-4 border-cyan-500 space-y-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2 font-heading">
              <Server size={18} className="text-cyan-400" />
              2. What is Backend & How Do Orders Work?
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              **Backend** is the server that processes payments, database storage, and order emails.
            </p>
            <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-200">
              💡 <strong>Smart Business Strategy:</strong> As a new custom printing founder, database servers can be expensive. Instead, PRISHIRT compiles customer designs, sizes, colors, and phone numbers directly into an <strong>Instant WhatsApp Order Chat</strong>. You get orders straight to your mobile phone with ZERO server cost!
            </div>
          </div>

          {/* Section 3: Launching Online for Free */}
          <div className="p-5 rounded-xl glass-panel border-l-4 border-emerald-500 space-y-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2 font-heading">
              <Globe size={18} className="text-emerald-400" />
              3. How to Launch PRISHIRT Live Online (3 Simple Steps)
            </h3>
            <ol className="text-xs space-y-2 list-decimal pl-4 text-slate-300">
              <li><strong>Upload Code to GitHub:</strong> Save this project repository online for free.</li>
              <li><strong>Deploy on Vercel or Netlify:</strong> Connect your GitHub repo to <span className="text-emerald-400 font-bold">Vercel.com</span> (takes 1 click, 100% free hosting).</li>
              <li><strong>Connect Your Custom Domain:</strong> Buy a domain like <code>www.prishirt.com</code> on GoDaddy/Namecheap and link it to Vercel!</li>
            </ol>
          </div>

          {/* Section 4: Business Profit & Marketing Strategy */}
          <div className="p-5 rounded-xl glass-panel border-l-4 border-pink-500 space-y-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2 font-heading">
              <Rocket size={18} className="text-pink-400" />
              4. PRISHIRT Business Growth & High Profit Strategy
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
              <div className="p-3 rounded-lg bg-slate-900 border border-white/10">
                <span className="font-bold text-pink-400 block mb-1">💰 Profit Margin Example</span>
                <span>Blank T-shirt: ₹180<br/>Print cost: ₹70<br/>Selling price: ₹799<br/><strong className="text-emerald-400">Profit per shirt: ₹549!</strong></span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-white/10">
                <span className="font-bold text-cyan-400 block mb-1">📱 Viral Marketing Tip</span>
                <span>Screen record your 3D customizer while creating trending anime/cyberpunk shirts and post as Instagram Reels & TikToks!</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-slate-900/80 flex justify-end">
          <button onClick={onClose} className="btn-primary">
            Got It, Let's Build PRISHIRT!
          </button>
        </div>
      </div>
    </div>
  );
}
