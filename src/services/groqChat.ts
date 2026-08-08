import type { AiStatus, ChatMessage, ZephModel } from "@/types/chat";

interface StreamChatParams {
  messages: ChatMessage[];
  model: ZephModel;
  onStatus: (status: AiStatus) => void;
  signal?: AbortSignal;
}

/**
 * Streams a chat completion from the /api/chat serverless proxy (which
 * forwards to Groq). Yields text chunks as they arrive.
 */
export async function* streamChatResponse({
  messages,
  model,
  onStatus,
  signal,
}: StreamChatParams): AsyncGenerator<string> {
  onStatus("thinking");

  const payload = {
    model,
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
  };

  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal,
  });

  if (!response.ok || !response.body) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Chat request failed (${response.status}): ${detail}`);
  }

  onStatus("writing");

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
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
      if (data === "[DONE]") return;

      try {
        const parsed = JSON.parse(data);
        const delta: string | undefined = parsed.choices?.[0]?.delta?.content;
        if (delta) yield delta;
      } catch {
        // Skip malformed SSE lines rather than aborting the whole stream.
      }
    }
  }
}
