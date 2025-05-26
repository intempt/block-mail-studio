
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Lightbulb, 
  ChevronDown,
  Copy,
  CheckCircle,
  Target,
  Zap,
  Sparkles,
  TrendingUp,
  Brain
} from 'lucide-react';

interface Suggestion {
  id: string;
  type: 'subject' | 'copy' | 'cta' | 'tone' | 'design';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  suggestion: string;
}

interface AISuggestionsCardProps {
  isOpen: boolean;
  onToggle: () => void;
  emailHTML: string;
  subjectLine: string;
  onApplySuggestion?: (suggestion: Suggestion) => void;
}

export const AISuggestionsCard: React.FC<AISuggestionsCardProps> = ({
  isOpen,
  onToggle,
  emailHTML,
  subjectLine,
  onApplySuggestion
}) => {
  const mockSuggestions: Suggestion[] = [
    {
      id: '1',
      type: 'subject',
      title: 'Optimize Subject Line',
      description: 'Make your subject line more compelling and action-oriented',
      impact: 'high',
      confidence: 87,
      suggestion: 'Add urgency words like "Limited Time" or personalization tokens'
    },
    {
      id: '2',
      type: 'cta',
      title: 'Enhance Call-to-Action',
      description: 'Improve button text for better click-through rates',
      impact: 'high',
      confidence: 92,
      suggestion: 'Use action verbs like "Get Started Now" instead of "Click Here"'
    },
    {
      id: '3',
      type: 'copy',
      title: 'Improve Content Flow',
      description: 'Restructure content for better readability',
      impact: 'medium',
      confidence: 78,
      suggestion: 'Break long paragraphs into shorter, scannable chunks'
    },
    {
      id: '4',
      type: 'design',
      title: 'Visual Hierarchy',
      description: 'Improve visual elements for better engagement',
      impact: 'medium',
      confidence: 83,
      suggestion: 'Add more white space and use contrasting colors for CTAs'
    }
  ];

  const applySuggestion = (suggestion: Suggestion) => {
    onApplySuggestion?.(suggestion);
    console.log(`Applied: ${suggestion.title}`);
  };

  const copySuggestion = (suggestion: Suggestion) => {
    navigator.clipboard.writeText(suggestion.suggestion);
    console.log(`Copied: ${suggestion.title}`);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'subject': return <Target className="w-4 h-4" />;
      case 'cta': return <Zap className="w-4 h-4" />;
      case 'copy': return <Sparkles className="w-4 h-4" />;
      case 'design': return <TrendingUp className="w-4 h-4" />;
      case 'tone': return <Brain className="w-4 h-4" />;
      default: return <Lightbulb className="w-4 h-4" />;
    }
  };

  if (!isOpen) return null;

  return (
    <Card className="absolute top-full left-0 right-0 z-50 mt-2 mx-6 shadow-lg border border-gray-200">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            AI Suggestions
            <Badge className="text-xs">{mockSuggestions.length}</Badge>
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="text-gray-500"
          >
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>

        <ScrollArea className="max-h-80">
          <div className="space-y-3">
            {mockSuggestions.map((suggestion) => (
              <div key={suggestion.id} className="border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(suggestion.type)}
                    <span className="font-medium text-sm">{suggestion.title}</span>
                    <Badge className={`text-xs ${getImpactColor(suggestion.impact)}`}>
                      {suggestion.impact}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <CheckCircle className="w-3 h-3" />
                    {suggestion.confidence}%
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">{suggestion.description}</p>
                
                <div className="text-sm bg-blue-50 p-2 rounded mb-3">
                  <span className="text-blue-800">💡 {suggestion.suggestion}</span>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => applySuggestion(suggestion)}
                    className="flex-1 text-xs h-7"
                  >
                    Apply
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copySuggestion(suggestion)}
                    className="text-xs h-7"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
};
