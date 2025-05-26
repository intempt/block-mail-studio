
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

interface EnhancedChatInputProps {
  onSendMessage: (message: string, mode: 'ask' | 'do') => void;
  isLoading?: boolean;
  placeholder?: string;
  disableDoMode?: boolean;
  context?: 'messages' | 'journeys' | 'snippets';
}

export const EnhancedChatInput: React.FC<EnhancedChatInputProps> = ({
  onSendMessage,
  isLoading = false,
  placeholder = "Describe your needs...",
  disableDoMode = false,
  context = 'messages'
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

  const getModePlaceholder = () => {
    const currentMode = (isDoMode && !disableDoMode) ? 'do' : 'ask';
    return `${currentMode === 'ask' ? 'Ask about' : 'Create'} ${placeholder.toLowerCase()}`;
  };

  return (
    <div className="border border-gray-300 rounded-lg focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 bg-white">
      {/* Mode Toggle Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
        <div className="flex items-center space-x-3">
          <Toggle
            pressed={isDoMode && !disableDoMode}
            onPressedChange={handleToggleMode}
            disabled={disableDoMode}
            className={`h-8 px-3 transition-all duration-200 ${
              isDoMode && !disableDoMode
                ? 'bg-blue-600 text-white hover:bg-blue-700 data-[state=on]:bg-blue-600 data-[state=on]:text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            } ${disableDoMode ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isDoMode && !disableDoMode ? (
              <>
                <Zap className="w-3 h-3 mr-1" />
                Do
              </>
            ) : (
              <>
                <MessageSquare className="w-3 h-3 mr-1" />
                Ask
              </>
            )}
          </Toggle>
          
          {disableDoMode && (
            <span className="text-xs text-gray-500">
              Do mode available for {context === 'messages' ? 'email creation' : context} only
            </span>
          )}
        </div>
        
        <div className="text-xs text-gray-500">
          {isDoMode && !disableDoMode ? 'Create when possible' : 'Plan and discuss'}
        </div>
      </div>

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
  );
};
