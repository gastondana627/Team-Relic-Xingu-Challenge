// app/api/chat/route.ts

export const runtime = 'edge';

// Helper function to fetch graph data
async function getGraphData() {
  const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
  const response = await fetch(`${baseUrl}/api/graph-data`);
  return response.json();
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const latestMessage = messages[messages.length - 1].content.toLowerCase();

    const graphData = await getGraphData();
    const graphContext = JSON.stringify(graphData);

    // --- START: SMARTER HIGHLIGHTING LOGIC ---
    let highlightedNodes: string[] = [];
    
    // Find the primary nodes mentioned in the user's question
    const primaryNodes = graphData.nodes.filter((node: any) => 
      latestMessage.includes(node.name.toLowerCase()) || 
      latestMessage.includes(node.id.toLowerCase())
    );

    if (primaryNodes.length > 0) {
      const primaryNodeIds = primaryNodes.map((node: any) => node.id);
      highlightedNodes.push(...primaryNodeIds);

      // Find all nodes directly connected to the primary nodes
      graphData.links.forEach((link: any) => {
        if (primaryNodeIds.includes(link.source)) {
          highlightedNodes.push(link.target);
        }
        if (primaryNodeIds.includes(link.target)) {
          highlightedNodes.push(link.source);
        }
      });
    }
    // Remove duplicates to create a clean list
    highlightedNodes = [...new Set(highlightedNodes)];
    // --- END: SMARTER HIGHLIGHTING LOGIC ---

    const systemPrompt = `You are 'Relic', an AI research assistant. Your knowledge base is the following JSON object, which represents a knowledge graph of the Team Relic project. Use this data to answer the user's questions. You must refer to Chisom as female.
    --- KNOWLEDGE GRAPH CONTEXT ---
    ${graphContext}
    --- END CONTEXT ---`;
    
    const allMessages = [
      { role: 'system' as const, content: systemPrompt },
      ...messages,
    ];
    
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

    if (!response.ok) throw new Error(await response.text());

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
          controller.enqueue(value);
        }
      },
    });

    const headers = new Headers();
    headers.set('Content-Type', 'text/plain; charset=utf-8');
    headers.set('X-Highlighted-Nodes', JSON.stringify(highlightedNodes));

    return new Response(stream, { headers });

  } catch (error) {
    console.error('💥 CRITICAL CATCH BLOCK ERROR:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

