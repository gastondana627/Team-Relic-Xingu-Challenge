// app/api/chat/route.ts

import { OpenAIStream, StreamingTextResponse, StreamData } from 'ai';

// THE OFFICIAL FIX: This line is removed to switch the function to the standard Node.js runtime,
// which has a longer timeout limit and prevents the 500 error.
// export const runtime = 'edge';

// PRESERVED: Your helper function is unchanged.
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
    
    const systemPrompt = `You are 'Relic', an AI research assistant... Use this data to answer... You must refer to Chisom as female.
    --- KNOWLEDGE GRAPH CONTEXT ---
    ${graphContext}
    --- END CONTEXT ---`;
    
    const allMessages = [{ role: 'system' as const, content: systemPrompt }, ...messages];
    
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

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }
    
    const data = new StreamData();
    const stream = OpenAIStream(response, {
      onFinal: async () => {
        data.append({ highlightedNodes });
        data.close();
      },
      experimental_streamData: true,
    });

    return new StreamingTextResponse(stream, {}, data);

  } catch (error) {
    console.error('💥 CRITICAL CATCH BLOCK ERROR:', error);
    
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}