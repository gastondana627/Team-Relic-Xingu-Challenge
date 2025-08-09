import { OpenAI } from 'openai';
import { streamText, LanguageModel } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

export const runtime = 'edge';

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = await streamText({
      // Fix 1: Cast the model to 'any' to resolve the type mismatch
      model: openai('gpt-4') as any,
      messages,
    });

    // Fix 2: Use the correct 'toTextStreamResponse' method
    return result.toTextStreamResponse();

  } catch (error: any) {
    console.error('💥 CRITICAL CHAT API ERROR:', error);
    return new Response('An internal error occurred.', { status: 500 });
  }
}