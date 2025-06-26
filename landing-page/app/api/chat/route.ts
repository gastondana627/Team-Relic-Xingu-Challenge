// landing-page/app/api/chat/route.ts

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';
export const maxDuration = 60; // Let's keep the timeout increased

export async function POST(req: Request) {
  console.log('LOG: API Route started.');

  try {
    const { messages } = await req.json();
    console.log('LOG: Received messages from client.');
    
    const allMessages = [
      {
        role: 'system' as const,
        content: `You are 'Relic', the AI research assistant for Team Relic... (full prompt is here)`,
      },
      ...messages,
    ];

    console.log('LOG: Calling OpenAI API with gpt-3.5-turbo...');
    
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      stream: true,
      messages: allMessages,
    });

    console.log('LOG: Received stream response from OpenAI successfully.');

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        for await (const chunk of response) {
          const text = chunk.choices[0]?.delta?.content || '';
          if (text) {
            controller.enqueue(encoder.encode(text));
          }
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });

  } catch (error: any) {
    // --- THIS IS THE NEW, MORE DETAILED LOGGING ---
    console.error('--- CRITICAL ERROR IN CATCH BLOCK ---');
    console.error('Error Name:', error.name);
    console.error('Error Message:', error.message);
    console.error('Full Error Object:', JSON.stringify(error, null, 2));
    
    return new Response('An error occurred while processing your request.', { status: 500 });
  }
}



