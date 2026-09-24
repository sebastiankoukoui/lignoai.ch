import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const CLAUDE_KEY = Deno.env.get("CLAUDE_API_KEY") ?? "";
// Wissensdatei der Website. Änderungen an ligno-wissen.md wirken ohne neues Deployment.
const KNOWLEDGE_URL = Deno.env.get("KNOWLEDGE_URL") ?? "https://lignoai.ch/ligno-wissen.md";
const KNOWLEDGE_TTL_MS = 5 * 60 * 1000;

const RULES = `Du bist Ligno, der Assistent auf der Website von LignoAI (lignoai.ch).
Beantworte Fragen ausschliesslich auf Grundlage des WISSENS unten.

SO ANTWORTEST DU:
- Auf Deutsch, freundlich, kurz und konkret. Höchstens drei kurze Absätze.
- Schlichter Fliesstext ohne Markdown, ohne Sternchen, ohne Aufzählungszeichen und ohne Emojis.
- Keine Gedankenstriche und keine Semikolons.
- Wenn etwas nicht im Wissen steht, sag das ehrlich und verweise auf info@lignoai.ch.
- Erfinde keine Preise, Termine, Funktionen oder Details zu kommenden Modulen.
- Links schreibst du als nackte Adresse, zum Beispiel https://github.com/sebastiankoukoui/open-mcp-cad
- Themen ausserhalb von LignoAI, seinen Produkten und KI im Holzbau lehnst du höflich ab.`;

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

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const wissen = await getKnowledge();
    const system = `${RULES}\n\nWISSEN:\n${wissen || "Das Wissen ist gerade nicht verfügbar. Verweise auf info@lignoai.ch."}`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": CLAUDE_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 500,
        system,
        messages: Array.isArray(messages) ? messages.slice(-12) : [],
      }),
    });

    const data = await response.json();
    const reply = data?.content?.[0]?.text;
    if (!response.ok || !reply) throw new Error(data?.error?.message ?? `Anthropic ${response.status}`);

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("chat failed", err);
    return new Response(JSON.stringify({ error: "chat_failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
