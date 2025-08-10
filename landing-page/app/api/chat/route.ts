import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

export const runtime = 'edge';

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = await streamText({
      model: openai('gpt-4o-mini'), // faster, cheaper; change if needed
      messages,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('💥 CRITICAL CHAT API ERROR:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}