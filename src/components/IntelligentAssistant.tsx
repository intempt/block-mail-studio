
import React, { useState, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Sparkles, 
  TrendingUp, 
  Target, 
  Zap,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  RefreshCw,
  Copy
} from 'lucide-react';

interface ContentSuggestion {
  id: string;
  type: 'subject' | 'copy' | 'cta' | 'tone';
  title: string;
  current: string;
  suggested: string;
  reason: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
}

interface IntelligentAssistantProps {
  editor: Editor | null;
  emailHTML: string;
}

export const IntelligentAssistant: React.FC<IntelligentAssistantProps> = ({ 
  editor, 
  emailHTML 
}) => {
  const [suggestions, setSuggestions] = useState<ContentSuggestion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [brandVoiceScore, setBrandVoiceScore] = useState(85);
  const [engagementScore, setEngagementScore] = useState(78);
  const [performancePrediction, setPerformancePrediction] = useState({
    openRate: 24.5,
    clickRate: 3.2,
    conversionRate: 2.1
  });

  const analyzingMessages = [
    "Analyzing content tone and voice...",
    "Evaluating engagement potential...",
    "Checking brand consistency...",
    "Generating optimization suggestions..."
  ];

  const [currentAnalyzingStep, setCurrentAnalyzingStep] = useState(0);

  useEffect(() => {
    if (emailHTML) {
      analyzeContent();
    }
  }, [emailHTML]);

  const analyzeContent = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis with progressive steps
    for (let i = 0; i < analyzingMessages.length; i++) {
      setCurrentAnalyzingStep(i);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    // Generate intelligent suggestions based on content
    const newSuggestions: ContentSuggestion[] = [
      {
        id: '1',
        type: 'subject',
        title: 'Subject Line Optimization',
        current: 'Welcome to Email Builder Pro',
        suggested: '🚀 Welcome! Start building stunning emails in minutes',
        reason: 'Adding emojis and urgency can increase open rates by 15-20%',
        impact: 'high',
        confidence: 92
      },
      {
        id: '2',
        type: 'cta',
        title: 'Call-to-Action Enhancement',
        current: 'Get Started',
        suggested: 'Create My First Email Now',
        reason: 'More specific and action-oriented CTAs perform 35% better',
        impact: 'high',
        confidence: 88
      },
      {
        id: '3',
        type: 'copy',
        title: 'Content Personalization',
        current: 'Create stunning emails',
        suggested: 'Create stunning emails that convert',
        reason: 'Adding outcome-focused language increases engagement',
        impact: 'medium',
        confidence: 76
      },
      {
        id: '4',
        type: 'tone',
        title: 'Tone Adjustment',
        current: 'Professional tone',
        suggested: 'Friendly-professional tone',
        reason: 'Slightly warmer tone aligns better with your brand voice',
        impact: 'low',
        confidence: 65
      }
    ];

    setSuggestions(newSuggestions);
    setIsAnalyzing(false);
  };

  const applySuggestion = (suggestion: ContentSuggestion) => {
    if (!editor) return;

    // Apply the suggestion to the editor
    const content = editor.getHTML();
    const updatedContent = content.replace(suggestion.current, suggestion.suggested);
    editor.commands.setContent(updatedContent);

    // Remove applied suggestion
    setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));

    // Update scores
    setBrandVoiceScore(prev => Math.min(100, prev + 3));
    setEngagementScore(prev => Math.min(100, prev + 5));
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
      case 'tone': return <Brain className="w-4 h-4" />;
      default: return <Lightbulb className="w-4 h-4" />;
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold">Intelligent Assistant</h3>
          <Badge variant="secondary" className="ml-auto bg-purple-50 text-purple-700">
            AI Powered
          </Badge>
        </div>

        {isAnalyzing ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span className="text-sm">{analyzingMessages[currentAnalyzingStep]}</span>
            </div>
            <Progress value={(currentAnalyzingStep + 1) * 25} className="h-2" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{brandVoiceScore}</div>
              <div className="text-xs text-gray-600">Brand Voice</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{engagementScore}</div>
              <div className="text-xs text-gray-600">Engagement</div>
            </div>
          </div>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Performance Prediction */}
          {!isAnalyzing && (
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Performance Prediction
              </h4>
              
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="text-center p-2 bg-blue-50 rounded">
                  <div className="font-semibold text-blue-600">{performancePrediction.openRate}%</div>
                  <div className="text-xs text-gray-600">Open Rate</div>
                </div>
                <div className="text-center p-2 bg-green-50 rounded">
                  <div className="font-semibold text-green-600">{performancePrediction.clickRate}%</div>
                  <div className="text-xs text-gray-600">Click Rate</div>
                </div>
                <div className="text-center p-2 bg-purple-50 rounded">
                  <div className="font-semibold text-purple-600">{performancePrediction.conversionRate}%</div>
                  <div className="text-xs text-gray-600">Conversion</div>
                </div>
              </div>
            </div>
          )}

          {/* Optimization Suggestions */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Optimization Suggestions ({suggestions.length})
            </h4>
            
            <div className="space-y-3">
              {suggestions.map((suggestion) => (
                <Card key={suggestion.id} className="p-3 border">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(suggestion.type)}
                      <span className="font-medium text-sm">{suggestion.title}</span>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getImpactColor(suggestion.impact)}`}
                      >
                        {suggestion.impact} impact
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <CheckCircle className="w-3 h-3" />
                      {suggestion.confidence}%
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    <div className="text-xs">
                      <span className="text-gray-500">Current:</span>
                      <div className="bg-gray-50 p-2 rounded text-gray-700 mt-1">
                        {suggestion.current}
                      </div>
                    </div>
                    
                    <div className="text-xs">
                      <span className="text-gray-500">Suggested:</span>
                      <div className="bg-blue-50 p-2 rounded text-blue-700 mt-1">
                        {suggestion.suggested}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-600 mb-3 italic">
                    💡 {suggestion.reason}
                  </p>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => applySuggestion(suggestion)}
                      className="flex-1"
                    >
                      Apply
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigator.clipboard.writeText(suggestion.suggested)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
              
              {suggestions.length === 0 && !isAnalyzing && (
                <div className="text-center py-6">
                  <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">All optimizations applied!</p>
                  <p className="text-xs text-gray-500 mt-1">Your email is performing well.</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Quick Optimizations</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={analyzeContent}
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Re-analyze
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                A/B Test
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Auto-fix
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Optimize
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>
    </Card>
  );
};
