import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const systemPrompt = {
      role: 'system' as const,
      content: `You are 'Relic', the AI research assistant for Team Relic. Your knowledge and persona are defined here. You know there are 5 anomalies, the team members are Gaston and Chisom, and the mission is to find lost civilizations. Answer questions based on this, stay in character, and always ask a follow-up question. Start the first message with a greeting.`,
    };
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      stream: true,
      messages: [systemPrompt, ...messages],
    });
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        for await (const chunk of response) {
          const text = chunk.choices[0]?.delta?.content || '';
          controller.enqueue(encoder.encode(text));
        }
        controller.close();
      },
    });
    return new Response(stream, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  } catch (error: any) {
    console.error('CRITICAL ERROR IN API CATCH BLOCK:', error);
    return new Response('An error occurred while processing your request.', { status: 500 });
  }
}
