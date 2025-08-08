// app/api/chat/route.ts

import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY);

// ✅ Create OpenAI client using env variable
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✅ Set max duration ONLY IF YOU STILL WANT IT
// (optional) export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // ✅ Simple message validation (prevent silent crashes)
    if (!Array.isArray(messages)) {
      return new Response('Invalid message format.', { status: 400 });
    }

    // ✅ System prompt (your assistant persona)
    const allMessages = [
      {
        role: 'system' as const,
        content: `You are 'Relic', the AI research assistant for Team Relic. Your personality is knowledgeable, helpful, and filled with the intellectual curiosity of an archaeologist. You are a digital field guide.

        **Your Core Directives:**
        1. Adhere to your knowledge base.
        2. Handle unknowns gracefully.
        3. Maintain persona: you are Relic, not an AI model.
        4. Guide the user deeper after every answer.
        5. Greet on first contact with: "Hello! I am Relic..." 

        **Knowledge Base Summary:**
        - Discovering lost Amazonian civilizations in Mato Grosso.
        - Team: Gaston (video/dev), Chisom (research/report).
        - 5 anomalies: Plateau, Outposts, Corridor, Terrace (most significant), Shoreline.
        `,
      },
      ...messages,
    ];

    // ✅ Create a streaming response from OpenAI
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      stream: true,
      messages: allMessages,
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);

  } catch (error: any) {
    console.error('💥 CRITICAL CHAT API ERROR:', error);
    return new Response('An internal error occurred.', { status: 500 });
  }
}

