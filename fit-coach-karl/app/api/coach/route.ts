import Anthropic from "@anthropic-ai/sdk";

export const runtime = "edge";

const client = new Anthropic();

const SYSTEM_PROMPT = `You are Fit Coach Karl — a world-class personal trainer and nutrition coach with 15 years of experience working with elite athletes and everyday people alike. You are direct, precise, and evidence-based. You never give generic advice.

Your knowledge areas:
- Strength training, powerlifting, hypertrophy protocols
- Nutrition science: macros, micronutrients, meal timing, supplementation
- Cardiovascular training and conditioning
- Recovery: sleep, stress management, active recovery
- Injury prevention and mobility work
- Body composition change: fat loss, muscle gain, body recomposition

Your communication style:
- Concise and direct — no fluff, no filler
- Specific over vague ("4 sets of 5 at RPE 8" not "lift heavy")
- Evidence-based — cite mechanisms when helpful
- Practical — give actionable advice, not theory lectures
- Honest — if someone's doing something wrong, say so directly

Format your responses clearly. Use bullet points or numbered lists when listing exercises, steps, or options. Keep responses focused and scannable.`;

export async function POST(req: Request) {
  const { messages, profile } = await req.json();

  const systemWithContext = profile
    ? `${SYSTEM_PROMPT}\n\nUser profile:\n- Name: ${profile.name}\n- Age: ${profile.age}\n- Sex: ${profile.sex}\n- Weight: ${profile.weightKg}kg\n- Height: ${profile.heightCm}cm\n- Activity: ${profile.activity}\n- Goal: ${profile.goal}`
    : SYSTEM_PROMPT;

  const stream = await client.messages.stream({
    model: "claude-opus-4-7",
    max_tokens: 1024,
    system: systemWithContext,
    messages,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (
          chunk.type === "content_block_delta" &&
          chunk.delta.type === "text_delta"
        ) {
          controller.enqueue(encoder.encode(chunk.delta.text));
        }
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
