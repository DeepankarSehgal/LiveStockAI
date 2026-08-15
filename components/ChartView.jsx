import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { BarChart2, Eye, Activity, RefreshCw } from 'lucide-react';
import { formatINR } from '../data/marketEngine';

export default function ChartView({ candles, livePrice, timeframe, setTimeframe }) {
  const [showVWAP, setShowVWAP] = useState(true);
  const [chartType, setChartType] = useState('AREA'); // AREA or LINE

  const isPositive = candles.length > 1 && candles[candles.length - 1].close >= candles[0].open;
  const strokeColor = isPositive ? '#10B981' : '#EF4444';
  const fillColor = isPositive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)';

  // Calculate Y-axis domain padding
  const minPrice = Math.min(...candles.map((c) => c.low || c.close));
  const maxPrice = Math.max(...candles.map((c) => c.high || c.close));
  const padding = (maxPrice - minPrice) * 0.1 || 5;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#0B0F19]/95 border border-slate-700 p-3 rounded-xl shadow-xl text-xs space-y-1 backdrop-blur-md">
          <div className="font-bold text-slate-300 border-b border-slate-800 pb-1 flex justify-between gap-4">
            <span>Time: {data.time}</span>
            <span className="text-cyan-400">Intraday</span>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 font-mono-numeric pt-1">
            <span className="text-slate-400">Open:</span> <span className="text-slate-100 font-semibold">{formatINR(data.open)}</span>
            <span className="text-slate-400">High:</span> <span className="text-emerald-400 font-semibold">{formatINR(data.high)}</span>
            <span className="text-slate-400">Low:</span> <span className="text-rose-400 font-semibold">{formatINR(data.low)}</span>
            <span className="text-slate-400">Close (LTP):</span> <span className="text-white font-bold">{formatINR(data.close)}</span>
            <span className="text-slate-400">VWAP:</span> <span className="text-amber-400 font-medium">{formatINR(data.vwap)}</span>
            <span className="text-slate-400">Volume:</span> <span className="text-slate-300 font-medium">{data.volume?.toLocaleString()}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#131B2E] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Chart Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <BarChart2 className="w-5 h-5 text-cyan-400" />
          <h2 className="font-bold text-base text-slate-100">Interactive Intraday Chart</h2>
          <span className="text-xs px-2 py-0.5 bg-slate-800 text-slate-400 rounded">Live Ticks</span>
        </div>

        {/* Controls: Timeframes & Toggles */}
        <div className="flex items-center space-x-3">
          {/* Timeframe selector */}
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            {['1m', '5m', '15m', '1D'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 rounded-lg font-bold transition ${
                  timeframe === tf
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* VWAP Overlay Toggle */}
          <button
            onClick={() => setShowVWAP(!showVWAP)}
            className={`px-3 py-1.5 text-xs rounded-xl font-medium border transition flex items-center gap-1.5 ${
              showVWAP
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>VWAP</span>
          </button>
        </div>
      </div>

      {/* Main Chart Container */}
      <div className="h-72 sm:h-80 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={candles} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={strokeColor} stopOpacity={0.4} />
                <stop offset="95%" stopColor={strokeColor} stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
            <XAxis dataKey="time" stroke="#64748B" fontSize={11} tickLine={false} />
            <YAxis
              domain={[Math.floor(minPrice - padding), Math.ceil(maxPrice + padding)]}
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              tickFormatter={(val) => `₹${val.toFixed(0)}`}
              orientation="right"
            />
            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="close"
              stroke={strokeColor}
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#priceGradient)"
            />

            {showVWAP && (
              <Line
                type="monotone"
                dataKey="vwap"
                stroke="#F59E0B"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Legend Footer */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-1 rounded-full" style={{ backgroundColor: strokeColor }}></span>
            <span>Price (LTP)</span>
          </div>
          {showVWAP && (
            <div className="flex items-center space-x-1.5 text-amber-400">
              <span className="w-3 h-0.5 border-b border-dashed border-amber-400"></span>
              <span>VWAP (Volume Weighted Avg)</span>
            </div>
          )}
        </div>
        <span className="hidden sm:inline-block text-slate-500">Real-time live tick stream active</span>
      </div>
    </div>
  );
}
