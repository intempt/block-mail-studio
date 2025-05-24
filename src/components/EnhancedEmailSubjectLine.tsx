
import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Sparkles, 
  Target, 
  AlertTriangle, 
  CheckCircle,
  RefreshCw,
  Copy,
  TrendingUp,
  Zap,
  BarChart3
} from 'lucide-react';

// Simple mock interface
interface SubjectLineAnalysisResult {
  score: number | null;
  spamRisk: string;
  length: number;
  emotionalImpact: number | null;
  urgencyLevel: number | null;
  recommendations: string[];
  benchmarkComparison: {
    predictedOpenRate: number | null;
  };
}

interface EnhancedEmailSubjectLineProps {
  value: string;
  onChange: (value: string) => void;
  emailContent?: string;
  onAnalysisComplete?: (analysis: SubjectLineAnalysisResult) => void;
}

export const EnhancedEmailSubjectLine: React.FC<EnhancedEmailSubjectLineProps> = ({
  value,
  onChange,
  emailContent = '',
  onAnalysisComplete
}) => {
  const [analysis, setAnalysis] = useState<SubjectLineAnalysisResult | null>(null);
  const [variants, setVariants] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingVariants, setIsGeneratingVariants] = useState(false);
  const [showVariants, setShowVariants] = useState(false);

  const analyzeSubjectLine = useCallback(async () => {
    if (!value.trim()) {
      setAnalysis(null);
      return;
    }

    setIsAnalyzing(true);
    try {
      console.log('Analyzing subject line:', value);
      
      // Mock analysis with safe defaults
      const result: SubjectLineAnalysisResult = {
        score: 82,
        spamRisk: 'low',
        length: value.length,
        emotionalImpact: 75,
        urgencyLevel: 60,
        recommendations: ['Consider adding urgency', 'Use action words'],
        benchmarkComparison: {
          predictedOpenRate: 26.3
        }
      };
      
      setAnalysis(result);
      onAnalysisComplete?.(result);
      
    } catch (error) {
      console.error('Error analyzing subject line:', error);
      setAnalysis(null);
    } finally {
      setIsAnalyzing(false);
    }
  }, [value, emailContent, onAnalysisComplete]);

  const generateVariants = async () => {
    if (!value.trim()) return;

    setIsGeneratingVariants(true);
    setShowVariants(true);
    
    try {
      console.log('Generating subject line variants:', value);
      
      // Mock variants
      const newVariants = [
        "🚀 " + value,
        value + " - Limited Time!",
        "Don't Miss: " + value,
        value.replace(/get/gi, 'discover')
      ].filter(v => v !== value).slice(0, 3);
      
      setVariants(newVariants);
    } catch (error) {
      console.error('Error generating variants:', error);
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

  // Auto-analyze when value changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (value.trim()) {
        analyzeSubjectLine();
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [value, analyzeSubjectLine]);

  const characterCount = value.length;
  const isTooLong = characterCount > 50;
  const isTooShort = characterCount < 10 && characterCount > 0;

  const getScoreColor = (score: number | null) => {
    if (score === null) return 'text-gray-600';
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSpamRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'high': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <Card className="p-4 mb-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2">
            <Target className="w-4 h-4" />
            Subject Line
          </h3>
          <div className="flex items-center gap-2">
            {analysis?.score !== null && analysis?.score !== undefined && (
              <Badge variant="outline" className={`text-xs ${getScoreColor(analysis.score)}`}>
                Score: {analysis.score || '--'}
              </Badge>
            )}
            {analysis?.spamRisk && analysis.spamRisk !== 'unknown' && (
              <Badge className={`text-xs ${getSpamRiskColor(analysis.spamRisk)}`}>
                {analysis.spamRisk.toUpperCase()} Risk
              </Badge>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={generateVariants}
              disabled={isGeneratingVariants || !value.trim()}
              className="h-7"
            >
              {isGeneratingVariants ? (
                <RefreshCw className="w-3 h-3 animate-spin mr-1" />
              ) : (
                <Sparkles className="w-3 h-3 mr-1" />
              )}
              Variants
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="relative">
            <Input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Enter your email subject line..."
              className="text-sm pr-10"
            />
            {isAnalyzing && (
              <RefreshCw className="w-4 h-4 animate-spin absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
            )}
          </div>
          
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

          {/* Analysis Results */}
          {analysis && (
            <div className="space-y-2 p-3 bg-slate-50 rounded-lg">
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center p-2 bg-white rounded">
                  <div className="font-semibold text-purple-600">
                    {analysis?.emotionalImpact || '--'}
                  </div>
                  <div className="text-gray-600">Emotion</div>
                </div>
                <div className="text-center p-2 bg-white rounded">
                  <div className="font-semibold text-orange-600">
                    {analysis?.urgencyLevel || '--'}
                  </div>
                  <div className="text-gray-600">Urgency</div>
                </div>
                <div className="text-center p-2 bg-white rounded">
                  <div className="font-semibold text-blue-600">
                    {analysis?.benchmarkComparison?.predictedOpenRate?.toFixed(1) || '--'}%
                  </div>
                  <div className="text-gray-600">Est. Open</div>
                </div>
              </div>

              {analysis.recommendations && analysis.recommendations.length > 0 && (
                <div className="bg-blue-50 p-2 rounded">
                  <div className="text-xs font-medium text-blue-900 mb-1">💡 Recommendations:</div>
                  <div className="space-y-1">
                    {analysis.recommendations.slice(0, 2).map((rec, index) => (
                      <div key={index} className="text-xs text-blue-800">• {rec}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* A/B Test Variants */}
          {showVariants && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-medium text-gray-700 flex items-center gap-1">
                  <BarChart3 className="w-3 h-3" />
                  Variants:
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
                  <RefreshCw className="w-4 h-4 animate-spin mx-auto mb-2 text-blue-600" />
                  <p className="text-xs text-gray-600">Generating variants...</p>
                </div>
              ) : (
                <ScrollArea className="max-h-40">
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
    </Card>
  );
};
