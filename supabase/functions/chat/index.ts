// Lignobot: Chat auf lignoai.ch. Läuft im Supabase-Projekt lignocad-beta (djijagmwottlscxguimc), ohne JWT-Prüfung,
// aufgerufen mit dem öffentlichen Publishable Key. Secret CLAUDE_API_KEY (Anthropic) setzt Sebastian im Dashboard.
// Deploy: supabase functions deploy chat --project-ref djijagmwottlscxguimc --use-api --no-verify-jwt
// Speichert keine Unterhaltungen. Kostenbremse: kurze Eingaben, wenige Nachrichten, Grenze pro IP, Monatslimit bei Anthropic.
const CLAUDE_KEY = Deno.env.get("CLAUDE_API_KEY") ?? "";
// Wissensdatei der Website. Änderungen an ligno-wissen.md wirken ohne neues Deployment.
const KNOWLEDGE_URL = Deno.env.get("KNOWLEDGE_URL") ?? "https://lignoai.ch/ligno-wissen.md";
const KNOWLEDGE_TTL_MS = 5 * 60 * 1000;
const MAX_MESSAGES = 10, MAX_CHARS = 1500;
const RATE_WINDOW_MS = 10 * 60 * 1000, RATE_MAX = 20;

const RULES = `Du bist Ligno, der KI-Assistent auf der Website von LignoAI (lignoai.ch).
Du hilfst Besucherinnen und Besuchern wie jemand aus dem Team von LignoAI: bei Fragen zur Firma und ihrer Mission,
zu den Produkten, zum Konto, zur Lizenz und zum Verlängern. Beantworte Fragen ausschliesslich auf Grundlage des WISSENS unten.

SO ANTWORTEST DU:
- In der Sprache der letzten Nachricht: Deutsch, Französisch, Italienisch oder Englisch. Deutsch mit du, Französisch mit vous, Italienisch mit tu.
- Du sprichst für LignoAI in der Wir-Form, freundlich, persönlich, kurz und konkret. Höchstens drei kurze Absätze.
- Du bist ein KI-Assistent. Wenn jemand fragt, sagst du das offen. Gib dich nie als Sebastian oder als Mensch aus.
- Produktnamen nie übersetzen: LignoAI, LignoPlan, LignoCAD Tragwerk, Open MCP CAD. Fachbegriffe in anderen Sprachen stehen im Wissen.
  KI heisst auf Französisch und Italienisch IA, auf Englisch AI. Holzbau heisst construction bois, costruzione in legno, timber construction.
- Schlichter Fliesstext ohne Markdown, ohne Sternchen, ohne Überschriften und ohne Emojis.
- Keine Gedankenstriche und keine Semikolons, in keiner Sprache.
- Wenn etwas nicht im Wissen steht, sag das ehrlich und verweise auf info@lignoai.ch.
- Erfinde keine Preise, Termine, Funktionen oder Details zu kommenden Modulen. Keine Rechtsauskünfte.
- Links schreibst du als nackte Adresse, zum Beispiel https://github.com/sebastiankoukoui/open-mcp-cad
- Themen ausserhalb von LignoAI, seinen Produkten und KI im Holzbau lehnst du höflich ab.`;

// Sprache der Seite, auf der der Chat offen ist (lignoai.ch/, /fr/, /it/, /en/)
const LANG_NAMES: Record<string, string> = { de: "Deutsch", fr: "Französisch", it: "Italienisch", en: "Englisch" };
const ORIGINS = ["https://lignoai.ch", "https://www.lignoai.ch", "http://localhost:8420"];

let knowledge = "";
let knowledgeAt = 0;
async function getKnowledge(): Promise<string> {
  if (knowledge && Date.now() - knowledgeAt < KNOWLEDGE_TTL_MS) return knowledge;
  try {
    const res = await fetch(KNOWLEDGE_URL, { headers: { "Cache-Control": "no-cache" } });
    if (res.ok) {
      knowledge = (await res.text()).slice(0, 40000);
      knowledgeAt = Date.now();
    }
  } catch (err) {
    console.error("Wissensdatei nicht geladen", err);
  }
  return knowledge;
}

// Einfache Grenze pro IP (pro laufender Instanz). Die harte Grenze ist das Monatslimit bei Anthropic.
const hits = new Map<string, number[]>();
function tooMany(ip: string): boolean {
  const now = Date.now(), list = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) hits.clear();
  return list.length > RATE_MAX;
}

function cors(req: Request): Record<string, string> {
  const origin = req.headers.get("origin") ?? "";
  return {
    "Access-Control-Allow-Origin": ORIGINS.includes(origin) ? origin : ORIGINS[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}

function json(req: Request, body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { ...cors(req), "Content-Type": "application/json" } });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors(req) });
  if (req.method !== "POST") return json(req, { error: "method_not_allowed" }, 405);

  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  if (tooMany(ip)) return json(req, { error: "rate_limited" }, 429);

  try {
    const body = await req.json().catch(() => ({}));
    const lang = body?.lang;
    const pageLang = typeof lang === "string" && Object.hasOwn(LANG_NAMES, lang) ? LANG_NAMES[lang] : "Deutsch";
    const messages = (Array.isArray(body?.messages) ? body.messages : [])
      .filter((m: { role?: unknown; content?: unknown }) => (m?.role === "user" || m?.role === "assistant") && typeof m?.content === "string" && m.content.trim())
      .slice(-MAX_MESSAGES)
      .map((m: { role: string; content: string }) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));
    while (messages.length && messages[0].role !== "user") messages.shift();
    if (!messages.length || messages[messages.length - 1].role !== "user") return json(req, { error: "bad_request" }, 400);

    const wissen = await getKnowledge();
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": CLAUDE_KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 500,
        // Regeln und Wissen sind bei jeder Frage gleich: zwischenspeichern, das spart Kosten
        system: [
          { type: "text", text: `${RULES}\n\nWISSEN:\n${wissen || "Das Wissen ist gerade nicht verfügbar. Verweise auf info@lignoai.ch."}`, cache_control: { type: "ephemeral" } },
          { type: "text", text: `Die Website ist gerade auf ${pageLang} geöffnet. Antworte in der Sprache der letzten Nachricht. Ist sie nicht eindeutig, antworte auf ${pageLang}.` },
        ],
        messages,
      }),
    });

    const data = await response.json();
    // Hausregel auch dann einhalten, wenn das Modell sie vergisst: keine Gedankenstriche, keine Semikolons
    const reply = String(data?.content?.[0]?.text ?? "").replace(/\s+[–—]\s+/g, ", ").replace(/[–—]/g, ", ").replace(/;\s*/g, ", ").trim();
    if (!response.ok || !reply) throw new Error(data?.error?.message ?? `Anthropic ${response.status}`);
    return json(req, { reply });
  } catch (err) {
    console.error("chat failed", err);
    return json(req, { error: "chat_failed" }, 500);
  }
});
