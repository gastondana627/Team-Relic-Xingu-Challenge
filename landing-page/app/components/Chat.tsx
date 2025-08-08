'use client';

import { useChat } from 'ai/react';
import { FormEvent, useEffect, useRef, useState } from 'react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();
  const [hasMounted, setHasMounted] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // This is the updated function
  const customHandleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(e);
  };

  if (!hasMounted) {
    return null;
  }

  return (
    <div className="chat-container">
      <div ref={chatContainerRef} className="chat-messages">
        {messages.map(m => (
          <div
            key={m.id}
            className={m.role === 'user' ? 'user-bubble message-bubble' : 'ai-bubble message-bubble'}
          >
            <strong>{m.role === 'user' ? 'You:' : 'Relic:'}</strong>
            <p>{m.content}</p>
          </div>
        ))}
        {isLoading && (
          <div className="ai-bubble message-bubble">
            <strong>Relic:</strong>
            <div className="flex items-center space-x-2 pt-2">
              <span className="h-2 w-2 bg-[#c7a44a] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="h-2 w-2 bg-[#c7a44a] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="h-2 w-2 bg-[#c7a44a] rounded-full animate-bounce"></span>
            </div>
          </div>
        )}
      </div>
      
      {/* The onSubmit event is handled here */}
      <form onSubmit={customHandleSubmit} className="chat-form">
        <input
          className="chat-input"
          value={input}
          placeholder="Ask about our discoveries..."
          onChange={handleInputChange}
        />
        <button
          type="submit"
          className="chat-submit-button"
          disabled={isLoading || !input.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
}
