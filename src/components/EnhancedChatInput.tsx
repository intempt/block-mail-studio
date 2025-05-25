
import React, { useState } from 'react';
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
}

export const EnhancedChatInput: React.FC<EnhancedChatInputProps> = ({
  onSendMessage,
  isLoading = false,
  placeholder = "Describe your needs..."
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const [selectedMode, setSelectedMode] = useState<'ask' | 'do'>('ask');

  const handleSend = () => {
    if (!inputMessage.trim()) return;
    onSendMessage(inputMessage, selectedMode);
    setInputMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 bg-white">
      {/* Mode Toggle */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Mode:</span>
          <div className="flex items-center bg-white rounded-md border border-gray-200">
            <Button
              variant={selectedMode === 'ask' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedMode('ask')}
              className={`h-8 px-3 rounded-r-none ${
                selectedMode === 'ask' 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <MessageSquare className="w-3 h-3 mr-1" />
              Ask
            </Button>
            <Button
              variant={selectedMode === 'do' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedMode('do')}
              className={`h-8 px-3 rounded-l-none border-l ${
                selectedMode === 'do' 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Zap className="w-3 h-3 mr-1" />
              Do
            </Button>
          </div>
        </div>
        
        <div className="text-xs text-gray-500">
          {selectedMode === 'ask' ? 'Plan and discuss' : 'Create when possible'}
        </div>
      </div>

      {/* Input Area */}
      <div className="flex items-center p-3 space-x-3">
        <Input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={`${selectedMode === 'ask' ? 'Ask about' : 'Create'} ${placeholder.toLowerCase()}`}
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
