import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bell, Sun, Moon, Search, User, LogOut, Menu, X, ArrowRight, Activity, Terminal } from "lucide-react";
import { AppNotification, User as UserType } from "../types";

interface NavigationProps {
  currentTab: string;
  setTab: (tab: string) => void;
  isDark: boolean;
  toggleTheme: () => void;
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  user: UserType | null;
  onLogout: () => void;
  openSearch: () => void;
}

export default function Navigation({
  currentTab,
  setTab,
  isDark,
  toggleTheme,
  notifications,
  markNotificationRead,
  user,
  onLogout,
  openSearch,
}: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Handle outside click to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifDropdownOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { id: "home", label: "Головна" },
    { id: "dashboard", label: "Аналітика" },
    { id: "tools", label: "Інструменти" },
    { id: "blog", label: "Блог" },
    { id: "contacts", label: "Контакти" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass border-b border-neutral-200/50 dark:border-white/5 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo - Tesla-inspired futuristic typography */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setTab("home")}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-pink-500 to-amber-500 flex items-center justify-center shadow-lg relative overflow-hidden group">
              <span className="text-white font-black text-lg select-none group-hover:scale-110 transition-transform font-heading">F</span>
            </div>
            <span className="text-xl font-bold tracking-widest font-heading text-neutral-900 dark:text-white">
              FUTUREX<span className="text-indigo-500">.</span>
            </span>
          </div>

          {/* Desktop Navigation Link Tabs */}
          <nav className="hidden md:flex space-x-1 font-medium">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`relative px-4 py-2 text-sm rounded-lg transition-colors cursor-pointer ${
                    isActive
                      ? "text-neutral-900 dark:text-white"
                      : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                  }`}
                >
                  <span className="relative z-10">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTabBadge"
                      className="absolute inset-0 bg-neutral-100 dark:bg-white/5 rounded-lg -z-0"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Control Actions Right Panel */}
          <div className="flex items-center gap-2">
            {/* Search Trigger Button */}
            <button
              onClick={openSearch}
              className="p-2 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-white/5 transition-all cursor-pointer relative"
              title="Швидкий Пошук [CMD+K]"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Notification Dropdown Container */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="p-2 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-white/5 transition-all cursor-pointer relative"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white font-mono text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {notifDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-80 rounded-2xl glass border border-neutral-200/60 dark:border-white/10 shadow-xl py-3 z-50 origin-top-right text-sm"
                  >
                    <div className="px-4 pb-2 border-b border-neutral-200/50 dark:border-white/5 flex items-center justify-between">
                      <span className="font-semibold text-neutral-900 dark:text-white">Сповіщення ({unreadCount})</span>
                      {unreadCount > 0 && (
                        <span className="text-[10px] bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 px-2 py-0.5 rounded-full font-semibold">
                          Нові
                        </span>
                      )}
                    </div>

                    <div className="max-h-72 overflow-y-auto mt-2">
                      {notifications.length === 0 ? (
                        <div className="text-center py-8 text-neutral-400 dark:text-neutral-500 text-xs">
                          У вас немає нових сповіщень.
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => markNotificationRead(notif.id)}
                            className={`px-4 py-3 hover:bg-neutral-50 dark:hover:bg-white/5 transition-all border-b border-neutral-100 dark:border-white/5 last:border-b-0 cursor-pointer ${
                              !notif.read ? "bg-indigo-500/5 dark:bg-indigo-500/5" : ""
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-xs text-neutral-800 dark:text-neutral-200">{notif.title}</span>
                              <span className="text-[9px] text-neutral-400 font-mono">{notif.timestamp}</span>
                            </div>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-normal">{notif.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Dark & Light Theme Switch */}
            <button
              onClick={toggleTheme}
              className="p-2 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-white/5 transition-all cursor-pointer"
              title="Перемикач теми"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Profile cabinet interaction */}
            <div className="relative" ref={profileRef}>
              {user ? (
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1 pl-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-white/5 transition-all cursor-pointer border border-neutral-200/50 dark:border-white/5"
                >
                  <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300 hidden sm:inline max-w-[80px] truncate">
                    {user.username}
                  </span>
                  <img
                    src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=120&auto=format&fit=crop"}
                    alt={user.username}
                    className="w-7 h-7 rounded-lg object-cover ring-2 ring-indigo-500/30"
                  />
                </button>
              ) : (
                <button
                  onClick={() => setTab("cabinet")}
                  className="px-4 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-900 text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-sm flex items-center gap-1"
                >
                  <span className="hidden sm:inline">Кабінет</span>
                  <User className="w-3.5 h-3.5" />
                </button>
              )}

              <AnimatePresence>
                {/* User Dropdown Profile Action Menu */}
                {profileDropdownOpen && user && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-56 rounded-2xl glass border border-neutral-200/60 dark:border-white/10 shadow-xl py-2 z-50 origin-top-right text-sm"
                  >
                    <div className="px-4 py-2 border-b border-neutral-200/50 dark:border-white/5">
                      <p className="font-semibold text-neutral-900 dark:text-white truncate">{user.username}</p>
                      <p className="text-xs text-neutral-400 truncate">{user.email}</p>
                    </div>

                    <div className="p-1.5 space-y-0.5">
                      <button
                        onClick={() => {
                          setTab("cabinet");
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-white/5 transition-all text-neutral-700 dark:text-neutral-300 text-xs flex items-center justify-between"
                      >
                        <span>Особистий кабінет</span>
                        <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
                      </button>
                      <button
                        onClick={() => {
                          setTab("dashboard");
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-white/5 transition-all text-neutral-700 dark:text-neutral-300 text-xs flex items-center justify-between"
                      >
                        <span>Аналітика & метрики</span>
                        <Activity className="w-3.5 h-3.5 text-neutral-400" />
                      </button>
                      
                      <hr className="border-neutral-250/20 dark:border-white/5 my-1" />

                      <button
                        onClick={() => {
                          onLogout();
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-rose-500/10 hover:text-rose-600 dark:hover:bg-rose-500/10 text-rose-500 transition-all text-xs flex items-center justify-between"
                      >
                        <span>Вийти з кабінету</span>
                        <LogOut className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Hamburger menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-white/5 transition-all md:hidden cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation Panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-neutral-200/50 dark:border-white/5 bg-white/95 dark:bg-[#0c0c0e]/95 backdrop-blur-2xl"
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 rounded-xl transition-all cursor-pointer text-sm font-medium ${
                    currentTab === item.id
                      ? "bg-neutral-100 dark:bg-white/5 text-neutral-900 dark:text-white border-l-2 border-indigo-500 pl-3"
                      : "text-neutral-500 hover:bg-neutral-50 dark:hover:bg-white/5 hover:text-neutral-900 dark:text-neutral-400"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
