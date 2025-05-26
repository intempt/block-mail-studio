
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  onModeChange?: (mode: 'ask' | 'do') => void;
}

export const EnhancedChatInput: React.FC<EnhancedChatInputProps> = ({
  onSendMessage,
  isLoading = false,
  placeholder = "Describe your needs...",
  disableDoMode = false,
  context = 'messages',
  onModeChange
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
      const newMode = !isDoMode;
      setIsDoMode(newMode);
      if (onModeChange) {
        onModeChange(newMode ? 'do' : 'ask');
      }
    }
  };

  // Notify parent of mode changes
  useEffect(() => {
    if (onModeChange) {
      onModeChange(isDoMode && !disableDoMode ? 'do' : 'ask');
    }
  }, [isDoMode, disableDoMode, onModeChange]);

  const getModePlaceholder = () => {
    const currentMode = (isDoMode && !disableDoMode) ? 'do' : 'ask';
    const contextText = {
      messages: 'campaign ideas',
      journeys: 'journey workflows', 
      snippets: 'content snippets'
    };
    return `${currentMode === 'ask' ? 'Ask about' : 'Create'} ${contextText[context]}...`;
  };

  return (
    <div className="border border-gray-300 rounded-lg focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 bg-white">
      <div className="flex items-center p-3 space-x-3">
        {/* Ask/Do Mode Toggle Button */}
        <Button
          onClick={handleToggleMode}
          disabled={disableDoMode}
          variant="ghost"
          size="sm"
          className={`h-8 px-3 transition-all duration-200 ${
            isDoMode && !disableDoMode
              ? 'bg-green-500 text-white hover:bg-green-600 shadow-md shadow-green-200'
              : 'bg-blue-500 text-white hover:bg-blue-600 shadow-md shadow-blue-200'
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
        </Button>

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
