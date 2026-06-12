import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dns from "node:dns";

// Fix Node localhost network resolution
dns.setDefaultResultOrder("ipv4first");

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client safely
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined in the environment secrets.");
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      }
    }
  });
};

// 1. In-memory temporary database for cross-device syncing
const syncVault: Record<string, { data: string; timestamp: number }> = {};

// Clean vault periodically (keep backups for 24 hours)
setInterval(() => {
  const now = Date.now();
  Object.keys(syncVault).forEach((code) => {
    if (now - syncVault[code].timestamp > 24 * 60 * 60 * 1000) {
      delete syncVault[code];
    }
  });
}, 60 * 60 * 1000);

// API Endpoints: Helper health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// API Endpoint: Cross-Device Backup (Sync)
app.post("/api/sync/backup", (req, res) => {
  try {
    const { payload } = req.body;
    if (!payload) {
      res.status(400).json({ error: "Missing payload data" });
      return;
    }

    // Generate a secure 6-character sync code
    let syncCode = "";
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    for (let i = 0; i < 6; i++) {
      syncCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    syncVault[syncCode] = {
      data: JSON.stringify(payload),
      timestamp: Date.now()
    };

    res.json({ success: true, syncCode });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// API Endpoint: Cross-Device Restore (Sync)
app.post("/api/sync/restore", (req, res) => {
  try {
    const { syncCode } = req.body;
    if (!syncCode) {
      res.status(400).json({ error: "Missing sync code" });
      return;
    }

    const cleanCode = syncCode.toUpperCase().trim();
    const backupEntry = syncVault[cleanCode];

    if (!backupEntry) {
      res.status(404).json({ error: "Невірний або прострочений код синхронізації" });
      return;
    }

    res.json({ success: true, payload: JSON.parse(backupEntry.data) });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// API Endpoint: AI Chat Assistant proxy
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { messages, userContext } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: "Invalid messages format" });
      return;
    }

    const ai = getGeminiClient();

    // Prepare system instruction detailing user metrics for rich personalized responses
    const contextStr = userContext 
      ? `Контекст користувача FutureX:
- Активні завдання: ${JSON.stringify(userContext.tasks || [])}
- Звички: ${JSON.stringify(userContext.habits || [])}
- Цілі: ${JSON.stringify(userContext.goals || [])}
- Фінанси: ${JSON.stringify(userContext.finances || [])}
- Прогрес: Рівень ${userContext.stats?.level || 1} (${userContext.stats?.xp || 0} XP)
` : "Панель приладів пуста або немає даних.";

    const systemInstruction = `Ти — інтелектуальний помічник FutureX AI, інтегрований у преміальну екосистему та панель інструментів (у стилі Apple, Tesla та Stripe).
Спілкуйся виключно українською мовою. Будь конструктивним, лаконічним, надихаючим та діловим.
Допомагай користувачу аналізувати його завдання, звички, цілі, фінанси та фокусний час.
Роби персоналізовані висновки з огляду на наданий контекст. Давай цінні поради з фінансової грамотності, планування тайм-менеджменту за технікою Pomodoro та досягнення довготривалих цілей.
Ось поточний стан користувача для роботи:
${contextStr}

Відповідай структуровано, використовуй марковані списки та жирний шрифт для зручності читання. Уникай довгих роздумів, пиши чітко по справі.`;

    const formattedContents = messages.map((m: any) => ({
      role: m.role === "assistant" ? "model" as const : "user" as const,
      parts: [{ text: m.content }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({ text: response.text });
  } catch (err: any) {
    console.error("AI Assistant error:", err);
    res.status(500).json({ error: err.message || "Помилка роботи штучного інтелекту" });
  }
});

// API Endpoint: AI Planner hourly scheduler generator
app.post("/api/ai/generate-schedule", async (req, res) => {
  try {
    const { tasks, habits, focusGoals } = req.body;
    const ai = getGeminiClient();

    const systemInstruction = `Ти — експертний планувальник дня для системи FutureX.
Твоє завдання — згенерувати оптимізований погодинний розклад з 8:00 до 21:00 у форматі JSON.
Користувач має такі невиконані завдання: ${JSON.stringify(tasks || [])}
Користувач хоче підтримати такі звички: ${JSON.stringify(habits || [])}
Спеціальні фокус-цілі на сьогодні: "${focusGoals || "Підвищити загальну продуктивність"}"

Поверни заголовок, короткий коментар та масив об'єктів планувальника. Твій результат має бути ТІЛЬКИ чистим JSON-файлом за наступною схемою (без додаткових описів, лапок markdown \`\`\` або символів перед/після):
{
  "title": "Оптимізований розклад FutureX AI",
  "review": "Коротке резюме чому цей розклад є збалансованим для ваших завдань.",
  "events": [
    {
      "timeSlot": "08:00 - 09:00",
      "title": "Ранкова рутина та фокус",
      "priority": "low" | "medium" | "high",
      "completed": false,
      "isAIGenerated": true
    }
  ]
}
Заповни всі слоти з 08:00 до 21:00 інтервалами від 1 до 2 годин. Інтегруй туди завдання користувача, трекінг звичок та інтервали фокусу.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: "Згенеруй розклад на сьогодні за заданою схемою JSON.",
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        temperature: 0.5,
      }
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (err: any) {
    console.error("AI Planner error:", err);
    res.status(500).json({ error: err.message || "Помилка генерації AI розкладу" });
  }
});

// Vite server configuration helper
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[FUTUREX SERVER] Running on http://localhost:${PORT}`);
  });
}

startServer();
