// app/components/Chat.tsx
'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

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

export default function Chat({ onNewHighlight }: { onNewHighlight: (nodes: string[]) => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement> | string) => {
    if (typeof e !== 'string') e.preventDefault();
    const userMessageContent = typeof e === 'string' ? e : input;
    if (!userMessageContent.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: userMessageContent };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    onNewHighlight([]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      const highlightedNodesJson = response.headers.get('X-Highlighted-Nodes');
      if (highlightedNodesJson) {
        const nodes = JSON.parse(highlightedNodesJson);
        onNewHighlight(nodes);
        setTimeout(() => onNewHighlight([]), 5000);
      }

      if (!response.body) throw new Error('The response body is empty.');
      
      const assistantMessageId = Date.now().toString() + '-ai';
      setMessages(prev => [...prev, { id: assistantMessageId, role: 'assistant', content: '' }]);

      // THE FIX: This modern, dependency-free stream parser is robust for production.
      const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
      let buffer = '';
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        buffer += value;
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.substring(6);
            if (data.trim() === '[DONE]') {
              break;
            }
            try {
              const parsed = JSON.parse(data);
              const textChunk = parsed.choices[0]?.delta?.content || '';
              if (textChunk) {
                setMessages(prev => prev.map(msg => 
                  msg.id === assistantMessageId ? { ...msg, content: msg.content + textChunk } : msg
                ));
              }
            } catch (error) {
              // Ignore malformed JSON chunks
            }
          }
        }
      }

    } catch (error) {
      console.error("Chat submission error:", error);
      setMessages(prev => [...prev, { id: 'error', role: 'assistant', content: 'Sorry, an error occurred.' }]);
    } finally {
      setIsLoading(false);
    }
  };
  
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
        {messages.length === 0 && !isLoading && (
          <div className="starters-container">
            <h4 className="starters-title">Start a Conversation</h4>
            {conversationStarters.map((starter, index) => (
              <button 
                key={index} 
                className="starter-button"
                onClick={() => handleSubmit(starter.text)}
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
          onChange={(e) => setInput(e.target.value)}
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