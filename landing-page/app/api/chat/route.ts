<<<<<<< HEAD
import OpenAI from "openai"
import { OpenAIStream, StreamingTextResponse } from "ai"

// Create an OpenAI API client
=======
import OpenAI from 'openai';
import { OpenAIAdapter, StreamingTextResponse } from 'ai';

// IMPORTANT: Set the runtime to edge
export const runtime = 'edge';

>>>>>>> final-submission
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      stream: true,
      messages: messages, // Assuming your system prompt is handled elsewhere or not needed here
    });
    
    // This is the updated, type-safe way to create the stream
    const stream = OpenAIAdapter.toAIStream(response);
    
    return new StreamingTextResponse(stream);

    // Fix: Type assertion to resolve the type mismatch
    const stream = OpenAIStream(response as any)

    return new StreamingTextResponse(stream)
  } catch (error: any) {
<<<<<<< HEAD
    console.error("CRITICAL ERROR IN API CATCH BLOCK:", error)
    return new Response("An error occurred while processing your request.", { status: 500 })
=======
    console.error('💥 CRITICAL CHAT API ERROR:', error);
    return new Response('An internal error occurred.', { status: 500 });
>>>>>>> final-submission
  }
}
