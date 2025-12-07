import { createAgentUIStreamResponse, type UIMessage } from "ai";
import { tutorAgent } from "@/lib/ai/tutor-agent";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  // Verify user is authenticated and has Ultra plan
  const { has, userId } = await auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (!has?.({ plan: "ultra" })) {
    return new Response("Ultra membership required", { status: 403 });
  }

  const requestStart = Date.now();
  const requestId = crypto.randomUUID();
  const MAX_MESSAGE_COUNT = 24;
  const MAX_TOTAL_CHARS = 8_000;

  const { messages }: { messages: UIMessage[] } = await request.json();

  if (!Array.isArray(messages)) {
    return new Response("Invalid request: messages must be an array.", {
      status: 400,
    });
  }

  if (messages.length > MAX_MESSAGE_COUNT) {
    return new Response("Too many messages in request.", { status: 400 });
  }

  const totalChars = messages.reduce((acc, m) => {
    const content = (m as { content?: string }).content;
    return acc + (typeof content === "string" ? content.length : 0);
  }, 0);

  if (totalChars > MAX_TOTAL_CHARS) {
    return new Response("Request too large. Please shorten your message.", {
      status: 400,
    });
  }

  const abortController = new AbortController();
  const timeout = setTimeout(() => {
    abortController.abort(`Request ${requestId} timed out`);
  }, 30_000);

  console.log("[ChatAPI] Request received", {
    requestId,
    userId,
    messageCount: messages.length,
    totalChars,
  });

  try {
    return await createAgentUIStreamResponse({
      agent: tutorAgent,
      messages,
      abortSignal: abortController.signal,
    });
  } finally {
    clearTimeout(timeout);
    console.log("[ChatAPI] Request finished", {
      requestId,
      durationMs: Date.now() - requestStart,
    });
  }
}
