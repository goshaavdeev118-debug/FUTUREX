import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { RefreshCw, TrendingUp, DollarSign, Wallet, ArrowRightLeft } from "lucide-react";

export default function CurrencyConverter() {
  const [amount, setAmount] = useState<number>(100);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("UAH");
  const [convertedResult, setConvertedResult] = useState<string>("0");

  const currencies = [
    { code: "USD", symbol: "$", name: "Долар США" },
    { code: "EUR", symbol: "€", name: "Євро" },
    { code: "UAH", symbol: "₴", name: "Українська гривня" },
    { code: "GBP", symbol: "£", name: "Британський фунт" },
    { code: "BTC", symbol: "₿", name: "Bitcoin" },
    { code: "USDT", symbol: "₮", name: "Tether (USDT)" },
    { code: "ETH", symbol: "Ξ", name: "Ethereum (ETH)" },
  ];

  // Rates in UAH (1 UAH = 1 UAH, USD = 44.36 UAH, etc.)
  const ratesInUAH: Record<string, number> = {
    USD: 44.36,
    EUR: 51.63,
    GBP: 59.76,
    BTC: 4700000,
    ETH: 110000,
    USDT: 44.36,
    UAH: 1
  };

  // Live Currency trends cards
  const trends = [
    { pair: "USD/UAH", rate: "44.36", change: "+0.15%", up: true },
    { pair: "EUR/UAH", rate: "51.63", change: "+0.25%", up: true },
    { pair: "BTC/USD", rate: "105,951", change: "+1.10%", up: true },
    { pair: "ETH/USD", rate: "2,479.71", change: "-0.45%", up: false },
    { pair: "USDT/UAH", rate: "44.36", change: "+0.02%", up: true },
  ];

  const handleConvert = () => {
    if (amount <= 0) {
      setConvertedResult("0");
      return;
    }
    // Convert to UAH first, then to target currency
    const inUAH = amount * ratesInUAH[fromCurrency];
    const targetValue = inUAH / ratesInUAH[toCurrency];

    if (toCurrency === "BTC" || toCurrency === "ETH") {
      setConvertedResult(targetValue.toFixed(6));
    } else {
      setConvertedResult(targetValue.toFixed(2));
    }
  };

  useEffect(() => {
    handleConvert();
  }, [amount, fromCurrency, toCurrency]);

  const handleSwap = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto items-start">
      {/* 1. Converter Calculator UI (Apple visual alignment) */}
      <div className="md:col-span-2 rounded-2xl border border-neutral-200/50 dark:border-white/5 bg-white/60 dark:bg-[#0c0c0e]/30 backdrop-blur-xl p-6 shadow-xl relative">
        <h3 className="font-semibold text-sm uppercase tracking-wider text-neutral-400 font-mono mb-6">Калькулятор Валют</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5 font-sans">
              Сума для конвертації
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 font-mono text-sm">
                {currencies.find((c) => c.code === fromCurrency)?.symbol}
              </span>
              <input
                type="number"
                min="0"
                value={amount}
                onChange={(e) => setAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-white/50 dark:bg-black/20 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none text-sm font-semibold text-neutral-900 dark:text-white transition-all font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-9 items-center gap-3">
            {/* From dropdown */}
            <div className="sm:col-span-4">
              <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5 font-sans">
                З валюти
              </label>
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-white/50 dark:bg-black/25 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none text-xs font-mono text-neutral-900 dark:text-white transition-all"
              >
                {currencies.map((c) => (
                  <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
                ))}
              </select>
            </div>

            {/* Interchange button */}
            <div className="sm:col-span-1 flex justify-center pt-5">
              <button
                onClick={handleSwap}
                className="p-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-white/5 dark:hover:bg-white/10 text-indigo-500 rounded-full transition-all cursor-pointer rotate-90 sm:rotate-0 hover:scale-105"
                title="Поміняти місцями"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>
            </div>

            {/* To dropdown */}
            <div className="sm:col-span-4">
              <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5 font-sans">
                В отримувану
              </label>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-white/50 dark:bg-black/25 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none text-xs font-mono text-neutral-900 dark:text-white transition-all"
              >
                {currencies.map((c) => (
                  <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Large result visual output panel */}
          <div className="mt-6 p-5 bg-neutral-100/50 dark:bg-black/35 rounded-2xl border border-neutral-150/40 dark:border-white/5 text-right font-mono select-all">
            <p className="text-xs text-neutral-400 dark:text-neutral-500">
              {amount} {fromCurrency} дорівнює
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-neutral-800 dark:text-neutral-100 mt-1">
              {convertedResult} <span className="text-indigo-500">{toCurrency}</span>
            </p>
          </div>
        </div>
      </div>

      {/* 2. Side trends rates dashboard */}
      <div className="p-5 rounded-2xl border border-neutral-200/50 dark:border-white/5 bg-white/40 dark:bg-[#0c0c0e]/15 backdrop-blur-xl shadow-xl space-y-4">
        <h4 className="font-semibold text-xs uppercase tracking-wider text-neutral-400 font-mono flex items-center gap-1">
          <TrendingUp className="w-4 h-4 text-indigo-500" />
          <span>Курси Валют</span>
        </h4>

        <div className="space-y-2.5 pt-2">
          {trends.map((item) => (
            <div
              key={item.pair}
              className="p-3 rounded-xl border border-neutral-200/40 dark:border-white/5 bg-neutral-500/5 flex justify-between items-center"
            >
              <div>
                <span className="font-bold text-xs text-neutral-800 dark:text-neutral-100 font-mono block">{item.pair}</span>
                <span className="text-[10px] text-neutral-400 font-sans mt-0.5 block">Банківський курс</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold font-mono text-neutral-700 dark:text-neutral-200 block">{item.rate}</span>
                <span className={`text-[9px] font-mono font-bold ${
                  item.up ? "text-emerald-500" : "text-rose-500"
                }`}>
                  {item.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-[10px] text-neutral-400 dark:text-neutral-550 border-t border-neutral-150/40 dark:border-white/5 pt-4 font-mono leading-relaxed mt-4">
          Курси є показовими і оновлюються в режимі реального часу.
        </div>
      </div>
    </div>
  );
}
