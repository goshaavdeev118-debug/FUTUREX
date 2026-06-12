import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, Plus, Trash2, Award, Flame, Calendar as CalIcon, RotateCcw, Compass, Dumbbell, Sparkles } from "lucide-react";
import { Habit } from "../types";

interface HabitsTrackerProps {
  onNotify: (title: string, message: string, type: 'info' | 'success' | 'warning' | 'error') => void;
  onXPChange?: (xpEarned: number) => void;
}

export default function HabitsTracker({ onNotify, onXPChange }: HabitsTrackerProps) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [title, setTitle] = useState("");
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>("daily");
  const [category, setCategory] = useState("Здоров'я");

  const categories = ["Здоров'я", "Фінанси", "Навчання", "Спорт", "Робота", "Розум/Медитація"];

  // Load habits from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("futurex_habits");
    if (saved) {
      try {
        setHabits(JSON.parse(saved));
      } catch {
        // Fallback
      }
    } else {
      const defaultHabits: Habit[] = [
        {
          id: "h1",
          title: "Прочитати 10 сторінок книги",
          frequency: "daily",
          streak: 4,
          bestStreak: 4,
          history: ["2026-06-07", "2026-06-06", "2026-06-05", "2026-06-04"],
          category: "Навчання",
          createdAt: "2026-06-04"
        },
        {
          id: "h2",
          title: "Ранкова фітнес-зарядка",
          frequency: "daily",
          streak: 2,
          bestStreak: 5,
          history: ["2026-06-07", "2026-06-06"],
          category: "Спорт",
          createdAt: "2026-06-05"
        },
        {
          id: "h3",
          title: "Аналіз витрат та бюджету",
          frequency: "weekly",
          streak: 1,
          bestStreak: 3,
          history: ["2026-06-04"],
          category: "Фінанси",
          createdAt: "2026-06-04"
        }
      ];
      setHabits(defaultHabits);
      localStorage.setItem("futurex_habits", JSON.stringify(defaultHabits));
    }
  }, []);

  const saveHabits = (updated: Habit[]) => {
    setHabits(updated);
    localStorage.setItem("futurex_habits", JSON.stringify(updated));
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newHabit: Habit = {
      id: "habit-" + Date.now().toString(),
      title: title.trim(),
      frequency,
      streak: 0,
      bestStreak: 0,
      history: [],
      category,
      createdAt: new Date().toISOString().split("T")[0]
    };

    saveHabits([newHabit, ...habits]);
    setTitle("");
    onNotify("Звичку створено", `Звичку "${newHabit.title}" додано до щоденного радару.`, "success");
    if (onXPChange) onXPChange(20); // Create habit rewarding XP
  };

  const handleDelete = (id: string) => {
    const target = habits.find((h) => h.id === id);
    const updated = habits.filter((h) => h.id !== id);
    saveHabits(updated);
    if (target) {
      onNotify("Звичку видалено", `Звичку "${target.title}" успішно видалено.`, "info");
    }
  };

  // Get date strings for past 7 days: formatted YYYY-MM-DD
  const getPast7Days = () => {
    const list = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const str = d.toISOString().split("T")[0];
      const weekday = d.toLocaleDateString("uk-UA", { weekday: "short" });
      const dayNum = d.getDate();
      list.push({ dateStr: str, weekday, dayNum });
    }
    return list;
  };

  const dates = getPast7Days();

  const toggleDateCompletion = (habitId: string, dateStr: string) => {
    const updated = habits.map((h) => {
      if (h.id !== habitId) return h;

      const isCompleted = h.history.includes(dateStr);
      let newHistory = [];
      if (isCompleted) {
        // Toggle off
        newHistory = h.history.filter((d) => d !== dateStr);
      } else {
        // Toggle on
        newHistory = [dateStr, ...h.history];
        onNotify("Звичка виконана! 🎉", `Чудова робота! Ви виконали "${h.title}" за ${dateStr}.`, "success");
        if (onXPChange) onXPChange(15); // Completion rewards 15 XP
      }

      // Recalculate current consecutive streaks based on history dates
      let currentStreak = 0;
      const sortedHistory = [...newHistory].sort().reverse(); // newest first
      const todayStr = new Date().toISOString().split("T")[0];
      
      // Calculate active streak
      let checkDate = new Date();
      let active = true;
      let iterations = 0;

      while (active && iterations < 365) {
        const curStr = checkDate.toISOString().split("T")[0];
        if (sortedHistory.includes(curStr)) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          // If the break is today or yesterday, the streak might still be count or broken
          if (iterations === 0) {
            // Check yesterday
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yestStr = yesterday.toISOString().split("T")[0];
            if (sortedHistory.includes(yestStr)) {
              // Streak is saved, start checking from yesterday backwards
              checkDate.setDate(checkDate.getDate() - 1);
            } else {
              active = false;
            }
          } else {
            active = false;
          }
        }
        iterations++;
      }

      const best = Math.max(h.bestStreak, currentStreak);

      return {
        ...h,
        history: newHistory,
        streak: currentStreak,
        bestStreak: best
      };
    });

    saveHabits(updated);
  };

  return (
    <div className="space-y-6">
      {/* Introduction Dashboard header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/40 dark:bg-[#0c0c0e]/30 border border-neutral-200/50 dark:border-white/5 p-5 rounded-2xl gap-4 backdrop-blur-xl">
        <div>
          <h3 className="text-lg font-heading font-bold text-neutral-800 dark:text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500 fill-amber-500 animate-pulse" />
            Радар Звичок та Концентрації
          </h3>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 font-sans mt-1">
            Кожне підтвердження звички приносить <span className="text-indigo-400 font-semibold">+15 XP</span> у скарбницю вашого акаунту!
          </p>
        </div>
        <div className="flex items-center gap-2 bg-neutral-250/20 dark:bg-white/5 py-1.5 px-3 rounded-xl border border-neutral-200/40 dark:border-white/5">
          <Award className="w-4.5 h-4.5 text-indigo-500 animate-bounce" />
          <span className="text-xs font-bold text-neutral-800 dark:text-neutral-100">Дисциплінований воїн</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Habit Form Panel */}
        <div className="p-5 border border-neutral-200/50 dark:border-white/5 bg-white/60 dark:bg-[#0c0c0e]/30 backdrop-blur-xl rounded-2xl shadow-md h-fit">
          <h4 className="font-semibold text-xs uppercase tracking-wider text-neutral-400 font-mono mb-4">Додати звичку</h4>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="text-[11px] font-bold text-neutral-400 uppercase block mb-1">Назва звички</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Медитувати 5 хвилин..."
                className="w-full bg-neutral-100/50 dark:bg-neutral-900 border border-neutral-250/50 dark:border-white/5 rounded-xl py-2 px-3 text-xs text-neutral-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-550"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-neutral-400 uppercase block mb-1">Періодичність</label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value as any)}
                  className="w-full bg-neutral-100/50 dark:bg-neutral-900 border border-neutral-250/50 dark:border-white/5 rounded-xl py-2 px-3 text-xs text-neutral-850 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-550"
                >
                  <option value="daily">Щодня</option>
                  <option value="weekly">Щотижня</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-bold text-neutral-400 uppercase block mb-1">Категорія</label>
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

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1 transition-all shadow-md cursor-pointer mt-2"
            >
              <Plus className="w-4 h-4" />
              <span>Активувати звичку</span>
            </button>
          </form>
        </div>

        {/* Habits grid selector */}
        <div className="lg:col-span-2 space-y-3.5">
          <AnimatePresence mode="wait">
            {habits.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-8 text-center bg-white/40 dark:bg-neutral-900/10 border border-dashed border-neutral-200 dark:border-white/5 rounded-2xl"
              >
                <Compass className="w-8 h-8 text-neutral-400 mx-auto stroke-1 mb-2" />
                <p className="text-xs text-neutral-450">У вас немає активних звичок. Додайте першу звичку, щоб розпочати трекінг.</p>
              </motion.div>
            ) : (
              habits.map((habit) => (
                <motion.div
                  key={habit.id}
                  initial={{ opacity: 0, scale: 0.98, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: -10 }}
                  className="p-4 bg-white/70 dark:bg-[#0c0c0e]/30 border border-neutral-200/50 dark:border-white/5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm relative group"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded">
                        {habit.category}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400">
                        {habit.frequency === "daily" ? "Щодня" : "Щотижня"}
                      </span>
                    </div>
                    <h5 className="font-bold text-sm text-neutral-800 dark:text-white mt-1.5 leading-tight">
                      {habit.title}
                    </h5>

                    {/* Streak Info HUD */}
                    <div className="flex gap-4 items-center mt-3 text-xs font-semibold text-neutral-450 dark:text-neutral-500">
                      <div className="flex items-center gap-1.5 bg-amber-500/5 text-amber-550 border border-amber-500/10 px-2 py-0.5 rounded font-mono">
                        <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span>Серія: {habit.streak} днів</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-indigo-500/5 text-indigo-550 border border-indigo-500/10 px-2 py-0.5 rounded font-mono">
                        <Award className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Рекорд: {habit.bestStreak}</span>
                      </div>
                    </div>
                  </div>

                  {/* Calendar 7 Days Matrix tracker checks */}
                  <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto py-1">
                    {dates.map((d) => {
                      const completed = habit.history.includes(d.dateStr);
                      const isToday = d.dateStr === new Date().toISOString().split("T")[0];
                      return (
                        <button
                          key={d.dateStr}
                          onClick={() => toggleDateCompletion(habit.id, d.dateStr)}
                          className={`flex flex-col items-center p-1.5 rounded-lg border min-w-10 text-center cursor-pointer transition-all ${
                            completed
                              ? "bg-emerald-500/15 border-emerald-500 text-emerald-500 font-bold scale-[1.03]"
                              : isToday
                              ? "bg-indigo-500/10 border-indigo-500/50 text-indigo-505 dark:text-indigo-400"
                              : "bg-neutral-100/40 dark:bg-white/5 border-neutral-200/50 dark:border-white/5 text-neutral-400 dark:text-neutral-500 hover:border-neutral-300 dark:hover:border-white/10"
                          }`}
                          title={`Пререключити завершення за ${d.dateStr}`}
                        >
                          <span className="text-[9px] uppercase font-mono tracking-tighter opacity-80">{d.weekday}</span>
                          <span className="text-xs font-mono font-bold mt-0.5">{d.dayNum}</span>
                          <div className="mt-1 flex items-center justify-center">
                            {completed ? (
                              <Check className="w-3 h-3 text-emerald-500 stroke-[3]" />
                            ) : (
                              <div className="w-2.5 h-2.5 rounded-full border border-neutral-300 dark:border-white/10" />
                            )}
                          </div>
                        </button>
                      );
                    })}

                    <button
                      onClick={() => handleDelete(habit.id)}
                      className="p-2 ml-1 text-neutral-400 hover:text-rose-500 hover:bg-rose-500/5 border border-transparent hover:border-rose-500/10 rounded-xl cursor-pointer transition-all"
                      title="Видалити звичку"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
