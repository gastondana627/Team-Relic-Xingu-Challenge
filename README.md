# Relics of the Xingu: An AI-Enhanced Archaeological Survey

### A Submission by Team Relic for the OpenAI to Z Challenge

**[ Python ] [ Google Colab ] [ OpenAI GPT-4o ] [ Remote Sensing ] [ Archaeology ]**

---

## Project Description

Beneath the canopy of the Amazon, the ghosts of forgotten cities lie waiting. Team Relic has ventured into this digital frontier, focusing on the Xingu River headwaters—a region famed for its sprawling "garden city" complexes—to uncover new, undocumented evidence of these ancient landscapes.

Our methodology fused two independent public datasets: topographic data from **SRTM** and multispectral imagery from **Sentinel-2**. We developed a purpose-built analysis toolkit in Google Colab to process this data, creating detailed hillshade maps and False-Color Infrared composites. The core of our discovery process involved a novel **"dual wield"** approach: combining Gemini's vision analysis to spot initial clues with targeted, leveraged prompts to the **OpenAI GPT-4o API** for deep-dive archaeological interpretation and strategic guidance.

## Key Findings: The 5 Candidate Anomalies

This AI-assisted workflow successfully identified five distinct candidate anomalies, painting a picture of a sophisticated, multi-layered society that strategically dominated its landscape.

| ID | Anomaly Name / Hypothesis | Approx. Location (Lat, Lon) | Combined Evidence & Description |
|:---|:---|:---|:---|
| 1 | **The Strategic Upland Plateau**<br/>*(Primary Settlement/Observation Post)* | `-15.07, -56.13` | A large, contiguous high-elevation plateau with defensible slopes overlooking the river valley. Sentinel-2 shows stable `terra firme` forest, suitable for a major settlement. |
| 2 | **The Network of Secondary Outposts**<br/>*(Defensive/Logistical Network)* | Representative Points:<br/> A: `-14.95, -55.85`<br/> B: `-14.75, -55.50` | Multiple smaller, isolated high-elevation areas suggest a network of watchtowers or support settlements forming a layered defense or logistical system. |
| 3 | **The Elevated Travel Corridor**<br/>*(Ancient Causeway/Route)* | Start: `-15.05, -55.20`<br/>End: `-14.90, -54.95` | A continuous, high-elevation ridge forming a natural causeway between two large plateaus, representing a high-probability ancient travel route. |
| 4 | **The Terrace Settlement**<br/>*(Habitation Site with Terra Preta)* | `~ -12.15, -53.40` | A cluster of low-relief mounds on a flat terrace, visible in SRTM. Sentinel-2 shows a mottled vegetation texture consistent with nutrient-rich *terra preta* soil from long-term human habitation. Located on the edge of the resource-rich floodplain "supermarket". |
| 5 | **The Artificial Shoreline**<br/>*(Possible Canal, Dock, or Sacred Grove)* | `~ -12.12, -53.42` | An unnaturally straight shoreline on Lagoa do Curumim, visible in SRTM. Sentinel-2 imagery shows a corresponding line of slightly different vegetation and is associated with a unique grove of flowering trees, suggesting a potentially cultivated or sacred area. |

## Repository Structure

* **/1_Checkpoint_Explorer/:** Contains the main Google Colab Notebook (`.ipynb`) with all the Python code for data processing, analysis, and visualization.
* **/2_Final_Report/:** Contains the key documentation files, including this README, the detailed Anomaly Log, Data Sources Log, and the final PDF submission report.
* **/3_Visual_Evidence/:** Contains all supporting screenshots and generated maps, organized into subfolders for each of the five anomalies.

## Data Sources

Our analysis is built on two independent, verifiable public data sources.

#### **Source 1: Topographic Data**
* **Dataset Name:** SRTM Global 1 arc-second (SRTM GL1)
* **Data Provider:** National Aeronautics and Space Administration (NASA)
* **Access Portal:** OpenTopography Facility
* **Job ID (Curumim Area):** `rt1749359231259`

#### **Source 2: Multispectral Imagery**
* **Dataset Name:** Sentinel-2 Level-2A (L2A)
* **Data Provider:** European Space Agency (ESA) Copernicus Programme
* **Access Portal:** Copernicus Data Space Ecosystem
* **Product ID (Curumim Area):** `S2A_MSIL2A_20250603T135131_N0511_R024_T21LZG_20250603T153613.SAFE`

## How to Reproduce
1.  Clone this repository.
2.  Open the `C1_Main_Analysis.ipynb` notebook in Google Colab.
3.  Ensure the file paths at the top of the snippets correspond to the data locations in your own Google Drive environment after uploading the source files.
4.  Run the cells sequentially. The notebook is commented to explain each step of the process.