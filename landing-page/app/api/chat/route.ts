// app/api/chat/route.ts

// Using the default Node.js runtime for maximum compatibility and longer timeouts.
// export const runtime = 'nodejs';
// export const dynamic = 'force-dynamic';

// THE FIX: Hardened getGraphData function with improved URL handling and error logging.
async function getGraphData() {
  // Switched to NEXT_PUBLIC_SITE_URL for a more reliable production base URL.
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  console.log("🌐 getGraphData baseUrl:", baseUrl);

  const response = await fetch(`${baseUrl}/api/graph-data`);
  console.log("📊 graph-data status:", response.status);

  if (!response.ok) {
    const errText = await response.text();
    console.error("💥 getGraphData fetch failed. Raw response text:", errText);
    throw new Error(`Failed to fetch graph data (${response.status})`);
  }

  // This block ensures that if we receive non-JSON, we log the raw text before crashing.
  const responseText = await response.text();
  try {
    return JSON.parse(responseText);
  } catch (e) {
    console.error("💥 getGraphData JSON parsing failed. Raw response that caused the error:", responseText);
    throw new Error("Received invalid JSON from /api/graph-data.");
  }
}

export async function POST(req: Request) {
  try {
    console.log("🚀 /api/chat POST handler triggered");

    if (!process.env.OPENAI_API_KEY) {
      console.error("❌ OPENAI_API_KEY missing!");
      return new Response(
        JSON.stringify({ error: "Missing OpenAI API key" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    console.log("🔑 OPENAI_API_KEY present: ✅");

    const { messages } = await req.json();
    console.log("📝 Incoming messages:", JSON.stringify(messages));

    const latestMessage = messages[messages.length - 1].content.toLowerCase();

    const graphData = await getGraphData();
    console.log("📊 Graph data successfully parsed. Keys:", Object.keys(graphData));

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

    const systemPrompt = `You are 'Relic', an AI research assistant. Knowledge base JSON follows...`;

    const allMessages = [
      { role: 'system' as const, content: systemPrompt },
      ...messages,
    ];

    console.log("📡 Sending request to OpenAI...");
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
    console.log("✅ OpenAI response status:", response.status);

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

    console.log("🔗 Returning SSE stream to client...");
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