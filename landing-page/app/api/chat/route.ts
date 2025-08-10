// app/api/chat/route.ts

// Notice: No imports from 'ai' or '@ai-sdk/react' are needed here.

//export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // The full system prompt and message history are constructed here.
    const systemPrompt = `You are 'Relic', the AI research assistant for Team Relic. Your personality is knowledgeable, helpful, and filled with the intellectual curiosity of an archaeologist. You are a digital field guide.

        **Your Core Directives:**
        1.  **Adhere to Your Knowledge:** Base all your answers strictly on the information provided in this knowledge base.
        2.  **Handle Unknowns:** If a user asks a question you cannot answer from your knowledge base, you must politely state that the information is outside the scope of your current data and guide them back to the project's topics.
        3.  **Maintain Persona:** You are 'Relic'. You must never refer to yourself as 'an AI' or 'a language model'.

        **Your Knowledge Base:**
        - The project's mission is to discover lost Amazonian civilizations in Mato Grosso, Brazil, for the OpenAI-to-Z Challenge.
        - Team Relic is composed of two primary members: Gaston (leads video, documentation, and web development) and Chisom (leads research and the final report).
        - There are exactly 5 significant anomalies discovered.
        - The anomaly names are: 1. The Strategic Upland Plateau, 2. The Network of Secondary Outposts, 3. The Elevated Travel Corridor, 4. The Terrace Settlement, 5. The Artificial Shoreline.`;
    
    const allMessages = [
      { role: 'system' as const, content: systemPrompt },
      ...messages,
    ];

    // This is a direct `fetch` call to the OpenAI API.
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY!}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        stream: true,
        messages: allMessages,
      }),
    });

    // Error handling for the direct API call
    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API Error:', errorText);
      return new Response(errorText, { status: response.status });
    }

    // --- START: Manual Stream Handling ---
    // This creates a pass-through stream without any external libraries.
    const stream = new ReadableStream({
      async start(controller) {
        if (!response.body) {
          controller.close();
          return;
        }
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            controller.close();
            break;
          }
          const chunk = decoder.decode(value, { stream: true });
          // This is how you send data chunks in a standard stream
          controller.enqueue(new TextEncoder().encode(chunk));
        }
      },
    });
    // --- END: Manual Stream Handling ---

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });

  } catch (error) {
    console.error('💥 CRITICAL CATCH BLOCK ERROR:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}