// app/api/chat/route.ts

// ✅ Force Node.js runtime (for streaming)
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function getGraphData() {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000';
  const response = await fetch(`${baseUrl}/api/graph-data`);
  return response.json();
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const latestMessage = messages[messages.length - 1].content.toLowerCase();

    const graphData = await getGraphData();
    const graphContext = JSON.stringify(graphData);

    // --- SMART HIGHLIGHT LOGIC ---
    let highlightedNodes: string[] = [];
    const primaryNodes = graphData.nodes.filter((node: any) =>
      latestMessage.includes(node.name.toLowerCase()) ||
      latestMessage.includes(node.id.toLowerCase())
    );
    if (primaryNodes.length > 0) {
      const primaryNodeIds = primaryNodes.map((n: any) => n.id);
      highlightedNodes.push(...primaryNodeIds);
      graphData.links.forEach((link: any) => {
        if (primaryNodeIds.includes(link.source)) highlightedNodes.push(link.target);
        if (primaryNodeIds.includes(link.target)) highlightedNodes.push(link.source);
      });
    }
    highlightedNodes = [...new Set(highlightedNodes)];

    const systemPrompt = `You are 'Relic', an AI research assistant. Your knowledge base is the following JSON object...`;

    const allMessages = [
      { role: 'system' as const, content: systemPrompt },
      ...messages,
    ];

    // ✅ Call OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY ?? ''}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        stream: true,
        messages: allMessages,
      }),
    });

    if (!response.ok || !response.body) {
      const errText = await response.text();
      throw new Error(`OpenAI API failed (${response.status}): ${errText}`);
    }

    // ✅ Stream passthrough
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body!.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            controller.close();
            break;
          }
          controller.enqueue(value);
        }
      },
    });

    // ✅ Proper SSE headers for production
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'X-Highlighted-Nodes': JSON.stringify(highlightedNodes),
      },
    });

  } catch (error: any) {
    console.error('💥 PROD ERROR:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}