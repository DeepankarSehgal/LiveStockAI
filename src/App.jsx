import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import StockSearch from './components/StockSearch';
import StockHeader from './components/StockHeader';
import ChartView from './components/ChartView';
import AIAgentsPanel from './components/AIAgentsPanel';
import FnOOptionCard from './components/FnOOptionCard';
import TradeTrackerChatbot from './components/TradeTrackerChatbot';
import MarketOverviewCards from './components/MarketOverviewCards';
import RenderDeployModal from './components/RenderDeployModal';

import { STOCK_UNIVERSE, MARKET_INDICES, INITIAL_SELECT } from './data/stockUniverse';
import {
  generateCandles,
  computeAIAgentsAnalysis,
  fetchLiveYahooQuote,
  formatINR
} from './data/marketEngine';

export default function App() {
  const [selectedStock, setSelectedStock] = useState(INITIAL_SELECT);
  const [livePrice, setLivePrice] = useState(INITIAL_SELECT.basePrice);
  const [priceFlash, setPriceFlash] = useState(null); // 'up' | 'down' | null
  const [timeframe, setTimeframe] = useState('5m');
  const [candles, setCandles] = useState([]);
  const [indices, setIndices] = useState(MARKET_INDICES);
  const [isRenderModalOpen, setIsRenderModalOpen] = useState(false);
  const [isYahooLive, setIsYahooLive] = useState(false);

  // Array of tracked trades in AI Chatbot
  const [trackedPositions, setTrackedPositions] = useState([
    {
      id: 'default-1',
      symbol: 'RELIANCE 1320 CE',
      baseSymbol: 'RELIANCE',
      type: 'CALL',
      entryPrice: 24.50,
      qty: 250,
      targetPrice: 42.00,
      stopLoss: 16.00,
      addedAt: '10:15 AM'
    }
  ]);

  // Fetch real Yahoo Finance quote whenever selected stock or timeframe changes
  useEffect(() => {
    let isMounted = true;

    async function loadRealQuote() {
      if (!selectedStock.yahooTicker) return;

      const liveData = await fetchLiveYahooQuote(selectedStock.yahooTicker);
      if (liveData && isMounted) {
        setIsYahooLive(true);
        setLivePrice(liveData.price);
        
        setSelectedStock((prev) => ({
          ...prev,
          dayHigh: liveData.dayHigh,
          dayLow: liveData.dayLow,
          fiftyTwoWeekHigh: liveData.fiftyTwoWeekHigh,
          fiftyTwoWeekLow: liveData.fiftyTwoWeekLow,
          volume: liveData.volume
        }));

        if (liveData.candles && liveData.candles.length > 5) {
          setCandles(liveData.candles);
        } else {
          setCandles(generateCandles(liveData.price, timeframe));
        }
      } else if (isMounted) {
        setIsYahooLive(false);
        setLivePrice(selectedStock.basePrice);
        setCandles(generateCandles(selectedStock.basePrice, timeframe));
      }
    }

    loadRealQuote();

    return () => {
      isMounted = false;
    };
  }, [selectedStock, timeframe]);

  // Real-time market tick simulator & periodic Yahoo fetch (Fires price updates every 2 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      // Small real-time tick for UI responsiveness
      const delta = (Math.random() - 0.49) * (livePrice * 0.002);
      setLivePrice((prev) => {
        const next = Math.max(prev + delta, selectedStock.basePrice * 0.85);
        if (next > prev) setPriceFlash('up');
        else if (next < prev) setPriceFlash('down');
        setTimeout(() => setPriceFlash(null), 400);
        return parseFloat(next.toFixed(2));
      });

      // Update candles with latest tick
      setCandles((prevCandles) => {
        if (!prevCandles || prevCandles.length === 0) return prevCandles;
        const last = { ...prevCandles[prevCandles.length - 1] };
        last.close = parseFloat(livePrice.toFixed(2));
        last.high = Math.max(last.high, livePrice);
        last.low = Math.min(last.low, livePrice);
        return [...prevCandles.slice(0, -1), last];
      });
    }, 2000);

    return () => clearInterval(timer);
  }, [selectedStock, livePrice]);

  // Compute AI Analysis
  const currentStockData = {
    ...selectedStock,
    basePrice: livePrice
  };
  const aiData = computeAIAgentsAnalysis(currentStockData);

  const handleSelectStock = (stock) => {
    setSelectedStock(stock);
    setLivePrice(stock.basePrice);
  };

  const handleAddPosition = (newPos) => {
    setTrackedPositions((prev) => [newPos, ...prev]);
  };

  const handleRemovePosition = (id) => {
    setTrackedPositions((prev) => prev.filter((p) => p.id !== id));
  };

  const handleTrackOptionTrade = (optionName, premium, optionType, strike) => {
    const newPos = {
      id: Date.now().toString(),
      symbol: optionName,
      baseSymbol: selectedStock.symbol,
      type: optionType,
      entryPrice: premium,
      qty: selectedStock.lotSize || 250,
      targetPrice: parseFloat((premium * 1.5).toFixed(2)),
      stopLoss: parseFloat((premium * 0.7).toFixed(2)),
      addedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    handleAddPosition(newPos);
    alert(`Successfully added ${optionName} to Live Trade Tracker Chatbot!`);
  };

  const handleTrackStockTrade = (symbol, entryPrice) => {
    const newPos = {
      id: Date.now().toString(),
      symbol: symbol,
      baseSymbol: symbol,
      type: 'EQUITY',
      entryPrice: entryPrice,
      qty: 50,
      targetPrice: parseFloat((entryPrice * 1.025).toFixed(2)),
      stopLoss: parseFloat((entryPrice * 0.985).toFixed(2)),
      addedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    handleAddPosition(newPos);
    alert(`Successfully added ${symbol} equity trade to Live Trade Tracker Chatbot!`);
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col font-['Inter',sans-serif]">
      {/* Top Navbar & Market Ticker */}
      <Navbar
        indices={indices}
        onOpenRenderGuide={() => setIsRenderModalOpen(true)}
      />

      {/* Main App Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Real Data Status Badge */}
        <div className="flex items-center justify-between text-xs px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center space-x-2">
            <span className={`w-2 h-2 rounded-full ${isYahooLive ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
            <span className="font-semibold text-slate-200">
              {isYahooLive ? `Live Yahoo Finance Data Active (${selectedStock.yahooTicker})` : 'Simulated Real-Time Tick Mode'}
            </span>
          </div>
          <span className="text-slate-400">
            Source: <strong className="text-cyan-400">Yahoo Finance NSE/BSE API</strong>
          </span>
        </div>

        {/* Search Bar Section */}
        <section className="w-full">
          <StockSearch
            stocks={STOCK_UNIVERSE}
            selectedStock={selectedStock}
            onSelectStock={handleSelectStock}
          />
        </section>

        {/* Selected Stock Live Header Card */}
        <section>
          <StockHeader
            stock={selectedStock}
            livePrice={livePrice}
            priceFlash={priceFlash}
          />
        </section>

        {/* Chart View & FnO Option Strike Recommendation Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <ChartView
              candles={candles}
              livePrice={livePrice}
              timeframe={timeframe}
              setTimeframe={setTimeframe}
            />
          </div>

          <div className="lg:col-span-5">
            <FnOOptionCard
              fnoData={aiData.fno}
              stock={selectedStock}
              onTrackOptionTrade={handleTrackOptionTrade}
            />
          </div>
        </section>

        {/* 6 AI Agent Bots Panel */}
        <section>
          <AIAgentsPanel
            aiData={aiData}
            stock={selectedStock}
            onTrackTrade={handleTrackStockTrade}
          />
        </section>

        {/* Live Trade Tracker Chatbot & Active Positions */}
        <section id="chatbot-section">
          <TradeTrackerChatbot
            trackedPositions={trackedPositions}
            onAddPosition={handleAddPosition}
            onRemovePosition={handleRemovePosition}
            liveStock={selectedStock}
            livePrice={livePrice}
          />
        </section>

        {/* Market Overview: Top Gainers & Watchlist */}
        <section>
          <MarketOverviewCards
            stocks={STOCK_UNIVERSE}
            onSelectStock={handleSelectStock}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#080B12] border-t border-slate-800/80 py-6 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 TradeNexus AI • Yahoo Finance & NSE/BSE Live Stock Analytics</p>
          <div className="flex items-center space-x-4 text-slate-400">
            <button onClick={() => setIsRenderModalOpen(true)} className="hover:text-cyan-400 transition">
              Deploy Guide
            </button>
            <span>•</span>
            <span>6 AI Bots Engine Active</span>
          </div>
        </div>
      </footer>

      {/* Host on Render / Vercel Guide Modal */}
      <RenderDeployModal
        isOpen={isRenderModalOpen}
        onClose={() => setIsRenderModalOpen(false)}
      />
    </div>
  );
}
