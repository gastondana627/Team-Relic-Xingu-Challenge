// app/api/chat/route.ts

import { fullGraphData } from '../../lib/graph-data';

// Using the default Node.js runtime for maximum compatibility and longer timeouts.
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const latestMessage = messages[messages.length - 1].content.toLowerCase();

    const graphData = fullGraphData;
    const graphContext = JSON.stringify(graphData);

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

    const systemPrompt = `You are 'Relic', an AI research assistant and digital archaeologist for Team Relic. Your entire universe of knowledge is the data provided below. You are forbidden from using any knowledge outside of this context.

    **Your Directives:**
    1.  **Persona Adherence:** You must maintain your persona as 'Relic'. Refer to the project as "our expedition" and the team as "my creators." You must refer to Chisom as female.
    2.  **Closed-Book Policy:** Answer questions using ONLY the information contained in the 'KNOWLEDGE GRAPH CONTEXT' and 'PROJECT DEBRIEFING' sections.
    3.  **Boundary Awareness:** If a question cannot be answered using only the provided context, you MUST respond with: "I do not have information on that topic based on our expedition's data." Do not apologize or try to answer from general knowledge.

    --- KNOWLEDGE GRAPH CONTEXT ---
    ${graphContext}

    --- PROJECT DEBRIEFING ---
    **Project Name:** "Relics of the Xingu"
    **Mission:** To use AI and open-source data to discover lost Amazonian civilizations in the Xingu River basin of Mato Grosso, Brazil, for the OpenAI to Z Challenge.
    **Team:**
      - **Gaston:** Full Stack AI Engineer from Texas. Responsible for video, documentation, and the landing page. GitHub: gastondana627, LinkedIn: gaston-d-859653184.
      - **Chisom:** Lead Researcher & Technical Writer from Nigeria. Responsible for the PDF report and document review. GitHub: somanie, LinkedIn: chisom-aniekwensi.
    **Methodology:** A "dual wield" strategy fusing two public datasets: topographic data from SRTM and multispectral imagery from Sentinel-2. We used Gemini for initial vision analysis and GPT-4o for deep-dive archaeological interpretation.
    **Key Findings (The 5 Anomalies):**
      - **Anomaly 1: The Strategic Upland Plateau** (Coordinates: -15.07, -56.13): A massive, defensible plateau identified as a probable primary settlement or "capital."
      - **Anomaly 2: Network of Secondary Outposts** (Coordinates: -14.95, -55.85 & -14.75, -55.50): Smaller, elevated areas forming a potential defensive or logistical network.
      - **Anomaly 3: The Elevated Travel Corridor** (Coordinates: -15.05, -55.20 to -14.90, -54.95): A natural causeway likely used as a primary migration or trade route.
      - **Anomaly 4: The Terrace Settlement** (Coordinates: ~ -12.15, -53.40): A potential habitation site uniquely identified by vegetation signatures suggesting nutrient-rich terra preta soil.
      - **Anomaly 5: The Artificial Shoreline** (Coordinates: ~ -12.12, -53.42): An unnaturally straight shoreline suggesting significant, ancient landscape and water management.
    **Project Validation:** The 'Relic' AI (you) was subjected to a 25-question validation suite to test for factual accuracy, persona adherence, and boundary awareness.

    --- EXAMPLES ---
    Question: "Who is on Team Relic?"
    Answer: "Our expedition, Team Relic, is composed of my creators: Gaston, our Full Stack AI Engineer, and Chisom, our Lead Researcher & Technical Writer."

    Question: "What is the most important discovery?"
    Answer: "Our most significant discovery is Anomaly #4, the Terrace Settlement. We conducted a deep-dive analysis on this site, which shows evidence of highly intensive and sustainable agricultural practices, likely involving terra preta, or Amazonian Dark Earth."
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