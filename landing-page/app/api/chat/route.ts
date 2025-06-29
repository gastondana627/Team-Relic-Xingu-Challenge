import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { knowledgeBase } from '@/app/lib/knowledge_base';

// --- Embedding and search functions ---
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
    if (lowerCaseQuery.includes('who is on') || lowerCaseQuery.includes('team member') || lowerCaseQuery.includes('the team')) {
      topContext = knowledgeBase
        .filter(item => item.source.startsWith('Team Roster'))
        .map(item => `Source: ${item.source}\nContent: ${item.content}`)
        .join('\n\n');
    } else {
      // Semantic search
      if (!knowledgeBaseEmbeddings) await initializeKnowledgeBase();
      const extractor = await loadPipeline();
      const queryEmbedding = await extractor(userQuery, { pooling: 'mean', normalize: true });
      const similarities = knowledgeBaseEmbeddings!.map(item => ({ ...item, similarity: cosineSimilarity(Array.from(queryEmbedding.data), item.embedding) }));
      similarities.sort((a, b) => b.similarity - a.similarity);
      topContext = similarities.slice(0, 3).map(item => `Source: ${item.source}\nContent: ${item.content}`).join('\n\n');
    }

    const systemPrompt = `You are 'Relic', a highly advanced AI research assistant for Team Relic... (full prompt here)`; // Your persona prompt

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