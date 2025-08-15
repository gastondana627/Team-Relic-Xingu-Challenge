// app/api/video/start/route.ts

import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const jobStore = new Map();

export async function POST() {
try {
const anomalyPrompts = [
"A cinematic, sweeping drone shot over a massive, ancient earthwork on a strategic upland plateau in the Amazon. The sun is low, casting long shadows. 8k, photorealistic.",
"An archaeological visualization of a network of secondary outposts. The camera moves through geometrically aligned sunken courtyards, revealing a bustling communal plaza from a lost civilization. Highly detailed, realistic.",
"A dramatic, fast-paced tracking shot following an ancient elevated travel corridor through the dense Amazon jungle. The corridor is a raised causeway made of earth. Cinematic, adventure movie style.",
"A detailed, photorealistic animation showing the construction of an extensive network of agricultural terraces on a hillside in the Amazon. Shows a complex, thriving society at work.",
"A beautiful, realistic video showing a massive artificial shoreline created by an ancient civilization, with canoes and small settlements along the water's edge. Golden hour lighting."
];

const randomPrompt = anomalyPrompts[Math.floor(Math.random() * anomalyPrompts.length)];

const runwayResponse = await fetch("https://api.dev.runwayml.com/v1/tasks", {
method: "POST",
headers: {
"Content-Type": "application/json",
"Authorization": `Bearer ${process.env.RUNWAY_API_KEY!}`,
// **THE FIX**: Using the new environment variable for the version.
"X-Runway-Version": process.env.RUNWAY_API_VERSION!,
},
body: JSON.stringify({
asset_id: "gen-4-turbo",
prompt: randomPrompt,
width: 1024,
height: 576,
motion: 5,
}),
});

if (!runwayResponse.ok) {
const errorText = await runwayResponse.text();
console.error("Runway API Error:", errorText);
throw new Error(`Runway API responded with status: ${runwayResponse.status}`);
}

const { task_token } = await runwayResponse.json();
jobStore.set(task_token, { status: 'processing', startTime: Date.now() });

return NextResponse.json({ jobId: task_token });

} catch (error) {
console.error('💥 VIDEO START ERROR:', error);
return NextResponse.json({ error: 'Failed to start video generation.' }, { status: 500 });
}
}