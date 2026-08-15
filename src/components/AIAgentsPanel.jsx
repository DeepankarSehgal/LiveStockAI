import React, { useState } from 'react';
import {
  Zap,
  TrendingUp,
  Target,
  Shield,
  Newspaper,
  Bot,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Info
} from 'lucide-react';
import { formatINR } from '../data/marketEngine';

export default function AIAgentsPanel({ aiData, stock, onTrackTrade }) {
  const [selectedAgentId, setSelectedAgentId] = useState('consensus'); // default to master consensus
  const consensusBot = aiData.agents.find((a) => a.id === 'consensus');
  const activeAgent = aiData.agents.find((a) => a.id === selectedAgentId) || consensusBot;

  const getActionColor = (action) => {
    if (action.includes('STRONG BUY') || action.includes('BUY')) return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    if (action.includes('SELL')) return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
    return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
  };

  return (
    <div className="bg-[#131B2E] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
              <Bot className="w-5 h-5 text-cyan-400" />
            </div>
            <h2 className="text-xl font-extrabold text-white">6 AI Agent Analysis System</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Concurrent multi-agent analysis for <strong className="text-white">{stock.symbol}</strong>
          </p>
        </div>

        {/* Master Action Pill */}
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">AI Consensus</span>
            <span className={`text-sm font-extrabold px-3 py-1 rounded-xl border ${getActionColor(aiData.consensusAction)}`}>
              {aiData.consensusAction}
            </span>
          </div>

          <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-center">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Win Prob.</span>
            <span className="text-xs font-mono-numeric font-extrabold text-cyan-400">{aiData.winProbability}%</span>
          </div>
        </div>
      </div>

      {/* Grid of 6 AI Agent Bot Cards (Clickable) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {aiData.agents.map((agent) => {
          const isSelected = selectedAgentId === agent.id;
          return (
            <button
              key={agent.id}
              onClick={() => setSelectedAgentId(agent.id)}
              className={`p-3 rounded-xl border text-left transition relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-800/90 border-cyan-500 ring-2 ring-cyan-500/20 shadow-lg'
                  : 'bg-slate-900/50 border-slate-800/80 hover:bg-slate-800/40 hover:border-slate-700'
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 right-0 w-12 h-12 bg-cyan-500/10 rounded-bl-full pointer-events-none" />
              )}
              
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 line-clamp-1">{agent.name.split(' ')[1] || agent.name}</span>
                  {agent.id === 'consensus' && (
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400/30" />
                  )}
                </div>
                <span className="text-[10px] text-slate-400 block line-clamp-1">{agent.role.split(' ')[0]}</span>
              </div>

              <div className="mt-3">
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700 block truncate">
                  {agent.badge}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Detailed Analysis View for Selected AI Agent Bot */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${activeAgent.avatarColor} p-0.5 shadow-lg`}>
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-bold text-white text-sm">
                {activeAgent.name.substring(0, 2)}
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-base text-white">{activeAgent.name}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Confidence: {activeAgent.confidence}
                </span>
              </div>
              <p className="text-xs text-slate-400">{activeAgent.role}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400">Bot Signal:</span>
            <span className={`text-xs font-bold px-3 py-1 rounded-lg border ${getActionColor(activeAgent.badge)}`}>
              {activeAgent.badge}
            </span>
          </div>
        </div>

        {/* Intraday Targets & Entry / Exit Specs */}
        {activeAgent.details && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
            {activeAgent.details.entryWindow && (
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <span className="text-slate-400 block mb-1">Intraday Entry Point</span>
                <span className="font-mono-numeric font-bold text-sm text-cyan-400">
                  {activeAgent.details.entryWindow}
                </span>
              </div>
            )}

            {activeAgent.details.stopLoss && (
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <span className="text-slate-400 block mb-1">Strict Stop Loss</span>
                <span className="font-mono-numeric font-bold text-sm text-rose-400">
                  {activeAgent.details.stopLoss}
                </span>
              </div>
            )}

            {activeAgent.details.target1 && (
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <span className="text-slate-400 block mb-1">Intraday Target 1</span>
                <span className="font-mono-numeric font-bold text-sm text-emerald-400">
                  {activeAgent.details.target1}
                </span>
              </div>
            )}

            {activeAgent.details.target2 && (
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <span className="text-slate-400 block mb-1">Target 2 (Extended)</span>
                <span className="font-mono-numeric font-bold text-sm text-emerald-300">
                  {activeAgent.details.target2}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Rationale & Key Bot Findings */}
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-xs space-y-2">
          <div className="flex items-center space-x-2 font-bold text-slate-200">
            <Info className="w-4 h-4 text-cyan-400" />
            <span>AI Bot Strategy Rationale:</span>
          </div>
          <p className="text-slate-300 leading-relaxed font-normal">
            {activeAgent.details.rationale || activeAgent.details.summary || "Analyzing price action, order flow depth, and momentum indicators."}
          </p>

          {/* Additional Parameters grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
            {Object.entries(activeAgent.details)
              .filter(([k]) => !['action', 'entryWindow', 'stopLoss', 'target1', 'target2', 'rationale', 'summary'].includes(k))
              .map(([key, val]) => (
                <div key={key} className="bg-slate-900/60 p-2 rounded border border-slate-800">
                  <span className="text-slate-500 capitalize block">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="text-slate-200 font-semibold">{String(val)}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Quick Send to Trade Tracker Chatbot */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-slate-400 hidden sm:inline-block">
            Want to execute or track this signal live?
          </span>
          <button
            onClick={() => onTrackTrade(stock.symbol, activeAgent.details.entryPrice || stock.basePrice)}
            className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl text-xs shadow-md transition flex items-center justify-center space-x-2"
          >
            <Zap className="w-4 h-4 fill-slate-950" />
            <span>Track Strategy in AI Chatbot</span>
          </button>
        </div>
      </div>
    </div>
  );
}
