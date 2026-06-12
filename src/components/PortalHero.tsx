import { motion } from "motion/react";
import { ArrowRight, Sparkles, Cpu, Zap, Layout, Shield, Activity, Code, ChevronRight } from "lucide-react";

interface PortalHeroProps {
  onStart: (tab: string) => void;
  isDark: boolean;
}

export default function PortalHero({ onStart, isDark }: PortalHeroProps) {
  const features = [
    {
      icon: Cpu,
      title: "Високоточний Рендеринг",
      desc: "Інтерфейс у стилі Apple з високою частотою кадрів, заснований на векторах і субпіксельному згладжуванні.",
      color: "from-blue-500 to-indigo-600",
      accent: "blue"
    },
    {
      icon: Zap,
      title: "Супершвидкі Інструменти",
      desc: "Локальна обробка даних без затримок. Миттєвий калькулятор, конвертер та генератор у реальному часі.",
      color: "from-pink-500 to-rose-600",
      accent: "rose"
    },
    {
      icon: Layout,
      title: "Модульна Workspace Панель",
      desc: "Гнучкий трекер завдань, щоденні нотатки та вбудовані таймери з автоматичним збереженням у браузері.",
      color: "from-violet-500 to-purple-600",
      accent: "violet"
    },
    {
      icon: Shield,
      title: "Безпека Нового Покоління",
      desc: "Приватність рівня Stripe. Усі ваші паролі, нотатки та особисті дані зберігаються шифрованими виключно у вашому браузері.",
      color: "from-emerald-500 to-teal-600",
      accent: "emerald"
    },
    {
      icon: Activity,
      title: "Аналітика в Реальному Часі",
      desc: "Масштабовані візуалізації метрик вашої продуктивності на інтерактивному дашборді.",
      color: "from-amber-500 to-orange-600",
      accent: "amber"
    },
    {
      icon: Code,
      title: "Спроєктовано на Майбутнє",
      desc: "Вишукана архітектура React-Vite з повною оптимізацією під мобільні пристрої та Retina екрани.",
      color: "from-cyan-500 to-blue-600",
      accent: "cyan"
    }
  ];

  return (
    <div className="relative min-h-[92vh] overflow-hidden">
      {/* Immersive interactive glowing mesh spheres (Tesla/Stripe feel) */}
      <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] rounded-full glowing-mesh-sphere-1 blur-[120px] pointer-events-none opacity-40 md:opacity-60" />
      <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] rounded-full glowing-mesh-sphere-2 blur-[120px] pointer-events-none opacity-30 md:opacity-50" />
      <div className="absolute top-[40%] left-[40%] w-[400px] h-[400px] rounded-full glowing-mesh-sphere-3 blur-[100px] pointer-events-none opacity-20 md:opacity-40" />

      {/* Grid Pattern overlay for tech aesthetic */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(120,120,120,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(120,120,120,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 relative z-10">
        {/* Banner Pill */}
        <div className="flex justify-center mb-6">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium border border-neutral-200/50 dark:border-neutral-800/80 bg-neutral-150/40 dark:bg-neutral-900/40 backdrop-blur-md text-neutral-800 dark:text-neutral-200 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
            <span>Інструменти нового покоління. UI/UX 2025</span>
            <ChevronRight className="w-3 h-3 text-neutral-400" />
          </motion.div>
        </div>

        {/* Big Display Headings - Apple Style */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight font-heading leading-[1.08] text-neutral-950 dark:text-white"
          >
            Новий стандарт вашої{" "}
            <span className="bg-gradient-to-r from-indigo-500 via-pink-500 to-amber-500 bg-clip-text text-transparent">
              продуктивності
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 text-lg sm:text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto font-sans leading-relaxed"
          >
            Елегантний мультифункціональний портал із набором професійних інструментів, динамічним особистим кабінетом, інтерактивними графіками аналітики та витонченим дизайном преміум-рівня.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button
              onClick={() => onStart("tools")}
              className="w-full sm:w-auto px-8 py-4 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
            >
              <span>Почати роботу</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => onStart("dashboard")}
              className="w-full sm:w-auto px-8 py-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/40 dark:bg-neutral-900/30 text-neutral-800 dark:text-neutral-200 font-medium backdrop-blur-md hover:bg-white/70 dark:hover:bg-neutral-900/60 transition-all duration-300"
            >
              Бортовий Дашборд
            </button>
          </motion.div>
        </div>

        {/* Hero Interactive Screen Preview (Apple Macbook / Tesla Screen Mockup) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-5xl mx-auto rounded-2xl border border-neutral-200/60 dark:border-white/10 bg-white/45 dark:bg-[#0c0c0e]/65 p-3 sm:p-4 backdrop-blur-2xl shadow-2xl overflow-hidden"
        >
          {/* Mock Browser Header */}
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-neutral-250/20 dark:border-white/5 text-neutral-400 dark:text-neutral-600">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <div className="text-[10px] sm:text-xs font-mono bg-neutral-200/50 dark:bg-white/5 py-0.5 px-6 rounded-md select-none">
              https://futurex-portal.io/workspace
            </div>
            <div className="w-10" />
          </div>

          {/* Graphic mockup of workspace inside */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Left Block - Statistics */}
            <div className="md:col-span-2 rounded-xl bg-neutral-100/50 dark:bg-white/5 p-5 min-h-[220px] flex flex-col justify-between border border-neutral-200/40 dark:border-white/5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs uppercase tracking-wider text-neutral-400 font-mono">Швидкість Обробки</p>
                  <p className="text-3xl font-bold font-heading mt-1 text-neutral-800 dark:text-neutral-100">99.8%</p>
                </div>
                <div className="px-2 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] rounded font-medium border border-emerald-500/20">
                  Активно
                </div>
              </div>
              
              {/* Dynamic SVG Sparkline */}
              <div className="h-20 w-full mt-4">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="sparklineGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 0,18 Q 10,2 20,12 T 40,5 T 60,15 T 80,3 T 100,10"
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 0,18 Q 10,2 20,12 T 40,5 T 60,15 T 80,3 T 100,10 L 100,20 L 0,20 Z"
                    fill="url(#sparklineGrad)"
                  />
                </svg>
              </div>

              <div className="flex justify-between items-center text-xs text-neutral-500 font-mono mt-2">
                <span>00:00</span>
                <span>Центр Аналітики FutureX</span>
                <span>Теперішній час</span>
              </div>
            </div>

            {/* Right Block - Quick Action */}
            <div className="rounded-xl bg-neutral-100/50 dark:bg-white/5 p-5 flex flex-col justify-between border border-neutral-200/40 dark:border-white/5">
              <div>
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500 mb-3 border border-indigo-500/10">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="font-medium text-neutral-800 dark:text-neutral-200">Розумний Контроль</h3>
                <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                  Ваші нотатки, завдання та таймери автоматично синхронізуються із хмарними ефектами у вашому сховищі.
                </p>
              </div>

              <button
                onClick={() => onStart("cabinet")}
                className="w-full mt-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-1"
              >
                <span>Увійти в кабінет</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Bento Grid - Features section */}
        <div className="mt-32 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-neutral-900 dark:text-white">
              Все для розширення ваших можливостей
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 mt-3 max-w-xl mx-auto">
              Комбінація апаратного мінімалізму, обчислювальної точності та витонченої візуальної форми.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, index) => {
              const IconComp = feat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  className="group rounded-2xl border border-neutral-150/60 dark:border-white/5 bg-white/50 dark:bg-[#0c0c0e]/30 p-6 backdrop-blur-lg hover:border-black/10 dark:hover:border-white/10 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feat.color} text-white flex items-center justify-center mb-4 shadow-sm`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold font-heading text-neutral-900 dark:text-white group-hover:text-indigo-500 transition-colors duration-200">
                    {feat.title}
                  </h3>
                  <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-2 leading-relaxed">
                    {feat.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Stripe Inspired Metric Section */}
        <div className="mt-28 py-12 rounded-3xl border border-neutral-200/50 dark:border-white/5 bg-neutral-50/50 dark:bg-white/5 backdrop-blur-2xl px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="max-w-md">
            <h3 className="text-2xl font-bold font-heading text-neutral-900 dark:text-white">
              Свобода від обмежень
            </h3>
            <p className="text-neutral-500 dark:text-neutral-400 mt-2 text-sm leading-relaxed">
              Немає підписок, прихованих зборів чи передачі конфіденційних даних третім сторонам. Все працює безпосередньо у вашому браузері.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-8 w-full md:w-auto">
            <div className="text-center md:text-left">
              <span className="block text-3xl font-bold font-mono text-indigo-500">0мс</span>
              <span className="text-xs text-neutral-400 font-sans mt-1">Затримка API</span>
            </div>
            <div className="text-center md:text-left">
              <span className="block text-3xl font-bold font-mono text-pink-500">256-bit</span>
              <span className="text-xs text-neutral-400 font-sans mt-1">Локальне AES</span>
            </div>
            <div className="text-center md:text-left">
              <span className="block text-3xl font-bold font-mono text-emerald-500">100%</span>
              <span className="text-xs text-neutral-400 font-sans mt-1">Безпечно</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
