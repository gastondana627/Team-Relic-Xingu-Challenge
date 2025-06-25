import AnomalyCard from './components/AnomalyCard';
import EvidenceCard from './components/EvidenceCard';
import RulesAccordion from './components/RulesAccordion';
import TeamMemberCard from './components/TeamMemberCard';
import SmartFAQ from './components/SmartFAQ'; // Import the new component

const teamMembers = [
    {
        name: "GasMan",
        role: "Video, Documentation & Landing Page",
        imageUrl: "/assets/Gasman.jpg",
        headline: "Digital Storyteller & Frontend Developer",
        bio: "Passionate about weaving compelling narratives from complex data. Responsible for bringing Team Relic&apos;s discoveries to life through visual media and an interactive web experience.",
        socials: {
            github: "https://github.com/gastondana627",
            linkedin: "https://www.linkedin.com/in/gaston-d-859653184/",
        }
    },
    {
        name: "Chisom",
        role: "PDF Report & Document Review",
        imageUrl: "/assets/Chisom.jpg",
        headline: "Lead Researcher & Technical Writer",
        bio: "Focused on ensuring the accuracy, clarity, and impact of our findings. Translates raw data into a professional, evidence-based report ready for academic and expert review.",
        socials: {
            linkedin: "https://www.linkedin.com/in/chisom-aniekwensi/",
            twitter: "https://twitter.com/their-handle",
        }
    },
];

const anomalies = [
  {
    id: 1,
    title: "Anomaly #1: The Serpent Geoglyph",
    description: "A massive, winding earthwork suggesting a ceremonial path or symbolic representation.",
    image: "/assets/Anomaly 1 Basic Image.jpg",
    video: "/assets/Anomaly 1 Video of Area.mov",
  },
  {
    id: 2,
    title: "Anomaly #2: The Sunken Courtyards",
    description: "Geometrically aligned rectangular depressions, pointing to a potential communal plaza.",
    image: "/assets/Anomaly_2_Image_of_Area_1.jpg",
    video: "/assets/Anomaly 2 Video of Area.mov",
  },
  {
    id: 3,
    title: "Anomaly #3: The Ring Ditch",
    description: "A perfectly circular ditch, indicative of a fortified village, consistent with known settlements.",
    image: "/assets/Anomaly_3_Image_of_Area_1.jpg",
    video: "/assets/Anomaly 3 Video of Area.mov",
  },
  {
    id: 4,
    title: "Anomaly #4: The Terrace Settlement",
    description: "Our primary discovery: an extensive network of terraces suggesting a complex agricultural society.",
    image: "/assets/Anomaly_4_Image_of_Area_1.jpg",
    video: "/assets/Anomaly 4 Video of Area.mov",
  },
  {
    id: 5,
    title: "Anomaly #5: The Causeway Remnant",
    description: "A linear feature identified through Lidar, likely a raised road connecting points of interest.",
    image: "/assets/Anomaly_5_Image_of_Area_1.jpg",
    video: "/assets/Anomaly 5 Video of Area.mov",
  },
];

export default function HomePage() {
  return (
    <div className="container">
      {/* Section 1: Hero */}
      <header className="hero">
        <video className="hero-video" autoPlay loop muted playsInline>
          <source src="/assets/Relic_Animation_1.mp4" type="video/mp4" />
        </video>
        <div className="hero-content">
          <h1>Team Relic</h1>
          <p className="subtitle">Unveiling the Lost Histories of the Amazon</p>
          <a href="#expedition" className="cta-button">Begin the Expedition</a>
        </div>
      </header>

      <main>
        {/* Section 2: Anomaly Showcase */}
        <section id="expedition" className="expedition-section">
          <h2>The Expedition Log</h2>
          <p className="section-intro">Our team of digital explorers has analyzed vast open-source datasets to uncover five significant anomalies. Each discovery below is a potential piece of a lost civilization's story, verified through multiple analytical methods and powered by OpenAI.</p>
          <div className="anomaly-grid">
            {anomalies.map((anomaly) => <AnomalyCard key={anomaly.id} anomaly={anomaly} />)}
          </div>
        </section>

        {/* Section 3: Evidence Locker */}
        <section id="evidence" className="evidence-section">
          <h2>The Evidence Locker</h2>
          <p className="section-intro">Reproducibility and transparency are core to our findings. Here, we present the methodology, code, and AI-driven analysis that form the foundation of our discoveries.</p>
          <div className="evidence-grid">
            <EvidenceCard title="Notebook 1: Broad Discovery Log" description="This notebook details our initial exploration, custom analysis toolkit, and the process of identifying all five anomalies. It&apos;s the story of our search." link="https://colab.research.google.com/drive/1jbDHWSLOBPMTQ9Rhr5pqWmUacelB3dsg?usp=sharing" buttonText="View C1 Discovery Log" />
            <EvidenceCard title="Notebook 2: Deep Dive Analysis" description="Our deep dive into Anomaly #4, detailing algorithmic detection, AI-powered historical synthesis, and comparative analysis against Kuhikugu." link="https://colab.research.google.com/drive/1B6gPASgZ9gpkcJQrnvRm3xL2XrIczszl?usp=sharing" buttonText="Explore C2 Deep Dive" />
            <EvidenceCard title="AI-Powered Historical Synthesis" description="We leveraged OpenAI's models to analyze academic texts, colonial diaries, and oral histories, creating a &quot;Research Dossier&quot; for our findings." link="https://www.kaggle.com/code/gastondana/c2-discovery-notebook-ipynb" buttonText="See AI in Action" />
          </div>
        </section>

        {/* This is the new AI Insights section */}
        <section id="ai-insights" className="ai-insights-section">
          <h2>AI-Powered Insights (Checkpoint 3)</h2>
          <p className="section-intro">
            This interactive tool demonstrates our project&apos;s ability to generate deep insights. Select a prompt below to reveal AI-generated answers based on our curated research data.
          </p>
          <SmartFAQ />
        </section>
        
        {/* Section 4: Project Timeline */}
        <section id="timeline" className="timeline-section">
            <h2>Our 3-Day Sprint to Victory</h2>
            <p className="section-intro">A clear plan and parallel execution were key to our success.</p>
            <div className="timeline">
                <div className="timeline-item">
                    <div className="timeline-content">
                        <h3>Day 1: Finalize Content</h3>
                        <p>✅ GasMan: Complete documentation and video structure.</p>
                        <p>✅ Chisom: Complete first draft of the two-page PDF.</p>
                        <p>✅ All: Record and share 1-minute anomaly explanation videos.</p>
                    </div>
                </div>
                <div className="timeline-item">
                    <div className="timeline-content">
                        <h3>Day 2: Assemble & Integrate</h3>
                        <p>✅ GasMan: Integrate team videos, add music, and export final video.</p>
                        <p>✅ Chisom: Review all documents for clarity and grammar.</p>
                        <p>✅ Team: Begin building landing page with final content.</p>
                    </div>
                </div>
                <div className="timeline-item">
                    <div className="timeline-content">
                        <h3>Day 3: Review & Submit</h3>
                        <p>✅ Team: Final review of all components (PDF, video, notebooks, repo, landing page).</p>
                        <p>✅ Final `git push`.</p>
                        <p>✅ Submit project with confidence.</p>
                    </div>
                </div>
            </div>
        </section>

        {/* Section 5: Meet The Team */}
        <section id="team" className="team-section">
            <h2>Meet The Digital Explorers</h2>
            <div className="team-grid">
                {teamMembers.map((member) => <TeamMemberCard key={member.name} {...member} />)}
            </div>
        </section>

        {/* Section 6: Competition & Rules */}
        <section id="rules" className="rules-section">
            <h2>Competition Compliance</h2>
            <RulesAccordion title="Mission & Judging Criteria">
                <p><strong>Mission:</strong> To use OpenAI models and open data to discover new archaeological sites in the Amazon.</p>
                <p><strong>Submissions are scored on:</strong> Archaeological Impact, Evidence Depth, Clarity, Reproducibility, Novelty, and Presentation Craft.</p>
            </RulesAccordion>
            <RulesAccordion title="Official Hackathon Rules">
                <p>Our project fully complies with all rules, including team size, data usage, licensing (CC0), and the use of OpenAI models. Full rules are on the <a href="https://www.kaggle.com/competitions/openai-to-z-challenge/rules" target="_blank" rel="noopener noreferrer">official Kaggle page</a>.</p>
            </RulesAccordion>
        </section>

        {/* Project Links Section */}
        <section id="links" className="project-links-section">
          <h2>Project Links & Repository</h2>
          <div className="links-grid">
            <div className="link-category">
              <h3>Checkpoint 1</h3>
              <a href="https://www.kaggle.com/code/gastondana/c1-team-relic-professional-notebook-ipynb" target="_blank" rel="noopener noreferrer">View on Kaggle</a>
              <a href="https://colab.research.google.com/drive/1jbDHWSLOBPMTQ9Rhr5pqWmUacelB3dsg?usp=sharing" target="_blank" rel="noopener noreferrer">Open in Colab</a>
            </div>
            <div className="link-category">
              <h3>Checkpoint 2</h3>
              <a href="https://www.kaggle.com/code/gastondana/c2-discovery-notebook-ipynb" target="_blank" rel="noopener noreferrer">View on Kaggle</a>
              <a href="https://colab.research.google.com/drive/1B6gPASgZ9gpkcJQrnvRm3xL2XrIczszl?usp=sharing" target="_blank" rel="noopener noreferrer">Open in Colab</a>
            </div>
            <div className="link-category">
              <h3>Relic Project</h3>
              <a href="https://github.com/gastondana627" target="_blank" rel="noopener noreferrer">View on GitHub</a>
            </div>
          </div>
        </section>

      </main>

      <footer className="footer">
        <p>&copy; 2025 Team Relic - OpenAI to Z Challenge</p>
        <a href="https://github.com/gastondana627" target="_blank" rel="noopener noreferrer">View on GitHub</a>
      </footer>
    </div>
  );
}