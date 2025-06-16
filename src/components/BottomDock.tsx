
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

const emailSuggestions = [
  "Who are my best subscribers?",
  "What's the best way to segment users?", 
  "How do I track open rates?",
  "Which emails are at risk of spam?",
  "What's my click-through rate?"
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
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Mode Toggle */}
        <div className="flex justify-center">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium">
              Ask
            </button>
            <button className="px-4 py-2 text-gray-600 rounded-md text-sm font-medium hover:bg-gray-200">
              Do
            </button>
          </div>
        </div>

        {/* Input Area */}
        <div className="flex items-center gap-3 max-w-2xl mx-auto">
          <div className="flex-1 relative">
            <input
              type="text"
              value={currentMessage}
              onChange={(e) => onMessageChange(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="What's my conversion rate this month?"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
              disabled={isLoading}
            />
          </div>
          <Button
            onClick={() => onSendMessage(currentMessage)}
            disabled={!currentMessage.trim() || isLoading}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3"
            size="sm"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* Suggestion Chips */}
        <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
          {emailSuggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => onSuggestionClick(suggestion)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors border border-gray-200"
              disabled={isLoading}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
