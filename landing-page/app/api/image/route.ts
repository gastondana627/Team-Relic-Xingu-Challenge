// app/api/image/route.ts

import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize the OpenAI client with your existing API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { anomaly } = await req.json();
    if (!anomaly) {
      return NextResponse.json({ error: 'Anomaly name is required.' }, { status: 400 });
    }

    const createPromptForAnomaly = (anomalyName: string): string => {
      const styleEnhancers = "digital art, cinematic lighting, highly detailed, 4k, epic, concept art, sharp focus, vibrant colors, archaeological visualization";
      let basePrompt = "";
      switch (anomalyName) {
        case "The Strategic Upland Plateau":
          basePrompt = "A cinematic, sweeping drone shot over a massive, ancient earthwork on a strategic upland plateau in the Amazon. The sun is low, casting long shadows.";
          break;
        case "The Network of Secondary Outposts":
          basePrompt = "An archaeological visualization of a network of secondary outposts. The camera moves through geometrically aligned sunken courtyards, revealing a bustling communal plaza from a lost civilization.";
          break;
        case "The Elevated Travel Corridor":
          basePrompt = "A dramatic, fast-paced tracking shot following an ancient elevated travel corridor through the dense Amazon jungle. The corridor is a raised causeway made of earth.";
          break;
        case "The Terrace Settlement":
          basePrompt = "A detailed, photorealistic animation still showing the construction of an extensive network of agricultural terraces on a hillside in the Amazon by a complex, thriving society.";
          break;
        case "The Artificial Shoreline":
          basePrompt = "A beautiful, realistic digital painting of a massive artificial shoreline created by an ancient civilization, with canoes and small settlements along the water's edge. Golden hour lighting.";
          break;
        default:
          basePrompt = `An artistic visualization of the archaeological anomaly known as ${anomalyName} in the Amazon rainforest.`;
      }
      return `${basePrompt}, ${styleEnhancers}`;
    };

    const finalPrompt = createPromptForAnomaly(anomaly);
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: finalPrompt,
      n: 1,
      size: "1024x1024",
      quality: "hd",
      style: "vivid"
    });

    // **THE FIX**: Use optional chaining (?.) to safely access the URL.
    // This checks if 'data' and 'data[0]' exist before trying to get the 'url'.
    const imageUrl = response.data?.[0]?.url;

    if (imageUrl) {
      return NextResponse.json({ imageUrl, prompt: finalPrompt });
    } else {
      // If imageUrl is null or undefined, throw an error.
      throw new Error('No image URL found in the OpenAI API response.');
    }

  } catch (error) {
    console.error('💥 CRITICAL IMAGE API ERROR:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
