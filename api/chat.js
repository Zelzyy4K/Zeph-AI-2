// Vercel Serverless Function — proxies chat requests to Google Gemini.
// The Gemini API key lives only in the server environment (GEMINI_API_KEY),
// never sent to or readable by the browser.
//
// Gemini's request/response shape is different from OpenAI-style APIs
// (Groq, DeepSeek), so this file translates between them:
//   - messages: [{role, content}]  ->  contents: [{role, parts: [{text}]}]
//   - role "assistant"             ->  role "model"
//   - role "system"                ->  moved into systemInstruction
//   - response text lives at candidates[0].content.parts[0].text

export const config = {
  runtime: "edge",
};

const DEFAULT_MODEL = "gemini-2.5-flash";

// Maps Zeph's model selector to a real Gemini model id.
const MODEL_MAP = {
  "zeph-lite": "gemini-2.5-flash-lite",
  "zeph-pro": "gemini-2.5-flash",
  "zeph-vision": "gemini-2.5-flash", // Gemini models are natively multimodal
};

function toGeminiContents(messages) {
  const contents = [];
  let systemInstruction;

  for (const m of messages) {
    if (m.role === "system") {
      systemInstruction = { parts: [{ text: m.content }] };
      continue;
    }
    contents.push({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    });
  }

  return { contents, systemInstruction };
}

// Gemini's SSE stream sends full GenerateContentResponse JSON objects per
// event. This re-shapes each one into the OpenAI-style delta chunk our
// frontend already knows how to parse, so src/services/groqChat.ts needs
// no changes.
function toOpenAiStyleChunk(geminiChunk) {
  const text = geminiChunk?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  return { choices: [{ delta: { content: text } }] };
}

export default async function handler(request) {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "Server is missing GEMINI_API_KEY" }),
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

  const geminiModel = MODEL_MAP[model] ?? DEFAULT_MODEL;
  const { contents, systemInstruction } = toGeminiContents(messages);

  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:streamGenerateContent?alt=sse`;

  const geminiResponse = await fetch(geminiUrl, {
    method: "POST",
    headers: {
      "x-goog-api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents,
      ...(systemInstruction ? { systemInstruction } : {}),
      generationConfig: { temperature: 0.7 },
    }),
  });

  if (!geminiResponse.ok || !geminiResponse.body) {
    const errorText = await geminiResponse.text();
    return new Response(
      JSON.stringify({ error: "Gemini request failed", detail: errorText }),
      { status: geminiResponse.status, headers: { "Content-Type": "application/json" } }
    );
  }

  // Re-stream Gemini's SSE as OpenAI-style SSE so the existing frontend
  // parser (which expects `data: {"choices":[{"delta":{"content":...}}]}`)
  // keeps working unchanged.
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const reader = geminiResponse.body.getReader();

  const stream = new ReadableStream({
    async start(controller) {
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue;

          const data = trimmed.slice(5).trim();
          if (!data) continue;

          try {
            const parsed = JSON.parse(data);
            const reshaped = toOpenAiStyleChunk(parsed);
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(reshaped)}\n\n`));
          } catch {
            // Skip malformed lines rather than aborting the whole stream.
          }
        }
      }
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
