Relics of the Xingu: An AI-Enhanced Archaeological Survey
A Submission by Team Relic for the OpenAI to Z Challenge

[ Python ] [ Google Colab ] [ OpenAI GPT-4o ] [ Remote Sensing ] [ Archaeology ]

1. Project Mission
For over a century, the whispers of a lost civilization deep within the Amazon rainforest captivated explorers like Percy Fawcett – a quest for "Z," a city of unimaginable scale and sophistication. Many dismissed such tales, believing the dense jungle could never sustain large, settled populations.

Our project challenges this myth. Team Relic has ventured into the digital frontier of Mato Grosso, Brazil, focusing on the Xingu River headwaters—a region famed for its sprawling "garden city" complexes—to uncover new, undocumented evidence of these ancient landscapes.

View our live, interactive presentation website here:
https://relic-openai-to-z-challenge.tech

2. Methodology: A "Dual Wield" Approach
Our methodology fused two independent public datasets: topographic data from SRTM and multispectral imagery from Sentinel-2. We developed a purpose-built analysis toolkit in Google Colab to process this data, creating detailed hillshade maps and False-Color Infrared composites.

The core of our discovery process involved a novel "dual wield" strategy, combining Gemini's vision analysis to spot initial clues with targeted, leveraged prompts to OpenAI models for deep-dive archaeological interpretation and strategic guidance.

AI Model Implementation

Our project strategically utilized two distinct OpenAI models, each chosen for its specific strengths:

For Deep-Dive Analysis (C2 Notebook): We used gpt-4o, OpenAI's flagship multimodal model. Its advanced reasoning and ability to interpret complex, nuanced information were essential for the historical synthesis and comparative analysis tasks.

For the Live AI Assistant ("Relic"): We used gpt-4 to power the live chatbot on our website. This model was chosen for its proven reliability and exceptional ability to adhere to the complex instructions required to maintain the "Relic" persona, ensuring a consistent and high-quality interactive experience for judges.

3. Key Findings: The 5 Candidate Anomalies
This AI-assisted workflow successfully identified five distinct candidate anomalies, painting a picture of a sophisticated, multi-layered society that strategically dominated its landscape.

ID

Anomaly Name / Hypothesis

Approx. Location (Lat, Lon)

Combined Evidence & Description

1

The Strategic Upland Plateau<br/>(Primary Settlement/Observation Post)

-15.07, -56.13

A large, contiguous high-elevation plateau with defensible slopes overlooking the river valley. Sentinel-2 shows stable terra firme forest, suitable for a major settlement.

2

The Network of Secondary Outposts<br/>(Defensive/Logistical Network)

Representative Points:<br/> A: -14.95, -55.85<br/> B: -14.75, -55.50

Multiple smaller, isolated high-elevation areas suggest a network of watchtowers or support settlements forming a layered defense or logistical system.

3

The Elevated Travel Corridor<br/>(Ancient Causeway/Route)

Start: -15.05, -55.20<br/>End: -14.90, -54.95

A continuous, high-elevation ridge forming a natural causeway between two large plateaus, representing a high-probability ancient travel route.

4

The Terrace Settlement<br/>(Habitation Site with Terra Preta)

~ -12.15, -53.40

A cluster of low-relief mounds on a flat terrace, visible in SRTM. Sentinel-2 shows a mottled vegetation texture consistent with nutrient-rich terra preta soil from long-term human habitation.

5

The Artificial Shoreline<br/>(Possible Canal, Dock, or Sacred Grove)

~ -12.12, -53.42

An unnaturally straight shoreline on Lagoa do Curumim, visible in SRTM, suggesting significant ancient landscape modification.

4. Repository Structure
/1_Checkpoint_Explorer/: Contains the main Google Colab Notebook (.ipynb) with all the Python code for data processing, analysis, and visualization.

/2_Final_Report/: Contains the key documentation files, including this README, the detailed Anomaly Log, Data Sources Log, and the final PDF submission report.

/3_Visual_Evidence/: Contains all supporting screenshots and generated maps, organized into subfolders for each of the five anomalies.

5. Data Sources
Our analysis is built on two independent, verifiable public data sources.

Source 1: Topographic Data

Dataset Name: SRTM Global 1 arc-second (SRTM GL1)

Data Provider: National Aeronautics and Space Administration (NASA)

Access Portal: OpenTopography Facility

Job ID (Curumim Area): rt1749359231259

Source 2: Multispectral Imagery

Dataset Name: Sentinel-2 Level-2A (L2A)

Data Provider: European Space Agency (ESA) Copernicus Programme

Access Portal: Copernicus Data Space Ecosystem

Product ID (Curumim Area): S2A_MSIL2A_20250603T135131_N0511_R024_T21LZG_20250603T153613.SAFE

6. How to Reproduce
Clone this repository.

Open the C1_Main_Analysis.ipynb notebook in Google Colab.

Ensure the file paths at the top of the snippets correspond to the data locations in your own Google Drive environment after uploading the source files.

Run the cells sequentially. The notebook is commented to explain each step of the process.