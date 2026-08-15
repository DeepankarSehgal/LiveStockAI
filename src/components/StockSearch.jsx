import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Sparkles, TrendingUp, Layers, CheckCircle } from 'lucide-react';
import { formatINR } from '../data/marketEngine';

export default function StockSearch({ stocks, selectedStock, onSelectStock }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, FNO, NIFTY50, BANKING
  const dropdownRef = useRef(null);

  // Filter stocks based on search query and category tab
  const filteredStocks = stocks.filter((stk) => {
    const matchQuery =
      stk.symbol.toLowerCase().includes(query.toLowerCase()) ||
      stk.name.toLowerCase().includes(query.toLowerCase()) ||
      stk.sector.toLowerCase().includes(query.toLowerCase());

    if (!matchQuery) return false;

    if (activeTab === 'FNO') return stk.hasFnO;
    if (activeTab === 'BANKING') return stk.sector.toLowerCase().includes('bank');
    if (activeTab === 'IT') return stk.sector.toLowerCase().includes('it');
    return true;
  });

  // Recommended stocks when search query is empty or being typed
  const recommendations = filteredStocks.slice(0, 7);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (stock) => {
    onSelectStock(stock);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Search Box Container */}
      <div className="relative flex items-center">
        <div className="absolute left-4 pointer-events-none flex items-center text-slate-400">
          <Search className="w-5 h-5 text-cyan-400" />
        </div>

        <input
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          placeholder="Search Indian stocks (e.g. RELIANCE, TCS, TATAMOTORS, NIFTY)..."
          className="w-full bg-[#131B2E] text-slate-100 text-sm font-medium pl-11 pr-24 py-3.5 rounded-xl border border-slate-800 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 shadow-inner outline-none transition"
        />

        {query ? (
          <button
            onClick={() => setQuery('')}
            className="absolute right-12 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        ) : null}

        <div className="absolute right-3 flex items-center space-x-1">
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800 border border-slate-700 rounded shadow-sm">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Autocomplete Dropdown & Smart AI Recommendations */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-[#131B2E] border border-slate-700/80 rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl">
          {/* Quick Category Filter Pills */}
          <div className="px-4 pt-3 pb-2 border-b border-slate-800 flex items-center space-x-2 overflow-x-auto no-scrollbar">
            <span className="text-[11px] font-semibold uppercase text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" /> AI Suggestions:
            </span>

            {[
              { id: 'ALL', label: 'All Stocks' },
              { id: 'FNO', label: '⚡ FnO Option Eligible' },
              { id: 'BANKING', label: '🏦 Banking' },
              { id: 'IT', label: '💻 IT Services' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-2.5 py-1 text-xs rounded-lg transition font-medium whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Recommended Stock Results List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
            {recommendations.length > 0 ? (
              recommendations.map((stk) => {
                const isSelected = selectedStock.symbol === stk.symbol;
                return (
                  <div
                    key={stk.symbol}
                    onClick={() => handleSelect(stk)}
                    className={`px-4 py-3 cursor-pointer flex items-center justify-between transition group ${
                      isSelected
                        ? 'bg-cyan-950/40 border-l-4 border-cyan-400'
                        : 'hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-cyan-400 group-hover:scale-105 transition">
                        {stk.symbol.substring(0, 3)}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-sm text-slate-100 group-hover:text-cyan-300 transition">
                            {stk.symbol}
                          </span>
                          <span className="text-[10px] font-semibold px-1.5 py-0.2 bg-slate-800 text-slate-400 border border-slate-700 rounded">
                            {stk.exchange}
                          </span>
                          {stk.hasFnO && (
                            <span className="text-[10px] font-extrabold px-1.5 py-0.2 bg-purple-500/20 text-purple-300 border border-purple-500/40 rounded flex items-center gap-1">
                              ⚡ FnO
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-1">{stk.name} • <span className="text-slate-500">{stk.sector}</span></p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-mono-numeric font-semibold text-sm text-slate-100">
                        {formatINR(stk.basePrice)}
                      </div>
                      <span className="text-[11px] text-emerald-400 font-medium">
                        RSI {stk.rsi}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="px-4 py-8 text-center text-slate-400 text-sm">
                No matching BSE/NSE stocks found for "<span className="text-white">{query}</span>"
              </div>
            )}
          </div>

          <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>Showing top recommendations for NSE & BSE</span>
            <span>Select a stock to run 6 AI Agent Bots</span>
          </div>
        </div>
      )}
    </div>
  );
}
