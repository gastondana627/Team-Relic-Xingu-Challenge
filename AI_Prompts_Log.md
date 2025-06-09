# AI Prompt Log for Checkpoint 1

This document logs the primary analytical prompts sent to the OpenAI API (Model: gpt-4o) during the initial investigation phase.

---

### Prompt #1: Initial Topographic Analysis (SRTM Data)

**Purpose:** To get initial archaeological interpretations based on the general landscape features revealed by the SRTM data.

**Prompt Text:**
> "I am analyzing an SRTM digital elevation model for a region in the Xingu River headwaters, an area known for pre-Columbian 'garden city' settlements. The hillshade reveals a complex dendritic drainage pattern, but also large, relatively flat elevated plateaus, especially in the southern portion of the dataset. Given this information, what are plausible archaeological interpretations for the strategic use of these high-plateau areas adjacent to a major river system in the Amazon?"

---

### Prompt #2: Sentinel-2 Image Interpretation Strategy

**Purpose:** To understand how to use the different Sentinel-2 composites for anomaly hunting, both in forested and deforested areas.

**Prompt Text:**
> "I have processed Sentinel-2 L2A data for the Xingu River headwaters... The False-Color Infrared Composite (B8,B4,B3) shows dense forest as a deep, vibrant red... and deforested patches in contrasting colors like bright cyan... My Questions: 1. Based on the description...how can a False-Color Infrared image be specifically used to identify potential archaeological anomalies that might be hidden *within* the densely forested (bright red) areas? 2. For the areas that are already deforested...what kinds of patterns, shapes, or soil color differences should I look for...?"

---

### Prompt #3: Leveraged Analysis of a Specific Anomaly (Example for Anomaly #4)

**Purpose:** To demonstrate "re-prompting with leverage" by feeding the AI specific, multi-source observations about a single candidate anomaly to get a detailed analysis.

**Prompt Text:**
> "I am conducting an archaeological remote sensing analysis... I have identified a potential anomaly... **Name:** The Terrace Settlement... **Location (Lat, Lon):** (-12.15, -53.40)... **My Observations:** - **From Topographic Data (SRTM):** The SRTM hillshade shows a distinct cluster of numerous small, low-relief, rounded mounds on a flat terrace. - **From Multispectral Imagery (Sentinel-2):** The Sentinel-2 False-Color image confirms this is a special area. The vegetation shows a mottled texture of light pinks and cyan... consistent with past human habitation... **Please provide your expert analysis on the following:** 1. Based on this combined evidence, what is the likelihood this is an anthropogenic feature? 2. What are the most plausible archaeological interpretations...? 3. What other specific features should I look for...?"