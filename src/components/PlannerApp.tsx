import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Calendar as CalendarIcon, CheckSquare, Plus, Trash2, Loader2, RefreshCw, AlertCircle, CalendarRange } from "lucide-react";
import { PlannerEvent, Task } from "../types";

interface PlannerAppProps {
  onNotify: (title: string, message: string, type: 'info' | 'success' | 'warning' | 'error') => void;
  onXPChange?: (xpEarned: number) => void;
}

export default function PlannerApp({ onNotify, onXPChange }: PlannerAppProps) {
  const [events, setEvents] = useState<PlannerEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [focusGoals, setFocusGoals] = useState("");
  const [aiReview, setAiReview] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]);

  // Read tasks from localStorage to correlate with dates
  const [allTasks, setAllTasks] = useState<Task[]>([]);

  useEffect(() => {
    // Load planner events
    const savedEvents = localStorage.getItem("futurex_planner_events");
    if (savedEvents) {
      try {
        setEvents(JSON.parse(savedEvents));
      } catch {
        // Fallback
      }
    } else {
      const defaultEvents: PlannerEvent[] = [
        { id: "e1", title: "Ранкове фокусування: Читання книги", timeSlot: "08:00 - 09:30", completed: true, priority: "low" },
        { id: "e2", title: "Активний крипто-аналіз ринку", timeSlot: "10:00 - 11:30", completed: false, priority: "high", isAIGenerated: true },
        { id: "e3", title: "Велотренування та дихальні вправи", timeSlot: "17:00 - 18:00", completed: false, priority: "medium" },
      ];
      setEvents(defaultEvents);
      localStorage.setItem("futurex_planner_events", JSON.stringify(defaultEvents));
    }

    // Load tasks to display in calendar indicators
    const savedTasks = localStorage.getItem("futurex_tasks");
    if (savedTasks) {
      try {
        setAllTasks(JSON.parse(savedTasks));
      } catch {
        // Fallback
      }
    }

    const savedReview = localStorage.getItem("futurex_ai_planner_review");
    if (savedReview) {
      setAiReview(savedReview);
    }
  }, []);

  const saveEvents = (updated: PlannerEvent[]) => {
    setEvents(updated);
    localStorage.setItem("futurex_planner_events", JSON.stringify(updated));
  };

  const generateAISchedule = async () => {
    setIsLoading(true);
    try {
      const habits = JSON.parse(localStorage.getItem("futurex_habits") || "[]");
      const uncompeletedTasks = allTasks.filter((t) => !t.completed);

      const response = await fetch("/api/ai/generate-schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tasks: uncompeletedTasks.map(t => ({ title: t.title, priority: t.priority })),
          habits: habits.map((h: any) => h.title),
          focusGoals: focusGoals.trim() || undefined
        })
      });

      if (!response.ok) {
        throw new Error("Не вдалося підключитися до AI-планувальника.");
      }

      const schedule = await response.json();
      if (schedule.error) {
        throw new Error(schedule.error);
      }

      if (schedule.events && Array.isArray(schedule.events)) {
        const mapped: PlannerEvent[] = schedule.events.map((e: any, idx: number) => ({
          id: `ai-ev-${Date.now()}-${idx}`,
          title: e.title,
          timeSlot: e.timeSlot,
          completed: false,
          priority: e.priority || "medium",
          isAIGenerated: true
        }));

        saveEvents(mapped);
        setAiReview(schedule.review || "Дисциплінований підхід до планування.");
        localStorage.setItem("futurex_ai_planner_review", schedule.review || "");
        onNotify("Розклад згенеровано! 🗓️", "FutureX AI збалансував ваш розклад для максимального ККД.", "success");
        if (onXPChange) onXPChange(50); // Generating custom AI schedules grants 50 XP!
      } else {
        throw new Error("Невірний формат відповіді планувальника.");
      }
    } catch (err: any) {
      console.error(err);
      onNotify("Помилка AI планувальника", err.message || "Спробуйте пізніше або перевірте API ключ.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleEvent = (id: string) => {
    const updated = events.map((ev) => {
      if (ev.id !== id) return ev;
      const willBeCompleted = !ev.completed;
      if (willBeCompleted) {
        onNotify("Подію виконано! 🚀", `Ви успішно завершили: "${ev.title}"!`, "success");
        if (onXPChange) onXPChange(15); // Completion rewarded with 15 XP
      }
      return { ...ev, completed: willBeCompleted };
    });
    saveEvents(updated);
  };

  const deleteEvent = (id: string) => {
    const updated = events.filter((ev) => ev.id !== id);
    saveEvents(updated);
    onNotify("Подію видалено", "Елемент розкладу успішно видалено.", "info");
  };

  // Build a standard 35 days calendar layout for June 2026 (based on freeze year)
  // June 1, 2026 is a Monday. Wait, let's look at the days.
  // We can render days in June from Monday to Sunday.
  const renderCalendarDays = () => {
    const days = [];
    const tempDate = new Date(2026, 5, 1); // June 2026
    const daysInMonth = 30; // June is 30 days
    
    // Calendar grid starting shift can be padded
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `2026-06-${String(i).padStart(2, '0')}`;
      const dayTasks = allTasks.filter((t) => t.dueDate === dateStr);
      days.push({ dayNum: i, dateStr, tasksCount: dayTasks.length, completedCount: dayTasks.filter((t) => t.completed).length });
    }
    return days;
  };

  const calDays = renderCalendarDays();
  const selectedDateTasks = allTasks.filter((t) => t.dueDate === selectedDate);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Days Calendar with Task markers */}
        <div className="lg:col-span-5 p-5 border border-neutral-200/50 dark:border-white/5 bg-white/60 dark:bg-[#0c0c0e]/30 backdrop-blur-xl rounded-2xl shadow-md space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-xs uppercase tracking-wider text-neutral-400 font-mono flex items-center gap-1.5 leading-none">
              <CalendarIcon className="w-4 h-4 text-indigo-505 dark:text-indigo-400" />
              Календар завдань
            </h4>
            <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-550 border border-indigo-500/10 px-2 py-0.5 rounded bg-indigo-500/5 font-mono">
              Червень 2026
            </span>
          </div>

          {/* Calendar Grid 7 columns */}
          <div className="grid grid-cols-7 gap-1 text-center font-mono text-[10px] font-bold text-neutral-450 dark:text-neutral-500 pb-1 border-b border-neutral-100 dark:border-white/5">
            {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"].map(h => <span key={h}>{h}</span>)}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calDays.map((d) => {
              const isSelected = selectedDate === d.dateStr;
              const hasUncompleted = d.tasksCount > d.completedCount;
              return (
                <button
                  key={d.dateStr}
                  onClick={() => setSelectedDate(d.dateStr)}
                  className={`p-2 rounded-xl text-xs font-semibold relative flex flex-col items-center justify-between min-h-12 border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-md font-bold scale-[1.05]"
                      : "bg-neutral-100/40 dark:bg-white/5 border-neutral-200/40 dark:border-white/5 text-neutral-800 dark:text-neutral-200 hover:border-neutral-300 dark:hover:border-white/10"
                  }`}
                >
                  <span>{d.dayNum}</span>
                  
                  {/* Indicator Dots for due tasks */}
                  {d.tasksCount > 0 && (
                    <div className="flex gap-0.5 mt-1">
                      {Array.from({ length: Math.min(3, d.tasksCount) }).map((_, idx) => (
                        <span
                          key={idx}
                          className={`w-1 h-1 rounded-full ${
                            hasUncompleted
                              ? isSelected ? "bg-amber-200" : "bg-rose-500"
                              : "bg-emerald-500"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Tasks due on selected date list display */}
          <div className="border-t border-neutral-200/50 dark:border-white/5 pt-3.5 space-y-2 mt-4">
            <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest block font-sans">
              Завдання на {selectedDate}
            </span>
            <div className="space-y-1.5 max-h-[140px] overflow-y-auto">
              {selectedDateTasks.length === 0 ? (
                <p className="text-[11px] text-neutral-400 py-4 text-center">Цього дня жодне завдання не заплановано.</p>
              ) : (
                selectedDateTasks.map((task) => (
                  <div key={task.id} className="p-2 border border-neutral-200/40 dark:border-white/10 rounded-xl bg-neutral-100/50 dark:bg-black/20 flex gap-2.5 items-center justify-between text-xs transition-all">
                    <span className={`font-semibold ${task.completed ? "line-through text-neutral-400" : "text-neutral-750 dark:text-neutral-300"}`}>
                      {task.title}
                    </span>
                    <span className={`text-[10px] py-0.5 px-2 rounded-full font-bold ${
                      task.priority === "high" ? "bg-rose-500/10 text-rose-500" : task.priority === "medium" ? "bg-amber-500/10 text-amber-500" : "bg-emerald-500/10 text-emerald-500"
                    }`}>
                      {task.priority === "high" ? "Високий" : task.priority === "medium" ? "Середній" : "Низький"}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Side: AI Day Scheduler with active slots */}
        <div className="lg:col-span-7 p-5 border border-neutral-200/50 dark:border-white/5 bg-white/60 dark:bg-[#0c0c0e]/30 backdrop-blur-xl rounded-2xl shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h4 className="font-semibold text-xs uppercase tracking-wider text-neutral-400 font-mono flex items-center gap-1.5 leading-none">
                <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
                AI-Планувальник денного графіку
              </h4>
              <p className="text-[10px] text-neutral-400 mt-1">Отримайте баланс фокусу на основі невиконаних завдань</p>
            </div>
            
            <button
              onClick={generateAISchedule}
              disabled={isLoading}
              className="py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:bg-neutral-300 dark:disabled:bg-white/5 disabled:text-neutral-500 text-white font-bold text-xs flex items-center gap-1 transition-all shadow cursor-pointer self-end sm:self-auto"
            >
              {isLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <RefreshCw className="w-3 h-3" />
              )}
              <span>Актуалізувати з AI</span>
            </button>
          </div>

          {/* AI Goals text prompt option */}
          <div className="flex gap-2 items-center bg-neutral-100/50 dark:bg-black/10 rounded-xl px-3 py-1.5 border border-neutral-150/40 dark:border-white/5">
            <span className="text-[10px] font-bold text-neutral-400 uppercase font-mono">Фокус</span>
            <input
              type="text"
              value={focusGoals}
              onChange={(e) => setFocusGoals(e.target.value)}
              placeholder="Введіть прагнення на розклад (напр. підготовка до іспиту або активний забіг)..."
              className="grow bg-transparent focus:outline-none border-none text-xs text-neutral-900 dark:text-white"
            />
          </div>

          {aiReview && (
            <div className="text-[11px] p-3 text-neutral-700 dark:text-neutral-400 bg-amber-500/5 border border-amber-500/10 rounded-xl leading-relaxed">
              <span className="font-bold text-[10px] text-amber-650 uppercase font-mono block mb-1">Резюме AI аналітика:</span>
              {aiReview}
            </div>
          )}

          {/* Agenda Event Slots Checklist */}
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
            <AnimatePresence initial={false}>
              {events.length === 0 ? (
                <div className="py-12 text-center text-neutral-400 dark:text-neutral-500 text-xs border border-dashed border-neutral-200 dark:border-white/5 rounded-xl">
                  <AlertCircle className="w-6 h-6 mx-auto stroke-1 mb-1 text-neutral-400" />
                  <span>Ваш розклад вільний. Натисніть "Актуалізувати з AI", щоб збалансувати ідеальну добу.</span>
                </div>
              ) : (
                events.map((ev) => (
                  <motion.div
                    key={ev.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className={`p-3 border rounded-xl flex items-center justify-between transition-all ${
                      ev.completed
                        ? "bg-neutral-100/40 dark:bg-black/10 border-neutral-200/50 dark:border-white/5 opacity-60"
                        : "bg-white/80 dark:bg-[#0c0c0e]/40 border-neutral-200/50 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/15"
                    }`}
                  >
                    <div className="flex gap-3 items-center">
                      <button
                        onClick={() => toggleEvent(ev.id)}
                        className={`w-5 h-5 rounded-md border flex items-center justify-center cursor-pointer transition-all ${
                          ev.completed
                            ? "bg-indigo-600 border-indigo-600 text-white"
                            : "border-neutral-300 dark:border-white/20 hover:border-indigo-500"
                        }`}
                      >
                        {ev.completed && <span className="text-[10px] font-bold">✓</span>}
                      </button>
                      
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono font-bold text-indigo-505 dark:text-indigo-400 bg-indigo-500/5 px-1.5 py-0.5 rounded leading-none">
                            {ev.timeSlot}
                          </span>
                          {ev.isAIGenerated && (
                            <span className="text-[9px] uppercase font-bold tracking-wider text-amber-500 font-mono flex items-center gap-0.5 leading-none">
                              <Sparkles className="w-2.5 h-2.5 fill-amber-500" />
                              AI
                            </span>
                          )}
                        </div>
                        <h5 className={`text-xs ml-0.5 font-bold mt-1 leading-normal ${
                          ev.completed ? "line-through text-neutral-400" : "text-neutral-850 dark:text-neutral-100"
                        }`}>
                          {ev.title}
                        </h5>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteEvent(ev.id)}
                      className="p-1 px-1.5 text-neutral-450 hover:text-rose-500 border border-transparent hover:border-rose-500/10 rounded cursor-pointer transition-all"
                      title="Видалити"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}
