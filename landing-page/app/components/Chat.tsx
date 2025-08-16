'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { Message } from 'ai/react';

interface ChatProps {
  messages: Message[];
  input: string;
  isLoading: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  append: (message: Message) => void;
  anomalies: string[];
}

const conversationStarters = [
  { text: "Tell me about the most significant anomaly." },
  { text: "Who is on Team Relic?" },
  { text: "What was the mission of this project?" }
];

export default function Chat({ messages, input, isLoading, handleInputChange, handleSubmit, append, anomalies }: ChatProps) {
  // PRESERVED: State for image and video generation remains fully intact.
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [selectedAnomaly, setSelectedAnomaly] = useState<string>("");
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoStatus, setVideoStatus] = useState<string | null>(null);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, generatedImageUrl, generatedVideoUrl]);

  // THE FIX: The handler now creates a complete Message object with a unique 'id'.
  const handleStarterClick = (text: string) => {
    append({
      id: Date.now().toString(),
      role: 'user',
      content: text
    });
  };
  
  // PRESERVED: Your full, original image generation logic.
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

  // PRESERVED: Your full, original video generation logic.
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

  // PRESERVED: Your full, original UI and JSX structure.
  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.length === 0 && !isLoading && (
          <div className="starters-container">
            <h4 className="starters-title">Start a Conversation</h4>
            {conversationStarters.map((starter, index) => (
              <button 
                key={index} 
                className="starter-button"
                onClick={() => handleStarterClick(starter.text)}
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
          disabled={isLoading || isGeneratingImage || isGeneratingVideo}
        />
        <button
          type="submit"
          className="chat-submit-button"
          disabled={isLoading || isGeneratingImage || isGeneratingVideo || !input.trim()}
        >
          {isLoading ? '...' : 'Send'}
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
