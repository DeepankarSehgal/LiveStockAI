import React from 'react';
import { Zap, ShieldAlert, TrendingUp, DollarSign, Layers, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { formatINR } from '../data/marketEngine';

export default function FnOOptionCard({ fnoData, stock, onTrackOptionTrade }) {
  if (!fnoData || !fnoData.hasFnO) {
    return (
      <div className="bg-[#131B2E] border border-slate-800 rounded-2xl p-5 shadow-xl text-center space-y-2">
        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
          <Zap className="w-5 h-5" />
        </div>
        <h3 className="font-bold text-slate-200">No FnO Option Contracts Available</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          {stock.symbol} is traded in the cash segment only. For option strategies, select a stock like RELIANCE, TCS, HDFCBANK, TATAMOTORS, or NIFTY.
        </p>
      </div>
    );
  }

  const isCall = fnoData.recommendedType === 'CALL';

  return (
    <div className="bg-[#131B2E] border border-purple-500/30 rounded-2xl p-5 shadow-xl relative overflow-hidden space-y-4">
      {/* Background Accent Gradient */}
      <div className={`absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl opacity-15 pointer-events-none ${isCall ? 'bg-emerald-500' : 'bg-rose-500'}`} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-xl p-0.5 shadow-lg flex items-center justify-center font-black text-xs ${
            isCall ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400' : 'bg-rose-500/20 border border-rose-500/40 text-rose-400'
          }`}>
            {isCall ? 'CALL' : 'PUT'}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-extrabold text-lg text-white">FnO Options Trade Recommendation</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded">
                NSE Derivatives
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Optimal strike selection based on PCR ({fnoData.pcrRatio}) & IV ({fnoData.impliedVolatility})
            </p>
          </div>
        </div>

        {/* Recommended Option Badge */}
        <div className="bg-slate-900 border border-purple-500/30 px-3.5 py-1.5 rounded-xl flex items-center space-x-2">
          <Zap className="w-4 h-4 text-purple-400" />
          <span className="font-extrabold text-sm text-purple-200">{fnoData.recommendedOptionName}</span>
        </div>
      </div>

      {/* Entry, Target & SL Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-1">Option Premium Entry</span>
          <span className="font-mono-numeric font-extrabold text-base text-cyan-400">
            {formatINR(fnoData.entryPoint)}
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">Recommended Buy Range</span>
        </div>

        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-1">Option Target 1</span>
          <span className="font-mono-numeric font-extrabold text-base text-emerald-400">
            {formatINR(fnoData.target1)}
          </span>
          <span className="text-[10px] text-emerald-400/80 block mt-0.5">+45% Profit Potential</span>
        </div>

        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-1">Option Target 2</span>
          <span className="font-mono-numeric font-extrabold text-base text-emerald-300">
            {formatINR(fnoData.target2)}
          </span>
          <span className="text-[10px] text-emerald-300/80 block mt-0.5">+85% Target extended</span>
        </div>

        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-1">Option Stop Loss</span>
          <span className="font-mono-numeric font-extrabold text-base text-rose-400">
            {formatINR(fnoData.stopLoss)}
          </span>
          <span className="text-[10px] text-rose-400/80 block mt-0.5">-30% Risk Cap</span>
        </div>
      </div>

      {/* Lot Size & Risk-Profit Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between">
          <span className="text-slate-400">Contract Lot Size:</span>
          <span className="font-bold text-slate-200 font-mono-numeric">{fnoData.lotSize} shares / lot</span>
        </div>

        <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between">
          <span className="text-slate-400">Est. Profit / Lot:</span>
          <span className="font-bold text-emerald-400 font-mono-numeric">+{formatINR(fnoData.maxProfitPerLot)}</span>
        </div>

        <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between">
          <span className="text-slate-400">Max Risk / Lot:</span>
          <span className="font-bold text-rose-400 font-mono-numeric">-{formatINR(fnoData.maxRiskPerLot)}</span>
        </div>
      </div>

      {/* Option Greeks */}
      <div className="bg-slate-950/90 p-3 rounded-xl border border-slate-800 text-[11px] grid grid-cols-4 gap-2 text-center">
        <div>
          <span className="text-slate-500 block">Delta (Δ)</span>
          <span className="font-mono-numeric font-bold text-slate-200">{fnoData.delta}</span>
        </div>
        <div>
          <span className="text-slate-500 block">Theta (Θ)</span>
          <span className="font-mono-numeric font-bold text-rose-400">{fnoData.theta}/day</span>
        </div>
        <div>
          <span className="text-slate-500 block">Implied Vol (IV)</span>
          <span className="font-mono-numeric font-bold text-amber-400">{fnoData.impliedVolatility}</span>
        </div>
        <div>
          <span className="text-slate-500 block">Put-Call Ratio</span>
          <span className="font-mono-numeric font-bold text-cyan-400">{fnoData.pcrRatio}</span>
        </div>
      </div>

      {/* Action button to track option in chatbot */}
      <div className="pt-2 flex justify-end">
        <button
          onClick={() =>
            onTrackOptionTrade(
              fnoData.recommendedOptionName,
              fnoData.recommendedPremium,
              fnoData.recommendedType,
              fnoData.recommendedStrike
            )
          }
          className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs shadow-lg transition flex items-center justify-center space-x-2"
        >
          <Zap className="w-4 h-4 fill-white" />
          <span>Track {fnoData.recommendedOptionName} in AI Chatbot</span>
        </button>
      </div>
    </div>
  );
}
