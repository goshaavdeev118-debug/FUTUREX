import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Zap, TrendingUp, BookOpen, Clock, Calendar, CheckSquare, Target, 
  Award, Flame, Wallet, Compass, Trophy, Star, Sparkles, CheckCircle2 
} from "lucide-react";
import { Task, Habit, Goal, FinancialRecord, PlannerEvent } from "../types";

export default function Dashboard() {
  const [hoveredNode, setHoveredNode] = useState<{ x: number; y: number; label: string; value: number } | null>(null);
  const [hoveredDonutSegment, setHoveredDonutSegment] = useState<{ category: string; value: number; color: string } | null>(null);

  // Dynamic States from Local Storage
  const [tasks, setTasks] = useState<Task[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [finances, setFinances] = useState<FinancialRecord[]>([]);
  const [events, setEvents] = useState<PlannerEvent[]>([]);
  const [notesCount, setNotesCount] = useState(0);
  const [userStats, setUserStats] = useState({ xp: 120, level: 1, pomodorosCompleted: 4 });

  useEffect(() => {
    try {
      const savedTasks = JSON.parse(localStorage.getItem("futurex_tasks") || "[]");
      const savedHabits = JSON.parse(localStorage.getItem("futurex_habits") || "[]");
      const savedGoals = JSON.parse(localStorage.getItem("futurex_goals") || "[]");
      const savedFinances = JSON.parse(localStorage.getItem("futurex_finances") || "[]");
      const savedEvents = JSON.parse(localStorage.getItem("futurex_planner_events") || "[]");
      const savedNotes = JSON.parse(localStorage.getItem("futurex_notes") || "[]");
      const savedStats = JSON.parse(localStorage.getItem("futurex_user_stats") || '{"xp": 120, "level": 1, "pomodorosCompleted": 4}');

      setTasks(savedTasks);
      setHabits(savedHabits);
      setGoals(savedGoals);
      setFinances(savedFinances);
      setEvents(savedEvents);
      setNotesCount(savedNotes.length);
      setUserStats(savedStats);
    } catch (e) {
      console.error("Dashboard metrics restoration error", e);
    }
  }, []);

  // Aggregated ratios for charts
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const taskRatio = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 75;

  const totalIncomes = finances.filter(f => f.type === 'income').reduce((acc, f) => acc + f.amount, 0);
  const totalExpenses = finances.filter(f => f.type === 'expense').reduce((acc, f) => acc + f.amount, 0);
  const netSavings = totalIncomes - totalExpenses;

  const maxStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak), 0) : 0;

  // Let's create beautiful reactive achievements based on user actions
  const achievements = [
    {
      id: "a1",
      title: "Перший Крок",
      desc: "Додайте першу звичку на щоденний радар",
      icon: "🎯",
      unlocked: habits.length > 0
    },
    {
      id: "a2",
      title: "Володар Часу",
      desc: "Згенеруйте та увімкніть розклад з AI",
      icon: "⚡",
      unlocked: events.some(e => e.isAIGenerated)
    },
    {
      id: "a3",
      title: "Дисциплінований Самурай",
      desc: "Досягніть серії з 3 підтверджень звичок",
      icon: "🔥",
      unlocked: maxStreak >= 3
    },
    {
      id: "a4",
      title: "Капіталіст",
      desc: "Зафіксуйте свій перший крипто-баланс",
      icon: "💎",
      unlocked: finances.length > 0
    },
    {
      id: "a5",
      title: "Стратег майбутнього",
      desc: "Встановіть щонайменше 3 важливі цілі",
      icon: "🏆",
      unlocked: goals.length >= 3
    },
    {
      id: "a6",
      title: "Творець Реальності",
      desc: "Виконайте хоча б одну ціль на 100%",
      icon: "✨",
      unlocked: goals.some(g => g.completed || g.progress >= 100)
    }
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  // Level Progression XP calculation: Every level is 150 XP. Range 0 - 150 points for progress bar.
  const currentLevelXpNeeded = 150;
  const relativeXpInLevel = userStats.xp % currentLevelXpNeeded;
  const levelProgressPct = (relativeXpInLevel / currentLevelXpNeeded) * 100;

  // Static mockup coordinates mapper for activities charts
  const lineChartData = [
    { label: "Пн", value: maxStreak > 0 ? 40 + maxStreak * 10 : 45 },
    { label: "Вт", value: completedTasks > 0 ? 50 + completedTasks * 5 : 58 },
    { label: "Ср", value: 72 },
    { label: "Чт", value: totalIncomes > 0 ? 65 + Math.min(25, Math.floor(totalIncomes/5000)) : 65 },
    { label: "Пт", value: 89 },
    { label: "Сб", value: 84 },
    { label: "Нд", value: 95 },
  ];

  const barChartData = [
    { day: "Пн", hrs: 4.5 },
    { day: "Вт", hrs: 6.2 },
    { day: "Ср", hrs: 7.8 },
    { day: "Чт", hrs: 5.4 },
    { day: "Пт", hrs: 8.5 },
    { day: "Сб", hrs: 9.8 },
    { day: "Нд", hrs: userStats.pomodorosCompleted > 0 ? Math.min(12, 3 + userStats.pomodorosCompleted * 1.5) : 6.0 },
  ];

  // Donut chart تقسیم energy parameters
  const donutData = [
    { category: "Робота", value: totalTasks > 0 ? Math.round((tasks.filter(t => t.category === "Робота").length / totalTasks) * 100) || 30 : 40, color: "#6366f1", pct: 30 },
    { category: "Особисте", value: totalTasks > 0 ? Math.round((tasks.filter(t => t.category === "Особисте").length / totalTasks) * 100) || 20 : 25, color: "#f43f5e", pct: 25 },
    { category: "Фінанси", value: finances.length > 0 ? 25 : 15, color: "#10b981", pct: 15 },
    { category: "Навчання", value: habits.length > 0 ? 20 : 12, color: "#f59e0b", pct: 12 },
    { category: "Інше", value: 10, color: "#0ea5e9", pct: 18 },
  ];

  // SVG bounding setup
  const width = 500;
  const height = 150;
  const paddingLeft = 35;
  const paddingRight = 15;
  const paddingTop = 20;
  const paddingBottom = 20;

  const getCoordinates = () => {
    const usableWidth = width - paddingLeft - paddingRight;
    const usableHeight = height - paddingTop - paddingBottom;
    const maxVal = 100;

    return lineChartData.map((d, index) => {
      const x = paddingLeft + (index / (lineChartData.length - 1)) * usableWidth;
      const y = paddingTop + usableHeight - (d.value / maxVal) * usableHeight;
      return { x, y, label: d.label, value: d.value };
    });
  };

  const pts = getCoordinates();

  const linePath = pts.reduce((acc, p, i) => {
    return acc + `${i === 0 ? "M" : "L"} ${p.x} ${p.y} `;
  }, "");

  const areaPath = linePath + `L ${pts[pts.length - 1].x} ${height - paddingBottom} L ${pts[0].x} ${height - paddingBottom} Z`;

  let cumulativePercent = 0;

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fadeIn">
      
      {/* Gamified Motivation Hub Card (Levels & Achievements progress) */}
      <div className="p-6 rounded-3xl border border-neutral-200/50 dark:border-white/5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 text-white shadow-xl relative overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute top-[-30%] right-[-10%] w-72 h-72 bg-indigo-500/15 rounded-full blur-[70px] pointer-events-none" />
        <div className="absolute bottom-[-30%] left-[-10%] w-60 h-60 bg-pink-500/10 rounded-full blur-[60px] pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
          
          {/* Level Info HUD circle badge */}
          <div className="md:col-span-4 flex flex-col items-center text-center p-3 border-r border-white/5 md:pr-6">
            <div className="relative w-24 h-24 mb-3 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="48" cy="48" r="42" stroke="rgba(255,255,255,0.05)" strokeWidth="4.5" fill="none" />
                <circle 
                  cx="48" cy="48" r="42" 
                  stroke="#a78bfa" strokeWidth="5" 
                  strokeDasharray="264" strokeDashoffset={264 - (264 * levelProgressPct) / 100}
                  strokeLinecap="round" fill="none" 
                  style={{ transition: "stroke-dashoffset 0.8s ease" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[10px] uppercase tracking-wider font-mono text-purple-300 font-bold leading-none">Рівень</span>
                <span className="text-3xl font-black font-mono tracking-tight text-white mt-1 leading-none">{userStats.level}</span>
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-bold tracking-normal font-sans">Елітний Оператор</h4>
              <p className="text-[10px] text-purple-350 font-mono">
                {relativeXpInLevel} / {currentLevelXpNeeded} XP • Наступний рівень за {currentLevelXpNeeded - relativeXpInLevel} XP
              </p>
            </div>
          </div>

          {/* Goals and stats completion summary highlights */}
          <div className="md:col-span-8 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h3 className="text-base font-bold font-heading text-neutral-105 flex items-center gap-1.5">
                  <Trophy className="w-4.5 h-4.5 text-amber-500 animate-bounce" />
                  Мотиваційні Досягнення
                </h3>
                <p className="text-xs text-indigo-200">Виконуйте завдання та підтримуйте звички, щоб відкривати унікальні медалі екосистеми!</p>
              </div>
              <div className="text-xs font-bold bg-[#6366f1]/20 border border-[#6366f1]/30 py-1.5 px-3.5 rounded-full flex items-center gap-1.5 font-mono">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-450" />
                <span>Отримано: {unlockedCount} з {achievements.length}</span>
              </div>
            </div>

            {/* Achievements badges collection matrix list */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {achievements.map((ach) => (
                <div 
                  key={ach.id} 
                  className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all text-left ${
                    ach.unlocked 
                      ? "bg-slate-800/85 border-indigo-500/30 shadow-md scale-[1.02]" 
                      : "bg-slate-900/40 border-white/5 opacity-40 select-none"
                  }`}
                  title={ach.desc}
                >
                  <div className="text-xl">{ach.icon}</div>
                  <div className="leading-tight">
                    <h5 className="text-[11px] font-bold text-white tracking-normal">{ach.title}</h5>
                    <p className="text-[9px] text-indigo-200 font-medium truncate max-w-[100px]">{ach.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* 2. Header KPIs panels */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Zap, label: "Рівень дисципліни", val: maxStreak > 0 ? `${maxStreak} дн` : "2 дн", desc: `Макс серія звичок (+14.2%)`, color: "text-indigo-505 bg-indigo-500/10 border-indigo-500/5" },
          { icon: Clock, label: "Фокусний баланс", val: userStats.pomodorosCompleted > 0 ? `${userStats.pomodorosCompleted * 25} хв` : "100 хв", desc: `${userStats.pomodorosCompleted} сеансів Pomodoro`, color: "text-rose-505 bg-rose-500/10 border-rose-500/5" },
          { icon: Target, label: "Виконання завдань", val: `${taskRatio}%`, desc: `${completedTasks} виконаних цілей`, color: "text-emerald-505 bg-emerald-500/10 border-emerald-500/5" },
          { icon: BookOpen, label: "Локальна конфіденційність", val: `${notesCount} од.`, desc: `${notesCount} зафіксовано в блокноті`, color: "text-amber-505 bg-amber-500/10 border-amber-500/5" },
        ].map((kpi, idx) => {
          const IconComp = kpi.icon;
          return (
            <div key={idx} className="p-4 sm:p-5 rounded-2xl border border-neutral-200/50 dark:border-white/5 bg-white/60 dark:bg-[#0c0c0e]/30 backdrop-blur-md shadow-sm">
              <div className="flex gap-3 items-center">
                <div className={`p-2 rounded-xl border ${kpi.color}`}>
                  <IconComp className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                </div>
                <div>
                  <span className="text-[11px] font-sans font-medium text-neutral-400 dark:text-neutral-500 block">
                    {kpi.label}
                  </span>
                  <span className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white block mt-0.5 font-sans">
                    {kpi.val}
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-neutral-400 dark:text-neutral-550 mt-2.5 pt-2 border-t border-neutral-100 dark:border-white/5 font-sans">
                {kpi.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* 3. Main charts visualizers block */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Plot Line Chart details (Stripe styled coordinate tracker) */}
        <div className="lg:col-span-2 rounded-2xl border border-neutral-200/50 dark:border-white/5 bg-white/60 dark:bg-[#0c0c0e]/30 backdrop-blur-xl p-5 shadow-md relative min-h-[300px] flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h4 className="font-semibold text-xs uppercase tracking-wider text-neutral-400 font-mono">Графік Активності</h4>
                <p className="text-base font-bold text-neutral-850 dark:text-neutral-100 font-sans mt-0.5">Відсоток Корисного Використання</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-neutral-400 bg-neutral-100 dark:bg-white/5 px-3 py-1 rounded-lg">
                <Calendar className="w-3.5 h-3.5" />
                <span>Останні 7 днів</span>
              </div>
            </div>

            {/* Area SVG Chart panel */}
            <div className="relative w-full h-[180px] mt-6 select-none">
              <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0.00" />
                  </linearGradient>
                </defs>

                {[25, 50, 75, 100].map((gl) => {
                  const y = paddingTop + (height - paddingTop - paddingBottom) * (1 - gl / 100);
                  return (
                    <g key={gl}>
                      <line
                        x1={paddingLeft}
                        y1={y}
                        x2={width - paddingRight}
                        y2={y}
                        className="stroke-neutral-200/60 dark:stroke-white/5"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                      />
                      <text
                        x={paddingLeft - 8}
                        y={y + 3}
                        className="fill-neutral-400 font-mono text-[9px] text-right"
                        textAnchor="end"
                      >
                        {gl}%
                      </text>
                    </g>
                  );
                })}

                {pts.map((p) => {
                  return (
                    <line
                      key={p.label}
                      x1={p.x}
                      y1={paddingTop}
                      x2={p.x}
                      y2={height - paddingBottom}
                      className="stroke-neutral-150/30 dark:stroke-white/5"
                      strokeWidth="1"
                    />
                  );
                })}

                <path d={areaPath} fill="url(#chartGradient)" />
                <path d={linePath} fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" />

                {pts.map((p, i) => {
                  return (
                    <circle
                      key={i}
                      cx={p.x}
                      cy={p.y}
                      r="4.5"
                      className="fill-white dark:fill-neutral-900 stroke-indigo-500 hover:r-6.5 transition-all cursor-crosshair pb-3"
                      strokeWidth="2.5"
                      onMouseEnter={() => setHoveredNode(p)}
                      onMouseLeave={() => setHoveredNode(null)}
                    />
                  );
                })}
              </svg>

              {hoveredNode && (
                <div
                  className="absolute bg-neutral-900 text-white rounded-lg p-2.5 shadow-xl glass text-xs pointer-events-none z-20"
                  style={{
                    left: `${(hoveredNode.x / width) * 100}%`,
                    top: `${(hoveredNode.y / height) * 100 - 35}%`,
                    transform: "translateX(-50%)"
                  }}
                >
                  <p className="font-bold text-[10px] text-neutral-400 font-mono">{hoveredNode.label}</p>
                  <p className="font-semibold text-white mt-0.5">{hoveredNode.value}% Фокус</p>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center text-[10px] text-neutral-400 font-mono mt-2" style={{ paddingLeft: `${(paddingLeft / width) * 100}%`, paddingRight: `${(paddingRight / width) * 100}%` }}>
              {lineChartData.map((d) => (
                <span key={d.label}>{d.label}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Categories Distribution Donut Chart */}
        <div className="rounded-2xl border border-neutral-200/50 dark:border-white/5 bg-white/60 dark:bg-[#0c0c0e]/30 backdrop-blur-xl p-5 shadow-md flex flex-col justify-between">
          <div>
            <h4 className="font-semibold text-xs uppercase tracking-wider text-neutral-400 font-mono mb-1">Спрямування Енергії</h4>
            <p className="text-sm font-bold text-neutral-850 dark:text-neutral-100 font-sans pb-3 border-b border-neutral-100 dark:border-white/5">
              Поділ завдань за категоріями
            </p>

            <div className="relative flex items-center justify-center my-6 h-36">
              <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.915" fill="none" className="stroke-neutral-100 dark:stroke-neutral-800" strokeWidth="3" />
                
                {donutData.map((seg, i) => {
                  const dasharray = `${seg.value} ${100 - seg.value}`;
                  const offset = 100 - cumulativePercent;
                  cumulativePercent += seg.value;

                  return (
                    <circle
                      key={i}
                      cx="18"
                      cy="18"
                      r="15.915"
                      fill="none"
                      stroke={seg.color}
                      strokeWidth="3.2"
                      strokeDasharray={dasharray}
                      strokeDashoffset={offset}
                      className="cursor-pointer transition-all hover:stroke-[4]"
                      onMouseEnter={() => setHoveredDonutSegment(seg)}
                      onMouseLeave={() => setHoveredDonutSegment(null)}
                    />
                  );
                })}
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
                <span className="text-[10px] text-neutral-400 font-sans truncate max-w-[80px]">
                  {hoveredDonutSegment ? hoveredDonutSegment.category : "Концентрація"}
                </span>
                <span className="text-base font-bold font-mono text-neutral-800 dark:text-neutral-100 mt-0.5">
                  {hoveredDonutSegment ? `${hoveredDonutSegment.value}%` : "100%"}
                </span>
              </div>
            </div>

            <div className="space-y-2 mt-4 max-h-[140px] overflow-y-auto">
              {donutData.map((d) => (
                <div
                  key={d.category}
                  className="flex justify-between items-center text-xs p-1.5 rounded-lg border border-transparent hover:border-neutral-200/50 dark:hover:border-white/5 hover:bg-neutral-50 dark:hover:bg-white/5"
                  onMouseEnter={() => setHoveredDonutSegment(d)}
                  onMouseLeave={() => setHoveredDonutSegment(null)}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-md" style={{ backgroundColor: d.color }} />
                    <span className="text-neutral-600 dark:text-neutral-400 font-medium">{d.category}</span>
                  </div>
                  <span className="font-mono font-bold text-neutral-800 dark:text-neutral-200">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Daily Screen Focus Logs Bar Chart panel */}
      <div className="p-5 rounded-2xl border border-neutral-200/50 dark:border-white/5 bg-white/60 dark:bg-[#0c0c0e]/30 backdrop-blur-xl shadow-md">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h4 className="font-semibold text-xs uppercase tracking-wider text-neutral-400 font-mono">Розподіл Працездатності</h4>
            <p className="text-base font-bold text-neutral-850 dark:text-neutral-100 mt-0.5">Час щоденного фокусу за тиждень</p>
          </div>
          <div className="text-[10px] uppercase font-bold text-indigo-555 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-lg font-mono">
            Статус: Синхронізовано
          </div>
        </div>

        <div className="grid grid-cols-7 gap-4 items-end min-h-[140px] pt-4 border-b border-neutral-200/50 dark:border-white/5">
          {barChartData.map((item) => {
            const pct = (item.hrs / 12) * 100; // max scale 12 hours
            return (
              <div key={item.day} className="flex flex-col items-center gap-2 group cursor-pointer">
                <span className="opacity-0 group-hover:opacity-100 font-mono text-[10px] text-indigo-500 font-bold transition-all transform -translate-y-1">
                  {item.hrs} год
                </span>
                
                <div className="w-full sm:w-12 bg-neutral-150 dark:bg-neutral-850 h-28 rounded-lg overflow-hidden relative shadow-inner">
                  <div
                    style={{ height: `${pct}%` }}
                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-indigo-600 via-pink-500 to-indigo-400 rounded-lg group-hover:opacity-90 transition-all duration-500"
                  />
                </div>

                <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono py-1 font-bold">
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
