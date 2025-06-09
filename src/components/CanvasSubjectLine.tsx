
import React, { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Lightbulb, 
  Target, 
  AlertTriangle, 
  CheckCircle,
  RefreshCw,
  Copy,
  BarChart3
} from 'lucide-react';
import { DirectAIService } from '@/services/directAIService';

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

  const generateVariants = async () => {
    const sessionId = `subject-variants-${Date.now()}`;
    console.log(`[CANVAS-SUBJECT-LINE] ${sessionId} - generateVariants() called`);
    console.log(`[CANVAS-SUBJECT-LINE] ${sessionId} - Current value: "${value}"`);
    
    if (!value.trim()) {
      console.warn(`[CANVAS-SUBJECT-LINE] ${sessionId} - Empty subject line, aborting`);
      return;
    }

    setIsGeneratingVariants(true);
    setShowVariants(true);
    
    try {
      console.log(`[CANVAS-SUBJECT-LINE] ${sessionId} - Calling DirectAIService for variants...`);
      const result = await DirectAIService.generateSubjectVariants(value, 3);
      
      console.log(`[CANVAS-SUBJECT-LINE] ${sessionId} - DirectAIService response:`, {
        success: result.success,
        dataLength: result.data?.length || 0,
        error: result.error || 'None'
      });
      
      if (result.success && result.data) {
        console.log(`[CANVAS-SUBJECT-LINE] ${sessionId} - Variants generated successfully:`, result.data);
        setVariants(result.data);
      } else {
        console.warn(`[CANVAS-SUBJECT-LINE] ${sessionId} - Variant generation failed:`, result.error);
        setVariants([]);
      }
    } catch (error) {
      console.error(`[CANVAS-SUBJECT-LINE] ${sessionId} - Error generating variants:`, {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      setVariants([]);
    } finally {
      console.log(`[CANVAS-SUBJECT-LINE] ${sessionId} - Variant generation process completed`);
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

  return (
    <div className="p-4 space-y-3 bg-white">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2">
          <Target className="w-4 h-4 text-blue-500" />
          Subject Line
        </h3>
        <div className="flex items-center gap-2">
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
