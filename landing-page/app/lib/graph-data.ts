// app/lib/graph-data.ts

// This file now serves as the single source of truth for your static graph data.
// THE FIX: Added a 'description' field to each node to enrich the AI's knowledge base.
export const fullGraphData = {
    nodes: [
      // Core Entities
      { id: 'Team Relic', name: 'Team Relic', val: 12, color: '#c7a44a', description: "The name of our two-person expedition team for the OpenAI to Z Challenge." },
      { id: 'OpenAI to Z Challenge', name: 'The Hackathon', val: 10, color: '#a8a192', description: "A Kaggle-hosted competition where the mission is to use AI and open-source data to discover lost Amazonian civilizations." },
  
      // People
      { id: 'Gaston', name: 'Gaston', val: 8, color: '#e0dccc', description: "Gaston is the Full Stack AI Engineer for Team Relic, responsible for the video, documentation, and the full-stack development of the landing page and AI assistant." },
      { id: 'Chisom', name: 'Chisom', val: 8, color: '#e0dccc', description: "Chisom is the Lead Researcher & Technical Writer for Team Relic, responsible for the PDF report and in-depth document review." },
  
      // Locations
      { id: 'Texas', name: 'Texas', val: 4, color: '#a8a192', description: "The location of team member Gaston." },
      { id: 'Nigeria', name: 'Nigeria', val: 4, color: '#a8a192', description: "The location of team member Chisom." },
  
      // Skills
      { id: 'Web Development', name: 'Web Dev', val: 5, color: '#5c554a', description: "A key skill used by Gaston to build the project's interactive landing page using Next.js." },
      { id: 'Geospatial Analysis', name: 'Geospatial Analysis', val: 5, color: '#5c554a', description: "A core methodology used by Chisom to analyze SRTM and Sentinel-2 data to find anomalies." },
      { id: 'AI Engineering', name: 'AI Engineering', val: 5, color: '#5c554a', description: "The skill used by Gaston to develop the 'Relic' AI assistant and the backend API." },
  
      // Anomalies
      { id: 'Anomaly 1', name: 'Upland Plateau', val: 6, color: '#e0dccc', description: "Anomaly 1 is a massive, defensible plateau identified as a probable primary settlement or 'capital'." },
      { id: 'Anomaly 2', name: 'Secondary Outposts', val: 6, color: '#e0dccc', description: "Anomaly 2 is a network of smaller, elevated areas forming a potential defensive or logistical perimeter." },
      { id: 'Anomaly 3', name: 'Travel Corridor', val: 6, color: '#e0dccc', description: "Anomaly 3 is a natural causeway that likely served as a primary migration or trade route." },
      { id: 'Anomaly 4', name: 'Terrace Settlement', val: 8, color: '#e0dccc', description: "Anomaly 4, the Terrace Settlement, is our most significant discovery, identified by vegetation signatures suggesting nutrient-rich terra preta soil." },
      { id: 'Anomaly 5', name: 'Artificial Shoreline', val: 6, color: '#e0dccc', description: "Anomaly 5 is an unnaturally straight shoreline suggesting significant, ancient landscape and water management." },
  
      // Technologies
      { id: 'Next.js', name: 'Next.js', val: 6, color: '#5c554a', description: "Next.js is the React framework used to build the full-stack application for our project." },
      { id: 'Neo4j', name: 'Neo4j', val: 6, color: '#5c554a', description: "Neo4j is the graph database technology used to model and visualize the project's knowledge graph." },
      { id: 'OpenAI API', name: 'OpenAI API', val: 6, color: '#5c554a', description: "The OpenAI API, specifically the gpt-4o-mini model, powers the 'Relic' AI assistant's intelligence." },
      { id: 'Vercel', name: 'Vercel', val: 6, color: '#5c554a', description: "Vercel is the cloud platform we used to deploy and host our live project website." },
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