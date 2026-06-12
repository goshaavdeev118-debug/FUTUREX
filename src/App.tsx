import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Calculator as CalcIcon,
  CheckSquare,
  FileText,
  Timer as ClockIcon,
  Key as KeyIcon,
  RefreshCw,
  Bell,
  X,
  Terminal,
  ShieldAlert,
  Sparkles,
  Flame,
  Target,
  Wallet,
  Database
} from "lucide-react";
import { AppNotification, User } from "./types";
import Navigation from "./components/Navigation";
import CommandPalette from "./components/CommandPalette";
import PortalHero from "./components/PortalHero";
import Dashboard from "./components/Dashboard";
import Calculator from "./components/Calculator";
import TaskManager from "./components/TaskManager";
import NotesApp from "./components/NotesApp";
import TimerApp from "./components/TimerApp";
import PasswordGenerator from "./components/PasswordGenerator";
import CurrencyConverter from "./components/CurrencyConverter";
import Blog from "./components/Blog";
import Contacts from "./components/Contacts";
import Cabinet from "./components/Cabinet";

// Under-hood modular components
import HabitsTracker from "./components/HabitsTracker";
import FinanceTracker from "./components/FinanceTracker";
import PlannerApp from "./components/PlannerApp";
import GoalsTracker from "./components/GoalsTracker";
import SyncManager from "./components/SyncManager";
import AIPresenter from "./components/AIPresenter";

interface ActiveToast {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>("home");
  const [activeTool, setActiveTool] = useState<string>("calc");
  const [isDark, setIsDark] = useState<boolean>(true);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  // Notifications and Toast States
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [toasts, setToasts] = useState<ActiveToast[]>([]);

  // 1. Core initialization
  useEffect(() => {
    // Theme setup from localStorage (defaulting to premium Deep Dark)
    const savedTheme = localStorage.getItem("futurex_theme");
    const optDark = savedTheme ? savedTheme === "dark" : true;
    setIsDark(optDark);

    // Profile auth session restore
    const savedUser = localStorage.getItem("futurex_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Auth session fallback", e);
      }
    }

    // Default notifications setup
    setNotifications([
      {
        id: "n1",
        title: "Ласкаво просимо до FutureX!",
        message: "Ваш багатофункціональний портал та преміальна екосистема готові до роботи.",
        type: "info",
        timestamp: "щойно",
        read: false
      },
      {
        id: "n2",
        title: "Локальна конфіденційність активована",
        message: "Всі нотатки та паролі кодуються безпосередньо у безпечній пісочниці браузера.",
        type: "success",
        timestamp: "5 хв тому",
        read: true
      }
    ]);
  }, []);

  // 2. Class toggler with theme updates
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("futurex_theme", isDark ? "dark" : "light");
  }, [isDark]);

  // Handle global CMD+K or CTRL+K search triggers
  useEffect(() => {
    const handleGlobalKeys = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleGlobalKeys);
    return () => window.removeEventListener("keydown", handleGlobalKeys);
  }, []);

  // 3. Dynamic Alerts Notification center
  const addNotificationWithToast = (
    title: string,
    message: string,
    type: 'info' | 'success' | 'warning' | 'error' = 'info'
  ) => {
    const logId = Date.now().toString();
    
    // Add to navigation logs
    const newNotif: AppNotification = {
      id: logId,
      title,
      message,
      type,
      timestamp: new Date().toLocaleTimeString("uk-UA", { hour: '2-digit', minute: '2-digit' }),
      read: false
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // Push into active Toast HUD list
    const newToast: ActiveToast = { id: logId, title, message, type };
    setToasts((prev) => [...prev, newToast]);

    // Timer to automatically sweep out toasts
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== logId));
    }, 4500);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // 4. Session Authentications actions
  const handleLogin = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem("futurex_user", JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("futurex_user");
    addNotificationWithToast("Вихід виконано", "Сесію успішно завершено. Дані збережено.", "info");
  };

  const manuallyDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const earnXP = (xpPoints: number) => {
    try {
      const stats = JSON.parse(localStorage.getItem("futurex_user_stats") || '{"xp":120,"level":1,"pomodorosCompleted":4}');
      stats.xp = (stats.xp || 0) + xpPoints;
      const oldLevel = stats.level || 1;
      const newLevel = Math.floor(stats.xp / 150) + 1;
      stats.level = newLevel;
      
      localStorage.setItem("futurex_user_stats", JSON.stringify(stats));
      
      if (newLevel > oldLevel) {
        addNotificationWithToast("🎉 НОВИЙ РІВЕНЬ ДОСЯГНУТО! 🎉", `Вітаємо! Ваш статус підвищено до Рівня ${newLevel}! Справжній воїн фокусу.`, "success");
      } else {
        addNotificationWithToast(`+${xpPoints} XP Отримано`, "Досвід заліковано в протокол вашого кабінету.", "success");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const toolsList = [
    { id: "calc", label: "Калькулятор", icon: CalcIcon, desc: "Математичні операції" },
    { id: "todo", label: "Завдання", icon: CheckSquare, desc: "Організація дня" },
    { id: "notes", label: "Нотатки", icon: FileText, desc: "Текстовий простір" },
    { id: "timer", label: "Таймер", icon: ClockIcon, desc: "Таймери та Pomodoro" },
    { id: "planner", label: "Планувальник", icon: Sparkles, desc: "AI Розклад" },
    { id: "habits", label: "Звички", icon: Flame, desc: "Радар звичок" },
    { id: "goals", label: "Цілі", icon: Target, desc: "Орієнтири результатів" },
    { id: "finances", label: "Фінанси", icon: Wallet, desc: "Фінансовий капітал" },
    { id: "pwd", label: "Паролі", icon: KeyIcon, desc: "Генератор ключів" },
    { id: "currency", label: "Валюти", icon: RefreshCw, desc: "Обмінний курс" },
    { id: "sync", label: "Хмара", icon: Database, desc: "Синхронізація пристроїв" },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 dark:bg-[#020617] text-slate-800 dark:text-slate-200 transition-colors duration-300 relative overflow-hidden">
      
      {/* Immersive Frosted Glass Theme Mesh Glow Spheres */}
      <div className="absolute top-[-10%] right-[-10%] w-[450px] h-[450px] bg-blue-600/10 dark:bg-blue-600/15 blur-[120px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[350px] h-[350px] bg-indigo-600/10 dark:bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none z-0"></div>
      
      {/* 1. Global Navigation header */}
      <Navigation
        currentTab={currentTab}
        setTab={setCurrentTab}
        isDark={isDark}
        toggleTheme={() => setIsDark((prev) => !prev)}
        notifications={notifications}
        markNotificationRead={markNotificationRead}
        user={user}
        onLogout={handleLogout}
        openSearch={() => setIsSearchOpen(true)}
      />

      {/* 2. Main Content viewport wrapper */}
      <main className="grow py-10 px-4 sm:px-6 lg:px-8 relative z-10 w-full max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* View Port Router matching requested screens */}
            {currentTab === "home" && (
              <PortalHero onStart={setCurrentTab} isDark={isDark} />
            )}

            {currentTab === "dashboard" && (
              <Dashboard />
            )}

            {currentTab === "tools" && (
              <div className="space-y-8">
                {/* Visual horizontal subtabs for widgets workspace */}
                <div className="text-center md:text-left max-w-4xl mx-auto">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-500 font-mono">Цифрова Робоча Станція Workspace</span>
                  <h2 className="text-2xl sm:text-3xl font-bold font-heading text-neutral-900 dark:text-white mt-1">
                    Універсальні Інструменти
                  </h2>
                </div>

                {/* Sub Tab buttons workstation navigator */}
                <div className="max-w-4xl mx-auto grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-11 gap-2 bg-neutral-200/40 dark:bg-[#0c0c0e]/40 p-1.5 rounded-2xl border border-neutral-200/50 dark:border-white/5 backdrop-blur-md">
                  {toolsList.map((tool) => {
                    const Icon = tool.icon;
                    const isActive = activeTool === tool.id;
                    return (
                      <button
                        key={tool.id}
                        onClick={() => setActiveTool(tool.id)}
                        className={`relative p-2.5 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all text-center group cursor-pointer ${
                          isActive
                            ? "text-indigo-600 dark:text-white"
                            : "text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
                        }`}
                      >
                        <Icon className={`w-4.5 h-4.5 transition-transform group-hover:scale-105 duration-200 ${
                          isActive ? "text-indigo-505 dark:text-indigo-400" : ""
                        }`} />
                        <span className="text-[10px] font-semibold">{tool.label}</span>
                        {isActive && (
                          <motion.div
                            layoutId="activeToolMarker"
                            className="absolute inset-0 bg-white dark:bg-white/5 rounded-xl -z-10 shadow-sm border border-neutral-200/30 dark:border-white/5"
                            transition={{ type: "spring", stiffness: 350, damping: 25 }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Main active subtool workflow viewport container */}
                <div className="max-w-5xl mx-auto pt-4">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTool}
                      initial={{ opacity: 0, scale: 0.98, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98, y: -15 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {activeTool === "calc" && <Calculator />}
                      {activeTool === "todo" && <TaskManager onNotify={addNotificationWithToast} />}
                      {activeTool === "notes" && <NotesApp onNotify={addNotificationWithToast} />}
                      {activeTool === "timer" && <TimerApp onNotify={addNotificationWithToast} onXPChange={earnXP} />}
                      {activeTool === "planner" && <PlannerApp onNotify={addNotificationWithToast} onXPChange={earnXP} />}
                      {activeTool === "habits" && <HabitsTracker onNotify={addNotificationWithToast} onXPChange={earnXP} />}
                      {activeTool === "goals" && <GoalsTracker onNotify={addNotificationWithToast} onXPChange={earnXP} />}
                      {activeTool === "finances" && <FinanceTracker onNotify={addNotificationWithToast} onXPChange={earnXP} />}
                      {activeTool === "pwd" && <PasswordGenerator onNotify={addNotificationWithToast} />}
                      {activeTool === "currency" && <CurrencyConverter />}
                      {activeTool === "sync" && <SyncManager onNotify={addNotificationWithToast} onDataRestored={() => window.location.reload()} />}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            )}

            {currentTab === "blog" && (
              <Blog />
            )}

            {currentTab === "contacts" && (
              <Contacts onNotify={addNotificationWithToast} />
            )}

            {currentTab === "cabinet" && (
              <Cabinet
                user={user}
                onLogin={handleLogin}
                onLogout={handleLogout}
                onNotify={addNotificationWithToast}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 3. Global Footer copyright details */}
      <footer className="border-t border-neutral-200/50 dark:border-white/5 bg-neutral-100/30 dark:bg-black/10 py-8 relative z-25 text-center text-xs text-neutral-400 select-none">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-medium font-sans">
            © 2026 FUTUREX Systems. Всі права захищено.
          </p>
          <p className="text-[10px] text-neutral-500 font-mono leading-normal max-w-sm mx-auto">
            Преміальний комерційний портал за кращими практиками комерційних лідерів Apple, Tesla та Stripe.
          </p>
        </div>
      </footer>

      {/* 4. Global Search shortcut overlay keyboard controller */}
      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        setTab={setCurrentTab}
        toggleTheme={() => setIsDark((prev) => !prev)}
        isDark={isDark}
        onActivateTool={setActiveTool}
        user={user}
        onLogout={handleLogout}
      />

      {/* 5. Custom Slide Toast Alerts HUD display (bottom-right aligned) */}
      <div className="fixed bottom-6 right-6 z-55 w-full max-w-sm flex flex-col gap-2.5 pointer-events-none px-4 sm:px-0">
        <AnimatePresence>
          {toasts.map((toast) => {
            let accentColor = "border-l-indigo-500 text-indigo-550 bg-indigo-500/5";
            if (toast.type === "success") accentColor = "border-l-emerald-500 text-emerald-550 bg-emerald-550/5";
            if (toast.type === "warning") accentColor = "border-l-amber-500 text-amber-550 bg-amber-550/5";
            if (toast.type === "error") accentColor = "border-l-rose-500 text-rose-550 bg-rose-550/5";

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                className={`p-4 rounded-xl shadow-2xl border border-neutral-200/40 dark:border-white/10 glass border-l-4 ${accentColor} flex justify-between items-start pointer-events-auto gap-4`}
              >
                <div>
                  <h5 className="font-bold text-xs text-neutral-850 dark:text-neutral-100 font-heading leading-tight">{toast.title}</h5>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-sans mt-1 leading-normal">{toast.message}</p>
                </div>
                
                <button
                  onClick={() => manuallyDismissToast(toast.id)}
                  className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-white transition-all cursor-pointer rounded"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Floating AI Assistant Copilot right-bottom corner */}
      <AIPresenter onNotify={addNotificationWithToast} />

    </div>
  );
}
