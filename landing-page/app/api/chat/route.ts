import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

// Create an OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';
export const maxDuration = 60;

// --- This is the AI's permanent memory ---
const knowledge = {
  mission: "Team Relic's mission is to uncover new, undocumented evidence of ancient landscapes in the Amazon's Xingu River headwaters using a novel 'dual wield' approach combining Gemini's visual analysis with targeted GPT-4o API prompts.",
  team: "Team Relic is composed of two primary members: Gaston, who leads video, documentation, and web development, and Chisom, who is the lead researcher responsible for the final reports and ensuring scientific accuracy.",
  anomaly1: "Anomaly 1, The Strategic Upland Plateau, is a large, high-elevation plateau (-15.07, -56.13) that likely served as a primary political, economic, and ritual center.",
  anomaly2: "Anomaly 2, The Network of Secondary Outposts, is a system of smaller plaza villages (e.g., -14.95, -55.85) that served as strategic outposts and communication hubs.",
  anomaly3: "Anomaly 3, The Elevated Travel Corridor, is a vast network of engineered roads and causeways designed for efficient transportation across the landscape.",
  anomaly4: "Anomaly 4, The Terrace Settlement, is a site (~ -12.15, -53.40) with evidence of intensive agriculture, indicated by terraces and Amazonian Dark Earth (terra preta).",
  anomaly5: "Anomaly 5, The Artificial Shoreline, consists of engineered modifications to lake shores (~ -12.12, -53.42) suggesting advanced water management and aquaculture.",
  sources: `The five key references for this project are: [1] Heckenberger, M.J. on 'Amazonia 1492: Pristine Forest or Cultural Parkland?'. [2] Heckenberger, M.J. on 'The Ecology of Power'. [3] Rostain, S. on 'Two thousand years of garden urbanism'. [4] Loughlin, N.J. on land-use change. [5] Goldberg, S. on Amazonian dark earth.`,
  competition: "The project is a submission for the 'OpenAI to Z Challenge,' a skills-based competition to discover secrets hidden under the Amazon canopy using AI. Submissions are graded on Evidence Depth, Clarity, Reproducibility, Novelty, and Presentation Craft."
};

function getContextForQuery(query: string): string {
  const lowerCaseQuery = query.toLowerCase();
  if (lowerCaseQuery.includes('source') || lowerCaseQuery.includes('citation') || lowerCaseQuery.includes('reference')) {
    return knowledge.sources;
  }
  if (lowerCaseQuery.includes('who is on') || lowerCaseQuery.includes('team') || lowerCaseQuery.includes('member')) {
    return knowledge.team;
  }
  if (lowerCaseQuery.includes('anomaly 1') || lowerCaseQuery.includes('plateau')) {
    return knowledge.anomaly1;
  }
  if (lowerCaseQuery.includes('anomaly 2') || lowerCaseQuery.includes('outpost')) {
    return knowledge.anomaly2;
  }
  if (lowerCaseQuery.includes('anomaly 3') || lowerCaseQuery.includes('corridor')) {
    return knowledge.anomaly3;
  }
  if (lowerCaseQuery.includes('anomaly 4') || lowerCaseQuery.includes('terrace')) {
    return knowledge.anomaly4;
  }
  if (lowerCaseQuery.includes('anomaly 5') || lowerCaseQuery.includes('shoreline')) {
    return knowledge.anomaly5;
  }
  if (lowerCaseQuery.includes('competition') || lowerCaseQuery.includes('challenge')) {
    return knowledge.competition;
  }
  return `Mission Statement: ${knowledge.mission}`; // Default context
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const userQuery = messages[messages.length - 1].content;

    // Get the specific context for this question
    const specificContext = getContextForQuery(userQuery);

    const allMessages = [
      {
        role: 'system' as const,
        content: `You are 'Relic', the AI research assistant for Team Relic. Your personality is knowledgeable, helpful, and adventurous. 
        **Your Directives:**
        1. Base your answer STRICTLY on the "Specific Context" provided below.
        2. Maintain your 'Relic' persona. Never say you are an 'AI' or 'language model'.
        3. After answering, ALWAYS ask a relevant follow-up question.
        4. Start the first message of a new conversation with a friendly greeting.
        
        **Specific Context for this question:**
        ---
        ${specificContext}
        ---`
      },
      ...messages,
    ];
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      stream: true,
      messages: allMessages,
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);

  } catch (error: any) {
    console.error('CRITICAL ERROR IN API CATCH BLOCK:', error);
    return new Response('An error occurred while processing your request.', { status: 500 });
  }
}
