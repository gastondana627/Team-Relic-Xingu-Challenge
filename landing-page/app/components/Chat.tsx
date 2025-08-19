// app/components/Chat.tsx
'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  imageUrl?: string;
  videoUrl?: string;
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
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [selectedAnomaly, setSelectedAnomaly] = useState<string>("");
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
            if (data.trim() === '[DONE]') break;
            try {
              const parsed = JSON.parse(data);
              const textChunk = parsed.choices[0]?.delta?.content || '';
              if (textChunk) {
                setMessages(prev => prev.map(msg => 
                  msg.id === assistantMessageId ? { ...msg, content: msg.content + textChunk } : msg
                ));
              }
            } catch (error) {}
          }
        }
      }

    } catch (error) {
      console.error("Chat submission error:", error);
      setMessages(prev => [...prev, { id: `error-${Date.now()}`, role: 'assistant', content: 'Sorry, an error occurred.' }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGenerateImage = async () => {
    if (!selectedAnomaly) return;
    setIsGeneratingImage(true);
    try {
      const response = await fetch('/api/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ anomaly: selectedAnomaly }),
      });
      const result = await response.json();
      
      if (result.imageUrl && result.caption) {
        const imageMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: '',
          imageUrl: result.imageUrl,
        };
        setMessages(prev => [...prev, imageMessage]);

        setTimeout(() => {
          const captionMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: result.caption,
          };
          setMessages(prev => [...prev, captionMessage]);
        }, 750);

      } else {
        throw new Error(result.error || 'Failed to generate image.');
      }
    } catch (error) {
      console.error("Image generation error:", error);
      setMessages(prev => [...prev, { id: `error-img-${Date.now()}`, role: 'assistant', content: 'Sorry, I was unable to generate that visualization.' }]);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleGenerateVideo = async () => {
    if (!selectedAnomaly) return;
    setIsGeneratingVideo(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      throw new Error("Video generation is under construction.");
    } catch (error) {
      console.error("Video generation error:", error);
      setMessages(prev => [...prev, { id: `error-vid-${Date.now()}`, role: 'assistant', content: 'Sorry, the video generation feature is under construction.' }]);
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  return (
    <>
      <style jsx>{`
        .chat-flex-container {
          display: flex;
          flex-direction: column;
          height: 85vh; 
          max-height: 800px;
        }
        .chat-messages-flex {
          flex-grow: 1;
          overflow-y: auto;
          min-height: 0;
        }
        .chat-input-area {
          flex-shrink: 0;
        }
        @media (min-width: 768px) {
          .chat-flex-container {
            height: auto;
            max-height: none;
          }
        }
      `}</style>
      
      <div className="chat-container chat-flex-container">
        {/* Scrollable message area with spacing + padding bottom */}
        <div className="chat-messages chat-messages-flex p-4 space-y-4 pb-24">
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
            <div 
              key={m.id} 
              className={`message-bubble ${m.role === 'user' ? 'user-bubble' : 'ai-bubble'} 
              ${m.imageUrl && !m.content ? 'image-only' : ''} 
              max-w-[85%] break-words whitespace-pre-wrap`}
            >
              {m.content && (
                <p>
                  <strong>{m.role === 'user' ? 'You: ' : 'Relic: '}</strong>
                  {m.content}
                </p>
              )}
              {m.imageUrl && (
                <div className={m.content ? "mt-2" : ""}>
                  <img src={m.imageUrl} alt="Generated art of an anomaly" className="chat-image rounded-xl shadow" />
                </div>
              )}
              {m.videoUrl && (
                <div className="mt-2">
                  <video src={m.videoUrl} controls autoPlay muted loop className="chat-video rounded-xl shadow" />
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-area">
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
              disabled={isLoading || isGeneratingImage || isGeneratingVideo || !input?.trim()}
            >
              {isLoading ? '...' : 'Send'}
            </button>
          </form>
          <div className="chat-actions flex flex-col md:flex-row items-center justify-center gap-4 mt-4">
            <div className="anomaly-generator flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
              <select 
                className="anomaly-select w-full sm:w-auto" 
                value={selectedAnomaly}
                onChange={(e) => setSelectedAnomaly(e.target.value)}
                disabled={isGeneratingImage || isGeneratingVideo}
              >
                <option value="" disabled>Select an anomaly to visualize...</option>
                {anomalies.map(name => <option key={name} value={name}>{name}</option>)}
              </select>
              <button 
                onClick={handleGenerateImage} 
                className="image-gen-button w-full sm:w-auto"
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
      </div>
    </>
  );
}