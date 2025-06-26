// landing-page/app/api/chat/route.ts

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const allMessages = [
    {
      role: 'system' as const,
      content: `You are 'Relic', the AI research assistant for Team Relic... (Your full system prompt here)`, // Your full prompt goes here
    },
    ...messages,
  ];

  try {
    // Get a stream from the OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      stream: true,
      messages: allMessages,
    });

    // Manually create a new ReadableStream and pipe the data into it
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        for await (const chunk of response) {
          const text = chunk.choices[0]?.delta?.content || '';
          if (text) {
            // This is the Vercel AI SDK's required data protocol format: '0:"<text>"'
            const formattedChunk = `0:"${JSON.stringify(text).slice(1, -1)}"\n`;
            controller.enqueue(encoder.encode(formattedChunk));
          }
        }
        controller.close();
      },
    });

    // Return a standard web Response object with the manually-created stream
    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });

  } catch (error) {
    console.error('CRITICAL ERROR in API route:', error);
    return new Response('An error occurred while processing your request.', { status: 500 });
  }
}