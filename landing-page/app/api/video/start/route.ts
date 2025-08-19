// app/api/video/start/route.ts

import { NextResponse } from 'next/server';

// THE FIX: The URL now points to the correct, documented image-to-video endpoint.
const RUNWAY_API_URL = 'https://api.dev.runwayml.com/v1/image_to_video';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    // THE FIX: The API now expects an imageUrl and a text prompt.
    const { imageUrl, promptText } = await req.json();
    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required.' }, { status: 400 });
    }

    const runwayResponse = await fetch(RUNWAY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.RUNWAY_API_KEY!}`,
        "X-Runway-Version": "2024-11-06",
      },
      // THE FIX: The body now sends the required 'promptImage' and optional 'promptText'.
      body: JSON.stringify({
        promptImage: imageUrl,
        promptText: promptText || "Animate this image with subtle, cinematic motion.",
        model: "gen4_turbo", // Specify a valid model from the documentation
        ratio: "1280:720", // Specify a valid ratio
      }),
    });

    if (!runwayResponse.ok) {
      const errorText = await runwayResponse.text();
      throw new Error(`Runway API Error: ${errorText}`);
    }

    const result = await runwayResponse.json();
    const jobId = result.id || result.uuid;

    if (!jobId) {
      throw new Error("Runway API did not return a job ID.");
    }

    const caption = `I've started animating the image. This may take a few moments.`;

    return NextResponse.json({ jobId, caption });

  } catch (error: any) {
    console.error('💥 VIDEO START API ERROR:', error);
    return NextResponse.json({ error: error.message || 'Failed to start video generation.' }, { status: 500 });
  }
}