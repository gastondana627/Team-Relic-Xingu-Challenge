// landing-page/app/lib/knowledge_base.ts

interface Knowledge {
    source: string;
    content: string;
  }
  
  export const knowledgeBase: Knowledge[] = [
    // --- CORE PROJECT INFO ---
    {
      source: "Team Relic Project Abstract",
      content: "Team Relic's mission is to uncover new, undocumented evidence of ancient landscapes in the Amazon's Xingu River headwaters. Our methodology fused two independent public datasets (SRTM and Sentinel-2) and used a novel 'dual wield' approach combining Gemini's visual analysis with targeted GPT-4o API prompts for deep-dive archaeological interpretation and strategic guidance."
    },
    {
      source: "Team Relic: Historical Context",
      content: "For over a century, explorers like Percy Fawcett have searched the Amazon for 'Z', a lost city of unimaginable scale. This project challenges the myth of a pristine, untouched wilderness by using modern technology to reveal evidence of monumental human achievement in Mato Grosso, Brazil, a unique 'halfway house' ecology between dense forest and savanna."
    },
  
    // --- ANOMALY DETAILS ---
    {
      source: "Project Paper: Anomaly 1 - The Strategic Upland Plateau",
      content: "Function & Location: Located at (-15.07, -56.13), this large, high-elevation plateau likely served as a primary political, economic, and ritual center—a 'capital' for a major regional polity. Its strategic elevation suggests defensive advantages. Age: Hypothesized to be from the Late Holocene, roughly AD 1000-1600. Reference: [1] Heckenberger (Amazonia 1492)."
    },
    {
      source: "Project Paper: Anomaly 2 - The Network of Secondary Outposts",
      content: "Function & Location: Located at representative points like (-14.95, -55.85), these smaller plaza villages represent an integrated regional settlement system, serving as strategic outposts and communication hubs. Age: Co-temporal with core settlements, AD 1000-1600. Reference: [2] Heckenberger (The Ecology of Power)."
    },
    {
      source: "Project Paper: Anomaly 3 - The Elevated Travel Corridor",
      content: "Function & Location: This feature, running from approx. (-15.05, -55.20) to (-14.90, -54.95), is a vast network of engineered roads and causeways designed for efficient transportation and communication across diverse terrains. Age: Primarily developed during peak settlement from AD 1000-1600. Reference: [3] Rostain et al."
    },
    {
      source: "Project Paper: Anomaly 4 - The Terrace Settlement",
      content: "Function & Location: Located at (~ -12.15, -53.40), this site shows evidence of highly intensive agriculture. The terraces and presence of Amazonian Dark Earth (terra preta) indicate a sophisticated 'forest cycling' agricultural technology. Age: Intensified during the Late Holocene (AD 1000-1600). Reference: [5] Goldberg et al."
    },
    {
      source: "Project Paper: Anomaly 5 - The Artificial Shoreline",
      content: "Function & Location: These engineered modifications to lake shores at (~ -12.12, -53.42) suggest advanced water management and sophisticated aquaculture systems like fish farms or turtle pens. Reference: [4] Loughlin et al."
    },
  
    // --- TEAM & DATA INFO ---
    {
      source: "Team Roster: Gaston",
      content: "Gaston is the lead on Video Production, Documentation Consolidation, and Frontend Development for Team Relic. He is a Digital Storyteller passionate about bringing the team's discoveries to life through visual media and an interactive web experience."
    },
    {
      source: "Team Roster: Chisom",
      content: "Chisom is the Lead Researcher for Team Relic and is responsible for the final PDF Report and Document Review. Her focus is on ensuring the accuracy, clarity, and impact of the team's findings."
    },
    {
      source: "Data Citation: SRTM",
      content: "The topographic data used was from the NASA Shuttle Radar Topography Mission (SRTM) Global dataset, distributed by OpenTopography. DOI: https://doi.org/10.5069/G9445JDF."
    },
    {
      source: "Data Citation: Sentinel-2",
      content: "The multispectral imagery used was from the Copernicus Sentinel-2 mission (Level-2A data), distributed by Copernicus Data Space Ecosystem. The Product ID for the Curumim Area is S2A_MSIL2A_20250603T135131_N0511_R024_T21LZG_20250603T153613.SAFE."
    },
  
    // --- COMPETITION INFO ---
    {
      source: "Competition Rules: Event Description",
      content: "The 'OpenAI to Z Challenge' is a skills-based competition where participants use AI to dig through open data to discover secrets hidden under the Amazon canopy. The goal is to pinpoint new sites, suggest new historical insights, or create new methods for discovery, inspired by legends of a 'lost city of Z'."
    },
    {
      source: "Competition Rules: Evaluation Criteria",
      content: "Submissions are graded on five key criteria, each worth 20 points: Evidence Depth (quality and range of data), Clarity (how convincingly the evidence converges), Reproducibility (ease for others to rerun the work), Novelty (surfacing something genuinely new or clever), and Presentation Craft (smooth visuals and overall polish)."
    }
  ];