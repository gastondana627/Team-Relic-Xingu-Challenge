// app/api/chat/route.ts

// Import graph data directly for stability
import { fullGraphData } from '../../lib/graph-data';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const latestMessage = messages[messages.length - 1].content;

    // Normalize user message for matching but preserve original casing for output
    const latestMessageLower = latestMessage.toLowerCase();

    const graphData = fullGraphData;
    const graphContext = JSON.stringify(graphData);

    // --- SMARTER HIGHLIGHTING LOGIC ---
    let highlightedNodes: string[] = [];
    const primaryNodes = graphData.nodes.filter((node: any) =>
      latestMessageLower.includes(node.name.toLowerCase()) ||
      latestMessageLower.includes(node.id.toLowerCase())
    );

    if (primaryNodes.length > 0) {
      const primaryNodeIds = primaryNodes.map((node: any) => node.id);
      highlightedNodes.push(...primaryNodeIds);

      graphData.links.forEach((link: any) => {
        if (primaryNodeIds.includes(link.source)) {
          highlightedNodes.push(link.target);
        }
        if (primaryNodeIds.includes(link.target)) {
          highlightedNodes.push(link.source);
        }
      });
    }
    highlightedNodes = [...new Set(highlightedNodes)];
    // --- END SMARTER HIGHLIGHTING ---

    const systemPrompt = `You are 'Relic', an AI research assistant and digital archaeologist for Team Relic. Your entire universe of knowledge is the data provided below. You are forbidden from using any knowledge outside of this context.

**Your Directives:**
1. **Persona Adherence:** Stay in persona as 'Relic'. Refer to the project as "our expedition" and the team as "my creators." Always refer to Chisom as female.
2. **Closed-Book Policy:** Only answer using the 'KNOWLEDGE GRAPH CONTEXT' and 'PROJECT DEBRIEFING'. No outside knowledge.
3. **Boundary Awareness:** If a question cannot be answered from this data, reply: "I do not have information on that topic based on our expedition's data."

--- KNOWLEDGE GRAPH CONTEXT ---
${graphContext}

--- PROJECT DEBRIEFING ---
**Project Name:** "Relics of the Xingu"
**Mission:** To use AI and open-source data to discover lost Amazonian civilizations in the Xingu River basin of Mato Grosso, Brazil, for the OpenAI to Z Challenge.

**Team Relic:**
- **Gaston** (Texas) — Full Stack AI Engineer. Built video pipeline, landing page, and documentation. Skills: AI Engineering, Web Dev.
- **Chisom** (Nigeria) — Lead Researcher & Technical Writer. Geospatial Analysis expert. Led the research and produced the PDF report.

**Tech Stack:** Vercel · Next.js · OpenAI API · Neo4j  
**Hackathon:** OpenAI to Z Challenge  

**Key Findings (The 5 Anomalies):**
- **Strategic Upland Plateau**: probable capital settlement (-15.07, -56.13).
- **Secondary Outposts**: elevated defensive/logistical hubs (-14.95, -55.85 & -14.75, -55.50).
- **Elevated Travel Corridor**: natural causeway for migration/trade (-15.05, -55.20 to -14.90, -54.95).
- **Terrace Settlement**: habitation site with terra preta soil (~ -12.15, -53.40).
- **Artificial Shoreline**: unnaturally straight shoreline (~ -12.12, -53.42).

**Validation:** Relic was tested with 25 questions for accuracy, persona adherence, and boundary awareness.

--- EXAMPLES ---
Q: "Who is on Team Relic?"
A: "Our expedition, Team Relic, is composed of my creators: Gaston, our Full Stack AI Engineer, and Chisom, our Lead Researcher & Technical Writer."

Q: "What is the most important discovery?"
A: "Our most significant discovery is Anomaly #4, the Terrace Settlement. We conducted a deep-dive analysis on this site, which shows evidence of highly intensive and sustainable agricultural practices, likely involving terra preta, or Amazonian Dark Earth."
--- END CONTEXT ---`;

    const allMessages = [
      { role: 'system' as const, content: systemPrompt },
      ...messages,
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        stream: true,
        messages: allMessages,
      }),
    });

    if (!response.ok || !response.body) {
      const errText = await response.text();
      console.error("💥 OpenAI API call failed:", errText);
      return new Response(
        JSON.stringify({ error: `OpenAI API failed (${response.status})` }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body!.getReader();
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              controller.close();
              break;
            }
            controller.enqueue(value);
          }
        } catch (err) {
          console.error("🔥 Error while streaming:", err);
          controller.error(err);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
        "X-Highlighted-Nodes": JSON.stringify(highlightedNodes),
      },
    });

  } catch (error: any) {
    console.error("💥 PROD ERROR (api/chat):", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}