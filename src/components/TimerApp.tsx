import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Pause, RotateCcw, AlertCircle, Flag, Timer, Zap, Volume2, Brain } from "lucide-react";

interface TimerAppProps {
  onNotify: (title: string, message: string, type: 'info' | 'success' | 'warning' | 'error') => void;
  onXPChange?: (xpEarned: number) => void;
}

export default function TimerApp({ onNotify, onXPChange }: TimerAppProps) {
  const [activeSegment, setActiveSegment] = useState<'timer' | 'stopwatch' | 'pomodoro'>("pomodoro");

  // Timer States
  const [inputMinutes, setInputMinutes] = useState(5);
  const [inputSeconds, setInputSeconds] = useState(0);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState(300);
  const [timerDuration, setTimerDuration] = useState(300);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Stopwatch States
  const [stopwatchMs, setStopwatchMs] = useState(0);
  const [isStopwatchRunning, setIsStopwatchRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);

  // Pomodoro States
  const [pomoMode, setPomoMode] = useState<'focus' | 'short' | 'long'>("focus");
  const [pomoSecondsLeft, setPomoSecondsLeft] = useState(1500); // 25 min default
  const [pomoDuration, setPomoDuration] = useState(1500);
  const [isPomoRunning, setIsPomoRunning] = useState(false);

  // Refs for intervals
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const stopwatchIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pomoIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const stopwatchStartRef = useRef<number>(0);
  const stopwatchAccumulatedRef = useRef<number>(0);

  // Safely trigger browser chime context sound
  const playAlertSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // Chord tone A5
      gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 1.2);
    } catch {
      // Inaudible if context blocked
    }
  };

  // 1. Timer Logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timerSecondsLeft > 0) {
      interval = setInterval(() => {
        setTimerSecondsLeft((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSecondsLeft]);

  // Handle Timer End
  useEffect(() => {
    if (timerSecondsLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      onNotify("Час вичерпано!", "Таймер завершив зворотний відлік.", "warning");
      playAlertSound();
    }
  }, [timerSecondsLeft, isTimerRunning]);

  const handleStartTimer = () => {
    if (!isTimerRunning && timerSecondsLeft === 0) {
      const total = inputMinutes * 60 + inputSeconds;
      if (total <= 0) return;
      setTimerDuration(total);
      setTimerSecondsLeft(total);
    }
    setIsTimerRunning(!isTimerRunning);
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    const total = inputMinutes * 60 + inputSeconds;
    setTimerDuration(total);
    setTimerSecondsLeft(total);
  };

  const handleApplyDuration = (m: number, s: number) => {
    setIsTimerRunning(false);
    const total = m * 60 + s;
    setTimerDuration(total);
    setTimerSecondsLeft(total);
  };

  // 2. Stopwatch Logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isStopwatchRunning) {
      stopwatchStartRef.current = Date.now();
      interval = setInterval(() => {
        setStopwatchMs(stopwatchAccumulatedRef.current + (Date.now() - stopwatchStartRef.current));
      }, 10);
    } else {
      stopwatchAccumulatedRef.current = stopwatchMs;
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isStopwatchRunning]);

  const startStopwatch = () => {
    setIsStopwatchRunning(!isStopwatchRunning);
  };

  const resetStopwatch = () => {
    setIsStopwatchRunning(false);
    setStopwatchMs(0);
    setLaps([]);
    stopwatchAccumulatedRef.current = 0;
  };

  const handleRecordLap = () => {
    if (isStopwatchRunning || stopwatchMs > 0) {
      setLaps([stopwatchMs, ...laps].slice(0, 9));
    }
  };

  // 3. Pomodoro Logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPomoRunning && pomoSecondsLeft > 0) {
      interval = setInterval(() => {
        setPomoSecondsLeft((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPomoRunning, pomoSecondsLeft]);

  // Handle Pomodoro Session Completion
  useEffect(() => {
    if (pomoSecondsLeft === 0 && isPomoRunning) {
      setIsPomoRunning(false);
      
      if (pomoMode === "focus") {
        onNotify("Грандіозно! Сеанс Pomodoro завершено! 🎉", "Ви доблесно фокусувалися протягом 25 хвилин. Час відпочити!", "success");
        playAlertSound();
        
        // Grant Focus XP gamification reward instantly!
        if (onXPChange) onXPChange(30);

        // Update Pomodoros Completed stats in storage
        try {
          const stats = JSON.parse(localStorage.getItem("futurex_user_stats") || '{"xp":120,"level":1,"pomodorosCompleted":0}');
          stats.pomodorosCompleted = (stats.pomodorosCompleted || 0) + 1;
          stats.xp += 30; // 30 XP per Completed Focus!
          stats.level = Math.floor(stats.xp / 150) + 1;
          localStorage.setItem("futurex_user_stats", JSON.stringify(stats));
        } catch (e) {
          console.error(e);
        }
      } else {
        onNotify("Час перерви завершено! ⚡", "Ваш розум відпочив та перезавантажився. Повертайтеся до фокусу!", "info");
        playAlertSound();
      }
      
      // Reset to default duration for safety
      const secs = pomoMode === "focus" ? 1500 : pomoMode === "short" ? 300 : 900;
      setPomoDuration(secs);
      setPomoSecondsLeft(secs);
    }
  }, [pomoSecondsLeft, isPomoRunning, pomoMode]);

  const handleApplyPomoMode = (mode: 'focus' | 'short' | 'long') => {
    setIsPomoRunning(false);
    setPomoMode(mode);
    const secs = mode === "focus" ? 1500 : mode === "short" ? 300 : 900;
    setPomoDuration(secs);
    setPomoSecondsLeft(secs);
  };

  // Conversions
  const formatTimerDisplay = (sec: number) => {
    const hours = Math.floor(sec / 3600);
    const minutes = Math.floor((sec % 3600) / 60);
    const seconds = sec % 60;
    return `${hours > 0 ? String(hours).padStart(2, '0') + ':' : ''}${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const formatStopwatchDisplay = (ms: number) => {
    const totalSecs = Math.floor(ms / 1000);
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    const mill = Math.floor((ms % 1000) / 10);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(mill).padStart(2, '0')}`;
  };

  const timerPct = timerDuration > 0 ? (timerSecondsLeft / timerDuration) * 100 : 0;
  const pomoPct = pomoDuration > 0 ? (pomoSecondsLeft / pomoDuration) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto items-start">
      
      {/* Sidebar Selector Navigation of states */}
      <div className="p-4 rounded-xl border border-neutral-200/50 dark:border-white/5 bg-white/60 dark:bg-[#0c0c0e]/30 backdrop-blur-xl shadow-md space-y-1.5 flex xs:flex-row md:flex-col justify-start">
        <button
          onClick={() => setActiveSegment("pomodoro")}
          className={`w-full text-left px-4 py-3 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            activeSegment === "pomodoro"
              ? "bg-indigo-500/10 text-indigo-500 border border-indigo-500/20"
              : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
          }`}
        >
          <Brain className="w-4 h-4" />
          <span>Таймер Pomodoro</span>
        </button>

        <button
          onClick={() => setActiveSegment("timer")}
          className={`w-full text-left px-4 py-3 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            activeSegment === "timer"
              ? "bg-indigo-500/10 text-indigo-500 border border-indigo-500/20"
              : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
          }`}
        >
          <Timer className="w-4 h-4" />
          <span>Зворотний таймер</span>
        </button>

        <button
          onClick={() => setActiveSegment("stopwatch")}
          className={`w-full text-left px-4 py-3 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            activeSegment === "stopwatch"
              ? "bg-indigo-500/10 text-indigo-500 border border-indigo-500/20"
              : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Прецизійний секундомір</span>
        </button>
      </div>

      {/* Main Workstation workspace */}
      <div className="md:col-span-2 rounded-2xl border border-neutral-200/50 dark:border-white/5 bg-white/60 dark:bg-[#0c0c0e]/30 backdrop-blur-xl p-6 shadow-xl relative min-h-[440px] flex flex-col justify-between overflow-hidden">
        {/* Ambient background blur */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <AnimatePresence mode="wait">
          
          {/* Active section: Pomodoro Timer */}
          {activeSegment === "pomodoro" && (
            <motion.div
              key="pomo-sec"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6 flex flex-col items-center w-full"
            >
              <div className="w-full flex justify-between items-center px-1">
                <h4 className="font-semibold text-xs uppercase tracking-wider text-neutral-400 font-mono">Pomodoro Концентрація</h4>
                <div className="flex items-center gap-1 text-[10px] text-purple-650 bg-purple-500/5 border border-purple-500/15 py-0.5 px-2 rounded-full font-mono font-bold">
                  <span>Фокус: +30 XP</span>
                </div>
              </div>

              {/* Swappable internal Break/Focus pills selection */}
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-neutral-200/50 dark:bg-black/30 rounded-xl text-xs font-semibold w-full max-w-xs">
                <button
                  onClick={() => handleApplyPomoMode("focus")}
                  className={`py-1.5 rounded-lg text-center cursor-pointer transition-all ${
                    pomoMode === "focus"
                      ? "bg-white dark:bg-white/5 shadow text-indigo-505 dark:text-white border border-neutral-200/30 dark:border-white/5"
                      : "text-neutral-500 hover:text-neutral-900"
                  }`}
                >
                  Фокус (25м)
                </button>
                <button
                  onClick={() => handleApplyPomoMode("short")}
                  className={`py-1.5 rounded-lg text-center cursor-pointer transition-all ${
                    pomoMode === "short"
                      ? "bg-white dark:bg-white/5 shadow text-indigo-505 dark:text-white border border-neutral-200/30 dark:border-white/5"
                      : "text-neutral-500 hover:text-neutral-900"
                  }`}
                >
                  Перерва (5м)
                </button>
                <button
                  onClick={() => handleApplyPomoMode("long")}
                  className={`py-1.5 rounded-lg text-center cursor-pointer transition-all ${
                    pomoMode === "long"
                      ? "bg-white dark:bg-white/5 shadow text-indigo-505 dark:text-white border border-neutral-200/30 dark:border-white/5"
                      : "text-neutral-500 hover:text-neutral-900"
                  }`}
                >
                  Відпочинок (15м)
                </button>
              </div>

              {/* Countdown numeric circle progress ring */}
              <div className="relative w-44 h-44 my-2">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="88" cy="88" r="76" className="stroke-neutral-200 dark:stroke-neutral-850 fill-none" strokeWidth="5.5" />
                  <circle
                    cx="88" cy="88" r="76"
                    className="stroke-[#6366f1] fill-none"
                    strokeWidth="5.5"
                    strokeDasharray="478"
                    strokeDashoffset={478 - (478 * pomoPct) / 100}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 0.6s linear" }}
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-3xl font-bold font-mono text-neutral-850 dark:text-white tracking-tight">
                  {formatTimerDisplay(pomoSecondsLeft)}
                </span>
              </div>

              {/* Action trigger button indicators */}
              <div className="flex gap-3 w-full max-w-sm pt-2">
                <button
                  onClick={() => handleApplyPomoMode(pomoMode)}
                  className="w-1/3 py-2.5 rounded-xl border border-neutral-200 dark:border-white/10 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-white/5 text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Скинути</span>
                </button>
                <button
                  onClick={() => setIsPomoRunning(!isPomoRunning)}
                  className={`w-2/3 py-2.5 rounded-xl text-white text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all ${
                    isPomoRunning ? "bg-amber-600 hover:bg-amber-500" : "bg-[#6366f1] hover:bg-indigo-505"
                  }`}
                >
                  {isPomoRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isPomoRunning ? "Призупинити" : "Запустити сесію"}</span>
                </button>
              </div>
            </motion.div>
          )}

          {activeSegment === "timer" && (
            <motion.div
              key="timer-sec"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6 flex flex-col items-center w-full"
            >
              <div className="w-full flex justify-between items-center px-1">
                <h4 className="font-semibold text-xs uppercase tracking-wider text-neutral-400 font-mono">Цифровий Таймер</h4>
                <div className="flex items-center gap-1 text-[11px] text-indigo-550 border border-indigo-500/20 px-2 py-0.5 rounded bg-indigo-500/5">
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Сирену увімкнено</span>
                </div>
              </div>

              <div className="relative w-44 h-44 my-2">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="88" cy="88" r="76" className="stroke-neutral-200 dark:stroke-neutral-850 fill-none" strokeWidth="5" />
                  <circle
                    cx="88" cy="88" r="76"
                    className="stroke-indigo-500 fill-none"
                    strokeWidth="5"
                    strokeDasharray="478"
                    strokeDashoffset={478 - (478 * timerPct) / 100}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 0.6s linear" }}
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-3xl font-bold font-mono text-neutral-850 dark:text-neutral-100 tracking-tight">
                  {formatTimerDisplay(timerSecondsLeft)}
                </span>
              </div>

              <div className="flex gap-2 items-center justify-center p-2.5 bg-neutral-100/50 dark:bg-black/20 rounded-xl border border-neutral-150/40 dark:border-white/5">
                <div className="flex items-center gap-1 text-xs">
                  <input
                    type="number"
                    min="0"
                    max="60"
                    value={inputMinutes}
                    onChange={(e) => {
                      const val = Math.max(0, parseInt(e.target.value) || 0);
                      setInputMinutes(val);
                      handleApplyDuration(val, inputSeconds);
                    }}
                    className="w-10 text-center font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/5 py-1 px-1"
                  />
                  <span className="text-neutral-505">хв</span>
                </div>
                <span className="text-neutral-400 font-mono">:</span>
                <div className="flex items-center gap-1 text-xs">
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={inputSeconds}
                    onChange={(e) => {
                      const val = Math.max(0, Math.min(59, parseInt(e.target.value) || 0));
                      setInputSeconds(val);
                      handleApplyDuration(inputMinutes, val);
                    }}
                    className="w-10 text-center font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/5 py-1 px-1"
                  />
                  <span className="text-neutral-505">сек</span>
                </div>
              </div>

              <div className="flex gap-3 w-full max-w-sm pt-2">
                <button
                  onClick={handleResetTimer}
                  className="w-1/3 py-2.5 rounded-xl border border-neutral-200 dark:border-white/10 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-white/5 text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Скинути</span>
                </button>
                <button
                  onClick={handleStartTimer}
                  className={`w-2/3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer text-white shadow-md transition-all ${
                    isTimerRunning ? "bg-amber-600 hover:bg-amber-500" : "bg-indigo-600 hover:bg-indigo-550"
                  }`}
                >
                  {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isTimerRunning ? "Призупинити" : "Запустити таймер"}</span>
                </button>
              </div>
            </motion.div>
          )}

          {activeSegment === "stopwatch" && (
            <motion.div
              key="stopwatch-sec"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6 flex flex-col justify-between w-full"
            >
              <div className="flex justify-between items-center px-1">
                <h4 className="font-semibold text-xs uppercase tracking-wider text-neutral-400 font-mono">Цифровий Секундомір</h4>
                <div className="text-[10px] text-neutral-405 font-mono">Похибка ~10мс</div>
              </div>

              <div className="text-center py-6">
                <span className="text-5xl font-bold font-mono tracking-tight text-neutral-850 dark:text-neutral-100">
                  {formatStopwatchDisplay(stopwatchMs)}
                </span>
              </div>

              <div className="w-full bg-neutral-100/50 dark:bg-black/35 rounded-2xl p-3.5 border border-neutral-200/30 dark:border-white/5 max-h-[140px] overflow-y-auto">
                {laps.length === 0 ? (
                  <p className="text-center text-xs text-neutral-450 py-3">Немає збережених інтервалів кола.</p>
                ) : (
                  <div className="space-y-1.5">
                    {laps.map((lap, i) => (
                      <div key={i} className="flex justify-between text-xs font-mono font-bold text-neutral-700 dark:text-neutral-300">
                        <span>Коло #{laps.length - i}</span>
                        <span>{formatStopwatchDisplay(lap)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 w-full max-w-sm pt-2">
                <button
                  onClick={resetStopwatch}
                  className="w-1/4 py-2.5 rounded-xl border border-neutral-200 dark:border-white/10 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-white/5 text-xs font-semibold flex items-center justify-center cursor-pointer"
                >
                  Скинути
                </button>
                <button
                  onClick={handleRecordLap}
                  className="w-1/4 py-2.5 rounded-xl border border-neutral-200 dark:border-white/10 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-white/5 text-xs font-semibold flex items-center justify-center cursor-pointer"
                >
                  <Flag className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={startStopwatch}
                  className={`w-2/4 py-2.5 rounded-xl font-bold text-white text-xs flex items-center justify-center gap-1 transition-all cursor-pointer shadow ${
                    isStopwatchRunning ? "bg-rose-600 hover:bg-rose-500" : "bg-emerald-600 hover:bg-emerald-555"
                  }`}
                >
                  {isStopwatchRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isStopwatchRunning ? "Стоп" : "Старт"}</span>
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
