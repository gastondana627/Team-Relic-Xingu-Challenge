// app/api/video/status/route.ts

import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv'; // Import the Vercel KV client

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get('jobId');

  if (!jobId) {
    return NextResponse.json({ error: 'Job ID is required.' }, { status: 400 });
  }

  try {
    // **THE FIX**: Check Vercel KV to see if our local simulation is done.
    const localJob = await kv.get(jobId);
    if (!localJob) { // If our job has been marked complete by the Runway check
        const runwayResponse = await fetch(`https://api.dev.runwayml.com/v1/tasks/${jobId}`, {
             headers: {
                "Authorization": `Bearer ${process.env.RUNWAY_API_KEY!}`,
                "X-Runway-Version": process.env.RUNWAY_API_VERSION!,
            },
        });
        const result = await runwayResponse.json();
        if (result.status === 'SUCCEEDED') {
             return NextResponse.json({ 
                status: 'complete', 
                videoUrl: result.output.video_url
            });
        }
    }

    const runwayResponse = await fetch(`https://api.dev.runwayml.com/v1/tasks/${jobId}`, {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${process.env.RUNWAY_API_KEY!}`,
        "X-Runway-Version": process.env.RUNWAY_API_VERSION!,
      },
    });

    if (!runwayResponse.ok) {
      throw new Error(`Runway API responded with status: ${runwayResponse.status}`);
    }

    const result = await runwayResponse.json();

    if (result.status === 'SUCCEEDED') {
      // **THE FIX**: Delete the job from Vercel KV upon completion.
      await kv.del(jobId);
      return NextResponse.json({ 
        status: 'complete', 
        videoUrl: result.output.video_url
      });
    } else if (result.status === 'FAILED') {
      await kv.del(jobId);
      return NextResponse.json({ status: 'failed' });
    } else {
      return NextResponse.json({ status: result.status || 'processing' });
    }

  } catch (error) {
    console.error('💥 VIDEO STATUS ERROR:', error);
    return NextResponse.json({ error: 'Failed to get video status.' }, { status: 500 });
  }
}
