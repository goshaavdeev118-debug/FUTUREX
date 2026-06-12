import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Send, Mail, MapPin, Phone, MessageSquare, AlertCircle, 
  CheckCircle, Clock, Search, UserPlus, Edit2, Trash2, 
  X, Check, Folder, Sparkles, User, Info, Copy
} from "lucide-react";
import { FeedbackMessage, PersonalContact } from "../types";

interface ContactsProps {
  onNotify: (title: string, message: string, type: 'info' | 'success' | 'warning' | 'error') => void;
}

const defaultContacts: PersonalContact[] = [
  {
    id: "c-1",
    name: "Олександр Коваленко",
    phone: "+380 67 123 4567",
    email: "o.kovalenko@futurex.ua",
    category: "work",
    notes: "Провідний розробник платформи, консультації по API",
    createdAt: new Date().toLocaleString("uk-UA")
  },
  {
    id: "c-2",
    name: "Світлана Петренко",
    phone: "+380 50 987 6543",
    email: "svetlana.p@gmail.com",
    category: "friends",
    notes: "Дизайнер інтерфейсів, обговорення макетів",
    createdAt: new Date().toLocaleString("uk-UA")
  },
  {
    id: "c-3",
    name: "Дмитро Сидоренко",
    phone: "+380 93 456 7890",
    email: "d.sydor@family-net.com",
    category: "family",
    notes: "Брат, нагадати про замовлення подарунку",
    createdAt: new Date().toLocaleString("uk-UA")
  }
];

export default function Contacts({ onNotify }: ContactsProps) {
  // Subtab switching state
  const [subTab, setSubTab] = useState<"personal" | "support">("personal");

  // ----------------------------------------------------
  // 1. My Personal Contacts State & Logic
  // ----------------------------------------------------
  const [personalContacts, setPersonalContacts] = useState<PersonalContact[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"all" | "work" | "family" | "friends" | "other">("all");
  
  // Contact Form States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editContactId, setEditContactId] = useState<string | null>(null);
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactCategory, setContactCategory] = useState<'work' | 'family' | 'friends' | 'other'>("work");
  const [contactNotes, setContactNotes] = useState("");

  // Delete Confirmation Dialog states
  const [deletingContactId, setDeletingContactId] = useState<string | null>(null);
  const [deletingContactName, setDeletingContactName] = useState("");

  // Load Contacts
  useEffect(() => {
    const saved = localStorage.getItem("futurex_my_contacts");
    if (saved) {
      try {
        setPersonalContacts(JSON.parse(saved));
      } catch (e) {
        console.error("Помилка завантаження контактів", e);
        setPersonalContacts(defaultContacts);
      }
    } else {
      setPersonalContacts(defaultContacts);
      localStorage.setItem("futurex_my_contacts", JSON.stringify(defaultContacts));
    }
  }, []);

  const saveContactsList = (updated: PersonalContact[]) => {
    setPersonalContacts(updated);
    localStorage.setItem("futurex_my_contacts", JSON.stringify(updated));
  };

  const handleOpenAddForm = () => {
    setEditContactId(null);
    setContactName("");
    setContactPhone("");
    setContactEmail("");
    setContactCategory("work");
    setContactNotes("");
    setIsFormOpen(true);
    // Smooth scroll to top of viewport to ensure mobile users see the input form immediately
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 80);
  };

  const handleEditContact = (contact: PersonalContact) => {
    setEditContactId(contact.id);
    setContactName(contact.name);
    setContactPhone(contact.phone);
    setContactEmail(contact.email);
    setContactCategory(contact.category);
    setContactNotes(contact.notes || "");
    setIsFormOpen(true);
    // Smooth scroll to top of viewport to ensure mobile users see the input form immediately
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 80);
  };

  const handleDeleteContact = (id: string, name: string) => {
    setDeletingContactId(id);
    setDeletingContactName(name);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim()) {
      onNotify("Помилка валідації", "Ім'я контакту обов'язкове.", "error");
      return;
    }

    if (editContactId) {
      // Edit mode
      const updated = personalContacts.map((c) => {
        if (c.id === editContactId) {
          return {
            ...c,
            name: contactName.trim(),
            phone: contactPhone.trim(),
            email: contactEmail.trim(),
            category: contactCategory,
            notes: contactNotes.trim()
          };
        }
        return c;
      });
      saveContactsList(updated);
      onNotify("Контакт оновлено", `Контакт "${contactName}" успішно оновлено!`, "success");
    } else {
      // Add mode
      const newContact: PersonalContact = {
        id: "c-" + Math.floor(Math.random() * 90000 + 10000),
        name: contactName.trim(),
        phone: contactPhone.trim(),
        email: contactEmail.trim(),
        category: contactCategory,
        notes: contactNotes.trim(),
        createdAt: new Date().toLocaleString("uk-UA")
      };
      
      const updated = [newContact, ...personalContacts];
      saveContactsList(updated);
      onNotify("Контакт додано", `Новий контакт "${contactName}" додано у телефонну книгу.`, "success");
    }

    // Reset filters so the saved or edited contact is instantly visible in the viewport
    setSearchQuery("");
    setSelectedCategory("all");

    // Reset status
    setIsFormOpen(false);
    setEditContactId(null);
  };

  const handleCopyToClipboard = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    onNotify("Скопійовано", `Вміст (${label}) скопійовано в буфер обміну.`, "info");
  };

  // Filter Logic
  const filteredContacts = personalContacts.filter((c) => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.notes && c.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === "all" || c.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });


  // ----------------------------------------------------
  // 2. Feedback Form & Simulated Tickets State & Logic
  // ----------------------------------------------------
  const [feedbackName, setFeedbackName] = useState("");
  const [feedbackEmail, setFeedbackEmail] = useState("");
  const [feedbackSubject, setFeedbackSubject] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbacks, setFeedbacks] = useState<FeedbackMessage[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("futurex_feedback");
    if (saved) {
      try {
        setFeedbacks(JSON.parse(saved));
      } catch (e) {
        console.error("Помилка завантаження відгуків", e);
      }
    }
  }, []);

  const saveFeedback = (updated: FeedbackMessage[]) => {
    setFeedbacks(updated);
    localStorage.setItem("futurex_feedback", JSON.stringify(updated));
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackName.trim() || !feedbackEmail.trim() || !feedbackSubject.trim() || !feedbackMessage.trim()) return;

    const newTicket: FeedbackMessage = {
      id: "T-" + Math.floor(Math.random() * 90000 + 10000),
      name: feedbackName.trim(),
      email: feedbackEmail.trim(),
      subject: feedbackSubject.trim(),
      message: feedbackMessage.trim(),
      createdAt: new Date().toLocaleString("uk-UA"),
      status: "new"
    };

    const updated = [newTicket, ...feedbacks];
    saveFeedback(updated);
    onNotify("Успішне відправлення", "Тикет зареєстровано в системі тикетів FutureX.", "success");

    // Clean inputs
    setFeedbackName("");
    setFeedbackEmail("");
    setFeedbackSubject("");
    setFeedbackMessage("");

    // Simulate smart administrator response after 2 seconds
    setTimeout(() => {
      const savedLatest = localStorage.getItem("futurex_feedback");
      if (savedLatest) {
        try {
          const tickets: FeedbackMessage[] = JSON.parse(savedLatest);
          const answered = tickets.map((t) => {
            if (t.id === newTicket.id) {
              return {
                ...t,
                status: "replied" as const,
                reply: `Вітаємо, ${t.name}! Ваша заявка стосовно "${t.subject}" успішно оброблена штучним інтелектом FUTUREX Core. Наші менеджери зафіксували статус і зв'яжуться з вами протягом однієї години на адресу: ${t.email}. Дякуємо за вибір нашої платформи!`
              };
            }
            return t;
          });
          setFeedbacks(answered);
          localStorage.setItem("futurex_feedback", JSON.stringify(answered));
          onNotify("Адміністратор відповів", "Нове повідомлення в журналі звернень.", "info");
        } catch (e) {
          console.error(e);
        }
      }
    }, 2000);
  };

  // Helper colors for Categories
  const getCategoryTheme = (cat: 'work' | 'family' | 'friends' | 'other') => {
    switch (cat) {
      case "work":
        return { bg: "bg-indigo-500/10 text-indigo-500 dark:bg-indigo-500/20", label: "Робота" };
      case "family":
        return { bg: "bg-rose-500/10 text-rose-500 dark:bg-rose-500/20", label: "Сім'я" };
      case "friends":
        return { bg: "bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20", label: "Друзі" };
      default:
        return { bg: "bg-neutral-500/10 text-neutral-500 dark:bg-neutral-500/20", label: "Інше" };
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "?";
    return name.split(" ").slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Subtab workstation navigator */}
      <div className="flex justify-center mb-4">
        <div className="inline-flex bg-neutral-200/50 dark:bg-neutral-900/60 p-1 rounded-xl border border-neutral-200/40 dark:border-white/5 backdrop-blur-md">
          <button 
            onClick={() => setSubTab("personal")}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all uppercase flex items-center gap-1.5 cursor-pointer ${subTab === "personal" ? "bg-white dark:bg-[#141416] text-neutral-900 dark:text-white shadow-sm" : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200"}`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Мої Контакти</span>
          </button>
          <button 
            onClick={() => setSubTab("support")}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all uppercase flex items-center gap-1.5 cursor-pointer ${subTab === "support" ? "bg-white dark:bg-[#141416] text-neutral-900 dark:text-white shadow-sm" : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200"}`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Офіс та Підтримка</span>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {subTab === "personal" ? (
          // ====================================================
          // RENDER: PERSONAL CONTACT BOOK
          // ====================================================
          <motion.div
            key="personal-contacts-panel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            
            {/* Top Toolbar Action Workspace */}
            <div className="p-4 rounded-2xl border border-neutral-200/50 dark:border-white/5 bg-white/60 dark:bg-[#0c0c0e]/30 backdrop-blur-xl shadow-md flex flex-col md:flex-row gap-4 items-center justify-between">
              
              {/* Search Control */}
              <div className="w-full md:w-80 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Шукати за ім'ям, телефоном або описом..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-neutral-200 dark:border-white/10 bg-white/40 dark:bg-black/20 outline-none focus:ring-2 focus:ring-indigo-500/50 text-neutral-900 dark:text-white transition-all font-sans"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")} 
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Categorization Filter badging bar */}
              <div className="flex flex-wrap gap-1.5 justify-center">
                {(['all', 'work', 'friends', 'family', 'other'] as const).map((cat) => {
                  const label = cat === 'all' ? 'Всі' : (cat === 'work' ? 'Робота' : (cat === 'friends' ? 'Друзі' : (cat === 'family' ? 'Сім\'я' : 'Інше')));
                  const active = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1 text-[10px] uppercase font-bold tracking-wider rounded-lg transition-all cursor-pointer ${
                        active 
                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm' 
                        : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200 dark:bg-white/5 dark:text-neutral-400 dark:hover:bg-white/10'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              {/* Add trigger */}
              <button
                onClick={handleOpenAddForm}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs transition-all shadow flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <UserPlus className="w-4 h-4" />
                <span>Додати контакт</span>
              </button>
            </div>

            {/* Layout Grid: Contacts List and Inline Add/Edit Form */}
            <div className={`grid grid-cols-1 ${isFormOpen ? 'lg:grid-cols-3' : ''} gap-6 items-start`}>
              
              {/* Form Sidebar Panel (Visually displayed when Open) */}
              {isFormOpen && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-5 rounded-2xl border border-neutral-200/50 dark:border-white/5 bg-white/70 dark:bg-[#0c0c0e]/40 backdrop-blur-xl shadow-xl space-y-4"
                >
                  <div className="flex justify-between items-center pb-2 border-b border-neutral-200/30 dark:border-white/5">
                    <h3 className="font-heading font-semibold text-neutral-900 dark:text-white text-sm">
                      {editContactId ? "Редагувати контакт" : "Створити контакт"}
                    </h3>
                    <button 
                      onClick={() => { setIsFormOpen(false); setEditContactId(null); }}
                      className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleFormSubmit} className="space-y-3">
                    <div>
                      <label htmlFor="contactName" className="block text-[10px] uppercase font-bold tracking-wider text-neutral-400 mb-1 cursor-pointer">
                        Повне Ім'я або Псевдонім *
                      </label>
                      <input
                        id="contactName"
                        name="contactName"
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Костянтин Коваль"
                        className="w-full px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-white/10 bg-white/50 dark:bg-black/20 focus:ring-2 focus:ring-indigo-500/50 outline-none text-xs text-neutral-900 dark:text-white relative z-10 cursor-text"
                      />
                    </div>

                    <div>
                      <label htmlFor="contactPhone" className="block text-[10px] uppercase font-bold tracking-wider text-neutral-400 mb-1 cursor-pointer">
                        Номер Телефону
                      </label>
                      <input
                        id="contactPhone"
                        name="contactPhone"
                        type="text"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="+380 XX XXX XXXX"
                        className="w-full px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-white/10 bg-white/50 dark:bg-black/20 focus:ring-2 focus:ring-indigo-500/50 outline-none text-xs text-neutral-900 dark:text-white font-mono relative z-10 cursor-text"
                      />
                    </div>

                    <div>
                      <label htmlFor="contactEmail" className="block text-[10px] uppercase font-bold tracking-wider text-neutral-400 mb-1 cursor-pointer">
                        Адреса Електронної Пошти
                      </label>
                      <input
                        id="contactEmail"
                        name="contactEmail"
                        type="text"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="example@gmail.com"
                        className="w-full px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-white/10 bg-white/50 dark:bg-black/20 focus:ring-2 focus:ring-indigo-500/50 outline-none text-xs text-neutral-900 dark:text-white font-mono relative z-10 cursor-text"
                      />
                    </div>

                    <div>
                      <label htmlFor="contactCategory" className="block text-[10px] uppercase font-bold tracking-wider text-neutral-400 mb-1 cursor-pointer">
                        Категорія Відносин
                      </label>
                      <select
                        id="contactCategory"
                        name="contactCategory"
                        value={contactCategory}
                        onChange={(e) => setContactCategory(e.target.value as any)}
                        className="w-full px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-white/10 bg-white/50 dark:bg-black/30 text-xs text-neutral-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/50 relative z-10 cursor-pointer"
                      >
                        <option value="work">💼 Робота / Колега</option>
                        <option value="friends">🤝 Друзі / Знайомі</option>
                        <option value="family">🏠 Сім'я / Рідні</option>
                        <option value="other">🌐 Інше / Загальне</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="contactNotes" className="block text-[10px] uppercase font-bold tracking-wider text-neutral-400 mb-1 cursor-pointer">
                        Примітки (Замітки)
                      </label>
                      <textarea
                        id="contactNotes"
                        name="contactNotes"
                        rows={3}
                        value={contactNotes}
                        onChange={(e) => setContactNotes(e.target.value)}
                        placeholder="Додаткова інформація, нотатки..."
                        className="w-full px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-white/10 bg-white/50 dark:bg-black/20 focus:ring-2 focus:ring-indigo-500/50 outline-none text-xs text-neutral-900 dark:text-white resize-none relative z-10 cursor-text"
                      />
                    </div>

                    <div className="pt-2 flex gap-2">
                      <button
                        type="submit"
                        className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg text-xs transition-all shadow flex items-center justify-center gap-1 cursor-pointer relative z-10"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Зберегти</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => { setIsFormOpen(false); setEditContactId(null); }}
                        className="py-2 px-3 bg-neutral-200 hover:bg-neutral-300 dark:bg-white/5 dark:hover:bg-white/10 text-neutral-700 dark:text-neutral-300 font-semibold rounded-lg text-xs transition-all cursor-pointer relative z-10"
                      >
                        Скасувати
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Grid of Contatcs Card Grid */}
              <div className={`col-span-1 ${isFormOpen ? 'lg:col-span-2' : ''} space-y-4`}>
                {filteredContacts.length === 0 ? (
                  <div className="p-12 text-center rounded-2xl border border-neutral-200/50 dark:border-white/5 bg-white/60 dark:bg-[#0c0c0e]/30 backdrop-blur-xl">
                    <Info className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                    <h4 className="font-semibold text-neutral-800 dark:text-white text-sm">Нічого не знайдено</h4>
                    <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
                      Немає контактів за вказаним запитом. Спробуйте змінити фільтри або створити новий контакт прямо зараз.
                    </p>
                    <button
                      onClick={handleOpenAddForm}
                      className="mt-4 px-4 py-1.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 font-bold rounded-lg text-[10px] uppercase tracking-wider hover:opacity-90 transition-all cursor-pointer"
                    >
                      Створити перший контакт
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredContacts.map((contact) => {
                      const { bg: catBg, label: catLabel } = getCategoryTheme(contact.category);
                      return (
                        <motion.div
                          key={contact.id}
                          layout
                          className="p-5 flex flex-col justify-between rounded-2xl border border-neutral-200/50 dark:border-white/5 bg-white/60 dark:bg-[#0c0c0e]/30 hover:bg-white/80 dark:hover:bg-[#0c0c0e]/50 backdrop-blur-xl shadow-lg transition-all relative overflow-hidden"
                        >
                          <div className="space-y-4">
                            {/* Card Header Info */}
                            <div className="flex gap-3.5 items-start">
                              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-500/20 to-indigo-500/5 dark:from-indigo-500/30 dark:to-white/5 text-indigo-600 dark:text-indigo-400 border border-indigo-500/10 flex items-center justify-center font-bold font-heading text-sm">
                                {getInitials(contact.name)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <h4 className="font-semibold text-sm text-neutral-900 dark:text-white truncate font-heading">
                                    {contact.name}
                                  </h4>
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${catBg}`}>
                                    {catLabel}
                                  </span>
                                </div>
                                <span className="text-[9px] text-neutral-400 font-mono tracking-tight block mt-0.5">
                                  ID: {contact.id} • Створено: {contact.createdAt.split(",")[0]}
                                </span>
                              </div>
                            </div>

                            {/* Communication channels */}
                            <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-white/5 text-xs text-neutral-600 dark:text-neutral-400">
                              {contact.phone && (
                                <div className="flex items-center justify-between group">
                                  <div className="flex items-center gap-2 min-w-0">
                                    <Phone className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                                    <span className="font-mono truncate">{contact.phone}</span>
                                  </div>
                                  <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                      onClick={() => handleCopyToClipboard(contact.phone, "телефон")}
                                      className="p-1 hover:bg-neutral-100 dark:hover:bg-white/5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded transition-all"
                                      title="Копіювати телефон"
                                    >
                                      <Copy className="w-3 h-3" />
                                    </button>
                                    <a 
                                      href={`tel:${contact.phone}`}
                                      className="p-1 hover:bg-neutral-100 dark:hover:bg-white/5 text-indigo-500 rounded transition-all"
                                      title="Подзвонити"
                                    >
                                      <Phone className="w-3 h-3" />
                                    </a>
                                  </div>
                                </div>
                              )}

                              {contact.email && (
                                <div className="flex items-center justify-between group">
                                  <div className="flex items-center gap-2 min-w-0">
                                    <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                                    <span className="font-mono truncate">{contact.email}</span>
                                  </div>
                                  <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                      onClick={() => handleCopyToClipboard(contact.email, "пошта")}
                                      className="p-1 hover:bg-neutral-100 dark:hover:bg-white/5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded transition-all"
                                      title="Копіювати пошту"
                                    >
                                      <Copy className="w-3 h-3" />
                                    </button>
                                    <a 
                                      href={`mailto:${contact.email}`}
                                      className="p-1 hover:bg-neutral-100 dark:hover:bg-white/5 text-indigo-500 rounded transition-all"
                                      title="Надіслати лист"
                                    >
                                      <Mail className="w-3 h-3" />
                                    </a>
                                  </div>
                                </div>
                              )}

                              {contact.notes && (
                                <div className="mt-2.5 p-2 bg-neutral-100/40 dark:bg-white/5 rounded-lg border border-neutral-150/40 dark:border-white/5 text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed max-h-16 overflow-y-auto italic">
                                  {contact.notes}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Trigger edit or Delete actions */}
                          <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-white/5 flex gap-2 justify-end">
                            <button
                              onClick={() => handleEditContact(contact)}
                              className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 dark:bg-white/5 dark:text-neutral-400 dark:hover:text-neutral-200 dark:hover:bg-white/10 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                            >
                              <Edit2 className="w-3 h-3" />
                              <span>Редагувати</span>
                            </button>
                            <button
                              onClick={() => handleDeleteContact(contact.id, contact.name)}
                              className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-rose-500 hover:text-rose-600 bg-rose-500/5 hover:bg-rose-500/10 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Видалити</span>
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>

          </motion.div>
        ) : (
          // ====================================================
          // RENDER: OFFICE & FEEDBACK (SUPPORT TICKETING)
          // ====================================================
          <motion.div
            key="feedback-contacts-panel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start"
          >
            {/* 1. Office credentials info panel */}
            <div className="space-y-4">
              <div className="p-6 rounded-2xl border border-neutral-200/50 dark:border-white/5 bg-white/60 dark:bg-[#0c0c0e]/30 backdrop-blur-xl shadow-xl space-y-6">
                <div>
                  <h3 className="font-semibold text-lg text-neutral-900 dark:text-white font-heading">Офіційне представництво</h3>
                  <p className="text-xs text-neutral-400 mt-1">Зв'яжіться з нашими департаментами напряму</p>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="flex gap-3 items-start">
                    <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-lg">
                      <MapPin className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h5 className="font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider font-mono">Адреса офісу</h5>
                      <p className="text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed">вул. Хрещатик, 22, Київ, 01001, Україна</p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start">
                    <div className="p-2 bg-rose-500/10 text-rose-550 rounded-lg">
                      <Phone className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h5 className="font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider font-mono">Контактна лінія</h5>
                      <p className="text-neutral-500 dark:text-neutral-400 mt-0.5 font-mono">+380 44 233 45 67 (цілодобово)</p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start">
                    <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
                      <Mail className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h5 className="font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider font-mono">Електронна пошта</h5>
                      <p className="text-neutral-500 dark:text-neutral-400 mt-0.5 font-mono">support@futurex-portal.io</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vector custom styled Mock map */}
              <div className="h-44 rounded-xl border border-neutral-200/50 dark:border-white/5 bg-neutral-100 dark:bg-neutral-900 overflow-hidden relative shadow-inner">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(100,110,130,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(100,110,130,0.06)_1px,transparent_1px)] bg-[size:16px_16px]" />
                <div className="absolute inset-x-0 bottom-4 text-center select-none z-10">
                  <span className="text-[10px] bg-neutral-900/80 dark:bg-black/90 text-white font-mono rounded px-3 py-1 uppercase tracking-widest border border-white/5">
                    Київ, Хрещатик 22
                  </span>
                </div>
                {/* Animated pin overlay map */}
                <div className="absolute top-[45%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <span className="w-3.5 h-3.5 bg-indigo-500 rounded-full animate-ping absolute" />
                  <span className="w-4 h-4 bg-indigo-600 rounded-full border-2 border-white relative" />
                </div>
              </div>
            </div>

            {/* 2. Feedback Form submission panel */}
            <div className="p-6 rounded-2xl border border-neutral-200/50 dark:border-white/5 bg-white/60 dark:bg-[#0c0c0e]/30 backdrop-blur-xl shadow-xl">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-neutral-400 font-mono mb-4">Форма Зворотного Зв'язку</h3>

              <form onSubmit={handleFeedbackSubmit} className="space-y-3.5">
                <div>
                  <label htmlFor="feedbackName" className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1 font-sans cursor-pointer">
                    Ваше повне ім'я *
                  </label>
                  <input
                    id="feedbackName"
                    name="feedbackName"
                    type="text"
                    required
                    value={feedbackName}
                    onChange={(e) => setFeedbackName(e.target.value)}
                    placeholder="Костянтин Коваль..."
                    className="w-full px-4 py-2 rounded-xl border border-neutral-200 dark:border-white/10 bg-white/50 dark:bg-black/20 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none text-xs text-neutral-900 dark:text-white transition-all relative z-10 cursor-text"
                  />
                </div>

                <div>
                  <label htmlFor="feedbackEmail" className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1 font-sans cursor-pointer">
                    Адреса email *
                  </label>
                  <input
                    id="feedbackEmail"
                    name="feedbackEmail"
                    type="email"
                    required
                    value={feedbackEmail}
                    onChange={(e) => setFeedbackEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    className="w-full px-4 py-2 rounded-xl border border-neutral-200 dark:border-white/10 bg-white/50 dark:bg-black/20 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none text-xs text-neutral-900 dark:text-white transition-all font-mono relative z-10 cursor-text"
                  />
                </div>

                <div>
                  <label htmlFor="feedbackSubject" className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1 font-sans cursor-pointer">
                    Тема звернення *
                  </label>
                  <input
                    id="feedbackSubject"
                    name="feedbackSubject"
                    type="text"
                    required
                    value={feedbackSubject}
                    onChange={(e) => setFeedbackSubject(e.target.value)}
                    placeholder="Запит на співпрацю, баг тощо..."
                    className="w-full px-4 py-2 rounded-xl border border-neutral-200 dark:border-white/10 bg-white/50 dark:bg-black/20 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none text-xs text-neutral-900 dark:text-white transition-all relative z-10 cursor-text"
                  />
                </div>

                <div>
                  <label htmlFor="feedbackMessage" className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1 font-sans cursor-pointer">
                    Текст повідомлення *
                  </label>
                  <textarea
                    id="feedbackMessage"
                    name="feedbackMessage"
                    required
                    rows={4}
                    value={feedbackMessage}
                    onChange={(e) => setFeedbackMessage(e.target.value)}
                    placeholder="Опишіть детально ваше питання або відгук для FUTUREX..."
                    className="w-full px-4 py-2 rounded-xl border border-neutral-200 dark:border-white/10 bg-white/50 dark:bg-black/20 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none text-xs text-neutral-900 dark:text-white transition-all resize-none relative z-10 cursor-text"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 font-semibold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 animate-pulse" />
                  <span>Надіслати повідомлення</span>
                </button>
              </form>
            </div>

            {/* 3. Realtime Ticket response console logs */}
            <div className="p-5 rounded-2xl border border-neutral-200/50 dark:border-white/5 bg-white/60 dark:bg-[#0c0c0e]/30 backdrop-blur-xl shadow-xl min-h-[460px] flex flex-col justify-between">
              <div>
                <h4 className="font-semibold text-xs uppercase tracking-wider text-neutral-400 font-mono mb-4 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-indigo-500" />
                  <span>Журнал Звернень ({feedbacks.length})</span>
                </h4>

                <div className="space-y-4 max-h-[360px] overflow-y-auto">
                  {feedbacks.length === 0 ? (
                    <div className="text-center py-20 text-neutral-400 text-xs font-sans">
                      Немає надісланих тикетів. Скористайтеся формою, щоб створити звернення.
                    </div>
                  ) : (
                    feedbacks.map((t) => (
                      <div
                        key={t.id}
                        className="p-3 bg-neutral-100/50 dark:bg-white/5 rounded-xl border border-neutral-200 dark:border-white/5 font-sans text-xs space-y-1.5"
                      >
                        <div className="flex justify-between items-center text-[10px] font-mono">
                          <span className="font-bold text-indigo-500">{t.id}</span>
                          <span className="text-neutral-400">{t.createdAt}</span>
                        </div>
                        
                        <p className="font-bold text-neutral-800 dark:text-neutral-200 break-all">{t.subject}</p>
                        <p className="text-neutral-500 dark:text-neutral-400 italic font-medium break-all">"{t.message}"</p>

                        {/* Status Indicator */}
                        <div className="pt-2 border-t border-neutral-150/40 dark:border-white/5 flex gap-2 items-start shrink-0">
                          {t.status === "new" ? (
                            <span className="inline-flex items-center gap-1 text-[9px] text-amber-500 font-bold bg-amber-500/10 px-2 py-0.5 rounded font-mono">
                              <Clock className="w-3 h-3" />
                              <span>Черга обробки...</span>
                            </span>
                          ) : (
                            <div className="space-y-1 shrink-0 w-full">
                              <span className="inline-flex items-center gap-1 text-[9px] text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded font-mono mb-1">
                                <CheckCircle className="w-3 h-3" />
                                <span>Відповідь Сформовано</span>
                              </span>
                              <p className="text-[10px] bg-neutral-200/50 dark:bg-neutral-900/40 p-2 rounded-lg text-neutral-600 dark:text-neutral-300 leading-relaxed break-words font-sans">
                                {t.reply}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="text-[10px] text-neutral-400 dark:text-neutral-550 border-t border-neutral-150/40 dark:border-white/5 pt-4 font-mono leading-relaxed mt-4">
                Усі звернення кодуються зашифрованими тикетами та анонімізуються.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingContactId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm p-6 rounded-2xl border border-neutral-250 dark:border-white/10 bg-white dark:bg-[#121214] shadow-2xl text-center space-y-4"
            >
              <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-550 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1.5">
                <h4 className="font-bold text-sm text-neutral-900 dark:text-white font-heading">
                  Видалити контакт?
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-normal">
                  Ви впевнені, що хочете видалити контакт <span className="font-semibold text-neutral-800 dark:text-neutral-200">"{deletingContactName}"</span>? Цю дію не можна буде скасувати.
                </p>
              </div>
              <div className="flex gap-2.5 pt-2">
                <button
                  onClick={() => {
                    if (deletingContactId) {
                      const updated = personalContacts.filter((c) => c.id !== deletingContactId);
                      saveContactsList(updated);
                      onNotify("Контакт видалено", `Контакт "${deletingContactName}" успішно стерто.`, "warning");
                    }
                    setDeletingContactId(null);
                    setDeletingContactName("");
                  }}
                  className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-xl text-xs transition-all shadow-md cursor-pointer"
                >
                  Видалити
                </button>
                <button
                  onClick={() => {
                    setDeletingContactId(null);
                    setDeletingContactName("");
                  }}
                  className="flex-1 py-2 bg-neutral-100 hover:bg-neutral-250 dark:bg-white/5 dark:hover:bg-white/10 text-neutral-700 dark:text-neutral-300 font-semibold rounded-xl text-xs transition-all cursor-pointer"
                >
                  Скасувати
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
