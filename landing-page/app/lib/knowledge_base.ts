// landing-page/app/lib/knowledge_base.ts

interface Knowledge {
    source: string;
    content: string;
  }
  
  export const knowledgeBase: Knowledge[] = [
    {
      source: "Project Paper: Mission Statement",
      content: "Our mission, inspired by the quest for 'Z', is to use cutting-edge remote sensing and AI to discover and document lost civilizations in Mato Grosso, Brazil. We aim to challenge the myth of a pristine, untouched wilderness by revealing evidence of monumental human achievement."
    },
    {
      source: "Project Paper: Anomaly 1 - Strategic Upland Plateau",
      content: "Function: This large, high-elevation plateau (-15.07, -56.13) likely served as a primary political, economic, and ritual center—a 'capital' for a major regional polity. Its strategic elevation suggests defensive advantages. Age: Hypothesized to be from the Late Holocene, roughly AD 1000-1600. Reference: Heckenberger (Amazonia 1492)."
    },
    {
      source: "Project Paper: Anomaly 2 - Network of Secondary Outposts",
      content: "Function: These smaller plaza villages and hamlets (e.g., -14.95, -55.85) represent an integrated regional settlement system, serving as strategic outposts, production centers, and communication hubs. Age: Co-temporal with core settlements, AD 1000-1600. Reference: Heckenberger (The Ecology of Power)."
    },
    {
      source: "Project Paper: Anomaly 3 - The Elevated Travel Corridor",
      content: "Function: A vast network of engineered roads and causeways designed for efficient transportation of people and goods across diverse terrains, including seasonally flooded wetlands. This facilitated trade and social cohesion. Age: Primarily developed during peak settlement from AD 1000-1600. Reference: Rostain et al."
    },
    {
      source: "Project Paper: Anomaly 4 - The Terrace Settlement",
      content: "Function: This site (~ -12.15, -53.40) shows evidence of highly intensive and sustainable agriculture. The terraces, combined with Amazonian Dark Earth (terra preta), indicate a sophisticated 'forest cycling' agricultural technology. Age: Intensified during the Late Holocene (AD 1000-1600). Reference: Goldberg et al."
    },
    {
      source: "Project Paper: Anomaly 5 - The Artificial Shoreline",
      content: "Function: Engineered modifications to lake shores (~ -12.12, -53.42) suggesting advanced water management and sophisticated aquaculture systems like fish farms or turtle pens. The use of specific tree species for stabilization highlights a holistic approach to environmental design. Reference: Loughlin et al."
    },
    {
      source: "Project Paper: Proposed Future Work",
      content: "The real job ahead requires collaborative fieldwork, including ground-truthing our findings, high-resolution mapping with local partners, targeted test excavations, and integrating ethnoarchaeological research with Indigenous knowledge."
    },
    // --- NEW TEAM MEMBER INFORMATION ADDED BELOW ---
    {
      source: "Team Roster: Gaston",
      content: "Gaston (GasMan) is the lead on Video Production, Documentation Consolidation, and Frontend Development for Team Relic. He is a Digital Storyteller passionate about weaving compelling narratives from complex data and bringing the team's discoveries to life through visual media and an interactive web experience."
    },
    {
      source: "Team Roster: Chisom",
      content: "Chisom is the Lead Researcher for Team Relic and is responsible for the final PDF Report and Document Review. Her focus is on ensuring the accuracy, clarity, and impact of the team's findings by translating raw data into a professional, evidence-based report."
    }
  ];