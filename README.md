# TradeNexus.AI - BSE & NSE Live Stock Analytics, 6 AI Bots & FnO Trade Tracker

TradeNexus.AI is a real-time Indian Stock Market (BSE & NSE) web application featuring live price streaming, smart stock search autocompletion, 6 specialized AI Agent Bots providing intraday entry/exit points, FnO Option Strike recommendations (CE/PE), and an interactive **Live AI Trade Tracker Chatbot**.

---

## ⚡ Core Features

1. **Live BSE & NSE Market Feed**: Real-time tick engine simulating price fluctuations, VWAP, 52W high/low, and market indices (NIFTY 50, SENSEX, BANK NIFTY, INDIA VIX).
2. **Smart Autocomplete Stock Search**: Instant recommendations as you type stock name or symbol (e.g. `RELIANCE`, `TCS`, `TATAMOTORS`, `NIFTY`) with FnO eligibility pills.
3. **Interactive Charting**: Timeframe selector (`1m`, `5m`, `15m`, `1D`) with VWAP overlays and intraday candle metrics.
4. **6 Specialized AI Agent Bots**:
   - ⚡ **Intraday Scalper Bot**: 5m/15m micro-trend entry, SL, and scalp targets.
   - 📊 **Technical Analyst Bot**: RSI, MACD, Supertrend, EMA 20, SMA 50.
   - 🎯 **FnO Options Specialist Bot**: Option chain PCR, IV, Call (CE) vs Put (PE) strike recommendation, entry & SL.
   - 🛡️ **Risk & Money Manager Bot**: Position sizing (shares / lots) based on risk cap, Risk:Reward ratio.
   - 📰 **Sentiment & Institutional Flow Bot**: FII/DII net flow, order volume surge score.
   - 🤖 **Consensus Master Synthesizer**: Unified action rating (**STRONG BUY**, **BUY**, **HOLD**, **SELL**, **AVOID**) with win probability.
5. **FnO Strike Recommendation Card**: Clear Call/Put strike recommendation, lot size profit/risk calculator, Delta, Theta, Gamma, IV.
6. **Live AI Trade Tracker Chatbot**:
   - Natural language input: *"I bought NIFTY 24500 CE at ₹120"* or *"Bought 100 shares of Reliance at ₹2950"*.
   - Registers positions in the **Active Trades Panel** with real-time live P&L ($ / ₹) and P&L %.
   - Continuous live AI advice: **HOLD & TRAIL SL**, **BOOK PROFIT NOW**, or **EXIT**.

---

## 🚀 How to Host on Render

### Step 1: Push to GitHub
Run the following commands in your project folder:
```bash
git init
git add .
git commit -m "Deploying BSE/NSE AI Trading & FnO App"
git branch -M main
git remote add origin <YOUR_GITHUB_REPO_URL>
git push -u origin main
```

### Step 2: Deploy on Render
1. Go to **[Render Dashboard](https://dashboard.render.com)**.
2. Click **New +** and select **Static Site**.
3. Connect your GitHub repository.
4. Set the build settings:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
5. Click **Create Static Site**. Your app will be live on Render in under 1 minute!

---

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev

# Build production bundle
npm run build
```
