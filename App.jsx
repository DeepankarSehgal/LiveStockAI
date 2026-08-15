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
  calculateFnORecommendation,
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

  // Array of tracked trades in AI Chatbot
  const [trackedPositions, setTrackedPositions] = useState([
    {
      id: 'default-1',
      symbol: 'RELIANCE 3000 CE',
      baseSymbol: 'RELIANCE',
      type: 'CALL',
      entryPrice: 42.50,
      qty: 250,
      targetPrice: 75.00,
      stopLoss: 28.00,
      addedAt: '10:15 AM'
    }
  ]);

  // Generate candles whenever stock or timeframe changes
  useEffect(() => {
    setLivePrice(selectedStock.basePrice);
    const initialCandles = generateCandles(selectedStock.basePrice, timeframe);
    setCandles(initialCandles);
  }, [selectedStock, timeframe]);

  // Real-time market tick simulator (Fires price updates every 2 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      // Tick for selected stock
      const delta = (Math.random() - 0.49) * (selectedStock.basePrice * 0.003);
      setLivePrice((prev) => {
        const next = Math.max(prev + delta, selectedStock.basePrice * 0.85);
        if (next > prev) setPriceFlash('up');
        else if (next < prev) setPriceFlash('down');
        setTimeout(() => setPriceFlash(null), 400);
        return parseFloat(next.toFixed(2));
      });

      // Update candles with latest close
      setCandles((prevCandles) => {
        if (!prevCandles || prevCandles.length === 0) return prevCandles;
        const last = { ...prevCandles[prevCandles.length - 1] };
        last.close = parseFloat(livePrice.toFixed(2));
        last.high = Math.max(last.high, livePrice);
        last.low = Math.min(last.low, livePrice);
        return [...prevCandles.slice(0, -1), last];
      });

      // Tick for market indices
      setIndices((prevIndices) =>
        prevIndices.map((idx) => {
          const changeVal = (Math.random() - 0.48) * (idx.basePrice * 0.001);
          const newPrice = idx.basePrice + changeVal;
          return {
            ...idx,
            basePrice: parseFloat(newPrice.toFixed(2)),
            change: parseFloat((idx.change + changeVal).toFixed(2))
          };
        })
      );
    }, 1800);

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
          <p>© 2026 TradeNexus AI • Live BSE & NSE Stock Analytics Platform</p>
          <div className="flex items-center space-x-4 text-slate-400">
            <button onClick={() => setIsRenderModalOpen(true)} className="hover:text-cyan-400 transition">
              Deploy to Render Guide
            </button>
            <span>•</span>
            <span>6 AI Bots Engine Active</span>
          </div>
        </div>
      </footer>

      {/* Host on Render Guide Modal */}
      <RenderDeployModal
        isOpen={isRenderModalOpen}
        onClose={() => setIsRenderModalOpen(false)}
      />
    </div>
  );
}
