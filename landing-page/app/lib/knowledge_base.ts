// landing-page/app/lib/knowledge_base.ts

interface Knowledge {
    source: string;
    content: string;
  }
  
  export const knowledgeBase: Knowledge[] = [
    // --- CORE PROJECT INFO ---
    {
      source: "Team Relic Mission Statement",
      content: "Team Relic's mission is to uncover new, undocumented evidence of ancient landscapes in the Amazon's Xingu River headwaters. Our methodology fused two independent public datasets (SRTM and Sentinel-2) and used a novel 'dual wield' approach combining Gemini's visual analysis with targeted GPT-4o API prompts for deep-dive archaeological interpretation and strategic guidance."
    },
    {
      source: "Team Roster: Gaston",
      content: "Gaston is the lead on Video Production, Documentation Consolidation, and Frontend Development for Team Relic. He is a Digital Storyteller passionate about bringing the team's discoveries to life through visual media and an interactive web experience."
    },
    {
      source: "Team Roster: Chisom",
      content: "Chisom is the Lead Researcher for Team Relic and is responsible for the final PDF Report and Document Review. Her focus is on ensuring the accuracy, clarity, and impact of the team's findings."
    },
  
    // --- ANOMALY DETAILS ---
    {
      source: "Project Paper: Anomaly 1 - The Strategic Upland Plateau",
      content: "Function & Location: Located at (-15.07, -56.13), this large, high-elevation plateau likely served as a primary political, economic, and ritual center. Its strategic elevation suggests defensive advantages. Age: Hypothesized to be from the Late Holocene, AD 1000-1600."
    },
    {
      source: "Project Paper: Anomaly 2 - The Network of Secondary Outposts",
      content: "Function & Location: Located at representative points like (-14.95, -55.85), these smaller plaza villages represent an integrated regional settlement system, serving as strategic outposts and communication hubs. Age: Co-temporal with core settlements, AD 1000-1600."
    },
    {
      source: "Project Paper: Anomaly 3 - The Elevated Travel Corridor",
      content: "Function & Location: This feature, running from approx. (-15.05, -55.20) to (-14.90, -54.95), is a vast network of engineered roads and causeways designed for efficient transportation and communication across diverse terrains."
    },
    {
      source: "Project Paper: Anomaly 4 - The Terrace Settlement",
      content: "Function & Location: Located at (~ -12.15, -53.40), this site shows evidence of highly intensive agriculture with terraces and Amazonian Dark Earth (terra preta)."
    },
    {
      source: "Project Paper: Anomaly 5 - The Artificial Shoreline",
      content: "Function & Location: These engineered modifications to lake shores at (~ -12.12, -53.42) suggest advanced water management and sophisticated aquaculture systems like fish farms or turtle pens."
    },
    
    // --- OFFICIAL REFERENCES ---
    {
      source: "Reference [1]",
      content: "Heckenberger, Michael J., et al. 'Amazonia 1492: Pristine Forest or Cultural Parkland?' ResearchGate."
    },
    {
      source: "Reference [2]",
      content: "Heckenberger, M. J. 'The Ecology of Power: Culture, Place, and Personhood in the Southern Amazon, A.D. 1000-2000.' Routledge, 2005."
    },
    {
      source: "Reference [3]",
      content: "Rostain, Stéphen, et al. 'Two thousand years of garden urbanism in the Upper Amazon.' ResearchGate."
    },
    {
      source: "Reference [4] & [5]",
      content: "Loughlin, N. J., et al. 'Insights into past land-use and vegetation change in the Llanos de Moxos (Bolivia) using fungal non-pollen palynomorphs.' Journal of Archaeological Science. And Goldberg, Sam, et al. 'Widespread Amazonian dark earth in the Xingu Indigenous Territory.' ResearchGate."
    },
  
    // --- COMPETITION INFO ---
    {
      source: "Competition Overview: Description",
      content: "The 'OpenAI to Z Challenge' is a skills-based competition where participants use AI to dig through open data to discover secrets hidden under the Amazon canopy, inspired by legends of a 'lost city of Z'."
    },
    {
      source: "Competition Overview: Evaluation Criteria",
      content: "Submissions are graded on five key criteria: Evidence Depth, Clarity, Reproducibility, Novelty, and Presentation Craft."
    }
  ];