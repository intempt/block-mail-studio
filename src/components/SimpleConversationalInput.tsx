
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Send, 
  MessageSquare,
  Sparkles
} from 'lucide-react';

interface SimpleConversationalInputProps {
  onSendMessage: (message: string, mode: 'ask' | 'do') => void;
  isLoading?: boolean;
  placeholder?: string;
  context?: 'messages' | 'journeys' | 'snippets';
  disableDoMode?: boolean;
}

export const SimpleConversationalInput: React.FC<SimpleConversationalInputProps> = ({
  onSendMessage,
  isLoading = false,
  placeholder = "Describe your needs...",
  context = 'messages',
  disableDoMode = false
}) => {
  const [inputMessage, setInputMessage] = useState('');

  const handleSend = (mode: 'ask' | 'do' = 'ask') => {
    if (!inputMessage.trim()) return;
    onSendMessage(inputMessage, mode);
    setInputMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend('ask');
    }
  };

  const getDoModeTooltip = () => {
    if (disableDoMode) {
      return `Do mode creates actionable content. Coming soon for ${context} - use Ask mode for expert guidance.`;
    }
    return "Create and build specific content based on your input";
  };

  const getAskPlaceholder = () => {
    const placeholders = {
      messages: "Ask about email marketing strategy...",
      journeys: "Ask about customer journey design...",
      snippets: "Ask about content optimization..."
    };
    return placeholders[context] || placeholder;
  };

  return (
    <div className="border border-gray-300 rounded-lg focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 bg-white">
      {/* Input Area */}
      <div className="flex items-center p-3 space-x-3">
        <Input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={getAskPlaceholder()}
          onKeyPress={handleKeyPress}
          className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
          disabled={isLoading}
        />
        
        <div className="flex items-center space-x-2">
          <Button 
            onClick={() => handleSend('ask')} 
            disabled={!inputMessage.trim() || isLoading}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <Sparkles className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <MessageSquare className="w-4 h-4 mr-1" />
                Ask
              </>
            )}
          </Button>
          
          {!disableDoMode && (
            <Button 
              onClick={() => handleSend('do')} 
              disabled={!inputMessage.trim() || isLoading}
              size="sm"
              variant="outline"
              title={getDoModeTooltip()}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Send className="w-4 h-4 mr-1" />
              Do
            </Button>
          )}
          
          {disableDoMode && (
            <Button 
              disabled
              size="sm"
              variant="outline"
              title={getDoModeTooltip()}
              className="border-gray-200 text-gray-400 cursor-not-allowed opacity-50"
            >
              <Send className="w-4 h-4 mr-1" />
              Do
            </Button>
          )}
        </div>
      </div>
      
      {disableDoMode && (
        <div className="px-3 pb-2">
          <p className="text-xs text-gray-500">
            💡 Do mode creates actionable content and comes soon for {context}. Use Ask mode for expert guidance and strategic advice.
          </p>
        </div>
      )}
    </div>
  );
};
