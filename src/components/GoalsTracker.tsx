import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Trash2, Milestone, CalendarClock, Check, Target, Compass, CircleDot } from "lucide-react";
import { Goal } from "../types";

interface GoalsTrackerProps {
  onNotify: (title: string, message: string, type: 'info' | 'success' | 'warning' | 'error') => void;
  onXPChange?: (xpEarned: number) => void;
}

export default function GoalsTracker({ onNotify, onXPChange }: GoalsTrackerProps) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [activeTimeframe, setActiveTimeframe] = useState<'monthly' | 'yearly'>("monthly");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Власна справа");
  const [targetDate, setTargetDate] = useState("2026-06-30");

  const categories = ["Власна справа", "Навчання", "Фінанси & Крипто", "Спорт & Здоров'я", "Подорожі", "Особистісний ріст"];

  // Fetch initial goals
  useEffect(() => {
    const saved = localStorage.getItem("futurex_goals");
    if (saved) {
      try {
        setGoals(JSON.parse(saved));
      } catch {
        // Fallback
      }
    } else {
      const defaultGoals: Goal[] = [
        {
          id: "g1",
          title: "Опанувати маржинальну торгівлю ф'ючерсами",
          timeframe: "monthly",
          category: "Фінанси & Крипто",
          completed: false,
          targetDate: "2026-06-30",
          progress: 55,
          createdAt: "2026-06-01"
        },
        {
          id: "g2",
          title: "Прочитати 4 розвиваючі книги про продуктивність",
          timeframe: "monthly",
          category: "Навчання",
          completed: false,
          targetDate: "2026-06-28",
          progress: 30,
          createdAt: "2026-06-02"
        },
        {
          id: "g3",
          title: "Накопичити капітал $10,000 у токенах USDT",
          timeframe: "yearly",
          category: "Фінанси & Крипто",
          completed: false,
          targetDate: "2026-12-31",
          progress: 72,
          createdAt: "2026-06-01"
        }
      ];
      setGoals(defaultGoals);
      localStorage.setItem("futurex_goals", JSON.stringify(defaultGoals));
    }
  }, []);

  const saveGoals = (updated: Goal[]) => {
    setGoals(updated);
    localStorage.setItem("futurex_goals", JSON.stringify(updated));
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newGoal: Goal = {
      id: "goal-" + Date.now().toString(),
      title: title.trim(),
      timeframe: activeTimeframe,
      category,
      completed: false,
      targetDate: targetDate || new Date().toISOString().split("T")[0],
      progress: 0,
      createdAt: new Date().toISOString().split("T")[0]
    };

    saveGoals([newGoal, ...goals]);
    setTitle("");
    onNotify("Ціль активовано", `Ціль "${newGoal.title}" зафіксовано на радарі вашого профілю.`, "success");
    if (onXPChange) onXPChange(25); // Goal creation XP
  };

  const handleUpdateProgress = (id: string, progressVal: number) => {
    const updated = goals.map((g) => {
      if (g.id !== id) return g;
      const isCompleted = progressVal >= 100;
      if (isCompleted && !g.completed) {
        onNotify("🔥 Суперціль виконано! 🔥", `Вітаємо! Ви досягли мети: "${g.title}"! (+40 XP)`, "success");
        if (onXPChange) onXPChange(40); // milestone achieved!
      }
      return {
        ...g,
        progress: progressVal,
        completed: isCompleted
      };
    });
    saveGoals(updated);
  };

  const handleDelete = (id: string) => {
    const target = goals.find((g) => g.id === id);
    const updated = goals.filter((g) => g.id !== id);
    saveGoals(updated);
    if (target) {
      onNotify("Ціль анульовано", "Перспективну ціль видалено зі списку.", "info");
    }
  };

  const activeGoalsList = goals.filter((g) => g.timeframe === activeTimeframe);

  return (
    <div className="space-y-6">
      {/* Visual Navigation Swapper */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/40 dark:bg-[#0c0c0e]/30 border border-neutral-200/50 dark:border-white/5 p-4 rounded-2xl gap-4 backdrop-blur-xl">
        <div className="grid grid-cols-2 gap-1 bg-neutral-200/50 dark:bg-black/30 p-1 rounded-xl text-xs font-semibold w-full sm:w-80">
          <button
            onClick={() => setActiveTimeframe("monthly")}
            className={`py-2 rounded-lg text-center cursor-pointer transition-all ${
              activeTimeframe === "monthly"
                ? "bg-white dark:bg-white/5 shadow-sm text-neutral-900 dark:text-white border border-neutral-200/30 dark:border-white/5"
                : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
            }`}
          >
            Цілі на місяць
          </button>
          <button
            onClick={() => setActiveTimeframe("yearly")}
            className={`py-2 rounded-lg text-center cursor-pointer transition-all ${
              activeTimeframe === "yearly"
                ? "bg-white dark:bg-white/5 shadow-sm text-neutral-900 dark:text-white border border-neutral-200/30 dark:border-white/5"
                : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
            }`}
          >
            Цілі на рік
          </button>
        </div>

        <div className="flex items-center gap-2 bg-indigo-500/5 border border-indigo-500/20 py-1.5 px-3 rounded-xl">
          <Target className="w-4.5 h-4.5 text-indigo-500 animate-pulse" />
          <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-100">
            {goals.filter((g) => g.completed).length} цілей завершено
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Goal Form */}
        <div className="p-5 border border-neutral-200/50 dark:border-white/5 bg-white/60 dark:bg-[#0c0c0e]/30 backdrop-blur-xl rounded-2xl shadow-md h-fit">
          <h4 className="font-semibold text-xs uppercase tracking-wider text-neutral-400 font-mono mb-4">
            Скласти {activeTimeframe === "monthly" ? "місячний" : "річний"} вектор
          </h4>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">Сформулюйте мету</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Запустити бета-версію порталу..."
                className="w-full bg-neutral-100/50 dark:bg-neutral-900 border border-neutral-250/50 dark:border-white/5 rounded-xl py-2 px-3 text-xs text-neutral-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-550"
              />
            </div>

            <div className="grid grid-cols-1 gap-2">
              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">Сфера діяльності</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-neutral-100/50 dark:bg-neutral-900 border border-neutral-250/50 dark:border-white/5 rounded-xl py-2 px-3 text-xs text-neutral-850 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-550"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">Максимальний термін (Крайня дата)</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full bg-neutral-100/50 dark:bg-neutral-900 border border-neutral-250/50 dark:border-white/5 rounded-xl py-2 px-3 text-xs text-neutral-950 dark:text-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-550 hover:from-indigo-550 hover:to-indigo-550 text-white font-bold text-xs flex items-center justify-center gap-1 transition-all shadow-md cursor-pointer mt-2"
            >
              <Plus className="w-4 h-4" />
              <span>Активувати орієнтир</span>
            </button>
          </form>
        </div>

        {/* Goals progress viewport */}
        <div className="lg:col-span-2 space-y-3.5">
          <AnimatePresence mode="wait">
            {activeGoalsList.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-12 text-center bg-white/40 dark:bg-neutral-900/10 border border-dashed border-neutral-200 dark:border-white/5 rounded-2xl"
              >
                <Compass className="w-8 h-8 text-neutral-400 mx-auto stroke-1 mb-2 animate-spin-slow" />
                <p className="text-xs text-neutral-450">Розділ перспективних цілей вільний. Встановіть свій перший вектор розвитку.</p>
              </motion.div>
            ) : (
              activeGoalsList.map((g) => (
                <motion.div
                  key={g.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="p-4 bg-white/70 dark:bg-[#0c0c0e]/30 border border-neutral-200/50 dark:border-white/5 rounded-2xl shadow-sm space-y-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-550 bg-indigo-505/10 px-2 py-0.5 rounded leading-none">
                          {g.category}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-neutral-450 dark:text-neutral-500 flex items-center gap-1">
                          <CalendarClock className="w-3.5 h-3.5" />
                          Дедлайн: {g.targetDate}
                        </span>
                      </div>
                      <h5 className={`font-bold mt-2 font-heading leading-tight ${g.completed ? "line-through text-neutral-400 text-sm" : "text-neutral-850 dark:text-white text-sm"}`}>
                        {g.title}
                      </h5>
                    </div>

                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleUpdateProgress(g.id, 100)}
                        className={`p-1.5 rounded-lg border flex items-center justify-center cursor-pointer transition-all ${
                          g.completed
                            ? "bg-emerald-500/15 border-emerald-555 text-emerald-500"
                            : "bg-neutral-100/50 dark:bg-white/5 border-neutral-200/50 dark:border-white/5 text-neutral-400 hover:text-emerald-550"
                        }`}
                        title="Зробити виконаною"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(g.id)}
                        className="p-1.5 rounded-lg border bg-neutral-100/50 dark:bg-white/5 border-neutral-200/50 dark:border-white/5 text-neutral-400 hover:text-rose-500 hover:bg-rose-500/5 transition-all cursor-pointer"
                        title="Видалити"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Interactive Progress Slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-medium text-neutral-450 dark:text-neutral-500">
                      <span>Рівень реалізації</span>
                      <span className="font-mono font-bold text-indigo-505 dark:text-indigo-400">{g.progress}%</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={g.progress}
                        onChange={(e) => handleUpdateProgress(g.id, parseInt(e.target.value))}
                        className="grow accent-indigo-600 h-1 bg-neutral-200 dark:bg-white/5 rounded-lg cursor-ew-resize focus:outline-none"
                      />
                      <CircleDot className={`w-4 h-4 ${g.completed ? "text-emerald-500" : "text-indigo-400"}`} />
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
