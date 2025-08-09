import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { ChatCompletionCreateParams } from 'openai/resources/chat/completions';

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
    
    // This is the stable way to create the stream
    const stream = OpenAIStream(response);
    
    return new StreamingTextResponse(stream);

  } catch (error: any) {
    console.error('💥 CRITICAL CHAT API ERROR:', error);
    return new Response('An internal error occurred.', { status: 500 });
  }
}
