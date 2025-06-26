// landing-page/app/api/chat/route.ts

import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Proactive Fix #1: Increase the max runtime for this function to 60 seconds
export const maxDuration = 60;
export const runtime = 'edge';

export async function POST(req: Request) {
  console.log('LOG: API Route started.'); // Checkpoint 1

  try {
    const { messages } = await req.json();
    console.log('LOG: Received messages from client.'); // Checkpoint 2

    const allMessages = [
      {
        role: 'system' as const,
        content: `You are 'Relic', the AI research assistant for Team Relic... (full prompt is here)`,
      },
      ...messages,
    ];

    console.log('LOG: Calling OpenAI API...'); // Checkpoint 3
    
    // Proactive Fix #2: Use a faster model to prevent timeouts
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Using a faster model for production reliability
      stream: true,
      messages: allMessages,
    });

    console.log('LOG: Received stream response from OpenAI successfully.'); // Checkpoint 4

    const stream = OpenAIStream(response);
    
    return new StreamingTextResponse(stream);

  } catch (error) {
    console.error('CRITICAL ERROR IN API CATCH BLOCK:', error); // Checkpoint 5: The error catcher
    return new Response('An error occurred while processing your request.', { status: 500 });
  }
}