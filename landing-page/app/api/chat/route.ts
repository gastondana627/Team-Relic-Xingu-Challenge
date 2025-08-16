// app/api/chat/route.ts

// ✅ Force stable Node.js runtime
export const runtime = 'nodejs';

// ✅ Prevent static caching of API route
export const dynamic = 'force-dynamic';

// Helper function to fetch graph data
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

    // --- SMARTER HIGHLIGHTING LOGIC ---
    let highlightedNodes: string[] = [];
    const primaryNodes = graphData.nodes.filter((node: any) => 
      latestMessage.includes(node.name.toLowerCase()) || 
      latestMessage.includes(node.id.toLowerCase())
    );
    if (primaryNodes.length > 0) {
      const primaryNodeIds = primaryNodes.map((node: any) => node.id);
      highlightedNodes.push(...primaryNodeIds);
      graphData.links.forEach((link: any) => {
        if (primaryNodeIds.includes(link.source)) highlightedNodes.push(link.target);
        if (primaryNodeIds.includes(link.target)) highlightedNodes.push(link.source);
      });
    }
    highlightedNodes = [...new Set(highlightedNodes)];

    const systemPrompt = `You are 'Relic', an AI research assistant. Your knowledge base is the following JSON object, which represents a knowledge graph of the Team Relic project. Use this data to answer the user's questions. You must refer to Chisom as female.
    --- KNOWLEDGE GRAPH CONTEXT ---
    ${graphContext}
    --- END CONTEXT ---`;
    
    const allMessages = [
      { role: 'system' as const, content: systemPrompt },
      ...messages,
    ];
    
    // ✅ Call OpenAI with streaming enabled
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

    // ✅ Convert raw body into stream passthrough
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

    // ✅ Headers safe for production
    const headers = new Headers();
    headers.set('Content-Type', 'text/plain; charset=utf-8');
    headers.set('Cache-Control', 'no-cache, no-transform');
    headers.set('Connection', 'keep-alive');
    headers.set('X-Highlighted-Nodes', JSON.stringify(highlightedNodes));

    return new Response(stream, { headers });

  } catch (error: any) {
    console.error('💥 CRITICAL CATCH BLOCK ERROR (PROD):', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal Server Error' }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}