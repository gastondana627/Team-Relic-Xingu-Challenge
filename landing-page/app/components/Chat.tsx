'use client';

import { useChat } from 'ai/react';
import { useEffect, useRef } from 'react';

export default function Chat() {
  // All the state management you need comes directly from the hook
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // This effect correctly handles auto-scrolling to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map(m => (
          // Use the message ID as the key for better performance
          <div key={m.id} className={`message-bubble ${m.role === 'user' ? 'user-bubble' : 'ai-bubble'}`}>
            <strong>{m.role === 'user' ? 'You: ' : 'Relic: '}</strong>
            {m.content}
          </div>
        ))}
        {/* This empty div is the target for the auto-scroller ref */}
        <div ref={messagesEndRef} />
      </div>

      {/* By using the hook's handleSubmit and handleInputChange, 
        you get all the functionality (API calls, streaming, state updates) for free.
      */}
      <form onSubmit={handleSubmit} className="chat-form">
        <input
          className="chat-input"
          value={input}
          onChange={handleInputChange} // Use the handler from the hook
          placeholder="Ask about our discoveries..."
          disabled={isLoading}
        />
        <button type="submit" className="chat-submit-button" disabled={isLoading || !input.trim()}>
          {isLoading ? '...' : 'Send'}
        </button>
      </form>
    </div>
  );
}