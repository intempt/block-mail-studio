import React, { useState, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  CheckCircle, 
  AlertTriangle, 
  Lightbulb, 
  Eye,
  Smartphone,
  Zap,
  Target,
  BarChart3,
  Palette
} from 'lucide-react';

interface DesignSuggestion {
  id: string;
  type: 'accessibility' | 'performance' | 'design' | 'content';
  severity: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  action?: string;
  fixed?: boolean;
}

interface DesignScore {
  overall: number;
  accessibility: number;
  performance: number;
  engagement: number;
  mobile: number;
}

interface SmartDesignAssistantProps {
  editor: Editor | null;
  emailHTML: string;
}

export const SmartDesignAssistant: React.FC<SmartDesignAssistantProps> = ({ 
  editor, 
  emailHTML 
}) => {
  const [designScore, setDesignScore] = useState<DesignScore>({
    overall: 85,
    accessibility: 78,
    performance: 92,
    engagement: 88,
    mobile: 90
  });

  const [suggestions, setSuggestions] = useState<DesignSuggestion[]>([
    {
      id: '1',
      type: 'accessibility',
      severity: 'medium',
      title: 'Add Alt Text to Images',
      description: 'Some images are missing alt text, which affects accessibility for screen readers.',
      action: 'Add descriptive alt text to all images'
    },
    {
      id: '2',
      type: 'design',
      severity: 'low',
      title: 'Improve Color Contrast',
      description: 'Text on some backgrounds may not meet WCAG contrast requirements.',
      action: 'Increase contrast ratio to 4.5:1 or higher'
    },
    {
      id: '3',
      type: 'performance',
      severity: 'high',
      title: 'Optimize Image Sizes',
      description: 'Large images can slow down email loading times.',
      action: 'Compress images and use appropriate formats'
    },
    {
      id: '4',
      type: 'content',
      severity: 'medium',
      title: 'Shorten Subject Line',
      description: 'Subject line may be truncated on mobile devices.',
      action: 'Keep subject line under 50 characters'
    }
  ]);

  const [aiInsights, setAiInsights] = useState([
    {
      id: '1',
      title: 'Engagement Optimization',
      description: 'Adding a sense of urgency could increase click-through rates by 15-20%',
      suggestion: 'Consider adding time-limited offers or countdown timers'
    },
    {
      id: '2',
      title: 'Personalization Opportunity',
      description: 'This template could benefit from dynamic content based on user behavior',
      suggestion: 'Add merge tags for location, purchase history, or preferences'
    },
    {
      id: '3',
      title: 'Mobile Optimization',
      description: 'The design looks great on mobile but could be enhanced',
      suggestion: 'Consider larger touch targets for buttons (minimum 44px)'
    }
  ]);

  // Simulate real-time analysis
  useEffect(() => {
    if (emailHTML) {
      // Simple analysis based on HTML content
      const hasImages = emailHTML.includes('<img');
      const hasLinks = emailHTML.includes('<a');
      const wordCount = emailHTML.replace(/<[^>]*>/g, '').split(/\s+/).length;

      // Update score based on content
      setDesignScore(prev => ({
        ...prev,
        overall: Math.min(100, 70 + (hasImages ? 10 : 0) + (hasLinks ? 10 : 0) + Math.min(10, wordCount / 50))
      }));
    }
  }, [emailHTML]);

  const applySuggestion = (suggestionId: string) => {
    setSuggestions(suggestions.map(s => 
      s.id === suggestionId ? { ...s, fixed: true } : s
    ));
    
    // Update design score
    setDesignScore(prev => ({
      ...prev,
      overall: Math.min(100, prev.overall + 5),
      accessibility: prev.accessibility + 3
    }));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'accessibility': return <Eye className="w-4 h-4" />;
      case 'performance': return <Zap className="w-4 h-4" />;
      case 'design': return <Palette className="w-4 h-4" />;
      case 'content': return <Target className="w-4 h-4" />;
      default: return <Lightbulb className="w-4 h-4" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="h-full flex flex-col">
      <div className="p-3 border-b border-gray-200 max-h-[200px] overflow-y-auto">
        <div className="flex items-center gap-2 mb-3">
          <Brain className="w-4 h-4" />
          <h3 className="text-base font-semibold">Design Assistant</h3>
          <Badge variant="secondary" className="ml-auto text-xs">
            AI Powered
          </Badge>
        </div>

        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium">Overall Score</span>
            <span className={`text-lg font-bold ${getScoreColor(designScore.overall)}`}>
              {designScore.overall}
            </span>
          </div>
          <Progress value={designScore.overall} className="mb-2 h-2" />
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-600">Accessibility</span>
              <span className={getScoreColor(designScore.accessibility)}>
                {designScore.accessibility}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Performance</span>
              <span className={getScoreColor(designScore.performance)}>
                {designScore.performance}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Engagement</span>
              <span className={getScoreColor(designScore.engagement)}>
                {designScore.engagement}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Mobile</span>
              <span className={getScoreColor(designScore.mobile)}>
                {designScore.mobile}
              </span>
            </div>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-3">
          {/* Suggestions */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-1 text-sm">
              <AlertTriangle className="w-3 h-3" />
              Suggestions ({suggestions.filter(s => !s.fixed).length})
            </h4>
            
            <div className="space-y-2">
              {suggestions.map((suggestion) => (
                <Card 
                  key={suggestion.id} 
                  className={`p-2 border ${suggestion.fixed ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-1 mb-1">
                        {getTypeIcon(suggestion.type)}
                        <span className="font-medium text-xs">{suggestion.title}</span>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getSeverityColor(suggestion.severity)}`}
                        >
                          {suggestion.severity}
                        </Badge>
                        {suggestion.fixed && (
                          <CheckCircle className="w-3 h-3 text-green-600" />
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mb-1">
                        {suggestion.description}
                      </p>
                      {suggestion.action && (
                        <p className="text-xs text-blue-600 italic">
                          {suggestion.action}
                        </p>
                      )}
                    </div>
                    
                    {!suggestion.fixed && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => applySuggestion(suggestion.id)}
                        className="ml-1 text-xs px-2 py-1"
                      >
                        Fix
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* AI Insights */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-1 text-sm">
              <Lightbulb className="w-3 h-3" />
              AI Insights
            </h4>
            
            <div className="space-y-2">
              {aiInsights.map((insight) => (
                <Card key={insight.id} className="p-2 bg-blue-50 border-blue-200">
                  <div className="flex items-start gap-1">
                    <BarChart3 className="w-3 h-3 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <h5 className="font-medium text-xs text-blue-900 mb-1">
                        {insight.title}
                      </h5>
                      <p className="text-xs text-blue-700 mb-1">
                        {insight.description}
                      </p>
                      <p className="text-xs text-blue-600 italic">
                        💡 {insight.suggestion}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2 text-sm">Quick Optimizations</h4>
            <div className="grid grid-cols-2 gap-1">
              <Button variant="outline" size="sm" className="flex items-center gap-1 text-xs">
                <Smartphone className="w-3 h-3" />
                Mobile Check
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1 text-xs">
                <Eye className="w-3 h-3" />
                Accessibility
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1 text-xs">
                <Zap className="w-3 h-3" />
                Performance
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1 text-xs">
                <Target className="w-3 h-3" />
                A/B Test Ideas
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>
    </Card>
  );
};
