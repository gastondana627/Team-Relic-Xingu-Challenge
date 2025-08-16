// app/api/chat/route.ts

import { OpenAIStream, StreamingTextResponse, StreamData } from 'ai';

export const runtime = 'edge';

// PRESERVED: Your helper function is unchanged.
async function getGraphData() {
  const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
  const response = await fetch(`${baseUrl}/api/graph-data`);
  return response.json();
}

export async function POST(req: Request) {
  // LOG 1: Confirm the API route is being hit.
  console.log("POST /api/chat route hit.");

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

    // LOG 2: Check for the API key's presence right before the fetch call.
    // This safely logs true/false without exposing the key itself.
    console.log("OpenAI API Key is present:", !!process.env.OPENAI_API_KEY);
    
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
    
    // LOG 3: Check the status of the response from OpenAI.
    console.log("Received response from OpenAI with status:", response.status);

    if (!response.ok) {
      // Throwing an error here will be caught by our catch block below.
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
    // LOG 4: This is the most important log. It will print the exact error to the Vercel logs.
    console.error('💥 CRITICAL CATCH BLOCK ERROR:', error);
    
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}