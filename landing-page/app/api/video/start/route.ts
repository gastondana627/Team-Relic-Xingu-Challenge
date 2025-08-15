// app/api/video/start/route.ts

import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv'; // Import the Vercel KV client

export const runtime = 'edge';

export async function POST() {
  try {
    const anomalyPrompts = [
      "A cinematic, sweeping drone shot over a massive, ancient earthwork on a strategic upland plateau in the Amazon...",
      // ... (your other prompts)
    ];
    const randomPrompt = anomalyPrompts[Math.floor(Math.random() * anomalyPrompts.length)];

    const runwayResponse = await fetch("https://api.dev.runwayml.com/v1/video/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.RUNWAY_API_KEY!}`,
        "X-Runway-Version": process.env.RUNWAY_API_VERSION!,
      },
      body: JSON.stringify({
        model: "gen4_turbo",
        promptText: randomPrompt,
        width: 1024,
        height: 576,
        motion: 5,
      }),
    });

    if (!runwayResponse.ok) {
      const errorText = await runwayResponse.text();
      throw new Error(`Runway API Error: ${errorText}`);
    }

    const { id: jobId } = await runwayResponse.json();

    // Store the job status in Vercel KV with a 10-minute expiration.
    await kv.set(jobId, { status: 'processing' }, { ex: 600 });

    return NextResponse.json({ jobId });

  } catch (error) {
    console.error('💥 VIDEO START ERROR:', error);
    return NextResponse.json({ error: 'Failed to start video generation.' }, { status: 500 });
  }
}
