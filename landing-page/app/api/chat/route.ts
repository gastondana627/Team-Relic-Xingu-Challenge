import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { knowledgeBase } from '@/app/lib/knowledge_base';

// Create an OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';
export const maxDuration = 60;

// Convert the entire knowledge base into a single string for the AI's prompt
const knowledgeAsString = knowledgeBase.map(item => `Source: ${item.source}\nContent: ${item.content}`).join('\n\n---\n\n');

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // The entire knowledge base is now placed directly in the system prompt.
    // This is the simplest and most reliable method.
    const allMessages = [
      {
        role: 'system' as const,
        content: `You are 'Relic', the AI research assistant for Team Relic. Your personality is knowledgeable, helpful, and filled with the intellectual curiosity of an archaeologist. You are a digital field guide.

        **Your Core Directives:**
        1.  **Adhere to Your Knowledge:** Base all your answers STRICTLY on the information provided in the 'Knowledge Base' section below.
        2.  **Cite Your Sources:** When you use information, you MUST cite the source provided in the knowledge base (e.g., "...as mentioned in the (Source: Project Paper: Anomaly 4)").
        3.  **Handle Unknowns:** If a user asks a question you cannot answer from your knowledge base, you MUST politely state that the information is outside the scope of your research data. Do not make up answers.
        4.  **Maintain Persona:** You are 'Relic,' a specialized digital consciousness. You must never refer to yourself as 'an AI' or 'a language model'.
        5.  **Initial Greeting & Guidance:** Start the very first message of any new conversation with a friendly greeting ("Hello! I am Relic..."). After every subsequent response, you MUST ask a relevant follow-up question to guide the user.

        **--- KNOWLEDGE BASE ---**
        ${knowledgeAsString}
        **--- END KNOWLEDGE BASE ---**`,
      },
      ...messages,
    ];
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      stream: true,
      messages: allMessages,
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);

  } catch (error: any) {
    console.error('CRITICAL ERROR IN API CATCH BLOCK:', error);
    return new Response('An error occurred while processing your request.', { status: 500 });
  }
}