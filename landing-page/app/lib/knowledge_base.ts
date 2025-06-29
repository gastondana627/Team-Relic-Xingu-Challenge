interface Knowledge {
    source: string;
    content: string;
  }
  
  export const knowledgeBase: Knowledge[] = [
    // Team & Project Info
    {
      source: "Team Relic Mission Statement",
      content: "Team Relic's mission is to uncover new, undocumented evidence of ancient landscapes in the Amazon's Xingu River headwaters. Our methodology fuses two independent public datasets (SRTM and Sentinel-2) and uses a novel 'dual wield' approach combining Gemini's visual analysis with targeted GPT-4o API prompts for deep-dive archaeological interpretation and strategic guidance."
    },
    {
      source: "Team Roster: Gaston",
      content: "Gaston is the lead on Video Production, Documentation Consolidation, and Frontend Development for Team Relic. He is a Digital Storyteller passionate about bringing the team's discoveries to life through visual media and an interactive web experience."
    },
    {
      source: "Team Roster: Chisom",
      content: "Chisom is the Lead Researcher for Team Relic and is responsible for the final PDF Report and Document Review. Her focus is on ensuring the accuracy, clarity, and impact of the team's findings by translating raw data into a professional, evidence-based report."
    },
  
    // Anomaly Details
    {
      source: "Project Paper: Anomaly 1 - Strategic Upland Plateau",
      content: "Function & Location: Located at (-15.07, -56.13), this large, high-elevation plateau likely served as a primary political, economic, and ritual center. Its strategic elevation suggests defensive advantages. Age: Hypothesized to be from the Late Holocene, AD 1000-1600. Reference: [1] Heckenberger."
    },
    {
      source: "Project Paper: Anomaly 2 - Network of Secondary Outposts",
      content: "Function & Location: Located at points like (-14.95, -55.85), these smaller villages represent an integrated regional settlement system, serving as strategic outposts. Age: Co-temporal with core settlements, AD 1000-1600. Reference: [2] Heckenberger."
    },
    {
      source: "Project Paper: Anomaly 3 - The Elevated Travel Corridor",
      content: "Function & Location: This feature is a vast network of engineered roads and causeways for efficient transportation across diverse terrains, including wetlands. Age: Primarily developed during peak settlement from AD 1000-1600. Reference: [3] Rostain et al."
    },
    {
      source: "Project Paper: Anomaly 4 - The Terrace Settlement",
      content: "Function & Location: Located at (~ -12.15, -53.40), this site shows evidence of intensive agriculture with terraces and Amazonian Dark Earth (terra preta). Age: Intensified during the Late Holocene (AD 1000-1600). Reference: [5] Goldberg et al."
    },
    {
      source: "Project Paper: Anomaly 5 - The Artificial Shoreline",
      content: "Function & Location: These engineered modifications to lake shores at (~ -12.12, -53.42) suggest advanced water management and aquaculture. Reference: [4] Loughlin et al."
    },
    
    // Data Citations
    {
      source: "Data Citation: SRTM",
      content: "The topographic data used was from the NASA Shuttle Radar Topography Mission (SRTM) Global dataset, distributed by OpenTopography. DOI: https://doi.org/10.5069/G9445JDF."
    },
    {
      source: "Data Citation: Sentinel-2",
      content: "The multispectral imagery used was from the Copernicus Sentinel-2 mission (Level-2A data), distributed by Copernicus Data Space Ecosystem."
    },
  
    // Competition & Judging Info
    {
      source: "Competition Overview: Description",
      content: "The OpenAI to Z Challenge is a competition focused on using AI to discover secrets hidden under the Amazon canopy. The goal is to pinpoint new sites, suggest new historical insights, or create new methods for discovery, inspired by legends of a 'lost city of Z'."
    },
    {
      source: "Competition Overview: Evaluation Criteria",
      content: "Submissions are graded on five key criteria, each worth 20 points: Evidence Depth, Clarity, Reproducibility, Novelty, and Presentation Craft."
    }
  ];