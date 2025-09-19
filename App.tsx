import React, { useState, useEffect, useCallback } from 'react';
import { ChatWindow } from './components/ChatWindow';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { ChatMessage } from './types';
import { generateChatStream } from './services/geminiService';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'dark';
  });

  const getInitialMessage = (): ChatMessage => ({
    role: 'model',
    parts: [{ text: "¡Hola! Soy tu Asistente de Optimización de Procesos. ¿En qué te puedo ayudar hoy?" }],
    quickActions: ['Ver Estado Actual', 'Realizar una Predicción', 'Analizar Variables Clave'],
  });

  useEffect(() => {
    setMessages([getInitialMessage()]);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'dark' ? 'light' : 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleSendMessage = useCallback(async (userInput: string) => {
    if (!userInput.trim()) return;

    const newMessages: ChatMessage[] = [...messages.map(m => ({...m, quickActions: undefined})), { role: 'user', parts: [{ text: userInput }] }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const stream = await generateChatStream(newMessages);
      
      let currentBotMessage = '';
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: '' }] }]);

      for await (const chunk of stream) {
        currentBotMessage += chunk.text;
        setMessages(prev => {
          const lastMessageIndex = prev.length - 1;
          const updatedMessages = [...prev];
          if(updatedMessages[lastMessageIndex].role === 'model') {
            updatedMessages[lastMessageIndex] = { ...updatedMessages[lastMessageIndex], parts: [{ text: currentBotMessage }] };
          }
          return updatedMessages;
        });
      }
    } catch (error) {
      console.error("Error generating content:", error);
      const errorMessage: ChatMessage = {
        role: 'model',
        parts: [{ text: 'Lo siento, ocurrió un error. Por favor, intenta de nuevo.' }],
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setMessages(prev => {
         const lastMessageIndex = prev.length - 1;
         if (prev[lastMessageIndex].role === 'model' && prev[lastMessageIndex].parts[0].text.includes('¿Hay algo más')) {
            const updatedMessages = [...prev];
            updatedMessages[lastMessageIndex].quickActions = ['Ver Estado Actual', 'Realizar una Predicción', 'Analizar Variables Clave'];
            return updatedMessages;
         }
         return prev;
      });
    }
  }, [messages]);
  
  const handleClearChat = useCallback(() => {
      setMessages([getInitialMessage()]);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  }, []);


  return (
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 min-h-screen flex flex-col antialiased transition-colors duration-300">
      <Header onClearChat={handleClearChat} onToggleTheme={toggleTheme} currentTheme={theme} />
      <main className="flex-grow container mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-80px)]">
        <aside className="lg:col-span-1 h-full overflow-y-auto">
          <Dashboard />
        </aside>
        <div className="lg:col-span-2 h-full">
           <ChatWindow
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
          />
        </div>
      </main>
    </div>
  );
};

export default App;
