
import React, { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Lightbulb, 
  Target, 
  AlertTriangle, 
  CheckCircle,
  RefreshCw,
  Copy,
  BarChart3,
  Key,
  Wifi,
  WifiOff
} from 'lucide-react';
import { DirectAIService } from '@/services/directAIService';
import { ApiKeyService } from '@/services/apiKeyService';

interface CanvasSubjectLineProps {
  value: string;
  onChange: (value: string) => void;
  emailContent?: string;
}

export const CanvasSubjectLine: React.FC<CanvasSubjectLineProps> = ({
  value,
  onChange,
  emailContent = ''
}) => {
  const [variants, setVariants] = useState<string[]>([]);
  const [isGeneratingVariants, setIsGeneratingVariants] = useState(false);
  const [showVariants, setShowVariants] = useState(false);
  const [apiKeyStatus, setApiKeyStatus] = useState<'checking' | 'valid' | 'invalid' | 'missing'>('checking');
  const [lastKeyCheck, setLastKeyCheck] = useState<number>(0);

  // Check API key status periodically
  const checkApiKeyStatus = useCallback(async () => {
    const now = Date.now();
    if (now - lastKeyCheck < 30000) return; // Check at most every 30 seconds
    
    try {
      const status = await ApiKeyService.getKeyStatus();
      setApiKeyStatus(status);
      setLastKeyCheck(now);
    } catch (error) {
      setApiKeyStatus('missing');
      setLastKeyCheck(now);
    }
  }, [lastKeyCheck]);

  const refreshApiKey = () => {
    ApiKeyService.forceRefresh();
    DirectAIService.refreshApiKey();
    setApiKeyStatus('checking');
    setLastKeyCheck(0);
    checkApiKeyStatus();
  };

  const generateVariants = async () => {
    if (!value.trim()) return;

    // Check API key before generating
    await checkApiKeyStatus();
    if (apiKeyStatus !== 'valid') {
      console.warn('Cannot generate variants: API key not valid');
      return;
    }

    setIsGeneratingVariants(true);
    setShowVariants(true);
    
    try {
      const result = await DirectAIService.generateSubjectVariants(value, 3);
      if (result.success && result.data) {
        setVariants(result.data);
      } else {
        setVariants([]);
        console.error('Failed to generate variants:', result.error);
      }
    } catch (error) {
      console.error('Error generating variants:', error);
      setVariants([]);
      // Refresh API key on error in case it's a key issue
      refreshApiKey();
    } finally {
      setIsGeneratingVariants(false);
    }
  };

  const applyVariant = (variant: string) => {
    onChange(variant);
    setShowVariants(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const characterCount = value.length;
  const isTooLong = characterCount > 50;
  const isTooShort = characterCount < 10 && characterCount > 0;

  // Check API key status on component mount
  React.useEffect(() => {
    checkApiKeyStatus();
  }, [checkApiKeyStatus]);

  return (
    <div className="p-4 space-y-3 bg-white">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2">
          <Target className="w-4 h-4 text-blue-500" />
          Subject Line
        </h3>
        <div className="flex items-center gap-2">
          {/* API Key Status Indicator */}
          <Badge 
            variant={apiKeyStatus === 'valid' ? 'default' : 'destructive'}
            className="h-5 text-xs flex items-center gap-1"
          >
            {apiKeyStatus === 'valid' ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
            {apiKeyStatus === 'checking' ? 'Checking...' : 
             apiKeyStatus === 'valid' ? 'AI Ready' : 
             'API Key Issue'}
          </Badge>
          
          {apiKeyStatus !== 'valid' ? (
            <Button
              variant="outline"
              size="sm"
              onClick={refreshApiKey}
              className="h-6 text-xs text-orange-600 hover:text-orange-700 hover:bg-orange-50"
            >
              <Key className="w-4 h-4 mr-1" />
              Refresh Key
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={generateVariants}
              disabled={isGeneratingVariants || !value.trim()}
              className="h-6 text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50"
            >
              {isGeneratingVariants ? (
                <RefreshCw className="w-4 h-4 animate-spin mr-1 text-purple-600" />
              ) : (
                <Lightbulb className="w-4 h-4 mr-1" />
              )}
              Subject AI
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter your email subject line..."
          className="text-sm border-gray-200 focus:border-blue-300 focus:ring-blue-200"
        />
        
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <span className={isTooLong ? 'text-red-600' : isTooShort ? 'text-yellow-600' : 'text-green-600'}>
              {characterCount}/50 characters
            </span>
            {isTooLong && (
              <div className="flex items-center gap-1 text-red-600">
                <AlertTriangle className="w-3 h-3" />
                <span>May be truncated</span>
              </div>
            )}
            {!isTooLong && !isTooShort && characterCount > 0 && (
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircle className="w-3 h-3" />
                <span>Good length</span>
              </div>
            )}
          </div>
        </div>

        {/* A/B Test Variants */}
        {showVariants && (
          <div className="space-y-2 border-t pt-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-medium text-gray-700 flex items-center gap-1">
                <BarChart3 className="w-3 h-3" />
                AI Variants:
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowVariants(false)}
                className="h-6 w-6 p-0"
              >
                ×
              </Button>
            </div>
            
            {isGeneratingVariants ? (
              <div className="text-center py-4">
                <RefreshCw className="w-4 h-4 animate-spin mx-auto mb-2 text-purple-600" />
                <p className="text-xs text-gray-600">AI analyzing subject line...</p>
              </div>
            ) : (
              <ScrollArea className="max-h-32">
                <div className="space-y-1">
                  {variants.map((variant, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-white border rounded hover:bg-blue-50 transition-colors">
                      <span className="text-xs text-gray-900 flex-1">{variant}</span>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(variant)}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => applyVariant(variant)}
                          className="h-6 px-2 text-xs"
                        >
                          Apply
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
