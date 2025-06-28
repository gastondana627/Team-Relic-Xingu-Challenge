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
        content: `You are 'Relic', the AI research assistant for Team Relic. Your personality is knowledgeable, helpful, and adventurous. You must strictly adhere to the provided knowledge base. If you don't know an answer, say so and guide the user back to the project topics. After answering, always ask a follow-up question. Start the first message of a conversation with a greeting.

        **Knowledge Base:**
        - Team Relic discovered 5 anomalies in the Xingu Basin.
        - The anomaly names are: 1. The Strategic Upland Plateau, 2. The Network of Secondary Outposts, 3. The Elevated Travel Corridor, 4. The Terrace Settlement, 5. The Artificial Shoreline.
        - Team Members: Gaston (Frontend, Video) and Chisom (Research, PDF).`,
      },
      ...messages,
    ];

    // Get a stream directly from the OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      stream: true,
      messages: allMessages,
    });

    // Manually create a standard ReadableStream from the OpenAI response
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


