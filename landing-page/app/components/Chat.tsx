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

  const customHandleSubmit = (e: FormEvent<HTMLFormElement>) => {
    handleSubmit(e);
  };

  if (!hasMounted) {
    return null;
  }

  return (
    // This container uses your custom CSS class now
    <div className="chat-container">
      
      <div ref={chatContainerRef} className="chat-messages">
        {messages.length > 0 ? (
          messages.map(m => (
            <div
              key={m.id}
              // This logic correctly places the bubbles
              className={m.role === 'user' ? 'user-bubble message-bubble' : 'ai-bubble message-bubble'}
            >
              <strong>{m.role === 'user' ? 'You' : 'Relic'}</strong>
              <p>{m.content}</p>
            </div>
          ))
        ) : (
          <div className="text-center text-[#a8a192] flex flex-col justify-center items-center h-full">
             {/* Welcome message appears here */}
          </div>
        )}
        {isLoading && (
          <div className="ai-bubble">
            <strong>Relic</strong>
            <div className="flex items-center space-x-2 pt-2">
              <span className="h-2 w-2 bg-[#c7a44a] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="h-2 w-2 bg-[#c7a44a] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="h-2 w-2 bg-[#c7a44a] rounded-full animate-bounce"></span>
            </div>
          </div>
        )}
      </div>

      {/* This form and its children now use your custom CSS classes */}
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
