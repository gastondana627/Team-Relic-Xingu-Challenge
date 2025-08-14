'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { Message, ChatRequestOptions } from 'ai/react'; // Use types from the library

// This component now defines the props it expects to receive from its parent.
type ChatProps = {
  messages: Message[];
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>, chatRequestOptions?: ChatRequestOptions | undefined) => void;
  // We also need the 'append' function for the conversation starters
  append: (message: Message | Omit<Message, 'id'>) => Promise<string | null | undefined>;
};

export default function Chat({ messages, input, handleInputChange, handleSubmit, append }: ChatProps) {
  // --- START: Internal State for Image/Video Features ---
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [selectedAnomaly, setSelectedAnomaly] = useState<string>("");
  
  // Video generation state is kept for future implementation
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoStatus, setVideoStatus] = useState<string | null>(null);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  // --- END: Internal State ---

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const anomalies = [
    "The Strategic Upland Plateau",
    "The Network of Secondary Outposts",
    "The Elevated Travel Corridor",
    "The Terrace Settlement",
    "The Artificial Shoreline"
  ];

  const conversationStarters = [
    { text: "Tell me about the most significant anomaly." },
    { text: "Who is on Team Relic?" },
    { text: "What was the mission of this project?" }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, generatedImageUrl, generatedVideoUrl]);
  
  // This function remains self-contained within the Chat component
  const handleGenerateImage = async () => {
    if (!selectedAnomaly) return;
    setIsGeneratingImage(true);
    setGeneratedImageUrl(null);
    try {
      const response = await fetch('/api/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ anomaly: selectedAnomaly }),
      });
      const result = await response.json();
      if (result.imageUrl) {
        setGeneratedImageUrl(result.imageUrl);
      } else {
        throw new Error(result.error || 'Failed to generate image.');
      }
    } catch (error) {
      console.error("Image generation error:", error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // This function is also kept for future use
  const handleGenerateVideo = async () => {
    setIsGeneratingVideo(true);
    setVideoStatus("Sending request to generate a video of a random anomaly...");
    setGeneratedVideoUrl(null);

    try {
      const startResponse = await fetch('/api/video/start', { method: 'POST' });
      const { jobId } = await startResponse.json();
      if (!jobId) throw new Error('Failed to start video generation job.');

      setVideoStatus("Video generation in progress... This can take a few minutes. Checking status...");

      const intervalId = setInterval(async () => {
        const statusResponse = await fetch(`/api/video/status?jobId=${jobId}`);
        const { status, videoUrl } = await statusResponse.json();
        setVideoStatus(`Job status: ${status}...`);
        if (status === 'complete') {
          clearInterval(intervalId);
          setGeneratedVideoUrl(videoUrl);
          setVideoStatus(null);
          setIsGeneratingVideo(false);
        } else if (status === 'failed') {
          clearInterval(intervalId);
          throw new Error('Video generation failed.');
        }
      }, 10000);
    } catch (error) {
      console.error("Video generation error:", error);
      setVideoStatus("Sorry, an error occurred while generating the video.");
      setIsGeneratingVideo(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="starters-container">
            <h4 className="starters-title">Start a Conversation</h4>
            {conversationStarters.map((starter, index) => (
              <button 
                key={index} 
                className="starter-button"
                // **THE FIX**: Use the 'append' function for conversation starters
                onClick={() => append({ role: 'user', content: starter.text })}
              >
                {starter.text}
              </button>
            ))}
          </div>
        )}
        {messages.map((m) => (
          <div key={m.id} className={`message-bubble ${m.role === 'user' ? 'user-bubble' : 'ai-bubble'}`}>
            <strong>{m.role === 'user' ? 'You: ' : 'Relic: '}</strong>
            {m.content}
          </div>
        ))}
        {generatedImageUrl && (
          <div className="message-bubble ai-bubble image-bubble">
            <img src={generatedImageUrl} alt="Generated art of an anomaly" className="chat-image" />
          </div>
        )}
        {videoStatus && (
          <div className="message-bubble ai-bubble status-bubble">
            <p>{videoStatus}</p>
          </div>
        )}
        {generatedVideoUrl && (
          <div className="message-bubble ai-bubble video-bubble">
            <video src={generatedVideoUrl} controls autoPlay muted loop className="chat-video" />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="chat-form">
        <input
          className="chat-input"
          value={input}
          onChange={handleInputChange}
          placeholder="Ask about our discoveries..."
          disabled={isGeneratingImage || isGeneratingVideo}
        />
        <button
          type="submit"
          className="chat-submit-button"
          disabled={isGeneratingImage || isGeneratingVideo || !input.trim()}
        >
          Send
        </button>
      </form>
      <div className="chat-actions">
        <div className="anomaly-generator">
          <select 
            className="anomaly-select" 
            value={selectedAnomaly}
            onChange={(e) => setSelectedAnomaly(e.target.value)}
            disabled={isGeneratingImage || isGeneratingVideo}
          >
            <option value="" disabled>Select an anomaly to visualize...</option>
            {anomalies.map(name => <option key={name} value={name}>{name}</option>)}
          </select>
          <button 
            onClick={handleGenerateImage} 
            className="image-gen-button"
            disabled={isGeneratingImage || isGeneratingVideo || !selectedAnomaly}
          >
            {isGeneratingImage ? 'Generating...' : 'Generate Visualization'}
          </button>
        </div>
        <div className="coming-soon-wrapper">
          <button className="image-gen-button" disabled>Generate Anomaly Video</button>
          <span className="coming-soon-overlay">Coming Soon</span>
        </div>
      </div>
    </div>
  );
}
