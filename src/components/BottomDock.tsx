
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
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-4xl px-4">
      {/* Single Container for Everything */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-4">
        {/* Top Row - Input Bar */}
        <div className="flex items-center gap-3 mb-4">
          {/* Ask/Do Toggle */}
          <div className="flex bg-gray-100 rounded-full p-1 flex-shrink-0">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-medium transition-colors">
              Ask
            </button>
            <button className="px-4 py-2 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">
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
            className="flex-1 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none text-base"
            disabled={isLoading}
          />

          {/* Send Button */}
          <Button
            onClick={() => onSendMessage(currentMessage)}
            disabled={!currentMessage.trim() || isLoading}
            className="bg-blue-400 hover:bg-blue-500 text-white rounded-full w-10 h-10 p-0 flex-shrink-0 shadow-none border-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* Bottom Rows - Suggestion Chips */}
        <div className="space-y-2">
          {/* First row - 3 chips */}
          <div className="flex gap-2 justify-start">
            {suggestionChips.slice(0, 3).map((suggestion, index) => (
              <button
                key={index}
                onClick={() => onSuggestionClick(suggestion)}
                className="px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-full text-sm text-gray-700 transition-colors border border-gray-200 whitespace-nowrap"
                disabled={isLoading}
              >
                {suggestion}
              </button>
            ))}
          </div>
          
          {/* Second row - 2 chips */}
          <div className="flex gap-2 justify-start">
            {suggestionChips.slice(3, 5).map((suggestion, index) => (
              <button
                key={index + 3}
                onClick={() => onSuggestionClick(suggestion)}
                className="px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-full text-sm text-gray-700 transition-colors border border-gray-200 whitespace-nowrap"
                disabled={isLoading}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
