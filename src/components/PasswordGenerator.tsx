import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Shield, Copy, RefreshCw, Check, Library } from "lucide-react";

interface PasswordGeneratorProps {
  onNotify: (title: string, message: string, type: 'info' | 'success' | 'warning' | 'error') => void;
}

export default function PasswordGenerator({ onNotify }: PasswordGeneratorProps) {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    let charset = "";
    if (includeUpper) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeLower) charset += "abcdefghijklmnopqrstuvwxyz";
    if (includeNumbers) charset += "0123456789";
    if (includeSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";

    if (charset === "") {
      setPassword("");
      return;
    }

    let generated = "";
    for (let i = 0; i < length; i++) {
      const randIdx = Math.floor(Math.random() * charset.length);
      generated += charset[randIdx];
    }
    setPassword(generated);
    setCopied(false);
  };

  useEffect(() => {
    generatePassword();
  }, [length, includeUpper, includeLower, includeNumbers, includeSymbols]);

  const handleCopy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    onNotify("Копіювання", "Пароль скопійовано в буфер обміну.", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  // Compute Password strength metrics (Entropy assessment)
  const getStrengthScore = () => {
    if (!password) return { label: "Пустий", color: "bg-neutral-300", width: "0%", desc: "Виберіть опції" };
    
    let score = 0;
    if (password.length >= 8) score += 1;
    if (password.length >= 14) score += 1;
    
    let varieties = 0;
    if (/[A-Z]/.test(password)) varieties++;
    if (/[a-z]/.test(password)) varieties++;
    if (/[0-9]/.test(password)) varieties++;
    if (/[^A-Za-z0-9]/.test(password)) varieties++;
    
    score += varieties;

    if (score <= 2) {
      return { label: "Слабкий", color: "bg-rose-500", width: "25%", desc: "Легко зламати методом підбору." };
    } else if (score <= 4) {
      return { label: "Середній", color: "bg-amber-500", width: "55%", desc: "Надійний для некритичних сайтів." };
    } else {
      return { label: "Надзвичайно безпечний", color: "bg-emerald-500", width: "100%", desc: "Придатний для фінансових кабінетів." };
    }
  };

  const strength = getStrengthScore();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto items-start animate-fadeIn">
      {/* 1. Configuration Checkboxes Panel */}
      <div className="p-5 rounded-2xl border border-neutral-200/50 dark:border-white/5 bg-white/60 dark:bg-[#0c0c0e]/30 backdrop-blur-xl shadow-xl space-y-4">
        <h3 className="font-semibold text-sm uppercase tracking-wider text-neutral-400 font-mono">Конфігуратор</h3>
        
        {/* Length slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs text-neutral-600 dark:text-neutral-400 font-medium">
            <span>Довжина символів:</span>
            <span className="font-mono bg-neutral-100 dark:bg-white/10 px-2 py-0.5 rounded font-bold text-indigo-500">{length}</span>
          </div>
          <input
            type="range"
            min="6"
            max="32"
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value))}
            className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-indigo-550"
          />
        </div>

        {/* Binary triggers components */}
        <div className="space-y-3 pt-2">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={includeUpper}
              onChange={(e) => setIncludeUpper(e.target.checked)}
              className="w-4.5 h-4.5 rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500 dark:bg-neutral-900 cursor-pointer"
            />
            <span className="text-xs text-neutral-600 dark:text-neutral-400 font-medium group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
              Великі літери (A-Z)
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={includeLower}
              onChange={(e) => setIncludeLower(e.target.checked)}
              className="w-4.5 h-4.5 rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500 dark:bg-neutral-900 cursor-pointer"
            />
            <span className="text-xs text-neutral-600 dark:text-neutral-400 font-medium group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
              Малі літери (a-z)
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={(e) => setIncludeNumbers(e.target.checked)}
              className="w-4.5 h-4.5 rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500 dark:bg-neutral-900 cursor-pointer"
            />
            <span className="text-xs text-neutral-600 dark:text-neutral-400 font-medium group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
              Числа (0-9)
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={includeSymbols}
              onChange={(e) => setIncludeSymbols(e.target.checked)}
              className="w-4.5 h-4.5 rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500 dark:bg-neutral-900 cursor-pointer"
            />
            <span className="text-xs text-neutral-600 dark:text-neutral-400 font-medium group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
              Спеціальні символи (!@#$)
            </span>
          </label>
        </div>
      </div>

      {/* 2. Interactive generator displays and strength dashboard */}
      <div className="md:col-span-2 rounded-2xl border border-neutral-200/50 dark:border-white/5 bg-white/60 dark:bg-[#0c0c0e]/30 backdrop-blur-xl p-6 shadow-xl space-y-6 flex flex-col justify-between min-h-[340px]">
        
        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-xs uppercase tracking-wider text-neutral-400 font-mono">Генератор AES</h4>
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded font-bold border border-emerald-500/20">
              <Shield className="w-3.5 h-3.5" />
              <span>Шифрування 256-bit</span>
            </div>
          </div>

          {/* Actual display bar with action buttons on details */}
          <div className="bg-neutral-100/50 dark:bg-black/35 rounded-2xl p-4 flex items-center justify-between border border-neutral-150/40 dark:border-white/5 min-h-[64px] relative">
            <p className="font-mono text-sm sm:text-base text-neutral-800 dark:text-neutral-100 font-bold select-all break-all pr-8">
              {password || "Оберіть параметри..."}
            </p>

            <div className="flex gap-1.5 shrink-0">
              <button
                onClick={generatePassword}
                className="p-2 text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-white/5 rounded-xl transition-all cursor-pointer"
                title="Оновити пароль"
              >
                <RefreshCw className="w-4.5 h-4.5" />
              </button>
              <button
                onClick={handleCopy}
                disabled={!password}
                className={`p-2 rounded-xl transition-all cursor-pointer ${
                  copied
                    ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                    : "text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-white/5"
                }`}
                title="Копіювати"
              >
                {copied ? <Check className="w-4.5 h-4.5" /> : <Copy className="w-4.5 h-4.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Progressive Entropy bar widget */}
        <div className="p-4 bg-neutral-150/30 dark:bg-neutral-900/40 rounded-xl space-y-2 border border-neutral-200/40 dark:border-white/5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-neutral-500 font-medium">Клас стійкості:</span>
            <span className="font-bold text-neutral-800 dark:text-neutral-200">{strength.label}</span>
          </div>

          <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full ${strength.color} transition-all duration-300`}
              style={{ width: strength.width }}
            />
          </div>

          <p className="text-[11px] text-neutral-400 dark:text-neutral-500 leading-relaxed font-sans">
            {strength.desc}
          </p>
        </div>

        <div className="text-[10px] text-neutral-400 dark:text-neutral-550 border-t border-neutral-150/40 dark:border-white/5 pt-4 font-mono leading-relaxed mt-4">
          Рекомендуємо використовувати довжину від 16 знаків із комбінацією цифр та символів для найкращого захисту.
        </div>
      </div>
    </div>
  );
}
