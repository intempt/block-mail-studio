
import React from 'react';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

interface BottomDockProps {
  onSuggestionClick: (suggestion: string) => void;
  onSendMessage: (message: string) => void;
  currentMessage: string;
  onMessageChange: (message: string) => void;
  isLoading?: boolean;
}

const suggestionChips = [
  "Who are my best customers?",
  "What's the best way to segment users?", 
  "How do I track conversion rates?",
  "Which accounts are at risk of churning?",
  "What's my customer lifetime value?"
];

export const BottomDock: React.FC<BottomDockProps> = ({
  onSuggestionClick,
  onSendMessage,
  currentMessage,
  onMessageChange,
  isLoading = false
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (currentMessage.trim()) {
        onSendMessage(currentMessage);
      }
    }
  };

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white rounded-full shadow-xl border border-gray-200 px-4 py-3 flex items-center gap-3 w-[600px] max-w-[90vw]">
        {/* Ask/Do Toggle */}
        <div className="flex bg-gray-100 rounded-full p-1 flex-shrink-0">
          <button className="px-4 py-1.5 bg-blue-500 text-white rounded-full text-sm font-medium transition-colors">
            Ask
          </button>
          <button className="px-4 py-1.5 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">
            Do
          </button>
        </div>

        {/* Input Field */}
        <input
          type="text"
          value={currentMessage}
          onChange={(e) => onMessageChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="What's my conversion rate this month?"
          className="flex-1 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none text-sm"
          disabled={isLoading}
        />

        {/* Send Button */}
        <Button
          onClick={() => onSendMessage(currentMessage)}
          disabled={!currentMessage.trim() || isLoading}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-10 h-10 p-0 flex-shrink-0"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>

      {/* Suggestion Chips */}
      <div className="flex flex-wrap justify-center gap-2 mt-3 px-4">
        {suggestionChips.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSuggestionClick(suggestion)}
            className="px-3 py-1.5 bg-white hover:bg-gray-50 rounded-full text-xs text-gray-700 transition-colors border border-gray-200 shadow-sm whitespace-nowrap"
            disabled={isLoading}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};
