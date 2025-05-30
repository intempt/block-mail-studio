
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Sparkles, 
  Wand2, 
  Target, 
  BarChart3, 
  Palette, 
  Type, 
  Image, 
  Layout,
  Zap,
  Brain
} from 'lucide-react';
import { EmailBlock } from '@/types/emailBlocks';

interface ContextualSuggestion {
  id: string;
  type: 'content' | 'design' | 'performance' | 'accessibility';
  title: string;
  description: string;
  confidence: number;
  action: string;
  icon: React.ReactNode;
}

interface ContextualToolbarProps {
  selectedBlock?: EmailBlock;
  emailContext: {
    type: string;
    audience: string;
    goal: string;
    performance?: any;
  };
  onSuggestionApply: (suggestion: ContextualSuggestion) => void;
  onContentGenerate: (type: string, context: any) => void;
}

export const ContextualToolbar: React.FC<ContextualToolbarProps> = ({
  selectedBlock,
  emailContext,
  onSuggestionApply,
  onContentGenerate
}) => {
  const [suggestions, setSuggestions] = useState<ContextualSuggestion[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    generateContextualSuggestions();
  }, [selectedBlock, emailContext]);

  const generateContextualSuggestions = () => {
    const newSuggestions: ContextualSuggestion[] = [];

    // Content suggestions
    if (selectedBlock?.type === 'text') {
      newSuggestions.push({
        id: 'enhance-copy',
        type: 'content',
        title: 'Enhance Copy',
        description: 'Make text more engaging and persuasive',
        confidence: 0.85,
        action: 'Optimize text for better engagement',
        icon: <Type className="w-4 h-4" />
      });
    }

    // Design suggestions
    if (selectedBlock) {
      newSuggestions.push({
        id: 'improve-layout',
        type: 'design',
        title: 'Improve Layout',
        description: 'Optimize spacing and visual hierarchy',
        confidence: 0.78,
        action: 'Apply better visual structure',
        icon: <Layout className="w-4 h-4" />
      });
    }

    // Performance suggestions
    newSuggestions.push({
      id: 'optimize-performance',
      type: 'performance',
      title: 'Boost Open Rates',
      description: 'Optimize subject line and preview text',
      confidence: 0.92,
      action: 'Generate high-performing subject lines',
      icon: <BarChart3 className="w-4 h-4" />
    });

    // Accessibility suggestions
    newSuggestions.push({
      id: 'improve-accessibility',
      type: 'accessibility',
      title: 'Enhance Accessibility',
      description: 'Add alt text and improve contrast',
      confidence: 0.71,
      action: 'Make email more accessible',
      icon: <Brain className="w-4 h-4" />
    });

    setSuggestions(newSuggestions);
  };

  const getSuggestionColor = (type: string) => {
    switch (type) {
      case 'content': return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'design': return 'bg-purple-50 border-purple-200 text-purple-800';
      case 'performance': return 'bg-green-50 border-green-200 text-green-800';
      case 'accessibility': return 'bg-orange-50 border-orange-200 text-orange-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const filteredSuggestions = activeCategory === 'all' 
    ? suggestions 
    : suggestions.filter(s => s.type === activeCategory);

  return (
    <Card className="p-4">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-gray-900">AI Suggestions</h3>
          </div>
          <Badge variant="outline" className="text-xs">
            {suggestions.length} suggestions
          </Badge>
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto">
          {['all', 'content', 'design', 'performance', 'accessibility'].map(category => (
            <Button
              key={category}
              variant={activeCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveCategory(category)}
              className="text-xs whitespace-nowrap"
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </div>

        <Separator />

        {/* Context Information */}
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div>
            <p className="text-gray-500">Type</p>
            <p className="font-medium">{emailContext.type}</p>
          </div>
          <div>
            <p className="text-gray-500">Audience</p>
            <p className="font-medium">{emailContext.audience}</p>
          </div>
          <div>
            <p className="text-gray-500">Goal</p>
            <p className="font-medium">{emailContext.goal}</p>
          </div>
        </div>

        {/* AI Suggestions */}
        <div className="space-y-3">
          {filteredSuggestions.map(suggestion => (
            <div
              key={suggestion.id}
              className={`p-3 rounded-lg border transition-all hover:shadow-sm ${getSuggestionColor(suggestion.type)}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2 flex-1">
                  {suggestion.icon}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm">{suggestion.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {Math.round(suggestion.confidence * 100)}%
                      </Badge>
                    </div>
                    <p className="text-xs opacity-80 mb-2">{suggestion.description}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => onSuggestionApply(suggestion)}
                  className="text-xs bg-white hover:bg-gray-50 text-gray-700 border border-gray-300"
                >
                  <Wand2 className="w-3 h-3 mr-1" />
                  Apply
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <Separator />
        
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Quick Generate</h4>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onContentGenerate('subject-line', emailContext)}
              className="text-xs"
            >
              <Target className="w-3 h-3 mr-1" />
              Subject Line
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onContentGenerate('cta-button', emailContext)}
              className="text-xs"
            >
              <Zap className="w-3 h-3 mr-1" />
              CTA Button
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onContentGenerate('hero-image', emailContext)}
              className="text-xs"
            >
              <Image className="w-3 h-3 mr-1" />
              Hero Image
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onContentGenerate('color-scheme', emailContext)}
              className="text-xs"
            >
              <Palette className="w-3 h-3 mr-1" />
              Colors
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
