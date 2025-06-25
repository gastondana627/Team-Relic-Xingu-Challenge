# Project Relic: The Xingu Discovery
### Submission for the OpenAI to Z Challenge

This repository contains the complete research, source code, and documentation for Team Relic's submission. Our project is presented as a fully interactive website, which serves as our primary demonstration.

**Live Project Demo:** **[https://relic-openai-to-z-challenge.tech](https://relic-openai-to-z-challenge.tech)**

---

### Table of Contents
1.  [Project Mission](#1-project-mission)
2.  [How to Explore Our Findings (User Guide)](#2-how-to-explore-our-findings-user-guide)
3.  [Our Methodology](#3-our-methodology)
4.  [Tech Stack](#4-tech-stack)
5.  [For Developers: Running Locally](#5-for-developers-running-the-project-locally)
6.  [Team Members](#6-team-members)

---

### 1. Project Mission

Inspired by the legend of the "Lost City of Z," this project undertakes a digital expedition into the Amazon's Xingu Basin. Our mission is to leverage modern AI tools and open-source datasets to identify, analyze, and document previously unknown archaeological sites. We aim to demonstrate that a small, agile team can make significant historical discoveries from anywhere in the world, contributing to the preservation of Amazonian history.

### 2. How to Explore Our Findings (User Guide)

Our project website is designed to be a narrative journey. We recommend exploring it in the following order to properly observe our findings.

#### Navigating the Landing Page
The website guides you through our entire research process from start to finish.
- **The Expedition Log:** This is the first main section, showcasing our five core discoveries (anomalies) with imagery and video links.
- **The Evidence Locker:** Here, we present our evidence-based approach with links to the discovery and deep-dive notebooks that form the foundation of our work.
- **AI-Powered Insights:** This is our interactive Checkpoint 3 deliverable.
- **Project Links & Repository:** This section at the bottom contains direct links to all essential resources, including this GitHub repository and our notebooks on Kaggle and Colab.

#### Using the AI-Powered Insights Tool
A centerpiece of our submission is the interactive AI tool. We've pre-loaded it with key questions a judge or researcher might have about our project.
- **Click a Prompt:** Simply click on any of the prompt buttons.
- **Reveal the Answer:** The panel below will display a detailed, AI-synthesized answer based on our curated research data.
This tool demonstrates our ability to use AI to turn complex data into understandable and compelling insights.

#### How to Observe Our Findings Properly
For full transparency and reproducibility, we encourage judges to dive into our raw work.
1.  Start by exploring the **"Evidence Locker"** and **"Project Links"** sections on the website.
2.  These sections contain direct links to our Jupyter Notebooks (`.ipynb` files) hosted on both **Google Colab** and **Kaggle**.
3.  These notebooks allow you to see our exact code, data sources, and analysis, allowing you to reproduce our findings step-by-step.

### 3. Our Methodology

Our workflow was divided into three distinct phases to ensure a process that was both broad in scope and deep in evidence.

- **Phase 1: Broad Area Survey (`C1_Notebook`)**
    - We systematically analyzed public Lidar and satellite imagery, using algorithmic detection to flag potential sites of interest.

- **Phase 2: Deep Dive Analysis (`C2_Notebook`)**
    - We focused on our most promising discovery (Anomaly #4), corroborating our findings with historical texts, academic papers, and known features of nearby sites like Kuhikugu.

- **Phase 3: AI-Powered Synthesis (`C3_Deliverable`)**
    - We utilized the OpenAI API to synthesize our complex findings into clear, citable narratives, which are presented interactively on our project website.

### 4. Tech Stack

- **Data Analysis & AI:** Python, Pandas, Matplotlib, Scikit-image, OpenAI API (GPT-4 Models)
- **Notebooks & Environment:** Jupyter Notebooks, Google Colab, Kaggle Notebooks
- **Website Frontend:** Next.js (React), TypeScript, Global CSS with CSS Variables
- **Deployment & Hosting:** Vercel
- **Version Control & Collaboration:** Git, GitHub, Google Drive
- **Presentation & Video:** Canva

### 5. For Developers: Running the Project Locally

To run the project website on your local machine, please follow these steps.

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/gastondana627/Team-Relic-Xingu-Challenge.git](https://github.com/gastondana627/Team-Relic-Xingu-Challenge.git)
    ```
2.  **Navigate to the website's directory:**
    ```bash
    cd Team-Relic-Xingu-Challenge/landing-page
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Run the development server:**
    ```bash
    npm run dev
    ```
5.  Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Team Members

- **GasMan:** Lead on Video Production, Documentation Consolidation, and Frontend (Website) Development.
- **Chisom:** Lead on Research, PDF Report Generation, and Final Document Review.