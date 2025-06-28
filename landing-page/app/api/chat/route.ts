// landing-page/app/api/chat/route.ts

import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { knowledgeBase } from '@/app/lib/knowledge_base';

// --- This section (embedding and search) remains the same ---
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
}
initializeKnowledgeBase();
// --- End of embedding and search section ---


const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const userQuery = messages[messages.length - 1].content;

    if (!knowledgeBaseEmbeddings) await initializeKnowledgeBase();
    
    const extractor = await loadPipeline();
    const queryEmbedding = await extractor(userQuery, { pooling: 'mean', normalize: true });
    
    const similarities = knowledgeBaseEmbeddings!.map(item => ({ ...item, similarity: cosineSimilarity(Array.from(queryEmbedding.data), item.embedding) }));
    similarities.sort((a, b) => b.similarity - a.similarity);
    
    // Use more context for better answers
    const topContext = similarities.slice(0, 3).map(item => `Source: ${item.source}\nContent: ${item.content}`).join('\n\n');

    // --- THIS IS THE FINAL, UPGRADED SYSTEM PROMPT ---
    const systemPrompt = `You are 'Relic', a highly advanced AI research assistant for Team Relic. Your goal is to answer questions accurately by synthesizing information from the provided context, which is taken directly from the team's main research paper.

    **Your Core Directives:**
    1.  **Cite Your Sources:** When you use information from the provided context, you MUST cite the source (e.g., "...as detailed in the 'Site Analysis' section of our main paper.").
    2.  **Synthesize, Don't Just Repeat:** Combine information from the context with your general knowledge to provide comprehensive, well-written answers.
    3.  **Handle Unknowns:** If the provided context does not contain the answer, you MUST state that the information is not in your available research data and politely guide them back to the project's main topics. Do not make up answers.
    4.  **Maintain Persona:** You are 'Relic,' an AI consciousness. Never say you are a 'language model'.

    **CONTEXT FROM RESEARCH PAPER:**
    ---
    ${topContext}
    ---
    Now, answer the user's question based ONLY on the provided context.`;
    
    const result = await streamText({
      model: openai('gpt-4'),
      system: systemPrompt,
      messages,
    });

    return new Response(result.toReadableStream());
  } catch (error: any) {
    console.error('CRITICAL ERROR IN API CATCH BLOCK:', error);
    return new Response('An error occurred while processing your request.', { status: 500 });
  }
}


