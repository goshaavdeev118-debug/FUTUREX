import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Compass, Terminal, Shield, Eye, Bookmark, Sun, Moon, Sparkles, X, ChevronRight, Check } from "lucide-react";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  setTab: (tab: string) => void;
  toggleTheme: () => void;
  isDark: boolean;
  onActivateTool: (toolId: string) => void;
  user: any;
  onLogout: () => void;
}

export default function CommandPalette({
  isOpen,
  onClose,
  setTab,
  toggleTheme,
  isDark,
  onActivateTool,
  user,
  onLogout,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close with ESC key, navigate with arrows, and select with Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      
      // Global hotkey CMD+K / CTRL+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // It's handled by App.tsx actually, but fine
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery("");
    }
  }, [isOpen]);

  const items = [
    // Pages
    { id: "page-home", title: "Перейти на головну сторінку", category: "Навігація", action: () => { setTab("home"); onClose(); } },
    { id: "page-dashboard", title: "Відкрити дашборд аналітики", category: "Навігація", action: () => { setTab("dashboard"); onClose(); } },
    { id: "page-tools", title: "Перейти до інструментів розробника", category: "Навігація", action: () => { setTab("tools"); onClose(); } },
    { id: "page-blog", title: "Читати блог з категоріями", category: "Навігація", action: () => { setTab("blog"); onClose(); } },
    { id: "page-contacts", title: "Відкрити контакти та зворотний зв’язок", category: "Навігація", action: () => { setTab("contacts"); onClose(); } },

    // Tools
    { id: "tool-calc", title: "Калькулятор (Apple-style математичний модуль)", category: "Інструменти", action: () => { setTab("tools"); onActivateTool("calc"); onClose(); } },
    { id: "tool-todo", title: "Менеджер завдань (To-Do List)", category: "Інструменти", action: () => { setTab("tools"); onActivateTool("todo"); onClose(); } },
    { id: "tool-notes", title: "Записна книжка / Нотатки (localStorage)", category: "Інструменти", action: () => { setTab("tools"); onActivateTool("notes"); onClose(); } },
    { id: "tool-timer", title: "Таймер та секундомір (сегменти часу)", category: "Інструменти", action: () => { setTab("tools"); onActivateTool("timer"); onClose(); } },
    { id: "tool-pwd", title: "Генератор надійних паролів (AES-ready)", category: "Інструменти", action: () => { setTab("tools"); onActivateTool("pwd"); onClose(); } },
    { id: "tool-currency", title: "Конвертер світових валют", category: "Інструменти", action: () => { setTab("tools"); onActivateTool("currency"); onClose(); } },
    
    // Auth & Commands
    { id: "cmd-theme", title: isDark ? "Увімкнути світлу тему" : "Увімкнути темну тему", category: "Команди", action: () => { toggleTheme(); onClose(); } },
    user 
      ? { id: "cmd-logout", title: "Вийти з особистого кабінету", category: "Команди", action: () => { onLogout(); onClose(); } }
      : { id: "cmd-login", title: "Увійти / Створити профіль", category: "Команди", action: () => { setTab("cabinet"); onClose(); } },
  ];

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleArrowKeys = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
      }
    }
  };

  // Close when outer background clicked
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          onClick={handleBackdropClick}
          className="fixed inset-0 bg-neutral-950/40 dark:bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-[12vh] px-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            ref={modalRef}
            className="w-full max-w-xl rounded-2xl glass-card border border-neutral-200/50 dark:border-white/10 shadow-2xl overflow-hidden relative"
            onKeyDown={handleArrowKeys}
          >
            {/* Input search panel */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-neutral-250/20 dark:border-white/5 bg-white/40 dark:bg-[#0c0c0e]/30">
              <Search className="w-5 h-5 text-neutral-400 dark:text-neutral-500 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Введіть запит для пошуку (наприклад: 'нотатки', 'тема'...) "
                className="w-full bg-transparent border-none text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none text-sm"
              />
              <button
                onClick={onClose}
                className="p-1 hover:bg-neutral-100 dark:hover:bg-white/5 text-neutral-400 dark:text-neutral-500 rounded-md transition-all shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Results container */}
            <div className="max-h-[360px] overflow-y-auto p-2 scroll-py-1">
              {filteredItems.length === 0 ? (
                <div className="text-center py-12 text-neutral-400 dark:text-neutral-500 text-xs">
                  Збігів не знайдено. Спробуйте інший запит.
                </div>
              ) : (
                Object.entries(
                  filteredItems.reduce((acc, item) => {
                    if (!acc[item.category]) acc[item.category] = [];
                    acc[item.category].push(item);
                    return acc;
                  }, {} as Record<string, typeof filteredItems>)
                ).map(([category, catItems]) => (
                  <div key={category} className="mb-2 last:mb-0">
                    <p className="px-3 py-1 font-mono text-[9px] uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-bold select-none">
                      {category}
                    </p>
                    <div className="space-y-0.5 mt-1">
                      {catItems.map((item) => {
                        // Find global index in original filtered array
                        const globalIdx = filteredItems.findIndex((fi) => fi.id === item.id);
                        const isSelected = globalIdx === selectedIndex;

                        return (
                          <div
                            key={item.id}
                            onClick={item.action}
                            className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                              isSelected
                                ? "bg-indigo-600 text-white shadow-md border-glow-indigo"
                                : "hover:bg-neutral-100 dark:hover:bg-white/5 text-neutral-700 dark:text-neutral-300"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              {category === "Навігація" && <Compass className="w-4 h-4 shrink-0 opacity-75" />}
                              {category === "Інструменти" && <Terminal className="w-4 h-4 shrink-0 opacity-75" />}
                              {category === "Команди" && <Sparkles className="w-4 h-4 shrink-0 opacity-75" />}
                              <span className="text-xs font-medium truncate">{item.title}</span>
                            </div>
                            {isSelected && (
                              <motion.div
                                layoutId="cmdActiveCircle"
                                className="w-5 h-5 rounded-md bg-white/20 flex items-center justify-center shrink-0"
                              >
                                <ChevronRight className="w-3 h-3 text-white" />
                              </motion.div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer hints */}
            <div className="px-4 py-2 border-t border-neutral-250/20 dark:border-white/5 bg-neutral-50/50 dark:bg-neutral-900/40 text-[10px] text-neutral-400 dark:text-neutral-500 font-mono flex items-center justify-between pointer-events-none select-none">
              <div className="flex items-center gap-3">
                <span>↑↓ Навігація</span>
                <span>↵ Вибрати</span>
              </div>
              <div>
                <span>ESC Закрити</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
