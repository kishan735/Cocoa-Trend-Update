import { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import type { ChatMessage, NewsItem, MarketFactor } from '../types';
import { generateChatResponse } from '../services/chatService';
import { useAppStore } from '../store';
import { format, parseISO } from 'date-fns';

interface ChatInterfaceProps {
  itemId: string;
  itemType: 'news' | 'factor' | 'overview';
  itemData: NewsItem | MarketFactor | null;
  initialContext: string;
}

export function ChatInterface({ itemId, itemType, itemData, initialContext }: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { chatMessages, addChatMessage } = useAppStore();
  const messages = chatMessages[itemId] || [];

  useEffect(() => {
    // Add initial context message if no messages exist
    if (messages.length === 0) {
      const initialMessage: ChatMessage = {
        id: `${itemId}-initial`,
        role: 'assistant',
        content: initialContext,
        timestamp: new Date().toISOString()
      };
      addChatMessage(itemId, initialMessage);
    }
  }, [itemId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `${itemId}-user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString()
    };

    addChatMessage(itemId, userMessage);
    setInput('');
    setIsLoading(true);

    try {
      const response = await generateChatResponse(itemType, itemData, userMessage.content);

      const assistantMessage: ChatMessage = {
        id: `${itemId}-assistant-${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString()
      };

      addChatMessage(itemId, assistantMessage);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: `${itemId}-error-${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString()
      };
      addChatMessage(itemId, errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedQuestions = itemType === 'news'
    ? ['How does this affect prices?', 'What should traders do?', 'Why is this happening?']
    : itemType === 'factor'
      ? ['Explain the price impact', 'Why does this matter?', 'How long will this last?']
      : ['What\'s the current trend?', 'Key factors to watch?', 'Market outlook?'];

  return (
    <div className="chat-interface">
      <div className="chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`chat-message ${msg.role}`}>
            <div className="message-content">
              {msg.content.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
            <span className="message-time">
              {format(parseISO(msg.timestamp), 'HH:mm')}
            </span>
          </div>
        ))}
        {isLoading && (
          <div className="chat-message assistant loading">
            <Loader2 className="spin" size={18} />
            <span>Analyzing...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {messages.length <= 1 && (
        <div className="suggested-questions">
          {suggestedQuestions.map((q, i) => (
            <button
              key={i}
              className="suggestion-btn"
              onClick={() => setInput(q)}
            >
              {q}
            </button>
          ))}
        </div>
      )}

      <div className="chat-input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask a question..."
          className="chat-input"
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className="send-btn"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
