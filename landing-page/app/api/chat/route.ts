import OpenAI from 'openai';
import { OpenAIAdapter, StreamingTextResponse } from 'ai';

export const runtime = 'edge';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      stream: true,
      messages: messages,
    });
    
    const stream = OpenAIAdapter.toAIStream(response);
    
    return new StreamingTextResponse(stream);

  } catch (error: any) { // The curly braces are correctly placed here
    console.error('💥 CRITICAL CHAT API ERROR:', error);
    return new Response('An internal error occurred.', { status: 500 });
  }
}