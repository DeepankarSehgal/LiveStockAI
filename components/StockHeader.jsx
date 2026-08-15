import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Zap, BarChart2, DollarSign, Layers } from 'lucide-react';
import { formatINR } from '../data/marketEngine';

export default function StockHeader({ stock, livePrice, priceFlash }) {
  const isPositive = livePrice >= stock.basePrice;
  const priceDiff = livePrice - stock.basePrice;
  const pDiff = (priceDiff / stock.basePrice) * 100;

  // Range calculation
  const dayLow = Math.min(stock.dayLow, livePrice);
  const dayHigh = Math.max(stock.dayHigh, livePrice);
  const rangePercent = Math.min(
    Math.max(((livePrice - dayLow) / (dayHigh - dayLow || 1)) * 100, 0),
    100
  );

  return (
    <div className="bg-[#131B2E] border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none ${isPositive ? 'bg-emerald-500' : 'bg-rose-500'}`} />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        {/* Left Info Column */}
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {stock.symbol}
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700 rounded-md">
              {stock.exchange}
            </span>
            {stock.hasFnO && (
              <span className="px-2.5 py-0.5 text-xs font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/40 rounded-md flex items-center gap-1">
                <Zap className="w-3 h-3 text-purple-400 fill-purple-400" />
                FnO Option Eligible
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-400">
            <span className="font-semibold text-slate-300">{stock.name}</span>
            <span>•</span>
            <span className="text-cyan-400 font-medium">{stock.sector}</span>
            <span>•</span>
            <span>Lot Size: <strong className="text-slate-200">{stock.lotSize || "N/A"}</strong></span>
          </div>
        </div>

        {/* Live LTP & Price Flash Widget */}
        <div className="flex flex-wrap items-end gap-6">
          <div className="space-y-1">
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Live Price (LTP)
            </div>
            
            <div className="flex items-baseline space-x-3">
              <span
                className={`text-3xl sm:text-4xl font-extrabold font-mono-numeric transition-colors duration-300 ${
                  priceFlash === 'up'
                    ? 'text-emerald-400 bg-emerald-950/40 px-2 rounded'
                    : priceFlash === 'down'
                    ? 'text-rose-400 bg-rose-950/40 px-2 rounded'
                    : 'text-white'
                }`}
              >
                {formatINR(livePrice)}
              </span>

              <div
                className={`flex items-center space-x-1 text-sm sm:text-base font-bold font-mono-numeric px-2.5 py-1 rounded-lg border ${
                  isPositive
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                }`}
              >
                {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span>
                  {isPositive ? '+' : ''}
                  {priceDiff.toFixed(2)} ({isPositive ? '+' : ''}
                  {pDiff.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="hidden sm:grid grid-cols-2 gap-4 border-l border-slate-800 pl-6 text-xs">
            <div>
              <span className="text-slate-400 block">VWAP</span>
              <span className="font-mono-numeric font-bold text-slate-200">{formatINR(stock.vwap)}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Volume</span>
              <span className="font-mono-numeric font-bold text-slate-200">{stock.volume}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Day High</span>
              <span className="font-mono-numeric font-semibold text-emerald-400">{formatINR(dayHigh)}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Day Low</span>
              <span className="font-mono-numeric font-semibold text-rose-400">{formatINR(dayLow)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Intraday Day High/Low Slider Bar */}
      <div className="mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div>
          <div className="flex justify-between text-slate-400 mb-1">
            <span>Day Low: <strong className="text-slate-200">{formatINR(dayLow)}</strong></span>
            <span>Intraday Range</span>
            <span>Day High: <strong className="text-slate-200">{formatINR(dayHigh)}</strong></span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-rose-500 via-yellow-500 to-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${rangePercent}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-slate-400 mb-1">
            <span>52W Low: <strong className="text-slate-200">{formatINR(stock.fiftyTwoWeekLow)}</strong></span>
            <span>52-Week Range</span>
            <span>52W High: <strong className="text-slate-200">{formatINR(stock.fiftyTwoWeekHigh)}</strong></span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden relative">
            <div
              className="h-full bg-cyan-500 rounded-full"
              style={{
                width: `${Math.min(
                  Math.max(
                    ((livePrice - stock.fiftyTwoWeekLow) /
                      (stock.fiftyTwoWeekHigh - stock.fiftyTwoWeekLow)) *
                      100,
                    5
                  ),
                  100
                )}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
