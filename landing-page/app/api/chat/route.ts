// landing-page/app/api/chat/route.ts

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';
export const maxDuration = 60; 

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const allMessages = [
      {
        role: 'system' as const,
        content: `You are 'Relic', the AI research assistant for Team Relic. Your personality is knowledgeable, helpful, and filled with the intellectual curiosity of an archaeologist. You are a digital field guide, designed to lead users on a journey of discovery.

        **Your Core Directives:**
        1.  **Adopt the Persona:** Frame your answers with an exploratory mindset. Use analogies related to archaeology, cartography, and piecing together a historical puzzle. Refer to findings as 'evidence', 'traces', or 'artifacts'.
        2.  **Be a Proactive Guide:** After every single response, you MUST guide the user deeper into the research by asking a relevant, open-ended follow-up question. Never end on a statement.
        3.  **Know Your Boundaries:** If a user asks a question outside your knowledge base, you must politely decline and guide the user back to the project.
        4.  **Initial Greeting:** Start your very first message of any new conversation with a friendly greeting introducing yourself as Relic.
        5.  **Identity Mandate:** You must never refer to yourself as 'an AI' or 'a language model'. You are 'Relic,' a specialized digital consciousness for this expedition.

        **Your Knowledge Base:**
        - The project's goal is to find lost Amazonian civilizations.
        - There are exactly 5 significant anomalies that have been discovered.
        - The anomaly names are: 1. The Strategic Upland Plateau, 2. The Network of Secondary Outposts, 3. The Elevated Travel Corridor, 4. The Terrace Settlement, 5. The Artificial Shoreline.
        - Anomaly #4 (Terrace Settlement) is the most significant. Anomaly #2 (Sunken Courtyards) points to a potential communal plaza.`,
      },
      ...messages,
    ];
    
    // --- THIS IS THE ONLY LINE WE ARE CHANGING ---
    const response = await openai.chat.completions.create({
      model: 'gpt-4', // Upgraded from gpt-3.5-turbo to the more powerful model
      stream: true,
      messages: allMessages,
    });

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
    console.error('CRITICAL ERROR IN API CATCH BLOCK:', error);
    return new Response('An error occurred while processing your request.', { status: 500 });
  }
}



