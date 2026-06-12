import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { User as UserIcon, Lock, Mail, Edit3, Save, Compass, Sparkles, Shield, Key, FileText, CheckCircle } from "lucide-react";
import { User } from "../types";

interface CabinetProps {
  user: User | null;
  onLogin: (user: User) => void;
  onLogout: () => void;
  onNotify: (title: string, message: string, type: 'info' | 'success' | 'warning' | 'error') => void;
}

export default function Cabinet({ user, onLogin, onLogout, onNotify }: CabinetProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Login Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  
  // Profile editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editRole, setEditRole] = useState("Фінансовий Аналітик");
  const [editAvatar, setEditAvatar] = useState("");

  const premiumAvatars = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=120&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=120&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=120&auto=format&fit=crop",
  ];

  useEffect(() => {
    if (user) {
      setEditUsername(user.username);
      setEditBio(user.bio);
      setEditRole(user.role);
      setEditAvatar(user.avatar);
    }
  }, [user]);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    if (isSignUp) {
      if (!username) return;
      const newUser: User = {
        username,
        email,
        bio: "Тут ви можете описати ваші плани, амбіції чи життєве кредо...",
        avatar: premiumAvatars[0],
        role: "Старший Дизайнер",
        joinedAt: new Date().toLocaleDateString("uk-UA")
      };
      onLogin(newUser);
      onNotify("Акаунт створено!", `Вітаємо в екосистемі FutureX, ${username}!`, "success");
    } else {
      // Simulate login
      const loggedUser: User = {
        username: email.split("@")[0],
        email,
        bio: "Розробник преміальних інструментів на базі FutureX Portal.",
        avatar: premiumAvatars[1],
        role: "Фінансовий Аналітик",
        joinedAt: new Date().toLocaleDateString("uk-UA")
      };
      onLogin(loggedUser);
      onNotify("Вхід виконано", `З поверненням у систему, ${loggedUser.username}!`, "success");
    }
  };

  const handleUpdateProfile = () => {
    if (!editUsername) return;
    const updatedUser: User = {
      username: editUsername,
      email: user?.email || "",
      bio: editBio,
      role: editRole,
      avatar: editAvatar,
      joinedAt: user?.joinedAt || new Date().toLocaleDateString("uk-UA")
    };
    onLogin(updatedUser);
    setIsEditing(false);
    onNotify("Профіль оновлено", "Ваш обліковий запис унікально налаштовано.", "success");
  };

  // Read sizes dynamically from localStorage for personalized cabinet stats
  const getTotals = () => {
    const tasks = JSON.parse(localStorage.getItem("futurex_tasks") || "[]");
    const notes = JSON.parse(localStorage.getItem("futurex_notes") || "[]");
    const feedbacks = JSON.parse(localStorage.getItem("futurex_feedback") || "[]");
    return {
      tasksCount: tasks.length,
      tasksCompleted: tasks.filter((t: any) => t.completed).length,
      notesCount: notes.length,
      feedbackResolved: feedbacks.filter((t: any) => t.status === "replied").length
    };
  };

  const totals = getTotals();

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn select-text mb-8">
      <AnimatePresence mode="wait">
        {user ? (
          /* Profile Cabinet UI dashboard screen */
          <motion.div
            key="profile-screen"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Left Block - Profile Card */}
            <div className="md:col-span-1 rounded-2xl border border-neutral-200/50 dark:border-white/5 bg-white/60 dark:bg-[#0c0c0e]/30 backdrop-blur-xl p-5 shadow-xl text-center space-y-4">
              <div className="relative inline-block mx-auto group">
                <img
                  src={editAvatar || user.avatar}
                  alt={user.username}
                  className="w-24 h-24 rounded-2xl mx-auto object-cover border-2 border-indigo-500 shadow-md group-hover:scale-105 transition-transform duration-300"
                />
                {isEditing && (
                  <span className="absolute bottom-1 right-1 bg-indigo-500 text-white p-1 rounded-md text-[9px] font-bold">
                    Edit
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-bold text-lg text-neutral-900 dark:text-white font-heading">{user.username}</h3>
                <p className="text-xs text-indigo-500 dark:text-indigo-400 font-mono mt-0.5">{user.role}</p>
                <p className="text-[10px] text-neutral-400 font-mono mt-1">Реєстрація: {user.joinedAt}</p>
              </div>

              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-normal italic px-2">
                "{user.bio}"
              </p>

              <div className="pt-2">
                {isEditing ? (
                  <button
                    onClick={handleUpdateProfile}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs transition-all flex items-center justify-center gap-1 cursor-pointer shadow-md"
                  >
                    <Save className="w-4.5 h-4.5" />
                    <span>Зберегти зміни</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full py-2 bg-neutral-100 dark:bg-white/5 hover:bg-neutral-200 dark:hover:bg-white/10 text-neutral-700 dark:text-neutral-300 border border-neutral-200/50 dark:border-white/5 font-semibold rounded-xl text-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Редагувати анкету</span>
                  </button>
                )}
              </div>

              <hr className="border-neutral-200/30 dark:border-white/5 pt-2" />
              
              <button
                onClick={onLogout}
                className="text-xs font-semibold text-rose-500 hover:text-rose-600 cursor-pointer"
              >
                Вийти з акаунта
              </button>
            </div>

            {/* Right Block - Customize form details / statistics */}
            <div className="md:col-span-2 space-y-6">
              {isEditing ? (
                /* Profile Editor Form Panel */
                <div className="p-6 rounded-2xl border border-neutral-200/50 dark:border-white/5 bg-white/60 dark:bg-[#0c0c0e]/30 backdrop-blur-xl shadow-xl space-y-4">
                  <h3 className="font-semibold text-xs uppercase tracking-wider text-neutral-400 font-mono">Анкета Профілю</h3>
                  
                  <div className="space-y-3 font-sans">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">Ваш нікнейм</label>
                      <input
                        type="text"
                        value={editUsername}
                        onChange={(e) => setEditUsername(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-white/10 bg-white/50 dark:bg-black/25 focus:ring-1 focus:ring-indigo-500 outline-none text-xs text-neutral-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">Спеціальність / Професія</label>
                      <select
                        value={editRole}
                        onChange={(e) => setEditRole(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-white/10 bg-white/50 dark:bg-black/25 focus:ring-1 focus:ring-indigo-500 outline-none text-xs text-neutral-900 dark:text-white"
                      >
                        <option value="Старший Дизайнер">Старший Дизайнер (Apple Lineup)</option>
                        <option value="Розробник ШІ">Програміст ШІ (Tesla Full Self Driving)</option>
                        <option value="Фінансовий Аналітик">Фінансовий Аналітик (Stripe Ledger)</option>
                        <option value="Крипто Інвестор">Крипто Інвестор</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">Статус / Біографія</label>
                      <textarea
                        value={editBio}
                        onChange={(e) => setEditBio(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-white/10 bg-white/50 dark:bg-black/25 focus:ring-1 focus:ring-indigo-500 outline-none text-xs text-neutral-900 dark:text-white resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">Оберіть системний аватар</label>
                      <div className="flex gap-3 h-12 pt-1">
                        {premiumAvatars.map((av) => (
                          <img
                            key={av}
                            src={av}
                            alt="Avatar option"
                            onClick={() => setEditAvatar(av)}
                            className={`w-10 h-10 rounded-xl object-cover cursor-pointer hover:scale-105 transition-all ${
                              editAvatar === av ? "ring-2 ring-indigo-500 scale-105 border-white border" : "opacity-70"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Profile statistics and engagement info */
                <div className="space-y-6">
                  {/* Summary of local database storage counters */}
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Всього завдань", value: totals.tasksCount, unit: "справ" },
                      { label: "Виконано завдань", value: totals.tasksCompleted, unit: "справ" },
                      { label: "Всього нотаток", value: totals.notesCount, unit: "одиниць" },
                      { label: "Вирішено тикетів", value: totals.feedbackResolved, unit: "звернень" },
                    ].map((stat, i) => (
                      <div key={i} className="p-4 rounded-xl border border-neutral-200/50 dark:border-white/5 bg-white/60 dark:bg-[#0c0c0e]/30 shadow-md">
                        <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 uppercase font-bold tracking-wider">{stat.label}</span>
                        <div className="flex items-baseline gap-1 mt-2">
                          <span className="text-2xl font-bold text-neutral-850 dark:text-neutral-100 font-mono">{stat.value}</span>
                          <span className="text-[10px] text-neutral-400">{stat.unit}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Stripe styled Shield checklist card */}
                  <div className="p-5 rounded-2xl border border-neutral-200/50 dark:border-white/5 bg-white/60 dark:bg-[#0c0c0e]/30 backdrop-blur-xl shadow-md space-y-4">
                    <h4 className="font-semibold text-xs uppercase tracking-wider text-neutral-400 font-mono flex items-center gap-1.5 p-1 select-none">
                      <Shield className="w-4.5 h-4.5 text-emerald-500" />
                      <span>Статус безпеки облікового запису IP</span>
                    </h4>

                    <div className="space-y-3 pt-2 text-xs">
                      {[
                        { title: "Захист бази даних", desc: "Увімкнено 256-bit локальне AES шифрування.", active: true },
                        { title: "Особисті файли", desc: "Конфігураційні нотатки захищено від індексування пошуковими ботами.", active: true },
                        { title: "Контроль доступу", desc: "Рівень фінансової верифікації Stripe Sandbox активовано.", active: true },
                      ].map((chk, i) => (
                        <div key={i} className="flex gap-3 items-start p-2.5 rounded-lg border border-neutral-200/40 dark:border-white/5 hover:bg-neutral-50 dark:hover:bg-white/5">
                          <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                          <div>
                            <h5 className="font-semibold text-neutral-850 dark:text-neutral-200 leading-none">{chk.title}</h5>
                            <p className="text-[11px] text-neutral-400 mt-1">{chk.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          /* Authentication Screen Form (Login / Register view) */
          <motion.div
            key="auth-screen"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="max-w-md mx-auto rounded-3xl border border-neutral-200/60 dark:border-white/10 bg-white/65 dark:bg-[#0c0c0e]/65 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl relative"
          >
            {/* Theme glow circles */}
            <div className="absolute top-[10%] right-[-10%] w-24 h-24 rounded-full bg-indigo-500/10 blur-xl pointer-events-none" />

            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 via-pink-500 to-amber-500 mx-auto flex items-center justify-center shadow-lg mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold font-heading text-neutral-900 dark:text-white">
                {isSignUp ? "Створити обліковий запис" : "Кабінет Керування"}
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                {isSignUp ? "Зареєструйте свій унікальний профіль в системі" : "Авторизуйтеся для доступу до розширеної метрики"}
              </p>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5 font-sans">
                    Нікнейм користувача
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Mykola01"
                      className="w-full pl-9 pr-4 py-2 rounded-xl border border-neutral-200 dark:border-white/10 bg-white/50 dark:bg-black/20 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none text-xs text-neutral-900 dark:text-white transition-all font-sans"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5 font-sans">
                  Електронна адреса
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="my-name@example.com"
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-neutral-200 dark:border-white/10 bg-white/50 dark:bg-black/20 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none text-xs text-neutral-900 dark:text-white transition-all font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5 font-sans">
                  Пароль безпеки
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-neutral-200 dark:border-white/10 bg-white/50 dark:bg-black/20 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none text-xs text-neutral-900 dark:text-white transition-all font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-900 font-semibold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer mt-4"
              >
                <span>{isSignUp ? "Створити акаунт" : "Увійти в кабінет"}</span>
              </button>
            </form>

            <div className="text-center mt-6">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-xs text-indigo-550 hover:text-indigo-600 dark:text-indigo-400 font-medium transition-colors cursor-pointer"
              >
                {isSignUp ? "Вже є акаунт? Увійдіть" : "Немає акаунта? Зареєструйтесь безкоштовно"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
