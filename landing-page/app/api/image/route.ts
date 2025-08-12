// app/api/image/route.ts

import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export const runtime = 'edge';

// A helper function to create detailed, artistic prompts
const createPromptForAnomaly = (anomalyName: string): string => {
  const styleEnhancers = "award-winning digital painting, cinematic, hyperrealistic, dramatic lighting, epic scale, concept art, matte painting, 8k, sharp focus";
  let basePrompt = "";

  switch (anomalyName) {
    case "The Strategic Upland Plateau":
      basePrompt = "A breathtaking wide-angle shot of a massive, ancient earthwork snaking across a strategic upland plateau in the Amazon. The sun is setting, casting long, dramatic shadows that reveal the structure's immense scale. The mood is mysterious and ancient.";
      break;
    case "The Network of Secondary Outposts":
      basePrompt = "An archaeological concept art visualization of a network of secondary outposts. The view is from a low angle, looking across a vast, geometrically aligned sunken plaza where ancient people are gathered. The architecture is earthen and precise. The atmosphere is alive with the energy of a lost civilization.";
      break;
    case "The Elevated Travel Corridor":
      basePrompt = "A dynamic, moody digital painting of an ancient elevated travel corridor cutting through the dense, misty Amazon jungle. The corridor is a wide, raised causeway made of earth, flanked by towering trees. Beams of light pierce the canopy, illuminating the path.";
      break;
    case "The Terrace Settlement":
      basePrompt = "A stunning, photorealistic matte painting of a complex agricultural society on a terraced mountainside in the Amazon. The terraces are lush with crops, and small, thatched-roof dwellings are nestled into the hillside. The scene is peaceful and depicts a thriving, advanced settlement.";
      break;
    case "The Artificial Shoreline":
      basePrompt = "A beautiful, serene digital painting of a massive artificial shoreline created by an ancient civilization. The engineered coastline is dotted with small settlements and wooden canoes. The water reflects the warm, golden hour light of the setting sun.";
      break;
    default:
      basePrompt = `An artistic visualization of the archaeological anomaly known as ${anomalyName} in the Amazon rainforest.`;
  }

  return `${basePrompt}, ${styleEnhancers}`;
};

export async function POST(req: Request) {
  try {
    const { anomaly } = await req.json();
    if (!anomaly) {
      return NextResponse.json({ error: 'Anomaly name is required.' }, { status: 400 });
    }

    const finalPrompt = createPromptForAnomaly(anomaly);
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: finalPrompt,
      n: 1,
      size: "1024x1024",
      quality: "hd",
      style: "vivid"
    });

    const imageUrl = response.data[0].url;

    if (imageUrl) {
      return NextResponse.json({ imageUrl, prompt: finalPrompt });
    } else {
      throw new Error('No image URL found in the OpenAI API response.');
    }

  } catch (error) {
    console.error('💥 CRITICAL IMAGE API ERROR:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
