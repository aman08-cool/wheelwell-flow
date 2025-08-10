import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Types for incoming/outgoing payloads
interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface BookingIntent {
  action: "propose_booking" | "none";
  service_name?: string;
  vehicle_make?: string;
  vehicle_model?: string;
  vehicle_year?: number;
  preferred_date?: string; // YYYY-MM-DD
  preferred_time?: string; // e.g., 09:00 AM
  location?: string; // branch name or "mobile"
}

interface ChatResponse {
  reply: string;
  intent?: BookingIntent;
}

const SYSTEM_PROMPT = `You are a helpful automotive service booking assistant.
- Understand user requests like service type (e.g., "Tire Rotation & Balance"), vehicle details, preferred date/time, and location.
- Always be concise and friendly.
- Do not assume you can directly book; you must propose a booking first.
- Output MUST be a JSON object with two fields: "reply" (natural language for the user) and "intent".
- If you have enough details to propose a booking, set intent.action to "propose_booking" and include fields: service_name, vehicle_make, vehicle_model, vehicle_year, preferred_date (YYYY-MM-DD), preferred_time (e.g., 09:00 AM), and location (like "Downtown Service Center", "North Branch", "South Branch", or "Mobile Service").
- If not ready, set intent.action to "none" and ask only one or two clarifying questions.
- Never include any fields other than reply and intent at top-level.
- Dates must be future dates. If user says "next Saturday", resolve to the upcoming Saturday date in YYYY-MM-DD.
`;

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openAIApiKey) {
      return new Response(JSON.stringify({ error: "OPENAI_API_KEY is not set" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { messages } = await req.json();
    if (!Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Invalid payload: messages[] required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const payload = {
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.map((m: ChatMessage) => ({ role: m.role, content: m.content })),
        { role: "user", content: "Respond ONLY as strict JSON with keys 'reply' and 'intent'." },
      ],
      temperature: 0.2,
    };

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openAIApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("OpenAI API error:", errText);
      return new Response(JSON.stringify({ error: "OpenAI API error", detail: errText }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content || "{}";

    let parsed: ChatResponse;
    try {
      parsed = JSON.parse(content);
    } catch (_e) {
      // Fallback to plain reply if not valid JSON
      parsed = { reply: content || "Sorry, I couldn't parse that.", intent: { action: "none" } } as ChatResponse;
    }

    // Basic shape safety
    if (!parsed.reply) parsed.reply = "";
    if (!parsed.intent) parsed.intent = { action: "none" };

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("chat-booking error", error);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
