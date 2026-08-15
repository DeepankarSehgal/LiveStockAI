import React from 'react';
import { X, Rocket, CheckCircle2, Copy, Github, Globe, ExternalLink } from 'lucide-react';

export default function RenderDeployModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied command to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-[#131B2E] border border-slate-700 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 relative text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Rocket className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg">Deploy to Render Guide</h3>
            <p className="text-xs text-slate-400">Host your BSE/NSE AI Trading app live on Render in 3 steps</p>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          {/* Step 1 */}
          <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between font-bold text-slate-200">
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center text-xs font-black">1</span>
                Initialize Git & Push to GitHub
              </span>
              <Github className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-slate-400">Run these commands in your project directory:</p>
            <div className="bg-slate-950 p-2.5 rounded-lg font-mono-numeric text-cyan-300 flex items-center justify-between">
              <code>git init && git add . && git commit -m "Initial BSE/NSE AI Trading App"</code>
              <button
                onClick={() => copyToClipboard('git init && git add . && git commit -m "Initial BSE/NSE AI Trading App"')}
                className="text-slate-500 hover:text-white p-1"
                title="Copy"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between font-bold text-slate-200">
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-black">2</span>
                Create New Static Site on Render
              </span>
              <Globe className="w-4 h-4 text-slate-400" />
            </div>
            <ol className="list-disc list-inside space-y-1 text-slate-300">
              <li>Log in to <strong className="text-cyan-400">dashboard.render.com</strong></li>
              <li>Click <strong>New +</strong> ➔ select <strong>Static Site</strong></li>
              <li>Connect your GitHub repository</li>
            </ol>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between font-bold text-slate-200">
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-xs font-black">3</span>
                Render Build & Publish Settings
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="grid grid-cols-2 gap-2 font-mono-numeric">
              <div className="bg-slate-950 p-2 rounded">
                <span className="text-slate-500 block text-[10px]">Build Command:</span>
                <span className="text-emerald-400 font-bold">npm run build</span>
              </div>
              <div className="bg-slate-950 p-2 rounded">
                <span className="text-slate-500 block text-[10px]">Publish Directory:</span>
                <span className="text-emerald-400 font-bold">dist</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
}
