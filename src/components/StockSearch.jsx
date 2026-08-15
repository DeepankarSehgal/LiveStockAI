import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Sparkles, TrendingUp, PlusCircle, CheckCircle } from 'lucide-react';
import { formatINR } from '../data/marketEngine';

export default function StockSearch({ stocks, selectedStock, onSelectStock }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, FNO, BANKING, IT
  const dropdownRef = useRef(null);

  // Normalize query for flexible matching (e.g. "bank of baroda" -> matches "bankbaroda" / "bank of baroda")
  const cleanQuery = query.toLowerCase().replace(/\s+/g, '');

  const filteredStocks = stocks.filter((stk) => {
    const cleanSym = stk.symbol.toLowerCase().replace(/\s+/g, '');
    const cleanName = stk.name.toLowerCase().replace(/\s+/g, '');
    const cleanSector = stk.sector.toLowerCase().replace(/\s+/g, '');

    const matchQuery =
      cleanSym.includes(cleanQuery) ||
      cleanName.includes(cleanQuery) ||
      cleanSector.includes(cleanQuery);

    if (!matchQuery) return false;

    if (activeTab === 'FNO') return stk.hasFnO;
    if (activeTab === 'BANKING') return stk.sector.toLowerCase().includes('bank');
    if (activeTab === 'IT') return stk.sector.toLowerCase().includes('it');
    return true;
  });

  const recommendations = filteredStocks.slice(0, 10);

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

  // Allow dynamic lookup of any custom NSE stock typed by user (e.g. INDOMIM, BANKBARODA, BANKINDIA)
  const handleCustomStockFetch = () => {
    if (!query.trim()) return;
    const cleanSymbol = query.trim().toUpperCase().replace(/\s+/g, '');
    const customStock = {
      symbol: cleanSymbol,
      yahooTicker: `${cleanSymbol}.NS`,
      name: `${query.trim().toUpperCase()} (NSE/BSE Listed)`,
      exchange: "NSE & BSE",
      sector: "Equity Stock",
      basePrice: 150.00,
      hasFnO: true,
      lotSize: 1000,
      dayHigh: 155.00,
      dayLow: 148.00,
      fiftyTwoWeekHigh: 200.00,
      fiftyTwoWeekLow: 100.00,
      volume: "5.0M",
      pe: 22.0,
      marketCap: "₹10,000 Cr",
      vwap: 149.50,
      rsi: 55.0,
      macd: "Bullish",
      pcr: 1.10,
      description: "Official NSE/BSE listed stock."
    };
    handleSelect(customStock);
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
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              if (recommendations.length > 0) handleSelect(recommendations[0]);
              else handleCustomStockFetch();
            }
          }}
          placeholder="Search ANY stock (e.g. Bank of Baroda, Bank of India, Indo MIM, PNB, Reliance, TCS)..."
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
              <Sparkles className="w-3 h-3 text-cyan-400" /> Suggestions:
            </span>

            {[
              { id: 'ALL', label: 'All Stocks' },
              { id: 'BANKING', label: '🏦 Bank of Baroda / Bank of India' },
              { id: 'FNO', label: '⚡ FnO Segment' },
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
                            {stk.name} ({stk.symbol})
                          </span>
                          <span className="text-[10px] font-semibold px-1.5 py-0.2 bg-slate-800 text-slate-400 border border-slate-700 rounded">
                            {stk.exchange}
                          </span>
                          {stk.hasFnO && (
                            <span className="text-[10px] font-extrabold px-1.5 py-0.2 bg-purple-500/20 text-purple-300 border border-purple-500/40 rounded">
                              ⚡ FnO
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-1">{stk.sector} • Yahoo Ticker: <span className="font-mono-numeric text-cyan-400">{stk.yahooTicker}</span></p>
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
            ) : null}

            {/* Custom Any Stock Search Action */}
            {query.trim() && (
              <div
                onClick={handleCustomStockFetch}
                className="px-4 py-3 bg-cyan-950/30 border-t border-cyan-500/30 cursor-pointer flex items-center justify-between hover:bg-cyan-900/40 transition"
              >
                <div className="flex items-center space-x-3">
                  <PlusCircle className="w-5 h-5 text-cyan-400" />
                  <div>
                    <span className="font-extrabold text-sm text-cyan-300">
                      Fetch Live Yahoo Quotes for "{query.trim().toUpperCase()}"
                    </span>
                    <p className="text-xs text-slate-400">
                      Query NSE/BSE Exchange Ticker: <strong className="text-white">{query.trim().toUpperCase().replace(/\s+/g, '')}.NS</strong>
                    </p>
                  </div>
                </div>

                <span className="px-3 py-1 bg-cyan-500 text-slate-950 font-bold text-xs rounded-lg shadow">
                  Fetch Live
                </span>
              </div>
            )}
          </div>

          <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>Type any stock name to analyze with 6 AI Agent Bots</span>
            <span>Press Enter to select</span>
          </div>
        </div>
      )}
    </div>
  );
}
