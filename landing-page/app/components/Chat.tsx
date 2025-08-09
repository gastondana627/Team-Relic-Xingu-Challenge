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
<<<<<<< HEAD
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    const userMessage: Message = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');

    setMessages(prev => [...prev, { role: 'assistant', content: '...' }]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.body || !response.ok) {
        throw new Error(response.statusText);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiMessageContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        aiMessageContent += decoder.decode(value, { stream: true });
        
        setMessages(prev => {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage && lastMessage.role === 'assistant') {
            return [ ...prev.slice(0, -1), { ...lastMessage, content: aiMessageContent } ];
          }
          return prev;
        });
      }
    } catch (error) {
      console.error("Failed to get AI response:", error);
      setMessages(prev => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage && lastMessage.role === 'assistant') {
          return [ ...prev.slice(0, -1), { ...lastMessage, content: 'Sorry, an error occurred.' } ];
        }
        return prev;
      });
    } finally {
      setIsLoading(false);
    }
=======
    handleSubmit(e);
>>>>>>> final-submission
  };

  if (!hasMounted) {
    return null;
  }

  return (
    <div className="chat-container">
<<<<<<< HEAD
      <div className="chat-messages">
        {messages.map((m, index) => (
          <div key={index} className={`message-bubble ${m.role === 'user' ? 'user-bubble' : 'ai-bubble'}`}>
            <strong>{m.role === 'user' ? 'You: ' : 'Relic: '}</strong>
            {m.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
=======
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
>>>>>>> final-submission
      </div>
      
      {/* The onSubmit event is handled here */}
      <form onSubmit={customHandleSubmit} className="chat-form">
        <input
          className="chat-input"
          value={input}
<<<<<<< HEAD
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about our discoveries..."
          disabled={isLoading}
        />
        <button type="submit" className="chat-submit-button" disabled={isLoading}>
          {isLoading ? '...' : 'Send'}
=======
          placeholder="Ask about our discoveries..."
          onChange={handleInputChange}
        />
        <button
          type="submit"
          className="chat-submit-button"
          disabled={isLoading || !input.trim()}
        >
          Send
>>>>>>> final-submission
        </button>
      </form>
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> final-submission
