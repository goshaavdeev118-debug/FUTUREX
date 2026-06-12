import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Heart, Bookmark, Clock, ArrowLeft, Send, Sparkles, User, MessageSquare, Play, Video } from "lucide-react";
import { BlogPost } from "../types";

export default function Blog() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Всі");
  const [readingPost, setReadingPost] = useState<BlogPost | null>(null);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  
  // Blog static list (Apple / Tesla / Stripe topics)
  const [posts, setPosts] = useState<BlogPost[]>([
    {
      id: "b1",
      title: "Мистецтво субпіксельної досконалості: Філософія дизайну Apple",
      summary: "Дослідження того, як Apple використовує субпіксельне згладжування, негативний простір та шрифтову ієрархію для формування преміальних інтерфейсів.",
      content: `У сучасному цифровому просторі різниця між звичайним продуктом та шедевром преміум-рівня полягає в деталях, яких користувач може навіть не помітити свідомо. Філософія дизайну Apple базується на концепції "невидимої досконалості".

1. СКЛЯНИЙ МІНІМАЛІЗМ (GLASSMORPHISM)
Використання розмиття заднього фону (backdrop blur) створює відчуття фізичної глибини на пласкому екрані. Елементи інтерфейсу здаються легкими, наче вони висічені з кристалів, що ширяють у повітрі. Це зменшує когнітивне навантаження та полегшує просторове орієнтування користувача.

2. НЕГАТИВНИЙ ПРОСТІР ЯК ФУНКЦІОНАЛЬНИЙ ЕЛЕМЕНТ
Багато дизайнерів прагнуть заповнити кожен піксель екрана інформацією. Натомість преміальні бренди на кшталт Apple та Tesla використовують простір як "дихальну зону". Вільні зони навколо заголовків фокусують зір на найголовнішому та створюють відчуття дорожнечі та вишуканості.

3. ПРЕТЕНЗІЙНА ТИПОГРАФІКА
Поєднання геометричних шрифтів (наприклад, Space Grotesk) для ефектних великих заголовків із суперчистими нео-гротесками (Inter) для основного тексту створює неповторний візуальний ритм. Це мова розкоші та технологій майбутнього.`,
      category: "Дизайн",
      readTime: "4 хв чит.",
      date: "08 Червня, 2026",
      image: "https://images.unsplash.com/photo-1461151304267-38535e780c79?q=80&w=600&auto=format&fit=crop",
      author: {
        name: "Марк Юрченко",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=120&auto=format&fit=crop"
      },
      likes: 128,
      likedByUser: false
    },
    {
      id: "b2",
      title: "Впровадження API Stripe: Новий рівень безпеки фінансових транзакцій",
      summary: "Як розробникам побудувати надійну платіжну систему з нульовою затримкою, використовуючи передові методи шифрування Stripe.",
      content: `Безпека фінансів у мережі є наріжним каменем будь-якого успішного комерційного продукту. Платформа Stripe довела, що інтеграція фінансових API може бути одночасно надзвичайно надійною та простою для розробника.

1. ТОКЕНІЗАЦІЯ ДАНИХ (TOKENIZATION)
Уникайте збереження конфіденційних даних банківських карт безпосередньо у вашій базі даних. Stripe використовує технологію токенізації, перетворюючи платіжні реквізити користувача на безпечний унікальний ключ (токен) перед відправкою через мережу.

2. КЛІЄНТСЬКА ОБРОБКА ТА API-ПРОКСІ
Реалізація платежів за схемою Stripe-Elements гарантує, що особисті фінансові дані ніколи не перетинають ваші сервери. Браузер взаємодіє з серверами Stripe безпосередньо за допомогою зашифрованих SSL каналів, а ваша система отримує лише підтвердження успішної авторизації.

3. ПРИВАТНІСТЬ ТА AES-256
Шифрування за стандартом AES-256 захищає дані користувача на всіх етапах обробки транзакцій. Це зводить імовірність витоку даних практично до нуля, забезпечуючи довіру користувачів.`,
      category: "Технології",
      readTime: "6 хв чит.",
      date: "05 Червня, 2026",
      image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=600&auto=format&fit=crop",
      author: {
        name: "Олексій Савченко",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120&auto=format&fit=crop"
      },
      likes: 84,
      likedByUser: false
    },
    {
      id: "b3",
      title: "Еволюція автономності Tesla: Штучний інтелект на колесах",
      summary: "Аналіз систем FSD Supervised та нейромережевих графів, які дозволяють електрокарам Tesla орієнтуватися у складних міських умовах.",
      content: `Tesla змінила уявлення про автомобільну індустрію, перетворивши транспортний засіб на високоінтелектуальний обчислювальний центр. Їхня система автономного водіння (Full Self-Driving, або FSD) спирається на передові технології комп’ютерного зору.

1. ТІЛЬКИ КАМЕРИ: ФІЛОСОФІЯ TESLA VISION
На відміну від більшості конкурентів, що використовують дорогі лідари (LiDAR) та радари, Tesla зробила ставку виключно на оптичні камери. Філософія Ілона Маска проста: люди керують за допомогою очей та мозку, тому штучний інтелект автомобіля має орієнтуватися так само - виключно за допомогою зору та потужного процесора.

2. СУПЕРКОМП'ЮТЕР DOJO ТА ШТУЧНИЙ ІНТЕЛЕКТ
Нейромережа Tesla навчається на базі мільйонів кілометрів реальних поїздок, здійснених власниками по всьому світу. Суперкомп’ютер DOJO обробляє терабайти відеоданих щомиті, оптимізуючи траєкторії руху, реакцію на раптові перешкоди та алгоритми розпізнавання знаків.

3. ЕНЕРГОЕФЕКТИВНІСТЬ І ПРОДУКТИВНІСТЬ
Суперслайди графічних ядер Tesla FSD Chip здатні виконувати до 144 трильйонів операцій за секунду (TOPS) при споживанні менше ніж 100 Ватт енергії. Це тріумф інженерного мистецтва, що тримає компанію на крок попереду залізо-обчислювальної індустрії.`,
      category: "Продуктивність",
      readTime: "8 хв чит.",
      date: "01 Червня, 2026",
      image: "https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=600&auto=format&fit=crop",
      author: {
        name: "Дарина Коваленко",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=120&auto=format&fit=crop"
      },
      likes: 95,
      likedByUser: false
    },
    {
      id: "b4",
      title: "Торгівля Ф'ючерсами: Відеоурок по біржі від професіоналів",
      summary: "Практичний відеорозбір по роботі з терміналом, розрахунком маржинального плеча, установкою ордерів Stop-Loss та Take-Profit на біржі.",
      content: `Ласкаво просимо до професійного практичного керівництва з торгівлі ф'ючерсами! Деривативні інструменти надають чудові можливості, але вимагають максимальної дисципліни.

У цьому детальному відео-тренінгу ми розберемо:
1. КРЕДИТНЕ ПЛЕЧЕ ТА МАРЖА: Комплексне налаштування ізольованої та крос-маржі на біржовому акаунті. Як уникнути ліквідації позиції та обирати безпечні розміри плеча під свій депозит.
2. СИСТЕМА УПРАВЛІННЯ РИЗИКАМИ (RISK MANAGEMENT): Чому ордери Stop-Loss є обов'язковими, як розраховувати співвідношення ризику до прибутку (Risk/Reward) від 1:3 і контролювати емоції під час торгового дня.
3. АНАЛІЗ КНИГИ ОРДЕРІВ (ORDER BOOK): Графічне зчитування ордерів маркет-мейкерів, стіни ліквідності та аналіз динаміки об'ємів торгівлі.

Перегляньте повне відео-керівництво, інтегроване безпосередньо у ваш термінал FutureX.`,
      category: "Трейдинг",
      readTime: "15 хв відео",
      date: "08 Червня, 2026",
      image: "https://images.unsplash.com/photo-1642790106117-e829e14a795f?q=80&w=600&auto=format&fit=crop",
      author: {
        name: "Владислав Кравченко",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=120&auto=format&fit=crop"
      },
      likes: 215,
      likedByUser: false,
      videoEmbedId: "I6pCo-8Y6Zc"
    },
    {
      id: "b5",
      title: "Стратегії Price Action на практиці: Точки входу та Рівні",
      summary: "Відео-розбір технічного аналізу без зайвого індикаторного шуму. Робота з графіками валют, криптовалют та психологією біржових гравців.",
      content: `Успішний трейдинг полягає у правильному зчитуванні чистого руху ціни на біржах. Торгова стратегія Price Action дозволяє вам аналізувати рух цін напряму, без запізнілих математичних моделей звичайних індикаторів.

Головні аспекти уроку:
1. РІВНІ ПІДТРИМКИ ТА ОПОРУ (SUPPORT/RESISTANCE): Чому рівні працюють, як знаходити сильні історичні зони на денних та годинних таймфреймах і відрізняти їх від локальних шумів ринку.
2. КЛЮЧОВІ ПАТТЕРНИ: Свічки поглинання (engulfing), пін-бари (pin bars) та помилкові спроби пробою з метою збору ліквідності (scams/sweeps).
3. ПСИХОЛОГІЯ ТРЕЙДИНГУ: Контроль над емоціями під час кризових флетів та уміння терпляче очікувати на свій ідеально сформований сетап.

Перегляньте професійну торгову сесію у наведеному нижче плеєрі.`,
      category: "Трейдинг",
      readTime: "12 хв відео",
      date: "07 Червня, 2026",
      image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=600&auto=format&fit=crop",
      author: {
        name: "Анна Волкова",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=120&auto=format&fit=crop"
      },
      likes: 173,
      likedByUser: false,
      videoEmbedId: "957Vb_l9B0Y"
    }
  ]);

  const categories = ["Всі", "Трейдинг", "Дизайн", "Технології", "Продуктивність"];

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPosts(
      posts.map((p) => {
        if (p.id === id) {
          const liked = !p.likedByUser;
          return {
            ...p,
            likes: liked ? p.likes + 1 : p.likes - 1,
            likedByUser: liked,
          };
        }
        return p;
      })
    );
  };

  const handleToggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (bookmarks.includes(id)) {
      setBookmarks(bookmarks.filter((b) => b !== id));
    } else {
      setBookmarks([...bookmarks, id]);
    }
  };

  const filteredPosts = posts.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(query.toLowerCase()) ||
                          p.summary.toLowerCase().includes(query.toLowerCase());
    const matchesCat = selectedCategory === "Всі" || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-6xl mx-auto animate-fadeIn select-text">
      <AnimatePresence mode="wait">
        {readingPost ? (
          /* Expand Article Read screen */
          <motion.article
            key="active-read"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="rounded-3xl border border-neutral-200/50 dark:border-white/5 bg-white/60 dark:bg-[#0c0c0e]/30 backdrop-blur-xl p-6 sm:p-10 shadow-2xl relative"
          >
            {/* Go Back button */}
            <button
              onClick={() => setReadingPost(null)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-550 mb-6 bg-neutral-100 hover:bg-neutral-200 dark:bg-white/5 dark:hover:bg-white/10 px-4 py-2 rounded-xl transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Повернутися до блогу</span>
            </button>

            {/* Title headers */}
            <div className="space-y-4 max-w-3xl">
              <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-550 px-2.5 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/15">
                {readingPost.category}
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading text-neutral-900 dark:text-white leading-tight">
                {readingPost.title}
              </h1>

              {/* Author index */}
              <div className="flex items-center gap-3 pt-2">
                <img
                  src={readingPost.author.avatar}
                  alt={readingPost.author.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/20"
                />
                <div>
                  <h5 className="text-xs font-bold text-neutral-800 dark:text-neutral-200">{readingPost.author.name}</h5>
                  <p className="text-[10px] text-neutral-400 font-mono mt-0.5">{readingPost.date} • {readingPost.readTime}</p>
                </div>
              </div>
            </div>

            {/* Cover display image or video player */}
            {readingPost.videoEmbedId ? (
              <div className="my-8 rounded-2xl overflow-hidden aspect-video w-full bg-black shadow-xl ring-1 ring-white/10 relative">
                <iframe
                  src={`https://www.youtube.com/embed/${readingPost.videoEmbedId}?autoplay=1&rel=0&modestbranding=1`}
                  title={readingPost.title}
                  className="w-full h-full border-0 absolute inset-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="my-8 rounded-2xl overflow-hidden h-[240px] sm:h-[400px]">
                <img
                  src={readingPost.image}
                  alt={readingPost.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            {/* Markdown Text rendering markup */}
            <div className="max-w-3xl mx-auto text-neutral-750 dark:text-neutral-300 text-sm sm:text-base leading-relaxed space-y-6 whitespace-pre-wrap font-sans font-normal selection:bg-indigo-500/20">
              {readingPost.content}
            </div>

            {/* Foot interaction details */}
            <div className="mt-12 pt-6 border-t border-neutral-200/50 dark:border-white/5 flex justify-between items-center max-w-3xl mx-auto">
              <div className="flex items-center gap-4">
                <button
                  onClick={(e) => handleLike(readingPost.id, e)}
                  className={`flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    readingPost.likedByUser
                      ? "bg-rose-500/15 border-rose-500/20 text-rose-505 font-bold"
                      : "border-neutral-200 dark:border-white/10 text-neutral-500 hover:bg-neutral-100"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${readingPost.likedByUser ? "fill-rose-500 text-rose-500" : ""}`} />
                  <span>{readingPost.likes} Подобається</span>
                </button>

                <button
                  onClick={(e) => handleToggleBookmark(readingPost.id, e)}
                  className={`p-2 rounded-xl border transition-all cursor-pointer ${
                    bookmarks.includes(readingPost.id)
                      ? "bg-indigo-500/15 border-indigo-500/25 text-indigo-500"
                      : "border-neutral-200 dark:border-white/10 text-neutral-500 hover:bg-neutral-100"
                  }`}
                  title="Зберегти статтю"
                >
                  <Bookmark className={`w-4 h-4 ${bookmarks.includes(readingPost.id) ? "fill-indigo-500 text-indigo-500" : ""}`} />
                </button>
              </div>

              <div className="text-[11px] text-neutral-400 font-mono">
                FutureX Publishing, 2026.
              </div>
            </div>
          </motion.article>
        ) : (
          /* Default Grid index view */
          <motion.div
            key="blog-index"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Search filtering panels */}
            <div className="p-4 rounded-xl border border-neutral-200/50 dark:border-white/5 bg-white/60 dark:bg-[#0c0c0e]/30 backdrop-blur-xl shadow-md flex flex-col md:flex-row gap-3 justify-between items-center">
              <div className="relative w-full md:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Шукати статтю..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-neutral-200 dark:border-white/5 bg-white/40 dark:bg-black/20 text-xs focus:ring-1 focus:ring-indigo-500 outline-none text-neutral-900 dark:text-white transition-all"
                />
              </div>

              <div className="flex gap-1.5 overflow-x-auto w-full md:w-auto">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium shrink-0 transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? "bg-indigo-500/10 text-indigo-550 dark:text-indigo-400 border border-indigo-500/20"
                        : "text-neutral-400 hover:text-neutral-800 dark:hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* List Items */}
            {filteredPosts.length === 0 ? (
              <div className="text-center py-20 rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800">
                <Search className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Нічого не знайдено за запитом</p>
                <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">Оновіть пошуковий термін або фільтр категорії.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post) => (
                  <motion.div
                    key={post.id}
                    layoutId={`post-${post.id}`}
                    onClick={() => setReadingPost(post)}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className="rounded-2xl border border-neutral-200/50 dark:border-white/5 bg-white/60 dark:bg-[#0c0c0e]/30 backdrop-blur-xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      {/* Cover photo */}
                      <div className="h-44 overflow-hidden relative group/cover">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute top-3 left-3 text-[9px] uppercase font-bold tracking-wider text-white bg-indigo-550/80 backdrop-blur-md px-2 py-0.5 rounded-full">
                          {post.category}
                        </span>
                        {post.videoEmbedId && (
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center transition-all group-hover:bg-black/35">
                            <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg transition-transform transform group-hover/cover:scale-110">
                              <Play className="w-4 h-4 text-white fill-white translate-x-0.5" />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Content panel previews */}
                      <div className="p-5 space-y-2">
                        <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 font-mono">
                          <Clock className="w-3 h-3" />
                          <span>{post.readTime} • {post.date}</span>
                        </div>
                        <h4 className="font-bold text-sm sm:text-base text-neutral-900 dark:text-white leading-snug line-clamp-2">
                          {post.title}
                        </h4>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed line-clamp-3">
                          {post.summary}
                        </p>
                      </div>
                    </div>

                    {/* Author layout footer indicator */}
                    <div className="px-5 pb-5 pt-3 border-t border-neutral-100 dark:border-white/5 bg-neutral-50/20 dark:bg-black/10 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="w-6 h-6 rounded-full object-cover ring-1 ring-indigo-500/20"
                        />
                        <span className="text-[10px] font-bold text-neutral-700 dark:text-neutral-300">
                          {post.author.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => handleLike(post.id, e)}
                          className={`p-1.5 rounded-lg transition-all flex items-center gap-1 text-[11px] ${
                            post.likedByUser ? "text-rose-550" : "text-neutral-400 hover:text-rose-500"
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${post.likedByUser ? "fill-rose-500 text-rose-500" : ""}`} />
                          <span>{post.likes}</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
