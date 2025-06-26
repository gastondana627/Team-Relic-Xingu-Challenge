// landing-page/app/components/Chat.tsx
"use client";

import { useState, FormEvent, useEffect, useRef } from 'react';
import Image from 'next/image'; // Import the Next.js Image component

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: newMessages }),
    });

    if (!response.body) return;

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let aiMessageContent = '';
    
    setMessages(prev => [...prev, { role: 'assistant', content: '...' }]);

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      aiMessageContent += decoder.decode(value, { stream: true });
      
      setMessages(prev => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage && lastMessage.role === 'assistant') {
          return [
            ...prev.slice(0, -1),
            { ...lastMessage, content: aiMessageContent }
          ];
        }
        return prev;
      });
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((m, index) => {
          // --- THIS IS THE NEW LOGIC ---
          // Check if the message content is an image tag
          if (m.role === 'assistant' && m.content.startsWith('[IMAGE:')) {
            const imageUrl = m.content.replace('[IMAGE:', '').replace(']', '').trim();
            return (
              <div key={index} className="message-bubble ai-bubble image-bubble">
                <Image src={imageUrl} alt="Anomaly Image" width={400} height={250} className="chat-image" />
              </div>
            );
          }

          // Otherwise, render the normal text bubble
          return (
            <div key={index} className={`message-bubble ${m.role === 'user' ? 'user-bubble' : 'ai-bubble'}`}>
              <strong>{m.role === 'user' ? 'You: ' : 'Relic: '}</strong>
              {m.content}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="chat-form">
        <input
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about our discoveries... or to see an anomaly!"
        />
        <button type="submit" className="chat-submit-button">Send</button>
      </form>
    </div>
  );
}


