import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, X, Send, Sparkles, Bot, ArrowRight, CornerDownLeft, Loader2 } from "lucide-react";

interface AIPresenterProps {
  onNotify: (title: string, message: string, type: 'info' | 'success' | 'warning' | 'error') => void;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AIPresenter({ onNotify }: AIPresenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMsg, setInputMsg] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Привіт! Я твій інтелектуальний штурман FutureX. Я вмію аналізувати твій розклад, фінанси, звички та цілі. Чим можу допомогти тобі сьогодні?"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  // Read current user statistics & tools context from localStorage for Gemini smart suggestions
  const getCurrentState = () => {
    try {
      const tasks = JSON.parse(localStorage.getItem("futurex_tasks") || "[]");
      const habits = JSON.parse(localStorage.getItem("futurex_habits") || "[]");
      const goals = JSON.parse(localStorage.getItem("futurex_goals") || "[]");
      const finances = JSON.parse(localStorage.getItem("futurex_finances") || "[]");
      const levelData = JSON.parse(localStorage.getItem("futurex_user_stats") || '{"level":1,"xp":120}');
      return { tasks, habits, goals, finances, stats: levelData };
    } catch {
      return null;
    }
  };

  const handleSend = async (textToSend?: string) => {
    const rawText = textToSend || inputMsg;
    if (!rawText.trim()) return;

    if (!textToSend) setInputMsg("");
    
    const userMsg: Message = { role: "user", content: rawText };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const context = getCurrentState();
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          userContext: context
        })
      });

      if (!response.ok) {
        throw new Error("Не вдалося отримати відповідь від сервера AI.");
      }

      const resData = await response.json();
      if (resData.error) {
        throw new Error(resData.error);
      }

      setMessages((prev) => [...prev, { role: "assistant", content: resData.text || "Без відповіді." }]);
    } catch (err: any) {
      onNotify("Помилка AI асистента", err.message || "Сталася помилка з'єднання", "error");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Вибачте, сталася помилка з'єднання з сервером. Перевірте, чи додано ваш `GEMINI_API_KEY` в кошик Secrets і перезавантажте систему."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const prompts = [
    "Сплануй мій сьогоднішній день 🗓️",
    "Як покращити фокус та звички? ⚡",
    "Аналіз моїх фінансів 📊",
    "Запропонуй цілі на цей місяць 🎯"
  ];

  return (
    <>
      {/* Floating Animated Assistant Icon Button (Bottom Right) */}
      <div className="fixed bottom-6 left-6 xs:bottom-6 xs:right-6 md:bottom-8 md:right-8 z-40">
        <button
          id="ai-presenter-trigger"
          onClick={() => setIsOpen(!isOpen)}
          className="relative group w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-500 text-white flex items-center justify-center shadow-[0_8px_30px_rgb(99,102,241,0.4)] hover:shadow-[0_12px_40px_rgb(99,102,241,0.6)] border border-white/20 transition-all hover:scale-105 duration-300 cursor-pointer"
        >
          <div className="absolute inset-0 rounded-full bg-indigo-500 animate-ping opacity-15 duration-1000 -z-10" />
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="flex items-center justify-center"
              >
                <Sparkles className="w-5.5 h-5.5 text-amber-200 group-hover:rotate-12 transition-transform" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Floating Chat Panel overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: "spring", damping: 24, stiffness: 220 }}
            className="fixed bottom-24 right-4 sm:right-6 md:right-8 z-40 w-[92vw] sm:w-[380px] h-[550px] rounded-3xl glass shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-neutral-200/50 dark:border-white/10 flex flex-col justify-between overflow-hidden"
          >
            {/* Ambient Background Gradient Glows */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-12 left-0 w-36 h-36 bg-pink-500/5 rounded-full blur-3xl pointer-events-none" />

            {/* Header segment with sparkling status lines */}
            <div className="p-4 border-b border-neutral-200/50 dark:border-white/5 bg-white/40 dark:bg-black/20 flex justify-between items-center relative z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 text-indigo-550 dark:text-indigo-400">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-neutral-900 dark:text-white flex items-center gap-1.5">
                    FutureX AI Асистент
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </h4>
                  <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono">Powered by gemini-3.5-flash</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/5 cursor-pointer transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content list viewport wrapper */}
            <div className="grow overflow-y-auto p-4 space-y-4 relative z-10 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-neutral-800">
              <AnimatePresence initial={false}>
                {messages.map((m, idx) => {
                  const isAi = m.role === "assistant";
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${isAi ? "justify-start" : "justify-end"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                          isAi
                            ? "bg-white/70 dark:bg-[#0c0c0e]/60 text-neutral-850 dark:text-neutral-300 border border-neutral-200/50 dark:border-white/5 shadow-sm"
                            : "bg-indigo-600 text-white font-medium shadow-md ml-4"
                        } whitespace-pre-wrap`}
                      >
                        {m.content}
                      </div>
                    </motion.div>
                  );
                })}

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-white/40 dark:bg-white/5 border border-neutral-200/50 dark:border-white/5 rounded-2xl p-3.5 text-xs text-neutral-400 flex items-center gap-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-500" />
                      <span>Аналізую ваші дані...</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={scrollRef} />
            </div>

            {/* Suggestion Quick Chips pills */}
            {messages.length === 1 && (
              <div className="px-4 py-2 flex flex-wrap gap-1.5 relative z-10 max-h-[100px] overflow-y-auto border-t border-neutral-150/30 dark:border-white/5 pt-3">
                {prompts.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(p)}
                    className="text-[10px] font-semibold bg-neutral-200/50 hover:bg-neutral-200 dark:bg-white/5 dark:hover:bg-white/10 text-neutral-700 dark:text-neutral-400 border border-neutral-300/20 dark:border-white/10 py-1.5 px-2.5 rounded-full cursor-pointer transition-all text-left"
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}

            {/* Input keyboard actions panel */}
            <div className="p-3 border-t border-neutral-200/60 dark:border-white/5 bg-white/50 dark:bg-black/10 relative z-10 flex gap-1.5 items-center">
              <input
                type="text"
                placeholder="Спитати щось..."
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !isLoading && handleSend()}
                className="grow bg-neutral-200/50 dark:bg-neutral-900/60 font-sans focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded-xl px-3.5 py-2.5 text-xs border border-neutral-300/10 dark:border-white/5 text-neutral-950 dark:text-white"
              />
              <button
                disabled={isLoading || !inputMsg.trim()}
                onClick={() => handleSend()}
                className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:bg-neutral-300 dark:disabled:bg-white/5 disabled:text-neutral-500 transition-all cursor-pointer shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
