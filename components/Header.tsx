import React from 'react';
import { TurbineIcon, SunIcon, MoonIcon, ClearIcon } from './IconComponents';

interface HeaderProps {
    onClearChat: () => void;
    onToggleTheme: () => void;
    currentTheme: 'light' | 'dark';
}

export const Header: React.FC<HeaderProps> = ({ onClearChat, onToggleTheme, currentTheme }) => {
  return (
    <header className="w-full bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-b border-blue-400/20 p-4 shadow-lg sticky top-0 z-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
            <TurbineIcon className="h-8 w-8 text-blue-500 dark:text-blue-400" />
            <h1 className="text-xl md:text-2xl font-bold tracking-wider text-gray-800 dark:text-gray-100 uppercase">
            Asistente Industrial
            </h1>
        </div>
        <div className="flex items-center space-x-4">
            <button onClick={onToggleTheme} className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" aria-label="Toggle theme">
                {currentTheme === 'dark' ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
            </button>
            <button onClick={onClearChat} className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" aria-label="Clear chat">
                <ClearIcon className="h-6 w-6" />
            </button>
        </div>
      </div>
    </header>
  );
};
