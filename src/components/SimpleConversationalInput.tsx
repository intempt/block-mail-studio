
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Toggle } from '@/components/ui/toggle';
import { 
  Send, 
  MessageSquare,
  Zap,
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
  const [isDoMode, setIsDoMode] = useState(false);

  const handleSend = () => {
    if (!inputMessage.trim()) return;
    const mode = (isDoMode && !disableDoMode) ? 'do' : 'ask';
    onSendMessage(inputMessage, mode);
    setInputMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleToggleMode = () => {
    if (!disableDoMode) {
      setIsDoMode(!isDoMode);
    }
  };

  const getAskPlaceholder = () => {
    const placeholders = {
      messages: "Ask about email marketing strategy...",
      journeys: "Ask about customer journey design...",
      snippets: "Ask about content optimization..."
    };
    return placeholders[context] || placeholder;
  };

  const getModePlaceholder = () => {
    const currentMode = (isDoMode && !disableDoMode) ? 'do' : 'ask';
    if (currentMode === 'do') {
      return `Create ${placeholder.toLowerCase()}`;
    }
    return getAskPlaceholder();
  };

  return (
    <div className="space-y-3">
      <div className="border border-gray-300 rounded-lg focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 bg-white">
        {/* Input Area */}
        <div className="flex items-center p-3 space-x-3">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={getModePlaceholder()}
            onKeyPress={handleKeyPress}
            className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            disabled={isLoading}
          />
          
          <div className="flex items-center space-x-2">
            <Toggle
              pressed={isDoMode && !disableDoMode}
              onPressedChange={handleToggleMode}
              disabled={disableDoMode}
              size="sm"
              className={`transition-all duration-200 ${
                isDoMode && !disableDoMode
                  ? 'bg-blue-600 text-white hover:bg-blue-700 data-[state=on]:bg-blue-600 data-[state=on]:text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
              } ${disableDoMode ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={disableDoMode ? `Do mode creates actionable content. Coming soon for ${context} - use Ask mode for expert guidance.` : undefined}
            >
              {isDoMode && !disableDoMode ? (
                <>
                  <Zap className="w-4 h-4 mr-1" />
                  Do
                </>
              ) : (
                <>
                  <MessageSquare className="w-4 h-4 mr-1" />
                  Ask
                </>
              )}
            </Toggle>
            
            <Button 
              onClick={handleSend} 
              disabled={!inputMessage.trim() || isLoading}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <Sparkles className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {disableDoMode && (
        <div className="px-3">
          <p className="text-xs text-gray-500">
            💡 Do mode creates actionable content and comes soon for {context}. Use Ask mode for expert guidance and strategic advice.
          </p>
        </div>
      )}
    </div>
  );
};
