// landing-page/app/api/chat/route.ts

import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { knowledgeBase } from '@/app/lib/knowledge_base';

// --- All the setup code for embeddings and search remains the same ---
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

    // --- THIS IS THE NEW HYBRID LOGIC ---
    // If the query is about the team, force the correct context.
    if (lowerCaseQuery.includes('who') || lowerCaseQuery.includes('team') || lowerCaseQuery.includes('member')) {
      console.log('Keyword match found: Forcing team context.');
      topContext = knowledgeBase
        .filter(item => item.source.startsWith('Team Roster'))
        .map(item => `Source: ${item.source}\nContent: ${item.content}`)
        .join('\n\n');
    } else {
      // Otherwise, use the smart semantic search for all other questions.
      console.log('No keyword match: Using semantic search.');
      if (!knowledgeBaseEmbeddings) await initializeKnowledgeBase();
      const extractor = await loadPipeline();
      const queryEmbedding = await extractor(userQuery, { pooling: 'mean', normalize: true });
      const similarities = knowledgeBaseEmbeddings!.map(item => ({ ...item, similarity: cosineSimilarity(Array.from(queryEmbedding.data), item.embedding) }));
      similarities.sort((a, b) => b.similarity - a.similarity);
      topContext = similarities.slice(0, 3).map(item => `Source: ${item.source}\nContent: ${item.content}`).join('\n\n');
    }

    const systemPrompt = `You are 'Relic', a highly advanced AI research assistant... (Your full system prompt from the previous step goes here)`;
    
    const result = await streamText({
      model: openai('gpt-4'),
      system: systemPrompt,
      messages: [{ role: 'user', content: userQuery }], // Send only the latest user query with the augmented prompt
      prompt: topContext, // The AI SDK uses `prompt` for RAG context now
    });

    return new Response(result.toReadableStream());
  } catch (error: any) {
    console.error('CRITICAL ERROR IN API CATCH BLOCK:', error);
    return new Response('An error occurred while processing your request.', { status: 500 });
  }
}


