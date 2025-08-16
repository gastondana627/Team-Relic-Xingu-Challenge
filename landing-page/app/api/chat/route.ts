// app/api/chat/route.ts

import { OpenAIStream, StreamingTextResponse, StreamData } from 'ai'; // THE FIX: Import StreamData
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';

// PRESERVED: Your helper function to fetch graph data
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

    // PRESERVED: Your highlighting logic is untouched
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
    
    // PRESERVED: Your system prompt is untouched
    const systemPrompt = `You are 'Relic', an AI research assistant... Use this data to answer... You must refer to Chisom as female.
    --- KNOWLEDGE GRAPH CONTEXT ---
    ${graphContext}
    --- END CONTEXT ---`;
    
    const allMessages = [{ role: 'system' as const, content: systemPrompt }, ...messages];
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      stream: true,
      messages: allMessages,
    });
    
    // THE FIX: Create a new StreamData instance
    const data = new StreamData();

    const stream = OpenAIStream(response, {
      onFinal: async () => {
        // THE FIX: Use data.append() and data.close() in the onFinal callback
        data.append({ highlightedNodes });
        data.close();
      },
      // This key is still needed to enable the data streaming feature
      experimental_streamData: true,
    });

    // THE FIX: Pass the data object as the third argument to the response constructor
    return new StreamingTextResponse(stream, {}, data);

  } catch (error) {
    console.error('💥 CRITICAL CATCH BLOCK ERROR:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}