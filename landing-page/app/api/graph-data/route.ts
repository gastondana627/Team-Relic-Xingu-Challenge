
// app/api/graph-data/route.ts

import { NextResponse } from 'next/server';
// THE FIX: Import the data from our new, dedicated data file.
import { fullGraphData } from '../../lib/graph-data';

export const runtime = 'edge';

export async function GET() {
  // The handler now simply returns the imported data.
  return NextResponse.json(fullGraphData);
}

