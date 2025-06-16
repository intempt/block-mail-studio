
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
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 w-[800px] max-w-[90vw]">
        {/* Mode Toggle */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex bg-gray-100 rounded-lg p-1">
            <button className="px-6 py-2 bg-blue-500 text-white rounded-md text-sm font-medium transition-colors">
              Ask
            </button>
            <button className="px-6 py-2 text-gray-600 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors">
              Do
            </button>
          </div>
        </div>

        {/* Input Area */}
        <div className="flex items-end gap-3 mb-6">
          <div className="flex-1">
            <input
              type="text"
              value={currentMessage}
              onChange={(e) => onMessageChange(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="What's my conversion rate this month?"
              className="w-full px-4 py-4 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
          </div>
          <Button
            onClick={() => onSendMessage(currentMessage)}
            disabled={!currentMessage.trim() || isLoading}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-6 py-4 h-auto"
          >
            <Send className="w-5 h-5 mr-2" />
            Send
          </Button>
        </div>

        {/* Suggestion Chips */}
        <div className="flex flex-wrap justify-center gap-3">
          {emailSuggestions.map((suggestion, index) => (
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
      </div>
    </div>
  );
};
