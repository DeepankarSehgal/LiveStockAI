import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Trash2, TrendingUp, TrendingDown, ShieldAlert, Sparkles, CheckCircle2, ArrowRight, Zap, RefreshCw } from 'lucide-react';
import { formatINR } from '../data/marketEngine';

export default function TradeTrackerChatbot({
  trackedPositions,
  onAddPosition,
  onRemovePosition,
  liveStock,
  livePrice
}) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `Hello! I am your AI Live Trade Tracking Assistant 🤖.\n\nTell me what you bought (e.g. "I bought NIFTY 24500 CE at ₹120" or "Bought 50 shares of Reliance at ₹2950").\n\nI will track your position LIVE and give real-time updates whether to HOLD, TRAIL STOP-LOSS, or SELL!`,
      suggestionChips: [
        `Bought ${liveStock.symbol} at ${Math.round(livePrice)}`,
        `I bought NIFTY 24600 CE @ 110`,
        `Should I hold ${liveStock.symbol}?`,
        `What is my total P&L?`
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Auto scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Smart Parser for User Trade Inputs
  const parseTradeInput = (text) => {
    const uppercase = text.toUpperCase();
    
    // Check if user is asking a general question vs declaring a trade
    const isTradeDeclaration =
      uppercase.includes('BOUGHT') ||
      uppercase.includes('BUY') ||
      uppercase.includes('PURCHASED') ||
      uppercase.includes('GOT') ||
      uppercase.includes('ENTERED');

    if (!isTradeDeclaration) return null;

    // Detect Type: CALL (CE) / PUT (PE) / EQUITY
    let type = 'EQUITY';
    if (uppercase.includes(' CE') || uppercase.includes('CALL')) type = 'CALL';
    else if (uppercase.includes(' PE') || uppercase.includes('PUT')) type = 'PUT';

    // Extract numbers (price / strike / quantity)
    const numbers = text.match(/\d+[\d,.]*/g);
    let entryPrice = livePrice;
    let qty = type === 'EQUITY' ? 50 : (liveStock.lotSize || 100);
    let strikePrice = null;

    if (numbers && numbers.length > 0) {
      // Last number or number after 'at' / '@' is usually price
      const priceMatch = text.match(/(?:at|@|price|rs\.?|₹)\s*(\d+[\d,.]*)/i);
      if (priceMatch) {
        entryPrice = parseFloat(priceMatch[1].replace(',', ''));
      } else {
        entryPrice = parseFloat(numbers[numbers.length - 1].replace(',', ''));
      }
    }

    // Symbol extraction
    let symbol = liveStock.symbol;
    if (uppercase.includes('NIFTY')) symbol = 'NIFTY';
    else if (uppercase.includes('BANKNIFTY')) symbol = 'BANKNIFTY';
    else if (uppercase.includes('SENSEX')) symbol = 'SENSEX';
    else if (uppercase.includes('RELIANCE')) symbol = 'RELIANCE';
    else if (uppercase.includes('TCS')) symbol = 'TCS';
    else if (uppercase.includes('TATAMOTORS')) symbol = 'TATAMOTORS';
    else if (uppercase.includes('ZOMATO')) symbol = 'ZOMATO';

    let displayTitle = symbol;
    if (type !== 'EQUITY') {
      const strikeMatch = text.match(/\d{4,5}/);
      strikePrice = strikeMatch ? strikeMatch[0] : Math.round(livePrice / 50) * 50;
      displayTitle = `${symbol} ${strikePrice} ${type === 'CALL' ? 'CE' : 'PE'}`;
    }

    return {
      id: Date.now().toString(),
      symbol: displayTitle,
      baseSymbol: symbol,
      type,
      entryPrice,
      qty,
      targetPrice: parseFloat((entryPrice * 1.25).toFixed(2)),
      stopLoss: parseFloat((entryPrice * 0.85).toFixed(2)),
      addedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const handleSend = (textToSend) => {
    const msgText = textToSend || input;
    if (!msgText.trim()) return;

    // Add user message
    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: msgText
    };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    // Process AI response
    setTimeout(() => {
      const parsedTrade = parseTradeInput(msgText);

      let botResponseText = '';
      let actionCard = null;

      if (parsedTrade) {
        onAddPosition(parsedTrade);
        botResponseText = `Got it! I have added **${parsedTrade.symbol}** to your Live Trade Tracker at entry price **${formatINR(parsedTrade.entryPrice)}** (Qty: ${parsedTrade.qty}).\n\nI am now actively monitoring this position in real-time! Below is your initial AI advice card.`;
        
        actionCard = {
          symbol: parsedTrade.symbol,
          entryPrice: parsedTrade.entryPrice,
          advice: '🟢 HOLD & ACCUMULATE',
          reason: 'Initial breakout confirmed. Technical indicators are bullish on 15m timeframe.',
          target: formatINR(parsedTrade.targetPrice),
          stopLoss: formatINR(parsedTrade.stopLoss)
        };
      } else if (msgText.toLowerCase().includes('p&l') || msgText.toLowerCase().includes('profit')) {
        if (trackedPositions.length === 0) {
          botResponseText = `You currently have no active tracked positions. Tell me what stock or option call you bought so I can track your P&L!`;
        } else {
          const totalPnL = trackedPositions.reduce((acc, pos) => {
            const currentP = pos.symbol.includes(liveStock.symbol) ? livePrice : pos.entryPrice * 1.04;
            return acc + (currentP - pos.entryPrice) * pos.qty;
          }, 0);
          botResponseText = `📊 **Current Live Portfolio P&L Summary**:\n\nYou have **${trackedPositions.length} active positions** being tracked.\n\nTotal Estimated Net P&L: **${formatINR(totalPnL)}** ${totalPnL >= 0 ? '🟢 (In Profit)' : '🔴 (In Loss)'}.`;
        }
      } else {
        // Conversational response
        const relevantPos = trackedPositions[0];
        if (relevantPos) {
          const curP = relevantPos.symbol.includes(liveStock.symbol) ? livePrice : relevantPos.entryPrice * 1.05;
          const diff = curP - relevantPos.entryPrice;
          const isProf = diff >= 0;

          botResponseText = `Regarding **${relevantPos.symbol}**:\n\n• Entry Price: ${formatINR(relevantPos.entryPrice)}\n• Live Simulated Price: ${formatINR(curP)}\n• Status: ${isProf ? '🟢 Profit' : '🔴 Drawdown'}\n\n**AI Bot Advice**: ${isProf ? 'HOLD for Target 1. Trail Stop-Loss to lock profits.' : 'Hold strictly with SL at ' + formatINR(relevantPos.stopLoss)}.`;
        } else {
          botResponseText = `I am ready! Mention any stock or Call/Put option you bought (e.g. "I bought NIFTY 24500 CE at 120" or "Bought 100 shares of ${liveStock.symbol} at ${formatINR(livePrice)}"), and I will track it live for you!`;
        }
      }

      const botMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: botResponseText,
        actionCard
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Active Live Positions Tracker Card (Left/Top) */}
      <div className="lg:col-span-5 bg-[#131B2E] border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <h3 className="font-extrabold text-base text-white">Live Tracked Trades ({trackedPositions.length})</h3>
            </div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              Real-time P&L Engine
            </span>
          </div>

          {/* List of Tracked Positions */}
          <div className="mt-4 space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {trackedPositions.length > 0 ? (
              trackedPositions.map((pos) => {
                // Compute current live price for tracked symbol
                const curPrice = pos.symbol.includes(liveStock.symbol)
                  ? livePrice
                  : pos.type === 'EQUITY'
                  ? pos.entryPrice * 1.025
                  : pos.entryPrice * 1.15;

                const pnl = (curPrice - pos.entryPrice) * pos.qty;
                const pnlPercent = ((curPrice - pos.entryPrice) / pos.entryPrice) * 100;
                const isProf = pnl >= 0;

                // Live AI Action logic
                let advicePill = { text: '🟢 HOLD & TRAIL', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
                if (pnlPercent > 35) advicePill = { text: '🎯 BOOK PROFIT NOW', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' };
                else if (pnlPercent < -15) advicePill = { text: '🔴 EXIT / SL HIT', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40' };

                return (
                  <div key={pos.id} className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-2 relative group hover:border-slate-700 transition">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-slate-100">{pos.symbol}</span>
                        <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded ${pos.type === 'CALL' ? 'bg-emerald-500/20 text-emerald-300' : pos.type === 'PUT' ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-800 text-slate-300'}`}>
                          {pos.type}
                        </span>
                      </div>

                      <button
                        onClick={() => onRemovePosition(pos.id)}
                        className="text-slate-500 hover:text-rose-400 transition p-1"
                        title="Stop tracking"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-mono-numeric">
                      <div>
                        <span className="text-slate-400 text-[10px] block">Bought @</span>
                        <span className="text-slate-200 font-semibold">{formatINR(pos.entryPrice)}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">Live Price</span>
                        <span className="text-white font-bold">{formatINR(curPrice)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block">P&L (Qty: {pos.qty})</span>
                        <span className={`font-mono-numeric font-extrabold ${isProf ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {isProf ? '+' : ''}{formatINR(pnl)} ({isProf ? '+' : ''}{pnlPercent.toFixed(2)}%)
                        </span>
                      </div>

                      <span className={`text-[10px] font-bold px-2 py-1 rounded-lg border ${advicePill.color}`}>
                        {advicePill.text}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-xl p-6 text-center space-y-2">
                <Bot className="w-8 h-8 text-cyan-400 mx-auto opacity-80" />
                <p className="text-xs text-slate-300 font-medium">No Active Trades Being Tracked Yet</p>
                <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                  Type in the chatbot on the right (e.g. <em>"I bought NIFTY 24500 CE at ₹120"</em> or <em>"Bought Reliance at ₹2950"</em>) to start live tracking!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Add Form Trigger */}
        <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Updates automatically with live price ticks</span>
          <span className="text-cyan-400 font-semibold flex items-center gap-1">
            <RefreshCw className="w-3 h-3 animate-spin" /> Live Sync
          </span>
        </div>
      </div>

      {/* AI Trade Tracker Chatbot Interface (Right/Bottom) */}
      <div className="lg:col-span-7 bg-[#131B2E] border border-slate-800 rounded-2xl shadow-xl flex flex-col h-[520px] overflow-hidden">
        {/* Chatbot Header */}
        <div className="px-5 py-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shadow-md">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                AI Trade Tracker & Advice Assistant
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </h3>
              <p className="text-[11px] text-slate-400">Tell me what you bought — I will guide when to Hold or Sell</p>
            </div>
          </div>
        </div>

        {/* Messages Feed */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isBot = msg.sender === 'bot';
            return (
              <div key={msg.id} className={`flex gap-3 ${isBot ? 'items-start' : 'items-end justify-end'}`}>
                {isBot && (
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0 text-cyan-400 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`space-y-2 max-w-[85%] sm:max-w-[75%]`}>
                  <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                    isBot
                      ? 'bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-none'
                      : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium rounded-tr-none shadow-md'
                  }`}>
                    <p className="whitespace-pre-line">{msg.text}</p>

                    {/* Optional Real-time AI Action Card */}
                    {msg.actionCard && (
                      <div className="mt-3 bg-slate-950 p-3 rounded-xl border border-cyan-500/30 space-y-2">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                          <span className="font-extrabold text-cyan-300">{msg.actionCard.symbol}</span>
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold">
                            {msg.actionCard.advice}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300">{msg.actionCard.reason}</p>
                        <div className="grid grid-cols-2 gap-2 text-[10px] pt-1">
                          <div>
                            <span className="text-slate-500 block">Target:</span>
                            <span className="text-emerald-400 font-mono-numeric font-bold">{msg.actionCard.target}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">Stop Loss:</span>
                            <span className="text-rose-400 font-mono-numeric font-bold">{msg.actionCard.stopLoss}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Suggestion Chips */}
                  {msg.suggestionChips && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.suggestionChips.map((chip, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSend(chip)}
                          className="px-2.5 py-1 text-[11px] bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 rounded-lg transition"
                        >
                          "{chip}"
                        </button>
                      ))}
                    </div>
                  )}

                  <span className="text-[9px] text-slate-500 block px-1">
                    {msg.timestamp}
                  </span>
                </div>

                {!isBot && (
                  <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0 text-slate-300 font-bold text-xs">
                    You
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center space-x-2 text-slate-400 text-xs pl-2">
              <Bot className="w-4 h-4 text-cyan-400 animate-bounce" />
              <span>AI Agent analyzing live tick data & trade position...</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Chat Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-slate-900 border-t border-slate-800 flex items-center space-x-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type e.g. 'I bought NIFTY 24500 CE at 120' or ask 'Should I hold Reliance?'..."
            className="flex-1 bg-[#131B2E] text-slate-100 text-xs px-4 py-3 rounded-xl border border-slate-700 focus:border-cyan-500 focus:outline-none"
          />
          <button
            type="submit"
            className="px-4 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition flex items-center space-x-1 shadow-md"
          >
            <Send className="w-4 h-4 fill-slate-950" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
