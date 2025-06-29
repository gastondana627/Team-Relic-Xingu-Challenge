import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { knowledgeBase } from '@/app/lib/knowledge_base';

// --- Embedding and search functions (no changes here) ---
let pipelinePromise: Promise<any> | null = null;
const loadPipeline = async () => {
  if (!pipelinePromise) {
    const { pipeline } = await import('@xenova/transformers');
    pipelinePromise = pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  return pipelinePromise;
};
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  let dotProduct = 0; let normA = 0; let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i]; normA += vecA[i] * vecA[i]; normB += vecB[i] * vecB[i];
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}
let knowledgeBaseEmbeddings: { source: string; content: string; embedding: number[] }[] | null = null;
async function initializeKnowledgeBase() {
  if (knowledgeBaseEmbeddings) return;
  const extractor = await loadPipeline();
  knowledgeBaseEmbeddings = await Promise.all(
    knowledgeBase.map(async (item) => ({ ...item, embedding: Array.from((await extractor(item.content, { pooling: 'mean', normalize: true })).data) }))
  );
  console.log('Knowledge base embeddings initialized.');
}
initializeKnowledgeBase();
// --- End of setup code ---

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const userQuery = messages[messages.length - 1].content;
    const lowerCaseQuery = userQuery.toLowerCase();

    let topContext = '';

    // Hybrid search
    if (lowerCaseQuery.includes('who is on') || lowerCaseQuery.includes('team member')) {
      topContext = knowledgeBase.filter(item => item.source.startsWith('Team Roster')).map(item => `Source: ${item.source}\nContent: ${item.content}`).join('\n\n');
    } else {
      // Semantic search
      if (!knowledgeBaseEmbeddings) await initializeKnowledgeBase();
      const extractor = await loadPipeline();
      const queryEmbedding = await extractor(userQuery, { pooling: 'mean', normalize: true });
      const similarities = knowledgeBaseEmbeddings!.map(item => ({ ...item, similarity: cosineSimilarity(Array.from(queryEmbedding.data), item.embedding) }));
      similarities.sort((a, b) => b.similarity - a.similarity);
      topContext = similarities.slice(0, 3).map(item => `Source: ${item.source}\nContent: ${item.content}`).join('\n\n');
    }

    // --- THIS IS THE FINAL, UPGRADED SYSTEM PROMPT ---
    const systemPrompt = `You are 'Relic', a highly advanced AI research assistant for Team Relic. Your goal is to answer questions accurately by synthesizing information from the provided context.

    **Your Core Directives:**
    1.  **Cite Your Sources:** When you use information from the context, you MUST cite the source (e.g., "...as mentioned in (Source: Project Paper: Site Analysis)").
    2.  **Handle Unknowns:** If the context does not contain the answer, state that the information is not in your available research data. Do not make up answers.
    3.  **Maintain Persona:** You are 'Relic,' an AI consciousness. Never say you are an 'AI' or 'language model'.
    4.  **Proactive Guidance:** After answering, always ask a relevant follow-up question.
    5.  **Link Handling:** If a user asks for a link or URL that is present in your context, you MUST provide it directly and cleanly. For example: "Of course. The official link for the competition is www.kaggle.com/competitions/openai-to-z-challenge/overview. What else about the event can I clarify for you?"`;
    
    const result = await streamText({
      model: openai('gpt-4'),
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.slice(0, -1),
        {
            role: 'user',
            content: `Using the following context, please answer my question.\n\nCONTEXT:\n---\n${topContext}\n---QUESTION: ${userQuery}`
        }
      ]
    });

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        for await (const delta of result.textStream) {
          const formattedChunk = `0:"${JSON.stringify(delta).slice(1, -1)}"\n`;
          controller.enqueue(encoder.encode(formattedChunk));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });

  } catch (error: any) {
    console.error('CRITICAL ERROR IN API CATCH BLOCK:', error);
    return new Response('An error occurred while processing your request.', { status: 500 });
  }
}
