import React from 'react';
import { TrendingUp, TrendingDown, Zap, ChevronRight } from 'lucide-react';
import { formatINR } from '../data/marketEngine';

export default function MarketOverviewCards({ stocks, onSelectStock }) {
  // Sort gainers & losers based on RSI / price performance
  const sorted = [...stocks].sort((a, b) => b.rsi - a.rsi);
  const topGainers = sorted.slice(0, 4);
  const topLosers = [...stocks].sort((a, b) => a.rsi - b.rsi).slice(0, 4);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Top Gainers Card */}
      <div className="bg-[#131B2E] border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>NSE/BSE Top Gainers Today</span>
          </div>
          <span className="text-[10px] text-slate-500">Live Trend</span>
        </div>

        <div className="divide-y divide-slate-800/60 text-xs">
          {topGainers.map((stk) => (
            <div
              key={stk.symbol}
              onClick={() => onSelectStock(stk)}
              className="py-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-800/40 px-2 rounded-lg transition"
            >
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-100">{stk.symbol}</span>
                  {stk.hasFnO && (
                    <span className="text-[9px] px-1 bg-purple-500/20 text-purple-300 rounded">
                      FnO
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-400">{stk.sector}</span>
              </div>

              <div className="text-right">
                <span className="font-mono-numeric font-bold text-slate-100 block">
                  {formatINR(stk.basePrice)}
                </span>
                <span className="text-[10px] font-bold text-emerald-400">
                  RSI {stk.rsi} (Bullish)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Losers / Value Picks Card */}
      <div className="bg-[#131B2E] border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center space-x-2 text-rose-400 font-bold text-sm">
            <TrendingDown className="w-4 h-4" />
            <span>Value Dip / Rebound Watchlist</span>
          </div>
          <span className="text-[10px] text-slate-500">Live Trend</span>
        </div>

        <div className="divide-y divide-slate-800/60 text-xs">
          {topLosers.map((stk) => (
            <div
              key={stk.symbol}
              onClick={() => onSelectStock(stk)}
              className="py-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-800/40 px-2 rounded-lg transition"
            >
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-100">{stk.symbol}</span>
                  {stk.hasFnO && (
                    <span className="text-[9px] px-1 bg-purple-500/20 text-purple-300 rounded">
                      FnO
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-400">{stk.sector}</span>
              </div>

              <div className="text-right">
                <span className="font-mono-numeric font-bold text-slate-100 block">
                  {formatINR(stk.basePrice)}
                </span>
                <span className="text-[10px] font-bold text-rose-400">
                  RSI {stk.rsi} (Support zone)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
