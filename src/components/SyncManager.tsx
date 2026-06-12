import React, { useState } from "react";
import { motion } from "motion/react";
import { RefreshCw, Download, Upload, Copy, Check, ShieldAlert, Key, Loader2, Database, Laptop, Info } from "lucide-react";

interface SyncManagerProps {
  onNotify: (title: string, message: string, type: 'info' | 'success' | 'warning' | 'error') => void;
  onDataRestored?: () => void;
}

export default function SyncManager({ onNotify, onDataRestored }: SyncManagerProps) {
  const [syncCode, setSyncCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Core gatherer package
  const collectLocalPayload = () => {
    const keys = ["futurex_tasks", "futurex_habits", "futurex_notes", "futurex_goals", "futurex_finances", "futurex_user_stats"];
    const payload: Record<string, any> = {};
    keys.forEach((key) => {
      const val = localStorage.getItem(key);
      if (val) {
        try {
          payload[key] = JSON.parse(val);
        } catch {
          payload[key] = val;
        }
      }
    });
    return payload;
  };

  const handleBackup = async () => {
    setIsLoading(true);
    setGeneratedCode("");
    
    try {
      const payload = collectLocalPayload();
      const response = await fetch("/api/sync/backup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payload })
      });

      if (!response.ok) {
        throw new Error("Не вдалося підключитися до сервера синхронізації.");
      }

      const resData = await response.json();
      if (resData.success && resData.syncCode) {
        setGeneratedCode(resData.syncCode);
        onNotify("Резервну копію хмари створено!", `Ваш розклад та прогрес зарезервовано. Код синхронізації: ${resData.syncCode}`, "success");
      } else {
        throw new Error(resData.error || "Сервер повернув невірну копію.");
      }
    } catch (err: any) {
      console.error(err);
      onNotify("Синхронізація не вдалася", err.message || "Помилка встановлення резервної точки", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!syncCode.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/sync/restore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ syncCode: syncCode.trim() })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Помилка завантаження резервації.");
      }

      const resData = await response.json();
      if (resData.success && resData.payload) {
        // Unpack key ratios
        const payload = resData.payload;
        Object.keys(payload).forEach((key) => {
          const item = payload[key];
          localStorage.setItem(key, typeof item === "string" ? item : JSON.stringify(item));
        });

        onNotify("Дані успішно синхронізовано! 🎉", "Всі завдання, розклади, фінанси та прогрес відновлено на цьому пристрої.", "success");
        setSyncCode("");
        if (onDataRestored) onDataRestored();
      }
    } catch (err: any) {
      console.error(err);
      onNotify("Синхронізація відхилена", err.message || "Не вдалося отримати резервні дані.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onNotify("Код скопійовано", "Код синхронізації скопійовано в буфер обміну.", "info");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Intro visual header details */}
      <div className="p-5 border border-neutral-200/50 dark:border-white/5 bg-white/40 dark:bg-[#0c0c0e]/30 backdrop-blur-xl rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex gap-3.5 items-start">
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-550 dark:text-indigo-400 mt-0.5">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-neutral-800 dark:text-white font-heading">
              Міжпристроєва Синхронізація Хмари
            </h3>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 font-sans mt-0.5 max-w-xl">
              Переносьте свій кабінет, звички, завдання та досягнення між комп'ютером, ноутбуком та смартфоном за допомогою миттєвого шестизначного коду верифікації.
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-emerald-555 border border-emerald-500/15 bg-emerald-500/5 px-2.5 py-1 rounded-full leading-none font-mono">
          <Laptop className="w-3.5 h-3.5" />
          <span>Підключено</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload Segment: Backup to Cloud */}
        <div className="p-5 border border-neutral-200/50 dark:border-white/5 bg-white/60 dark:bg-[#0c0c0e]/30 backdrop-blur-xl rounded-2xl shadow-md space-y-4 flex flex-col justify-between min-h-[290px]">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5 text-indigo-505 dark:text-indigo-400" />
              Експортувати прогрес
            </span>
            <h4 className="text-sm font-bold text-neutral-850 dark:text-neutral-100 font-sans">
              Отримати код перенесення
            </h4>
            <p className="text-xs text-neutral-400 dark:text-neutral-500">
              Запакує всі локальні нотатки, налаштування та досягнення, та збереже їх у зашифрованому сховищі Vault на 24 години.
            </p>
          </div>

          {generatedCode && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-3.5 rounded-xl border border-indigo-500/30 bg-indigo-505/5 flex items-center justify-between gap-4 font-mono text-center"
            >
              <div className="flex gap-2 items-center">
                <Key className="w-4 h-4 text-indigo-505" />
                <span className="text-lg font-black tracking-widest text-[#6366f1]">{generatedCode}</span>
              </div>
              <button
                onClick={handleCopy}
                className="p-2 bg-white dark:bg-white/5 border border-neutral-200/50 dark:border-white/5 text-neutral-400 hover:text-indigo-550 rounded-lg cursor-pointer transition-all"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </motion.div>
          )}

          <button
            onClick={handleBackup}
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-neutral-200 dark:disabled:bg-white/5 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer mt-2"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5" />
            )}
            <span>Створити крапку синхронізації</span>
          </button>
        </div>

        {/* Download Segment: Restore from Cloud */}
        <div className="p-5 border border-neutral-200/50 dark:border-white/5 bg-white/60 dark:bg-[#0c0c0e]/30 backdrop-blur-xl rounded-2xl shadow-md space-y-4 flex flex-col justify-between min-h-[290px]">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5 text-emerald-500" />
              Імпортувати прогрес
            </span>
            <h4 className="text-sm font-bold text-neutral-850 dark:text-neutral-100 font-sans">
              Відновити з резервного коду
            </h4>
            <p className="text-xs text-neutral-400 dark:text-neutral-500">
              Введіть отриманий шестизначний код синхронізації з іншого пристрою для повного розгортання вашого кабінету.
            </p>
          </div>

          <form onSubmit={handleRestore} className="space-y-3">
            <div className="relative">
              <input
                type="text"
                maxLength={6}
                value={syncCode}
                onChange={(e) => setSyncCode(e.target.value)}
                placeholder="Введіть код синхронізації (напр. AG7H38)..."
                className="w-full bg-neutral-100/50 dark:bg-neutral-900 border border-neutral-250/50 dark:border-white/5 rounded-xl py-2.5 px-4 text-xs text-neutral-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-550 focus:border-indigo-550 font-mono text-center tracking-widest font-bold uppercase"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !syncCode.trim()}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-neutral-200 dark:disabled:bg-white/5 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Аналізувати та розгорнути</span>
            </button>
          </form>

          <div className="flex gap-2 bg-amber-500/5 border border-amber-500/10 p-3 rounded-xl">
            <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[10px] text-neutral-500 dark:text-neutral-450 leading-relaxed">
              <strong className="text-neutral-700 dark:text-neutral-300">Примітка:</strong> Розгортання резервної копії ПОВНІСТЮ перезапише поточні локальні дані в цьому браузері.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
