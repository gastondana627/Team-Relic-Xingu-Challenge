// app/api/video/status/route.ts

import { NextResponse } from 'next/server';

const RUNWAY_API_URL = 'https://api.dev.runwayml.com/v1';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get('jobId');

  if (!jobId) {
    return NextResponse.json({ error: 'Job ID is required.' }, { status: 400 });
  }

  try {
    const runwayResponse = await fetch(`${RUNWAY_API_URL}/tasks/${jobId}`, {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${process.env.RUNWAY_API_KEY!}`,
        "X-Runway-Version": "2024-11-06",
      },
    });

    if (!runwayResponse.ok) {
      throw new Error(`Runway API responded with status: ${runwayResponse.status}`);
    }

    const result = await runwayResponse.json();

    if (result.status === 'SUCCEEDED') {
      // THE FIX: The video URL is in the first element of the 'output' array.
      return NextResponse.json({ 
        status: 'succeeded', 
        videoUrl: result.output?.[0]
      });
    } else if (result.status === 'FAILED') {
      return NextResponse.json({ status: 'failed' });
    } else {
      return NextResponse.json({ status: result.status || 'processing' });
    }

  } catch (error: any) {
    console.error('💥 VIDEO STATUS ERROR:', error);
    return NextResponse.json({ error: 'Failed to get video status.' }, { status: 500 });
  }
}