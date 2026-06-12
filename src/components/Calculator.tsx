import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Delete, Trash2, Clock, Equal } from "lucide-react";

export default function Calculator() {
  const [display, setDisplay] = useState("0");
  const [equation, setEquation] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const keys = [
    { label: "C", type: "action", value: "clear" },
    { label: "±", type: "action", value: "negate" },
    { label: "%", type: "action", value: "percent" },
    { label: "÷", type: "operator", value: "/" },
    { label: "7", type: "number", value: "7" },
    { label: "8", type: "number", value: "8" },
    { label: "9", type: "number", value: "9" },
    { label: "×", type: "operator", value: "*" },
    { label: "4", type: "number", value: "4" },
    { label: "5", type: "number", value: "5" },
    { label: "6", type: "number", value: "6" },
    { label: "−", type: "operator", value: "-" },
    { label: "1", type: "number", value: "1" },
    { label: "2", type: "number", value: "2" },
    { label: "3", type: "number", value: "3" },
    { label: "+", type: "operator", value: "+" },
    { label: "0", type: "number", value: "0" },
    { label: ".", type: "number", value: "." },
    { label: "⌫", type: "action", value: "backspace" },
    { label: "=", type: "operator-eq", value: "calculate" },
  ];

  const handleKeyPress = (value: string, type: string) => {
    if (type === "number") {
      if (display === "0" && value !== ".") {
        setDisplay(value);
      } else {
        // Prevent double dots
        if (value === "." && display.includes(".")) return;
        setDisplay(display + value);
      }
    } else if (type === "operator") {
      // Append current display & operator to equation
      setEquation(`${equation} ${display} ${value}`);
      setDisplay("0");
    } else if (type === "operator-eq") {
      if (equation === "") return;
      
      const fullExpression = `${equation} ${display}`;
      try {
        // Safe evaluation of mathematical expressions (no arbitrary eval of malicious user strings)
        // Sanitizing expression with strict regex matching arithmetic structures
        const sanitizedExpression = fullExpression
          .replace(/×/g, "*")
          .replace(/÷/g, "/")
          .replace(/[^-()\d/*+. ]/g, ""); // Strip any letters/unwanted symbols
        
        // Use a safe arithmetic parser function to evaluate rather than pure eval
        const calculation = Function(`"use strict"; return (${sanitizedExpression})`)();
        const resultString = Number(calculation.toFixed(8)).toString(); // format floats nicely

        setDisplay(resultString);
        setHistory([`${fullExpression} = ${resultString}`, ...history.slice(0, 9)]);
        setEquation("");
      } catch (err) {
        setDisplay("Помилка");
        setEquation("");
      }
    } else if (type === "action") {
      if (value === "clear") {
        setDisplay("0");
        setEquation("");
      } else if (value === "backspace") {
        if (display.length > 1) {
          setDisplay(display.slice(0, -1));
        } else {
          setDisplay("0");
        }
      } else if (value === "negate") {
        setDisplay((parseFloat(display) * -1).toString());
      } else if (value === "percent") {
        setDisplay((parseFloat(display) / 100).toString());
      }
    }
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto items-start">
      {/* Prime Calculator Screen Card */}
      <div className="md:col-span-2 rounded-2xl border border-neutral-200/50 dark:border-white/5 bg-white/60 dark:bg-[#0c0c0e]/30 backdrop-blur-xl p-6 shadow-xl relative overflow-hidden">
        {/* Neon accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex justify-between items-center mb-6">
          <h3 className="font-semibold text-sm uppercase tracking-wider text-neutral-400 font-mono">Обчислювальний Модуль</h3>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="p-1 px-3 text-xs bg-neutral-100 dark:bg-white/5 text-neutral-500 dark:text-neutral-400 rounded-lg hover:bg-neutral-200 dark:hover:bg-white/10 transition-all flex items-center gap-1 cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{showHistory ? "Калькулятор" : "Історія"}</span>
          </button>
        </div>

        {/* Display Screens - Apple slider effect */}
        <div className="bg-neutral-100/50 dark:bg-black/35 rounded-2xl p-5 mb-5 text-right font-mono min-h-[110px] flex flex-col justify-end border border-neutral-150/40 dark:border-white/5 select-all">
          <div className="text-xs text-neutral-400 dark:text-neutral-500 min-h-[1.5rem] tracking-wider truncate">
            {equation || " "}
          </div>
          <div className="text-3xl sm:text-4xl font-bold text-neutral-800 dark:text-neutral-100 tracking-tight truncate mt-1">
            {display}
          </div>
        </div>

        {/* Grid panel keys */}
        <div className="grid grid-cols-4 gap-3">
          {keys.map((key) => {
            let bgType = "bg-neutral-100 dark:bg-white/5 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-white/10";
            if (key.type === "operator") {
              bgType = "bg-amber-500/10 text-amber-500 hover:bg-amber-500/25 border border-amber-500/20";
            } else if (key.type === "operator-eq") {
              bgType = "bg-indigo-600 text-white hover:bg-indigo-500 shadow-md col-span-1";
            } else if (key.label === "C") {
              bgType = "bg-rose-500/10 text-rose-500 hover:bg-rose-500/25 border border-rose-500/20";
            }

            return (
              <motion.button
                key={key.label}
                whileTap={{ scale: 0.94 }}
                onClick={() => handleKeyPress(key.value, key.type)}
                className={`py-4 px-2 rounded-xl text-sm font-semibold select-none transition-all duration-150 flex items-center justify-center cursor-pointer ${bgType}`}
              >
                {key.label === "⌫" ? <Delete className="w-4 h-4" /> : key.label}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* History Log Panel Side */}
      <div className="rounded-2xl border border-neutral-200/50 dark:border-white/5 bg-white/40 dark:bg-[#0c0c0e]/15 backdrop-blur-xl p-5 shadow-xl min-h-[440px] flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-xs uppercase tracking-wider text-neutral-400 font-mono">Журнал Операцій</h4>
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="p-1 px-2 hover:bg-rose-500/10 rounded-md text-rose-500 transition-all cursor-pointer"
                title="Очистити історію"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="space-y-2 mt-4 max-h-[340px] overflow-y-auto">
            {history.length === 0 ? (
              <div className="text-center py-16 text-neutral-400 dark:text-neutral-500 text-xs font-sans">
                Немає записаних обчислень.
              </div>
            ) : (
              history.map((eq, i) => (
                <div
                  key={i}
                  className="p-3 bg-neutral-100/50 dark:bg-white/5 rounded-xl border border-neutral-150/40 dark:border-white/5 font-mono text-xs text-right animate-fadeIn"
                >
                  <p className="text-neutral-400 dark:text-neutral-500 pb-1">{eq.split(" = ")[0]}</p>
                  <p className="text-neutral-800 dark:text-neutral-100 font-bold text-sm">= {eq.split(" = ")[1]}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="text-[10px] text-neutral-400 dark:text-neutral-550 border-t border-neutral-150/40 dark:border-white/5 pt-4 font-mono leading-relaxed">
          Всі результати автоматично заокруглюються до 8 знаків після коми.
        </div>
      </div>
    </div>
  );
}
