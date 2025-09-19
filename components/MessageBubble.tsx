import React from 'react';
import { ChatMessage } from '../types';
import { UserIcon, BotIcon } from './IconComponents';

interface MessageBubbleProps {
  message: ChatMessage;
  isLoading?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isLoading }) => {
  const isUser = message.role === 'user';
  const textContent = message.parts[0].text;

  const formattedText = textContent
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>');

  return (
    <div className={`flex items-start gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg">
          <BotIcon className="w-6 h-6 text-white" />
        </div>
      )}
      <div
        className={`max-w-xl px-5 py-3 rounded-2xl shadow-md font-roboto-mono text-sm leading-relaxed transition-colors duration-300 ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'
        }`}
      >
        {isLoading && !textContent ? (
            <div className="flex items-center justify-center space-x-1">
                <span className="w-2 h-2 bg-blue-400 dark:bg-blue-300 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                <span className="w-2 h-2 bg-blue-400 dark:bg-blue-300 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                <span className="w-2 h-2 bg-blue-400 dark:bg-blue-300 rounded-full animate-pulse"></span>
            </div>
        ) : (
          <p className="prose prose-sm dark:prose-invert" dangerouslySetInnerHTML={{ __html: formattedText }} />
        )}
      </div>
       {isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center shadow-lg">
          <UserIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        </div>
      )}
    </div>
  );
};
