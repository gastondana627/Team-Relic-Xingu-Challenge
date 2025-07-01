"use client";

import { useChat } from 'ai/react'; // Import the official hook

export default function Chat() {
  // The useChat hook handles all the complex logic for you:
  // - Managing the message history
  // - Handling user input
  // - Sending the form data to your API
  // - Decoding the streaming response correctly
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map(m => (
          <div key={m.id} className={`message-bubble ${m.role === 'user' ? 'user-bubble' : 'ai-bubble'}`}>
            <strong>{m.role === 'user' ? 'You: ' : 'Relic: '}</strong>
            {m.content}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="chat-form">
        <input
          className="chat-input"
          value={input}
          onChange={handleInputChange}
          placeholder="Ask about our discoveries..."
          disabled={isLoading}
        />
        <button type="submit" className="chat-submit-button" disabled={isLoading}>
          {isLoading ? '...' : 'Send'}
        </button>
      </form>
    </div>
  );
}
