
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Wand2,
  RefreshCw,
  Sparkles,
  Target,
  Type,
  TrendingUp,
  Zap,
  CheckCircle,
  FileText
} from 'lucide-react';
import { TipTapProService } from '@/services/TipTapProService';

interface AIDropdownMenuProps {
  selectedText?: string;
  fullContent?: string;
  onContentUpdate: (content: string) => void;
  className?: string;
  size?: 'sm' | 'default';
}

export const AIDropdownMenu: React.FC<AIDropdownMenuProps> = ({
  selectedText,
  fullContent,
  onContentUpdate,
  className = '',
  size = 'default'
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentOperation, setCurrentOperation] = useState<string>('');

  const hasContent = selectedText || fullContent;
  const workingText = selectedText || fullContent || '';

  const handleAIOperation = async (operation: string, instruction: string) => {
    if (!hasContent || isGenerating) return;
    
    setIsGenerating(true);
    setCurrentOperation(operation);
    
    try {
      let result;
      
      switch (operation) {
        case 'generate':
          result = await TipTapProService.generateContent(
            'Generate professional content',
            'professional'
          );
          break;
        case 'improve':
          result = await TipTapProService.improveText(workingText, {
            style: 'professional',
            goal: 'clarity'
          });
          break;
        case 'professional':
          result = await TipTapProService.refineEmail(
            workingText,
            'Make this content more professional and business-appropriate'
          );
          break;
        case 'casual':
          result = await TipTapProService.refineEmail(
            workingText,
            'Make this content more casual and conversational'
          );
          break;
        case 'friendly':
          result = await TipTapProService.refineEmail(
            workingText,
            'Make this content more friendly and approachable'
          );
          break;
        case 'shorter':
          result = await TipTapProService.refineEmail(
            workingText,
            'Make this content more concise and impactful'
          );
          break;
        case 'expand':
          result = await TipTapProService.refineEmail(
            workingText,
            'Expand this content with more details and examples'
          );
          break;
        case 'grammar':
          result = await TipTapProService.refineEmail(
            workingText,
            'Fix grammar and improve clarity'
          );
          break;
        default:
          result = await TipTapProService.refineEmail(workingText, instruction);
      }
      
      if (result?.success && result.data) {
        onContentUpdate(result.data);
      }
    } catch (error) {
      console.error('AI operation failed:', error);
    } finally {
      setIsGenerating(false);
      setCurrentOperation('');
    }
  };

  const buttonSize = size === 'sm' ? 'sm' : 'default';
  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size={buttonSize}
          disabled={isGenerating}
          className={`bg-gradient-to-r from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100 text-purple-700 border border-purple-200 ${className}`}
        >
          {isGenerating ? (
            <RefreshCw className={`${iconSize} animate-spin mr-1`} />
          ) : (
            <Sparkles className={`${iconSize} mr-1`} />
          )}
          AI
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className="w-56 bg-white border border-gray-200 shadow-lg z-50"
        align="start"
      >
        <DropdownMenuLabel className="flex items-center gap-2 text-purple-700">
          <Sparkles className="w-3 h-3" />
          TipTap Pro AI
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        {/* Generation */}
        <DropdownMenuItem
          onClick={() => handleAIOperation('generate', '')}
          disabled={isGenerating}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Wand2 className="w-4 h-4 text-purple-600" />
          Generate Content
        </DropdownMenuItem>
        
        {hasContent && (
          <>
            <DropdownMenuItem
              onClick={() => handleAIOperation('improve', '')}
              disabled={isGenerating}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Target className="w-4 h-4 text-blue-600" />
              Improve
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            {/* Tone adjustments */}
            <DropdownMenuItem
              onClick={() => handleAIOperation('professional', '')}
              disabled={isGenerating}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Type className="w-4 h-4 text-gray-600" />
              Make Professional
            </DropdownMenuItem>
            
            <DropdownMenuItem
              onClick={() => handleAIOperation('casual', '')}
              disabled={isGenerating}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Type className="w-4 h-4 text-green-600" />
              Make Casual
            </DropdownMenuItem>
            
            <DropdownMenuItem
              onClick={() => handleAIOperation('friendly', '')}
              disabled={isGenerating}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Type className="w-4 h-4 text-orange-600" />
              Make Friendly
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            {/* Length adjustments */}
            <DropdownMenuItem
              onClick={() => handleAIOperation('shorter', '')}
              disabled={isGenerating}
              className="flex items-center gap-2 cursor-pointer"
            >
              <TrendingUp className="w-4 h-4 text-red-600" />
              Make Shorter
            </DropdownMenuItem>
            
            <DropdownMenuItem
              onClick={() => handleAIOperation('expand', '')}
              disabled={isGenerating}
              className="flex items-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-indigo-600" />
              Expand Content
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            {/* Quality improvements */}
            <DropdownMenuItem
              onClick={() => handleAIOperation('grammar', '')}
              disabled={isGenerating}
              className="flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Fix Grammar
            </DropdownMenuItem>
          </>
        )}
        
        {isGenerating && currentOperation && (
          <>
            <DropdownMenuSeparator />
            <div className="px-2 py-1 text-xs text-gray-500 flex items-center gap-2">
              <RefreshCw className="w-3 h-3 animate-spin" />
              Processing {currentOperation}...
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
