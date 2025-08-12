// app/components/Chat.tsx

'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';

// Define the shape of a message object
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

// Define the list of anomalies for the dropdown
const anomalies = [
  "The Strategic Upland Plateau",
  "The Network of Secondary Outposts",
  "The Elevated Travel Corridor",
  "The Terrace Settlement",
  "The Artificial Shoreline"
];

// Define the conversation starter prompts
const conversationStarters = [
  { text: "Tell me about the most significant anomaly." },
  { text: "Who is on Team Relic?" },
  { text: "What was the mission of this project?" }
];

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [lastImagePrompt, setLastImagePrompt] = useState<string | null>(null);

  const [selectedAnomaly, setSelectedAnomaly] = useState<string>("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, generatedImageUrl]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement> | string) => {
    // Allow submitting directly with a string for starters
    if (typeof e !== 'string') {
      e.preventDefault();
    }
    
    const userMessageContent = typeof e === 'string' ? e : input;
    if (!userMessageContent.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: userMessageContent };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: newMessages,
          imageContext: lastImagePrompt
        }),
      });
      setLastImagePrompt(null);
      if (!response.body) throw new Error('The response body is empty.');
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      const assistantMessageId = Date.now().toString() + '-ai';

      setMessages(prev => [...prev, { id: assistantMessageId, role: 'assistant', content: '' }]);

      // --- START: ROBUST STREAM PARSING LOGIC ---
      let buffer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep the last, possibly incomplete line in the buffer

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
              // This can happen with incomplete JSON chunks, which is normal.
              // We'll just wait for the next chunk to complete it.
            }
          }
        }
      }
      // --- END: ROBUST STREAM PARSING LOGIC ---

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
      if (result.imageUrl && result.prompt) {
        setGeneratedImageUrl(result.imageUrl);
        setLastImagePrompt(result.prompt);
      } else {
        throw new Error(result.error || 'Failed to generate image.');
      }
    } catch (error) {
      console.error("Image generation error:", error);
      const errorMessage: Message = { id: 'image-error', role: 'assistant', content: 'Sorry, I was unable to generate the image.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {/* --- Conversation Starters UI --- */}
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
        {/* --- End Conversation Starters UI --- */}

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
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="chat-form">
        <input
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about our discoveries..."
          disabled={isLoading || isGeneratingImage}
        />
        <button
          type="submit"
          className="chat-submit-button"
          disabled={isLoading || isGeneratingImage || !input.trim()}
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
            disabled={isGeneratingImage || isLoading}
          >
            <option value="" disabled>Select an anomaly to visualize...</option>
            {anomalies.map(name => <option key={name} value={name}>{name}</option>)}
          </select>
          <button 
            onClick={handleGenerateImage} 
            className="image-gen-button"
            disabled={isGeneratingImage || isLoading || !selectedAnomaly}
          >
            {isGeneratingImage ? 'Generating...' : 'Generate Visualization'}
          </button>
        </div>
        <div className="coming-soon-wrapper">
          <button 
            className="image-gen-button"
            disabled
          >
            Generate Anomaly Video
          </button>
          <span className="coming-soon-overlay">Coming Soon</span>
        </div>
      </div>
    </div>
  );
}