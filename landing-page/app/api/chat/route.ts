import OpenAI from 'openai';
import { OpenAIAdapter, StreamingTextResponse, streamToResponse } from 'ai';

// IMPORTANT: Set the runtime to edge
export const runtime = 'edge';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const allMessages = [
      {
        role: 'system' as const,
        content: `You are 'Relic', the AI research assistant for Team Relic...` // Keeping your system prompt
      },
      ...messages,
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      stream: true,
      messages: allMessages,
    });
    
    // This is the updated, type-safe way to create the stream
    const stream = OpenAIAdapter.toAIStream(response);
    
    return new StreamingTextResponse(stream);

  } catch (error: any) {
    console.error('💥 CRITICAL CHAT API ERROR:', error);
    return new Response('An internal error occurred.', { status: 500 });
  }
}
