"use client"; // This is a client component because it uses interactive state

import { useState } from 'react';

// This is where you will put your actual C3 prompts and the AI-generated answers
// I've included the examples we discussed.
const faqData = [
  {
    prompt: "What is the significance of Anomaly #4?",
    answer: "Anomaly #4, identified as a Terrace Settlement, is highly significant as it points to a large-scale, complex agricultural society previously unknown in this region. Its structure, including extensive earthworks and potential mound clusters, suggests a population density and social organization comparable to the known Kuhikugu settlements, challenging previous assumptions about the Amazon's historical landscape."
  },
  {
    prompt: "How does this project use AI to generate insights?",
    answer: "This project leverages Large Language Models (LLMs) in a process called Retrieval-Augmented Generation (RAG). We feed the AI our curated research data—including academic papers, Lidar scans, and historical texts. The AI then uses this specific context to analyze findings and generate citable, evidence-based paragraphs, transforming raw data into historical narrative."
  },
  {
    prompt: "Summarize the primary discovery of Team Relic.",
    answer: "Team Relic's primary discovery is a series of five interconnected anomalies deep within the Xingu Basin, culminating in the identification of Anomaly #4. This site, a sprawling Terrace Settlement, presents irrefutable evidence of a sophisticated pre-Columbian civilization capable of large-scale land alteration, likely forming a missing link in the network of settlements that includes the legendary 'Lost City of Z' or Kuhikugu."
  }
];

export default function SmartFAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0); // Default to showing the first answer

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="smart-faq-container">
      <div className="prompt-buttons">
        {faqData.map((item, index) => (
          <button
            key={index}
            className={`prompt-button ${activeIndex === index ? 'active' : ''}`}
            onClick={() => toggleFAQ(index)}
          >
            {item.prompt}
          </button>
        ))}
      </div>
      <div className="answer-panel">
        {activeIndex !== null && <p>{faqData[activeIndex].answer}</p>}
      </div>
    </div>
  );
}