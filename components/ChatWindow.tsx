import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { MessageBubble } from './MessageBubble';
import { LoadingSpinner } from './LoadingSpinner';
import { SendIcon } from './IconComponents';

interface ChatWindowProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const QuickActionButton: React.FC<{ text: string; onClick: () => void }> = ({ text, onClick }) => (
    <button
      onClick={onClick}
      className="bg-blue-500/10 hover:bg-blue-500/20 dark:bg-blue-400/10 dark:hover:bg-blue-400/20 text-blue-600 dark:text-blue-300 border border-blue-500/30 dark:border-blue-400/30 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200"
    >
      {text}
    </button>
);


export const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };
  
  const handleQuickAction = (text: string) => {
      onSendMessage(text);
  }

  return (
    <div className="w-full h-full flex flex-col bg-white/50 dark:bg-gray-800/50 rounded-lg border border-blue-400/20 shadow-2xl backdrop-blur-xl">
      <div className="flex-grow p-6 overflow-y-auto space-y-6">
        {messages.map((msg, index) => (
          <div key={index}>
            <MessageBubble message={msg} />
            {msg.quickActions && !isLoading && (
                 <div className="flex items-center gap-2 mt-3 ml-14 flex-wrap">
                    {msg.quickActions.map((action, i) => (
                        <QuickActionButton key={i} text={action} onClick={() => handleQuickAction(action)} />
                    ))}
                 </div>
            )}
          </div>
        ))}
        {isLoading && messages[messages.length - 1]?.role !== 'model' && (
           <MessageBubble message={{role: 'model', parts: [{text: ''}]}} isLoading={true} />
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-white/50 dark:bg-gray-900/50 border-t border-blue-400/20">
        <form onSubmit={handleSend} className="flex items-center space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu consulta aquí..."
            className="flex-grow bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 rounded-full py-3 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition duration-300 font-roboto-mono"
            disabled={isLoading}
            aria-label="Chat input"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white rounded-full p-3 hover:bg-blue-500 disabled:bg-gray-500 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900 transform hover:scale-110"
            aria-label="Send message"
          >
            {isLoading ? <LoadingSpinner /> : <SendIcon className="h-6 w-6" />}
          </button>
        </form>
      </div>
    </div>
  );
};