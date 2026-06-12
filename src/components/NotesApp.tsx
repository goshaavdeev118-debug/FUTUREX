import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Pin, Trash2, Search, Tag, Eye, EyeOff, Save, Check, Sparkles } from "lucide-react";
import { Note } from "../types";

interface NotesAppProps {
  onNotify: (title: string, message: string, type: 'info' | 'success' | 'warning' | 'error') => void;
}

export default function NotesApp({ onNotify }: NotesAppProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Загальне");
  const [pinned, setPinned] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#6366f1"); // Violet default
  const [editingId, setEditingId] = useState<string | null>(null);

  // Search filter
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Всі");

  const colors = [
    { name: "Indigo", value: "#6366f1", bg: "bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/15" },
    { name: "Rose", value: "#f43f5e", bg: "bg-rose-500/10 text-rose-500 hover:bg-rose-500/15" },
    { name: "Emerald", value: "#10b981", bg: "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/15" },
    { name: "Amber", value: "#f59e0b", bg: "bg-amber-500/10 text-amber-500 hover:bg-amber-500/15" },
    { name: "Sky", value: "#0ea5e9", bg: "bg-sky-500/10 text-sky-500 hover:bg-sky-500/15" },
  ];

  const categories = ["Загальне", "Ідеї", "Робота", "Навчання", "Архів"];

  useEffect(() => {
    const saved = localStorage.getItem("futurex_notes");
    if (saved) {
      try {
        setNotes(JSON.parse(saved));
      } catch (e) {
        console.error("Помилка завантаження нотаток", e);
      }
    } else {
      const defaultNotes: Note[] = [
        {
          id: "1",
          title: "Купівля електрокара Tesla",
          content: "Проаналізувати переваги Tesla Model S Plaid з тримоторною силовою установкою. Розрахувати запас ходу, вартість заправки на суперчарджерах та екологічну доцільність.",
          category: "Ідеї",
          pinned: true,
          color: "#f59e0b",
          updatedAt: new Date().toLocaleDateString("uk-UA")
        },
        {
          id: "2",
          title: "Дизайн-система Stripe",
          content: "Для нового порталу FutureX варто впровадити плавні інтерактивні сітки Stripe, а також їхній фірмовий стиль кодування кольорів для кнопок і бейджів.",
          category: "Робота",
          pinned: false,
          color: "#6366f1",
          updatedAt: new Date().toLocaleDateString("uk-UA")
        }
      ];
      setNotes(defaultNotes);
      localStorage.setItem("futurex_notes", JSON.stringify(defaultNotes));
    }
  }, []);

  const saveNotes = (updated: Note[]) => {
    setNotes(updated);
    localStorage.setItem("futurex_notes", JSON.stringify(updated));
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    if (editingId) {
      // Edit existing note
      const updated = notes.map((n) => {
        if (n.id === editingId) {
          return {
            ...n,
            title,
            content,
            category,
            pinned,
            color: selectedColor,
            updatedAt: new Date().toLocaleDateString("uk-UA")
          };
        }
        return n;
      });
      saveNotes(updated);
      onNotify("Нотатку оновлено", `"${title}" успішно відредаговано.`, "success");
      setEditingId(null);
    } else {
      // Create new note
      const newNote: Note = {
        id: Date.now().toString(),
        title,
        content,
        category,
        pinned,
        color: selectedColor,
        updatedAt: new Date().toLocaleDateString("uk-UA")
      };
      const updated = [newNote, ...notes];
      saveNotes(updated);
      onNotify("Нотатку створено", `"${title}" успішно збережено у вашому браузері.`, "success");
    }

    // Reset controls
    setTitle("");
    setContent("");
    setPinned(false);
    setCategory("Загальне");
  };

  const handleSelectEdit = (note: Note) => {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setCategory(note.category);
    setPinned(note.pinned);
    setSelectedColor(note.color);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTitle("");
    setContent("");
    setPinned(false);
    setCategory("Загальне");
  };

  const handleDeleteNote = (id: string) => {
    const target = notes.find((n) => n.id === id);
    const updated = notes.filter((n) => n.id !== id);
    saveNotes(updated);
    if (target) {
      onNotify("Нотатку видалено", `"${target.title}" було назавжди стерто.`, "info");
    }
    if (editingId === id) cancelEdit();
  };

  const togglePinNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = notes.map((n) => {
      if (n.id === id) {
        return { ...n, pinned: !n.pinned };
      }
      return n;
    });
    saveNotes(updated);
  };

  const filteredNotes = notes.filter((note) => {
    const matchesSearch = note.title.toLowerCase().includes(query.toLowerCase()) ||
                          note.content.toLowerCase().includes(query.toLowerCase());
    const matchesCat = selectedCategory === "Всі" || note.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  // Separate pinned/unpinned
  const pinnedNotes = filteredNotes.filter((n) => n.pinned);
  const unpinnedNotes = filteredNotes.filter((n) => !n.pinned);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto items-start">
      {/* Note Editor Form Creator */}
      <div className="p-6 rounded-2xl border border-neutral-200/50 dark:border-white/5 bg-white/60 dark:bg-[#0c0c0e]/30 backdrop-blur-xl shadow-xl flex flex-col justify-between min-h-[480px]">
        <form onSubmit={handleSaveNote} className="space-y-4 grow">
          <div className="flex justify-between items-center mb-1">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-neutral-400 font-mono">
              {editingId ? "Редагування Нотатки" : "Створити Нотатку"}
            </h3>
            <button
              type="button"
              onClick={(e) => {
                setPinned(!pinned);
              }}
              className={`p-1.5 rounded-lg border transition-all ${
                pinned
                  ? "bg-amber-500/15 border-amber-500/20 text-amber-500"
                  : "border-neutral-200 dark:border-white/5 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/5"
              }`}
              title="Закріпити зверху"
            >
              <Pin className="w-4 h-4" />
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1 font-sans">
              Заголовок нотатки
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Слушна ідея чи зустріч..."
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-white/50 dark:bg-black/20 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none text-sm text-neutral-900 dark:text-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1 font-sans">
              Текст нотатки *
            </label>
            <textarea
              required
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Опишіть ваші думки, посилання або спостереження у розгорнутому вигляді..."
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-white/50 dark:bg-black/20 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none text-sm text-neutral-900 dark:text-white transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1 font-sans">
                Розділ категорії
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-white/50 dark:bg-black/25 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none text-xs text-neutral-900 dark:text-white transition-all"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1 font-sans">
                Колірна марка
              </label>
              <div className="flex gap-1.5 h-10 items-center justify-start">
                {colors.map((c) => (
                  <button
                    type="button"
                    key={c.value}
                    onClick={() => setSelectedColor(c.value)}
                    style={{ backgroundColor: c.value }}
                    className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer hover:scale-110 ${
                      selectedColor === c.value
                        ? "border-neutral-950 dark:border-white scale-105"
                        : "border-transparent"
                    }`}
                    title={c.name}
                  />
                ))}
              </div>
            </div>
          </div>
        </form>

        <div className="pt-4 border-t border-neutral-200/50 dark:border-white/5 flex gap-2">
          {editingId && (
            <button
              onClick={cancelEdit}
              className="w-1/3 py-2.5 rounded-xl border border-neutral-200 dark:border-white/10 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-white/5 text-xs font-medium cursor-pointer"
            >
              Скасувати
            </button>
          )}
          <button
            onClick={handleSaveNote}
            className={`py-3 rounded-xl font-semibold text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer ${
              editingId ? "w-2/3 bg-indigo-600 text-white" : "w-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 hover:bg-neutral-800"
            }`}
          >
            <Save className="w-4 h-4" />
            <span>{editingId ? "Зберегти" : "Зберегти нотатку"}</span>
          </button>
        </div>
      </div>

      {/* Grid List view notes rendering */}
      <div className="lg:col-span-2 space-y-5">
        {/* Search header filters */}
        <div className="p-4 rounded-xl border border-neutral-200/50 dark:border-white/5 bg-white/60 dark:bg-[#0c0c0e]/30 backdrop-blur-xl shadow-md flex flex-col md:flex-row gap-3 justify-between items-center">
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Шукати у тексті нотаток..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-neutral-200 dark:border-white/5 bg-white/40 dark:bg-black/20 text-xs focus:ring-1 focus:ring-indigo-500 outline-none text-neutral-900 dark:text-white transition-all"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto w-full md:w-auto">
            {["Всі", ...categories].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-medium shrink-0 transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 border border-indigo-500/20"
                    : "text-neutral-400 hover:text-neutral-800 dark:hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Notes display */}
        {pinnedNotes.length === 0 && unpinnedNotes.length === 0 ? (
          <div className="text-center py-24 rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800 bg-white/30 dark:bg-transparent">
            <Search className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Немає збережених нотаток</p>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
              Напишіть першу нотатку на панелі ліворуч, щоб зафіксувати її назавжди.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* 1. Pinned Group */}
            {pinnedNotes.length > 0 && (
              <div>
                <h4 className="text-xs uppercase font-bold text-amber-500 tracking-widest font-mono flex items-center gap-1.5 mb-3 px-1 select-none">
                  <Pin className="w-3.5 h-3.5 fill-amber-500" />
                  <span>Закріплені записи</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pinnedNotes.map((note) => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      onSelect={handleSelectEdit}
                      onDelete={handleDeleteNote}
                      onTogglePin={togglePinNote}
                      isEditing={editingId === note.id}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 2. Standard Group */}
            {unpinnedNotes.length > 0 && (
              <div>
                {pinnedNotes.length > 0 && (
                  <h4 className="text-xs uppercase font-bold text-neutral-400 tracking-widest font-mono mb-3 px-1 select-none">
                    Всі інші записи
                  </h4>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {unpinnedNotes.map((note) => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      onSelect={handleSelectEdit}
                      onDelete={handleDeleteNote}
                      onTogglePin={togglePinNote}
                      isEditing={editingId === note.id}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Internal Note Card render block
interface NoteCardProps {
  key?: string;
  note: Note;
  onSelect: (note: Note) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string, e: React.MouseEvent) => void;
  isEditing: boolean;
}

function NoteCard({ note, onSelect, onDelete, onTogglePin, isEditing }: NoteCardProps) {
  return (
    <motion.div
      layout
      onClick={() => onSelect(note)}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className={`rounded-2xl p-5 border cursor-pointer apple-hover transition-all flex flex-col justify-between min-h-[170px] relative overflow-hidden group ${
        isEditing
          ? "border-indigo-500 ring-2 ring-indigo-500/10 shadow-lg bg-indigo-500/5"
          : "border-neutral-200 dark:border-white/5 bg-white dark:bg-[#0c0c0e]/30 shadow-sm hover:shadow-md"
      }`}
    >
      {/* Decorative vertical colored left bar indicator for aesthetics */}
      <div className="absolute top-0 left-0 w-1.5 h-full" style={{ backgroundColor: note.color }} />

      <div>
        <div className="flex justify-between items-start gap-4 mb-2 pl-2">
          <h5 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 group-hover:text-indigo-500 transition-colors duration-200">
            {note.title}
          </h5>
          <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
            <button
              onClick={(e) => onTogglePin(note.id, e)}
              className={`p-1 rounded hover:bg-neutral-150 dark:hover:bg-white/10 transition-all ${
                note.pinned ? "text-amber-500" : "text-neutral-400"
              }`}
              title={note.pinned ? "Відкріпити" : "Закріпити"}
            >
              <Pin className={`w-3.5 h-3.5 ${note.pinned ? "fill-amber-500" : ""}`} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(note.id);
              }}
              className="p-1 rounded hover:bg-rose-500/10 text-neutral-400 hover:text-rose-500 transition-all"
              title="Видалити"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-sans line-clamp-4 pl-2 break-words">
          {note.content}
        </p>
      </div>

      <div className="flex items-center justify-between mt-4 border-t border-neutral-100 dark:border-white/5 pt-3 pl-2">
        <span className="text-[10px] font-medium text-neutral-400 bg-neutral-100 dark:bg-white/5 px-2 py-0.5 rounded-full border border-neutral-150 dark:border-white/5 flex items-center gap-1">
          <Tag className="w-2.5 h-2.5" />
          <span>{note.category}</span>
        </span>
        <span className="text-[10px] text-neutral-400 font-mono">{note.updatedAt}</span>
      </div>
    </motion.div>
  );
}
