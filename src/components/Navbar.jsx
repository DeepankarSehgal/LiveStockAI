import React from 'react';
import { TrendingUp, ShieldCheck, Cpu, Rocket, Activity, Zap } from 'lucide-react';
import { formatINR } from '../data/marketEngine';

export default function Navbar({ indices, onOpenRenderGuide }) {
  return (
    <header className="sticky top-0 z-40 bg-[#0B0F19]/90 backdrop-blur-md border-b border-slate-800">
      {/* Upper Brand & Top Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-blue-500/20">
            <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center">
              <Zap className="w-5 h-5 text-cyan-400 fill-cyan-400/20" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                TradeNexus<span className="text-cyan-400">.AI</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                BSE & NSE LIVE
              </span>
            </div>
            <p className="text-xs text-slate-400">6 Multi-AI Bots & Live FnO Trade Tracker</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenRenderGuide}
            className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition text-xs font-medium"
          >
            <Rocket className="w-4 h-4 text-indigo-400" />
            <span>Host on Render</span>
          </button>
          
          <div className="hidden md:flex items-center space-x-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800 text-xs text-slate-300">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>6 AI Bots Operational</span>
          </div>
        </div>
      </div>

      {/* Live Market Indices Ticker Bar */}
      <div className="bg-[#080B12] border-t border-slate-800/80 overflow-x-auto py-2 px-4 no-scrollbar">
        <div className="max-w-7xl mx-auto flex items-center justify-between space-x-6 min-w-max text-xs">
          <div className="flex items-center space-x-1.5 text-slate-400 uppercase tracking-wider font-semibold text-[11px] pr-2 border-r border-slate-800">
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Market Indices</span>
          </div>

          {indices.map((idx) => {
            const isPos = idx.change >= 0;
            return (
              <div key={idx.symbol} className="flex items-center space-x-2 bg-slate-900/40 px-3 py-1 rounded border border-slate-800/60">
                <span className="font-semibold text-slate-200">{idx.symbol}</span>
                <span className="font-mono-numeric font-medium text-slate-100">{formatINR(idx.basePrice)}</span>
                <span className={`font-mono-numeric font-semibold flex items-center ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isPos ? '+' : ''}{idx.change.toFixed(2)} ({isPos ? '+' : ''}{idx.pChange.toFixed(2)}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </header>
  );
}
