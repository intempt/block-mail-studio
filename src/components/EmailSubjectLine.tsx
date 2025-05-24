
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Sparkles, 
  Target, 
  AlertTriangle, 
  CheckCircle,
  RefreshCw 
} from 'lucide-react';

interface EmailSubjectLineProps {
  value: string;
  onChange: (value: string) => void;
  onAIOptimize?: () => void;
  performanceScore?: number;
}

export const EmailSubjectLine: React.FC<EmailSubjectLineProps> = ({
  value,
  onChange,
  onAIOptimize,
  performanceScore = 75
}) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const characterCount = value.length;
  const isTooLong = characterCount > 50;
  const isTooShort = characterCount < 10 && characterCount > 0;

  const getScoreColor = () => {
    if (performanceScore >= 80) return 'text-green-600';
    if (performanceScore >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCharacterCountColor = () => {
    if (isTooLong) return 'text-red-600';
    if (isTooShort) return 'text-yellow-600';
    return 'text-green-600';
  };

  const generateSuggestions = async () => {
    setIsOptimizing(true);
    setShowSuggestions(true);
    
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const aiSuggestions = [
      "🚀 Transform Your Email Marketing Today",
      "Exclusive: New Features You'll Love",
      "Don't Miss Out - Limited Time Offer",
      "Your Weekly Dose of Inspiration",
      "Breaking: Industry Updates Inside"
    ];
    
    setSuggestions(aiSuggestions);
    setIsOptimizing(false);
  };

  const applySuggestion = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
  };

  return (
    <Card className="p-4 mb-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900">Subject Line</h3>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={`text-xs ${getScoreColor()}`}>
              Score: {performanceScore}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={generateSuggestions}
              disabled={isOptimizing}
              className="h-7"
            >
              {isOptimizing ? (
                <RefreshCw className="w-3 h-3 animate-spin mr-1" />
              ) : (
                <Sparkles className="w-3 h-3 mr-1" />
              )}
              AI Optimize
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter your email subject line..."
            className="text-sm"
          />
          
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className={getCharacterCountColor()}>
                {characterCount}/50 characters
              </span>
              {isTooLong && (
                <div className="flex items-center gap-1 text-red-600">
                  <AlertTriangle className="w-3 h-3" />
                  <span>May be truncated on mobile</span>
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

          {performanceScore > 0 && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Performance Score</span>
                <span className={getScoreColor()}>{performanceScore}/100</span>
              </div>
              <Progress value={performanceScore} className="h-1" />
            </div>
          )}
        </div>

        {showSuggestions && (
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-gray-700">AI Suggestions:</h4>
            {isOptimizing ? (
              <div className="text-center py-4">
                <RefreshCw className="w-4 h-4 animate-spin mx-auto mb-2 text-blue-600" />
                <p className="text-xs text-gray-600">Generating optimized subject lines...</p>
              </div>
            ) : (
              <div className="space-y-1">
                {suggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded border">
                    <span className="text-xs text-blue-900">{suggestion}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => applySuggestion(suggestion)}
                      className="h-6 px-2 text-xs"
                    >
                      Apply
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};
