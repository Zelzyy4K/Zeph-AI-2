// Vercel Serverless Function — proxies chat requests to Groq.
// The Groq API key lives only in the server environment (GROQ_API_KEY),
// never sent to or readable by the browser.

export const config = {
  runtime: "edge",
};

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_MODEL = "llama-3.3-70b-versatile";

// Maps Zeph's model selector to a real Groq model id.
const MODEL_MAP = {
  "zeph-lite": "llama-3.1-8b-instant",
  "zeph-pro": "llama-3.3-70b-versatile",
  "zeph-vision": "llama-3.3-70b-versatile", // swap for a vision-capable model when needed
};

export default async function handler(request) {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "Server is missing GROQ_API_KEY" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { messages, model } = body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response(JSON.stringify({ error: "messages[] is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const groqModel = MODEL_MAP[model] ?? DEFAULT_MODEL;

  const groqResponse = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: groqModel,
      messages,
      stream: true,
      temperature: 0.7,
    }),
  });

  if (!groqResponse.ok || !groqResponse.body) {
    const errorText = await groqResponse.text();
    return new Response(
      JSON.stringify({ error: "Groq request failed", detail: errorText }),
      { status: groqResponse.status, headers: { "Content-Type": "application/json" } }
    );
  }

  // Stream the SSE response straight through to the client.
  return new Response(groqResponse.body, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
