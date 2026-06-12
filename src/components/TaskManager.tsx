import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Check, Trash2, Tag, Calendar, AlertTriangle, Filter, Search, Sparkles } from "lucide-react";
import { Task } from "../types";

interface TaskManagerProps {
  onNotify: (title: string, message: string, type: 'info' | 'success' | 'warning' | 'error') => void;
}

interface ConversionResult {
  amount: number;
  fromCode: string;
  toCode: string;
  result: number;
  rate: number;
}

const ratesInUAH: Record<string, number> = {
  USD: 44.36,
  EUR: 51.63,
  UAH: 1,
  GBP: 59.76,
  BTC: 4700000,
  USDT: 44.36,
  ETH: 110000
};

const currencySymbols: Record<string, string> = {
  USD: "$",
  EUR: "€",
  UAH: "₴",
  GBP: "£",
  BTC: "₿",
  USDT: "₮",
  ETH: "Ξ"
};

function parseCurrencyCommand(text: string): ConversionResult | null {
  const norm = text.toLowerCase().trim();
  
  // Clean decimal spaces
  const cleanNorm = norm.replace(/\s*([.,])\s*/g, "$1");
  const matchNum = cleanNorm.match(/(\d+([.,]\d+)?)/);
  if (!matchNum) return null;

  const amountStr = matchNum[1].replace(",", ".");
  const amount = parseFloat(amountStr);
  if (isNaN(amount) || amount <= 0) return null;

  const usdKeywords = ["долар", "доллар", "usd", "$", "bucks", "бакс", "зелен"];
  const eurKeywords = ["євро", "евро", "eur", "€"];
  const uahKeywords = ["грив", "uah", "₴", "грн", "уах"];
  const gbpKeywords = ["фунт", "gbp", "£"];
  const btcKeywords = ["btc", "бітко", "битко", "₿"];
  const usdtKeywords = ["usdt", "юсдт", "тезер", "тезер", "₮"];
  const ethKeywords = ["eth", "ефір", "ефир", "етереум", "етериум", "ethereum", "Ξ"];

  const getCurrencyCode = (word: string): string | null => {
    if (usdKeywords.some(k => word.includes(k))) return "USD";
    if (eurKeywords.some(k => word.includes(k))) return "EUR";
    if (uahKeywords.some(k => word.includes(k))) return "UAH";
    if (gbpKeywords.some(k => word.includes(k))) return "GBP";
    if (btcKeywords.some(k => word.includes(k))) return "BTC";
    if (usdtKeywords.some(k => word.includes(k))) return "USDT";
    if (ethKeywords.some(k => word.includes(k))) return "ETH";
    return null;
  };

  const tokens = norm.replace(/[^\w\d\sа-яієїґ$€₴£₿₮Ξ]/gi, " ").split(/\s+/).filter(Boolean);

  const foundCurrencies: { code: string; index: number }[] = [];
  tokens.forEach((tok, i) => {
    const code = getCurrencyCode(tok);
    if (code) {
      foundCurrencies.push({ code, index: i });
    }
  });

  if (foundCurrencies.length >= 2) {
    const fromHit = foundCurrencies[0];
    const toHit = foundCurrencies.find(h => h.code !== fromHit.code);
    if (toHit) {
      const fromCode = fromHit.code;
      const toCode = toHit.code;

      const inUAH = amount * ratesInUAH[fromCode];
      const targetVal = inUAH / ratesInUAH[toCode];
      const calcRate = ratesInUAH[fromCode] / ratesInUAH[toCode];

      return {
        amount,
        fromCode,
        toCode,
        result: parseFloat(targetVal.toFixed((toCode === "BTC" || toCode === "ETH") ? 6 : 2)),
        rate: parseFloat(calcRate.toFixed(4))
      };
    }
  }

  if (foundCurrencies.length === 1) {
    const fromCode = foundCurrencies[0].code;
    const toCode = fromCode === "UAH" ? "USD" : "UAH";

    const inUAH = amount * ratesInUAH[fromCode];
    const targetVal = inUAH / ratesInUAH[toCode];
    const calcRate = ratesInUAH[fromCode] / ratesInUAH[toCode];

    return {
      amount,
      fromCode,
      toCode,
      result: parseFloat(targetVal.toFixed(2)),
      rate: parseFloat(calcRate.toFixed(4))
    };
  }

  return null;
}

export default function TaskManager({ onNotify }: TaskManagerProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>("medium");
  const [category, setCategory] = useState("Робота");
  const [dueDate, setDueDate] = useState("");
  
  // Filtering & search states
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed'>("all");
  const [categoryFilter, setCategoryFilter] = useState("Всі");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["Робота", "Особисте", "Фінанси", "Навчання", "Терміново"];

  // Initialize from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem("futurex_tasks");
    if (saved) {
      try {
        setTasks(JSON.parse(saved));
      } catch (e) {
        console.error("Помилка завантаження завдань", e);
      }
    } else {
      // Default tasks
      const defaultTasks: Task[] = [
        {
          id: "1",
          title: "Створити прототип сайту FutureX",
          description: "Налаштувати скляний дизайн, неонові підсвічування та анімації переходу.",
          completed: true,
          priority: "high",
          dueDate: "2026-06-12",
          category: "Робота",
          createdAt: new Date().toISOString()
        },
        {
          id: "2",
          title: "Оновити баланс у валютному конвертері",
          description: "Перевірити оновлення курсів валют у режимі реального часу.",
          completed: false,
          priority: "medium",
          dueDate: "2026-06-15",
          category: "Фінанси",
          createdAt: new Date().toISOString()
        }
      ];
      setTasks(defaultTasks);
      localStorage.setItem("futurex_tasks", JSON.stringify(defaultTasks));
    }
  }, []);

  const saveTasks = (updated: Task[]) => {
    setTasks(updated);
    localStorage.setItem("futurex_tasks", JSON.stringify(updated));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const conversion = parseCurrencyCommand(title);
    let finalTitle = title;
    let finalDescription = description;
    let finalCategory = category;

    if (conversion) {
      const fromSymbol = currencySymbols[conversion.fromCode] || conversion.fromCode;
      const toSymbol = currencySymbols[conversion.toCode] || conversion.toCode;
      
      const autoDesc = `💵 Автоматична конвертація валют:\n${conversion.amount} ${conversion.fromCode} [${fromSymbol}] ➔ ${conversion.result} ${conversion.toCode} [${toSymbol}]\nКурс обміну: 1 ${conversion.fromCode} = ${conversion.rate} ${conversion.toCode}`;
      
      if (!finalDescription.trim()) {
        finalDescription = autoDesc;
      } else {
        finalDescription = `${finalDescription}\n\n${autoDesc}`;
      }
      
      if (category === "Робота" || category === "Особисте") {
        finalCategory = "Фінанси";
      }

      finalTitle = `${title} (Результат: ${conversion.result} ${toSymbol})`;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title: finalTitle,
      description: finalDescription.trim() || undefined,
      completed: false,
      priority,
      category: finalCategory,
      dueDate: dueDate || undefined,
      createdAt: new Date().toISOString()
    };

    const updated = [newTask, ...tasks];
    saveTasks(updated);
    
    // Notification popup trigger
    if (conversion) {
      onNotify(
        "Валюту конвертовано!",
        `${conversion.amount} ${conversion.fromCode} = ${conversion.result} ${conversion.toCode} за курсом ${conversion.rate}`,
        "success"
      );
    } else {
      onNotify("Завдання додано", `"${title}" успішно занесено в розклад.`, "success");
    }

    // Reset controls
    setTitle("");
    setDescription("");
    setDueDate("");
    setPriority("medium");
  };

  const toggleTask = (id: string) => {
    const updated = tasks.map((t) => {
      if (t.id === id) {
        const nextState = !t.completed;
        if (nextState) {
          onNotify("Завдання виконано!", `Вітаємо з завершенням "${t.title}"!`, "success");
        }
        return { ...t, completed: nextState };
      }
      return t;
    });
    saveTasks(updated);
  };

  const deleteTask = (id: string) => {
    const match = tasks.find((t) => t.id === id);
    const updated = tasks.filter((t) => t.id !== id);
    saveTasks(updated);
    if (match) {
      onNotify("Завдання видалено", `"${match.title}" було видалено.`, "info");
    }
  };

  // Compute Completion rates
  const totalTasks = tasks.length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  // Filter conditions
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (task.description?.toLowerCase() || "").includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "Всі" || task.category === categoryFilter;
    const matchesTab = activeTab === "all" || 
                       (activeTab === "active" && !task.completed) || 
                       (activeTab === "completed" && task.completed);
    
    return matchesSearch && matchesCategory && matchesTab;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto items-start">
      {/* 1. Add Task Form Panel  */}
      <div className="p-6 rounded-2xl border border-neutral-200/50 dark:border-white/5 bg-white/60 dark:bg-[#0c0c0e]/30 backdrop-blur-xl shadow-xl">
        <h3 className="font-semibold text-sm uppercase tracking-wider text-neutral-400 font-mono mb-4">Нове Завдання</h3>
        
        <form onSubmit={handleAddTask} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5 font-sans">
              Заголовок завдання *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Назва вашої мети..."
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-white/50 dark:bg-black/20 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none text-sm text-neutral-900 dark:text-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5 font-sans">
              Опис (опціонально)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Короткі деталі запланованого..."
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-white/50 dark:bg-black/20 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none text-sm text-neutral-900 dark:text-white transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5 font-sans">
                Пріоритет
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-white/50 dark:bg-black/25 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none text-xs text-neutral-900 dark:text-white transition-all"
              >
                <option value="low">Низький</option>
                <option value="medium">Середній</option>
                <option value="high">Високий</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5 font-sans">
                Категорія
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-white/50 dark:bg-black/25 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none text-xs text-neutral-900 dark:text-white transition-all"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5 font-sans">
              Термін виконання
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-white/50 dark:bg-black/20 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none text-xs text-neutral-900 dark:text-white transition-all font-mono"
            />
          </div>

          <AnimatePresence>
            {(() => {
              const activeConversion = parseCurrencyCommand(title);
              if (!activeConversion) return null;
              return (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3.5 rounded-xl border border-indigo-500/15 bg-indigo-500/10 text-xs text-indigo-700 dark:text-indigo-350 font-sans mt-2 space-y-1 block"
                >
                  <div className="flex items-center gap-1.5 font-semibold text-indigo-650 dark:text-indigo-450">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
                    <span>Швидка конвертація валют</span>
                  </div>
                  <p className="font-mono text-[11px] leading-relaxed">
                    {activeConversion.amount} {activeConversion.fromCode} ({currencySymbols[activeConversion.fromCode] || ""}) ➔{" "}
                    <span className="font-bold text-neutral-950 dark:text-white">
                      {activeConversion.result} {activeConversion.toCode} ({currencySymbols[activeConversion.toCode] || ""})
                    </span>
                  </p>
                  <p className="text-[10px] text-neutral-400 font-mono">
                    Курс обміну: 1 {activeConversion.fromCode} = {activeConversion.rate} {activeConversion.toCode}
                  </p>
                </motion.div>
              );
            })()}
          </AnimatePresence>

          <button
            type="submit"
            className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 font-semibold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Додати завдання</span>
          </button>
        </form>

        {/* Interactive radial SVG Progress Circle */}
        <div className="mt-6 pt-5 border-t border-neutral-200/50 dark:border-white/5 flex items-center gap-4">
          <div className="relative w-14 h-14 shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="28"
                cy="28"
                r="24"
                className="stroke-neutral-200 dark:stroke-neutral-800 fill-none"
                strokeWidth="4.5"
              />
              <circle
                cx="28"
                cy="28"
                r="24"
                className="stroke-indigo-500 fill-none"
                strokeWidth="4.5"
                strokeDasharray="150"
                strokeDashoffset={150 - (150 * completionPercentage) / 100}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 0.6s ease" }}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold font-mono text-neutral-800 dark:text-neutral-100">
              {completionPercentage}%
            </span>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">Рівень Виконання</h4>
            <p className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-0.5 font-sans leading-relaxed">
              Завершено {completedCount} з {totalTasks} активованих цілей.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Tasks List Display & Filtering Panel  */}
      <div className="lg:col-span-2 space-y-4">
        {/* Top filter controls */}
        <div className="p-4 rounded-xl border border-neutral-200/50 dark:border-white/5 bg-white/60 dark:bg-[#0c0c0e]/30 backdrop-blur-xl shadow-md flex flex-col md:flex-row gap-3 justify-between items-center">
          {/* Active status filters */}
          <div className="flex gap-1.5 self-start md:self-auto">
            {(["all", "active", "completed"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium capitalize transition-all cursor-pointer ${
                  activeTab === tab
                    ? "bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 border border-indigo-500/20"
                    : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                }`}
              >
                {tab === "all" ? "Всі" : tab === "active" ? "Активні" : "Завершені"}
              </button>
            ))}
          </div>

          <div className="flex gap-2 w-full md:w-auto items-center">
            {/* Search Box */}
            <div className="relative w-full md:w-48">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Пошук завдань..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-neutral-200 dark:border-white/5 bg-white/40 dark:bg-black/20 text-xs focus:ring-1 focus:ring-indigo-500 outline-none text-neutral-900 dark:text-white transition-all"
              />
            </div>

            {/* Tag selector */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="py-1.5 px-2 bg-neutral-100 dark:bg-white/5 rounded-lg border border-neutral-200 dark:border-white/5 text-xs text-neutral-600 dark:text-neutral-300 outline-none"
            >
              <option value="Всі">Всі категорії</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Dynamic task items cards */}
        <div className="space-y-2.5">
          <AnimatePresence mode="popLayout">
            {filteredTasks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-16 rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800 bg-white/30 dark:bg-transparent"
              >
                <AlertTriangle className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Нічого не знайдено</p>
                <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">Оновіть фільтри запитів або додайте завдання.</p>
              </motion.div>
            ) : (
              filteredTasks.map((task) => {
                // Priority badges colors
                const priorityColor =
                  task.priority === "high"
                    ? "bg-rose-500/10 text-rose-500 border-rose-500/15"
                    : task.priority === "medium"
                    ? "bg-amber-500/10 text-amber-500 border-amber-500/15"
                    : "bg-emerald-500/10 text-emerald-500 border-emerald-500/15";

                return (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, y: 12, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className={`p-4 rounded-xl border transition-all flex items-start gap-4 hover:shadow-lg ${
                      task.completed
                        ? "border-neutral-200/40 dark:border-white/5 bg-neutral-50/50 dark:bg-white/5 opacity-60"
                        : "border-neutral-200 dark:border-white/5 bg-white dark:bg-[#0c0c0e]/30"
                    }`}
                  >
                    {/* Tick Checkbox block */}
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 apple-hover transition-all cursor-pointer ${
                        task.completed
                          ? "bg-indigo-500 border-indigo-500 text-white"
                          : "border-neutral-300 dark:border-neutral-700 hover:border-indigo-400"
                      }`}
                    >
                      {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>

                    {/* Meta Titles and dates */}
                    <div className="grow space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className={`text-sm font-semibold leading-snug break-words max-w-[340px] ${
                          task.completed ? "line-through text-neutral-400" : "text-neutral-900 dark:text-neutral-100"
                        }`}>
                          {task.title}
                        </h4>
                        
                        <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${priorityColor}`}>
                          {task.priority === "high" ? "Високий" : task.priority === "medium" ? "Середній" : "Низький"}
                        </span>

                        <span className="text-[10px] font-medium text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-white/5 px-2 py-0.5 rounded-md flex items-center gap-1 border border-neutral-150 dark:border-white/5">
                          <Tag className="w-3 h-3 text-neutral-400" />
                          <span>{task.category}</span>
                        </span>
                      </div>

                      {task.description && (
                        <p className={`text-xs leading-relaxed max-w-xl ${
                          task.completed ? "text-neutral-400" : "text-neutral-500 dark:text-neutral-400"
                        }`}>
                          {task.description}
                        </p>
                      )}

                      {task.dueDate && (
                        <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 font-mono pt-1">
                          <Calendar className="w-3 h-3 text-neutral-400" />
                          <span>Термін: {task.dueDate}</span>
                        </div>
                      )}
                    </div>

                    {/* Trash buttons action */}
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
