
import React, { useMemo, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  RefreshCw, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Shield,
  Smartphone,
  TrendingUp
} from 'lucide-react';
import { useEmailAnalytics } from '@/analytics/react/useEmailAnalytics';

interface CanvasStatusProps {
  selectedBlockId: string | null;
  canvasWidth: number;
  previewMode: 'desktop' | 'mobile';
  emailHTML?: string;
  subjectLine?: string;
}

export const CanvasStatus: React.FC<CanvasStatusProps> = ({
  selectedBlockId,
  canvasWidth,
  previewMode,
  emailHTML = '',
  subjectLine = ''
}) => {
  const { analyze, result, isAnalyzing, error, clearCache } = useEmailAnalytics();
  const [hasContent, setHasContent] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Check if there's content to analyze
  useEffect(() => {
    const contentExists = emailHTML.trim().length > 0;
    setHasContent(contentExists);
  }, [emailHTML]);

  // Auto-expand results when analysis completes
  useEffect(() => {
    if (result && !isAnalyzing) {
      setShowResults(true);
    }
  }, [result, isAnalyzing]);

  const analyzeEmail = async () => {
    if (!emailHTML.trim()) {
      return;
    }

    await analyze({
      html: emailHTML,
      subjectLine: subjectLine
    });
  };

  const refreshAnalytics = async () => {
    await clearCache();
    analyzeEmail();
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-gradient-to-r from-purple-600 via-violet-600 to-purple-700 border-t border-purple-500">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-white/20 rounded-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-base">Email Analytics</h3>
              <p className="text-purple-100 text-sm">Get AI-powered email optimization suggestions</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {result && (
              <Button
                variant="ghost"
                size="sm"
                onClick={refreshAnalytics}
                disabled={isAnalyzing}
                className="h-8 px-3 text-xs text-white hover:bg-white/20 hover:text-white border border-white/30"
              >
                {isAnalyzing ? (
                  <RefreshCw className="w-3 h-3 animate-spin mr-1" />
                ) : (
                  <RefreshCw className="w-3 h-3 mr-1" />
                )}
                Refresh
              </Button>
            )}
            
            <Button 
              onClick={analyzeEmail} 
              className="bg-white text-purple-700 hover:bg-purple-50 font-medium px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-200"
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              {isAnalyzing ? 'Analyzing...' : result ? 'Re-analyze Email' : 'Analyze Email'}
            </Button>
          </div>
        </div>
        
        {error && (
          <div className="mt-3 px-3 py-2 bg-red-500/20 border border-red-400/30 rounded text-red-100 text-sm">
            {error}
          </div>
        )}

        {/* Analytics Results Panel */}
        {result && (
          <Collapsible open={showResults} onOpenChange={setShowResults} className="mt-4">
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full justify-between text-white hover:bg-white/10 p-3"
              >
                <span className="font-medium">Analysis Results</span>
                {showResults ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="mt-3">
              <Card className="bg-white/95 backdrop-blur-sm p-4 space-y-4">
                {/* Scores Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="text-center p-3 bg-slate-50 rounded">
                    <div className={`text-2xl font-bold ${getScoreColor(result.scores.overallScore)}`}>
                      {result.scores.overallScore}
                    </div>
                    <div className="text-xs text-gray-600 flex items-center justify-center gap-1">
                      <BarChart3 className="w-3 h-3" />
                      Overall
                    </div>
                  </div>
                  
                  <div className="text-center p-3 bg-slate-50 rounded">
                    <div className={`text-2xl font-bold ${getScoreColor(result.scores.deliverabilityScore)}`}>
                      {result.scores.deliverabilityScore}
                    </div>
                    <div className="text-xs text-gray-600 flex items-center justify-center gap-1">
                      <Shield className="w-3 h-3" />
                      Delivery
                    </div>
                  </div>
                  
                  <div className="text-center p-3 bg-slate-50 rounded">
                    <div className={`text-2xl font-bold ${getScoreColor(result.scores.mobileScore)}`}>
                      {result.scores.mobileScore}
                    </div>
                    <div className="text-xs text-gray-600 flex items-center justify-center gap-1">
                      <Smartphone className="w-3 h-3" />
                      Mobile
                    </div>
                  </div>
                  
                  <div className="text-center p-3 bg-slate-50 rounded">
                    <div className={`text-2xl font-bold ${result.scores.spamScore > 20 ? 'text-red-600' : 'text-green-600'}`}>
                      {result.scores.spamScore}
                    </div>
                    <div className="text-xs text-gray-600">
                      Spam Risk
                    </div>
                  </div>
                </div>

                {/* Predictions */}
                <div className="bg-blue-50 p-3 rounded flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Predicted Performance</span>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <span className="text-blue-700">Open: {result.prediction.openRate}%</span>
                    <span className="text-blue-700">Click: {result.prediction.clickRate}%</span>
                    <span className="text-blue-700">Convert: {result.prediction.conversionRate}%</span>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Size:</span>
                    <span className="font-medium">{result.metrics.sizeKB} KB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Words:</span>
                    <span className="font-medium">{result.metrics.wordCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Images:</span>
                    <span className="font-medium">{result.metrics.imageCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Links:</span>
                    <span className="font-medium">{result.metrics.linkCount}</span>
                  </div>
                </div>

                {/* Suggestions */}
                {result.suggestions && result.suggestions.length > 0 && (
                  <div className="border-t pt-3">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">AI Suggestions</h4>
                    <div className="space-y-2">
                      {result.suggestions.slice(0, 3).map((suggestion, index) => (
                        <div key={index} className="text-xs bg-amber-50 border border-amber-200 rounded p-2">
                          💡 {suggestion.message || suggestion}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>
    </div>
  );
};
