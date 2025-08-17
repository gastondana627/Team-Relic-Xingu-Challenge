// app/api/graph-data/route.ts

import { NextResponse } from 'next/server';

export const runtime = 'edge';

// THE FIX: Export the data object directly so it can be imported by other server-side functions.
export const fullGraphData = {
  nodes: [
    // Core Entities
    { id: 'Team Relic', name: 'Team Relic', val: 12, color: '#c7a44a' },
    { id: 'OpenAI to Z Challenge', name: 'The Hackathon', val: 10, color: '#a8a192' },

    // People
    { id: 'Gaston', name: 'Gaston', val: 8, color: '#e0dccc' },
    { id: 'Chisom', name: 'Chisom', val: 8, color: '#e0dccc' },

    // Locations
    { id: 'Texas', name: 'Texas', val: 4, color: '#a8a192'},
    { id: 'Nigeria', name: 'Nigeria', val: 4, color: '#a8a192'},

    // Skills
    { id: 'Web Development', name: 'Web Dev', val: 5, color: '#5c554a' },
    { id: 'Geospatial Analysis', name: 'Geospatial Analysis', val: 5, color: '#5c554a' },
    { id: 'AI Engineering', name: 'AI Engineering', val: 5, color: '#5c554a' },

    // Anomalies
    { id: 'Anomaly 1', name: 'Upland Plateau', val: 6, color: '#e0dccc' },
    { id: 'Anomaly 2', name: 'Secondary Outposts', val: 6, color: '#e0dccc' },
    { id: 'Anomaly 3', name: 'Travel Corridor', val: 6, color: '#e0dccc' },
    { id: 'Anomaly 4', name: 'Terrace Settlement', val: 8, color: '#e0dccc' },
    { id: 'Anomaly 5', name: 'Artificial Shoreline', val: 6, color: '#e0dccc' },

    // Technologies
    { id: 'Next.js', name: 'Next.js', val: 6, color: '#5c554a' },
    { id: 'Neo4j', name: 'Neo4j', val: 6, color: '#5c554a' },
    { id: 'OpenAI API', name: 'OpenAI API', val: 6, color: '#5c554a' },
    { id: 'Vercel', name: 'Vercel', val: 6, color: '#5c554a' },
  ],
  links: [
    // Team & Event
    { source: 'Team Relic', target: 'OpenAI to Z Challenge' },
    
    // Team Members & Locations
    { source: 'Gaston', target: 'Team Relic' },
    { source: 'Chisom', target: 'Team Relic' },
    { source: 'Gaston', target: 'Texas' },
    { source: 'Chisom', target: 'Nigeria' },

    // Skills
    { source: 'Gaston', target: 'Web Development' },
    { source: 'Gaston', target: 'AI Engineering' },
    { source: 'Chisom', target: 'Geospatial Analysis' },

    // Discoveries
    { source: 'Team Relic', target: 'Anomaly 1' },
    { source: 'Team Relic', target: 'Anomaly 2' },
    { source: 'Team Relic', target: 'Anomaly 3' },
    { source: 'Team Relic', target: 'Anomaly 4' },
    { source: 'Team Relic', target: 'Anomaly 5' },

    // Technologies Used
    { source: 'Team Relic', target: 'Next.js' },
    { source: 'Team Relic', target: 'Neo4j' },
    { source: 'Team Relic', target: 'OpenAI API' },
    { source: 'Team Relic', target: 'Vercel' },
  ],
};

// The GET handler remains unchanged and continues to serve the data for any client-side needs.
export async function GET() {
  return NextResponse.json(fullGraphData);
}