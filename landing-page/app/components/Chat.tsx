'use client';

import { useChat } from '@ai-sdk/react';
import { useEffect, useRef, useState } from 'react';

export default function Chat() {
  const { messages, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
  });

  const [localInput, setLocalInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`message-bubble ${
              m.role === 'user' ? 'user-bubble' : 'ai-bubble'
            }`}
          >
            <strong>{m.role === 'user' ? 'You: ' : 'Relic: '}</strong>
            {m.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(localInput);
          setLocalInput('');
        }}
        className="chat-form"
      >
        <input
          className="chat-input"
          value={localInput}
          onChange={(e) => setLocalInput(e.target.value)}
          placeholder="Ask about our discoveries..."
          disabled={isLoading}
        />
        <button
          type="submit"
          className="chat-submit-button"
          disabled={isLoading || !localInput.trim()}
        >
          {isLoading ? '...' : 'Send'}
        </button>
      </form>
    </div>
  );
}