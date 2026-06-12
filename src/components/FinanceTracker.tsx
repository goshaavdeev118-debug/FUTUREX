import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Trash2, ArrowUpRight, ArrowDownRight, Wallet, TrendingUp, Calendar, AlertCircle } from "lucide-react";
import { FinancialRecord } from "../types";

interface FinanceTrackerProps {
  onNotify: (title: string, message: string, type: 'info' | 'success' | 'warning' | 'error') => void;
  onXPChange?: (xpEarned: number) => void;
}

export default function FinanceTracker({ onNotify, onXPChange }: FinanceTrackerProps) {
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const [type, setType] = useState<'income' | 'expense'>("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Продукти");
  const [description, setDescription] = useState("");

  const incomeCategories = ["Зарплата", "Фріланс", "Крипто-Трейдинг", "Дивіденди", "Інше"];
  const expenseCategories = ["Продукти", "Розваги", "Оренда", "Трейдинг лосс", "Комунальні", "Кафе/Ресторани", "Техніка", "Інше"];

  // Fetch initial finances
  useEffect(() => {
    const saved = localStorage.getItem("futurex_finances");
    if (saved) {
      try {
        setRecords(JSON.parse(saved));
      } catch {
        // Fallback
      }
    } else {
      const defaultRecords: FinancialRecord[] = [
        { id: "f1", type: "income", amount: 65000, category: "Зарплата", description: "Основна виплата за травень", date: "2026-06-01" },
        { id: "f2", type: "income", amount: 15400, category: "Крипто-Трейдинг", description: "Прибуток по позиції ETH/USDT", date: "2026-06-03" },
        { id: "f3", type: "expense", amount: 4800, category: "Продукти", description: "Закупка супермаркет Silpo", date: "2026-06-04" },
        { id: "f4", type: "expense", amount: 12000, category: "Оренда", description: "Часткова оплата квартири", date: "2026-06-05" },
        { id: "f5", type: "expense", amount: 2300, category: "Кафе/Ресторани", description: "Вечеря з колегами", date: "2026-06-07" },
      ];
      setRecords(defaultRecords);
      localStorage.setItem("futurex_finances", JSON.stringify(defaultRecords));
    }
  }, []);

  const saveRecords = (updated: FinancialRecord[]) => {
    setRecords(updated);
    localStorage.setItem("futurex_finances", JSON.stringify(updated));
  };

  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const amtNum = parseFloat(amount);
    if (isNaN(amtNum) || amtNum <= 0) {
      onNotify("Неприпустима сума", "Будь ласка, введіть дійсне позитивне число.", "warning");
      return;
    }

    const newRec: FinancialRecord = {
      id: "fin-" + Date.now().toString(),
      type,
      amount: amtNum,
      category,
      description: description.trim() || category,
      date: new Date().toISOString().split("T")[0]
    };

    saveRecords([newRec, ...records]);
    setAmount("");
    setDescription("");
    onNotify(
      newRec.type === "income" ? "Надходження коштів 💰" : "Витрату додано 📉",
      `${newRec.type === "income" ? "Отримано" : "Витрачено"} ${newRec.amount.toLocaleString("uk-UA")} UAH на ${newRec.description}`,
      "success"
    );
    if (onXPChange) onXPChange(10); // finance add rewards 10 XP
  };

  // Safe category swap on type change
  useEffect(() => {
    setCategory(type === "income" ? incomeCategories[0] : expenseCategories[0]);
  }, [type]);

  const handleDelete = (id: string) => {
    const target = records.find((r) => r.id === id);
    const updated = records.filter((r) => r.id !== id);
    saveRecords(updated);
    if (target) {
      onNotify("Запис видалено", "Транзакцію успішно видалено зі звіту.", "info");
    }
  };

  // Math aggregates calculations
  const totalIncome = records.filter((r) => r.type === "income").reduce((acc, r) => acc + r.amount, 0);
  const totalExpense = records.filter((r) => r.type === "expense").reduce((acc, r) => acc + r.amount, 0);
  const activeBalance = totalIncome - totalExpense;

  return (
    <div className="space-y-6">
      {/* 3 Overview KPI tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl border border-neutral-200/50 dark:border-white/5 bg-gradient-to-br from-indigo-500/10 via-pink-500/5 to-transparent backdrop-blur-xl relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-505 dark:text-indigo-400 font-mono">Загальний Баланс</span>
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mt-1 font-mono">
                {activeBalance.toLocaleString("uk-UA")} <span className="text-xs text-neutral-400">UAH</span>
              </h3>
            </div>
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 rounded-xl">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex gap-1.5 items-center text-[10px] text-neutral-400 dark:text-neutral-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Параметри капіталізації активні</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-neutral-200/50 dark:border-white/5 bg-white/60 dark:bg-[#0c0c0e]/30 backdrop-blur-xl relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-500 font-mono">Всього доходів</span>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white mt-1 font-mono">
                +{totalIncome.toLocaleString("uk-UA")} <span className="text-xs text-neutral-400">UAH</span>
              </h3>
            </div>
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-xl">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 text-[10px] text-emerald-500 font-semibold">
            {records.filter(r => r.type === 'income').length} активних транзакцій
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-neutral-200/50 dark:border-white/5 bg-white/60 dark:bg-[#0c0c0e]/30 backdrop-blur-xl relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-rose-500 font-mono">Всього витрат</span>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white mt-1 font-mono">
                -{totalExpense.toLocaleString("uk-UA")} <span className="text-xs text-neutral-400">UAH</span>
              </h3>
            </div>
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl">
              <ArrowDownRight className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 text-[10px] text-rose-500 font-semibold">
            {records.filter(r => r.type === 'expense').length} платежів враховано
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Record insert statement block */}
        <div className="p-5 border border-neutral-200/50 dark:border-white/5 bg-white/60 dark:bg-[#0c0c0e]/30 backdrop-blur-xl rounded-2xl shadow-md h-fit">
          <h4 className="font-semibold text-xs uppercase tracking-wider text-neutral-400 font-mono mb-4">Додати транзакцію</h4>
          
          {/* Swapper button header tabs */}
          <div className="grid grid-cols-2 gap-1 bg-neutral-200/50 dark:bg-black/30 p-1 rounded-xl mb-4 text-xs font-semibold">
            <button
              onClick={() => setType("expense")}
              className={`py-1.5 rounded-lg text-center cursor-pointer transition-all ${
                type === "expense"
                  ? "bg-rose-550/15 text-rose-500 border border-rose-500/20"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white"
              }`}
            >
              Витрата (-)
            </button>
            <button
              onClick={() => setType("income")}
              className={`py-1.5 rounded-lg text-center cursor-pointer transition-all ${
                type === "income"
                  ? "bg-emerald-550/15 text-emerald-555 border border-emerald-500/20"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white"
              }`}
            >
              Дохід (+)
            </button>
          </div>

          <form onSubmit={handleAddRecord} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">Сума (UAH)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                min="0.01"
                step="0.01"
                className="w-full bg-neutral-100/50 dark:bg-neutral-900 border border-neutral-250/50 dark:border-white/5 rounded-xl py-2 px-3 text-xs text-neutral-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-550"
              />
            </div>

            <div className="grid grid-cols-1 gap-2">
              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">Категорія</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-neutral-100/50 dark:bg-neutral-900 border border-neutral-250/50 dark:border-white/5 rounded-xl py-2 px-3 text-xs text-neutral-850 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-550"
                >
                  {(type === "income" ? incomeCategories : expenseCategories).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">Опис транзакції</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Опис (необов'язково)..."
                className="w-full bg-neutral-100/50 dark:bg-neutral-900 border border-neutral-250/50 dark:border-white/5 rounded-xl py-2 px-3 text-xs text-neutral-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-550"
              />
            </div>

            <button
              type="submit"
              className={`w-full py-2.5 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-1 transition-all shadow-md cursor-pointer ${
                type === 'income' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-rose-600 hover:bg-rose-500'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Зберегти у відомостях</span>
            </button>
          </form>
        </div>

        {/* Dynamic transaction list display */}
        <div className="lg:col-span-2 space-y-3.5">
          <div className="p-5 border border-neutral-200/50 dark:border-white/5 bg-white/60 dark:bg-[#0c0c0e]/30 backdrop-blur-xl rounded-2xl shadow-md min-h-[300px] flex flex-col justify-between">
            <div>
              <h4 className="font-semibold text-xs uppercase tracking-wider text-neutral-400 font-mono mb-4">Протокол транзакцій</h4>
              
              <div className="max-h-72 overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-neutral-800">
                <AnimatePresence initial={false}>
                  {records.length === 0 ? (
                    <div className="py-12 text-center text-neutral-400 dark:text-neutral-500 text-xs">
                      <AlertCircle className="w-6 h-6 mx-auto stroke-1 mb-1.5 text-neutral-400" />
                      <span>Історія транзакцій порожня.</span>
                    </div>
                  ) : (
                    records.map((rec) => (
                      <motion.div
                        key={rec.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-3 bg-neutral-100/50 dark:bg-[#0c0c0e]/40 border border-neutral-200/30 dark:border-white/5 rounded-xl flex justify-between items-center group shadow-sm"
                      >
                        <div className="flex gap-3 items-center">
                          <div className={`p-2 rounded-lg border ${
                            rec.type === "income"
                              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                              : "bg-rose-500/10 border-rose-500/20 text-rose-500"
                          }`}>
                            {rec.type === "income" ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                          </div>
                          <div>
                            <span className="text-[10px] font-semibold text-neutral-400 dark:text-neutral-500">{rec.category} • {rec.date}</span>
                            <h5 className="text-xs font-bold text-neutral-800 dark:text-neutral-200 mt-0.5 leading-none">{rec.description}</h5>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className={`text-xs font-bold font-mono ${rec.type === "income" ? "text-emerald-555" : "text-rose-555"}`}>
                            {rec.type === "income" ? "+" : "-"}{rec.amount.toLocaleString("uk-UA")}
                          </span>
                          <button
                            onClick={() => handleDelete(rec.id)}
                            className="p-1 px-1 text-neutral-400 hover:text-rose-500 rounded cursor-pointer transition-all hover:bg-neutral-200 dark:hover:bg-white/5"
                            title="Видалити запис"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Micro visual native coordinate ratio chart */}
            {records.length > 0 && (
              <div className="mt-4 pt-4 border-t border-neutral-200/50 dark:border-white/5">
                <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wide block mb-2 font-sans">
                  Бюджетна Залученість (Співвідношення Витрат)
                </span>
                <div className="h-2 rounded-full bg-neutral-200 dark:bg-white/5 overflow-hidden flex">
                  <div
                    style={{ width: `${Math.min(100, Math.max(5, (totalIncome / (totalIncome + totalExpense || 1)) * 100))}%` }}
                    className="bg-emerald-500 h-full transition-all duration-500"
                    title={`Доходи: ${totalIncome.toLocaleString("uk-UA")} UAH`}
                  />
                  <div
                    style={{ width: `${Math.min(100, Math.max(5, (totalExpense / (totalIncome + totalExpense || 1)) * 100))}%` }}
                    className="bg-rose-500 h-full transition-all duration-500"
                    title={`Витрати: ${totalExpense.toLocaleString("uk-UA")} UAH`}
                  />
                </div>
                <div className="flex justify-between mt-1 text-[9px] font-mono font-medium text-neutral-400 leading-none">
                  <span>Доходи ({Math.round((totalIncome / (totalIncome + totalExpense || 1)) * 100)}%)</span>
                  <span>Витрати ({Math.round((totalExpense / (totalIncome + totalExpense || 1)) * 100)}%)</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
