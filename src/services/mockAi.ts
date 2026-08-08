import type { AiStatus } from "@/types/chat";

const MOCK_REPLY = `Ini adalah respons contoh dari Zeph AI.

Backend streaming yang sesungguhnya (OpenAI, Anthropic, Groq, Gemini, atau Ollama) belum terhubung — bagian ini hanya mensimulasikan alur UI: status AI, streaming teks, dan rendering markdown.

\`\`\`ts
function greet(name: string) {
  return \`Hello, \${name}!\`;
}
\`\`\`

Struktur frontend sudah disiapkan agar backend nyata bisa dicolokkan tanpa mengubah arsitektur utama.`;

const STATUS_SEQUENCE: AiStatus[] = ["thinking", "reasoning", "writing"];

export async function* mockStreamResponse(
  onStatus: (status: AiStatus) => void
): AsyncGenerator<string> {
  for (const status of STATUS_SEQUENCE) {
    onStatus(status);
    await sleep(450);
  }

  const words = MOCK_REPLY.split(/(?<=\s)/);
  for (const word of words) {
    yield word;
    await sleep(18);
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
