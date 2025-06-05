
import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  BarChart3, 
  CheckCircle, 
  AlertTriangle, 
  Zap, 
  Clock,
  TrendingUp,
  RefreshCw,
  Monitor,
  Smartphone,
  Mail,
  Shield
} from 'lucide-react';
import { DirectAIService } from '@/services/directAIService';
import { PerformanceAnalysisResult } from '@/services/EmailAIService';

interface EnhancedPerformanceAnalyzerProps {
  emailHTML: string;
  subjectLine: string;
  onOptimize?: (suggestion: string) => void;
}

export const EnhancedPerformanceAnalyzer: React.FC<EnhancedPerformanceAnalyzerProps> = ({
  emailHTML,
  subjectLine,
  onOptimize
}) => {
  const [analysis, setAnalysis] = useState<PerformanceAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [autoAnalyze, setAutoAnalyze] = useState(true);

  const runAnalysis = useCallback(async () => {
    if (!emailHTML.trim()) {
      setAnalysis(null);
      return;
    }

    setIsAnalyzing(true);
    try {
      console.log('Direct performance analysis...');
      
      const result = await DirectAIService.analyzePerformance(emailHTML, subjectLine);
      console.log('Direct performance analysis completed:', result);
      
      if (result.success && result.data) {
        setAnalysis(result.data);
      } else {
        setAnalysis(null);
        console.log("Analysis Failed. Unable to analyze email performance. Please try again.");
      }
    } catch (error) {
      console.error('Error analyzing performance:', error);
      console.log("Analysis Failed. Unable to analyze email performance. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  }, [emailHTML, subjectLine]);

  // Auto-analyze when content changes
  useEffect(() => {
    if (!autoAnalyze) return;

    const timer = setTimeout(() => {
      if (emailHTML.trim()) {
        runAnalysis();
      }
    }, 2000); // Slightly longer debounce since no caching

    return () => clearTimeout(timer);
  }, [emailHTML, subjectLine, autoAnalyze, runAnalysis]);

  const getScoreColor = (score: number | null) => {
    if (score === null) return 'text-gray-600';
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'poor': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with Controls */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Enhanced Performance Analysis
          </h3>
          <div className="flex items-center gap-2">
            <Badge variant={autoAnalyze ? "default" : "outline"} className="text-xs">
              Auto-analyze: {autoAnalyze ? 'ON' : 'OFF'}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAutoAnalyze(!autoAnalyze)}
              className="h-7"
            >
              {autoAnalyze ? 'Manual' : 'Auto'}
            </Button>
            <Button
              size="sm"
              onClick={runAnalysis}
              disabled={isAnalyzing}
              className="h-7"
            >
              {isAnalyzing ? (
                <RefreshCw className="w-3 h-3 animate-spin mr-1" />
              ) : (
                <Zap className="w-3 h-3 mr-1" />
              )}
              Analyze
            </Button>
          </div>
        </div>

        {/* Overall Scores */}
        {analysis && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-fade-in">
            <div className="text-center p-3 bg-slate-50 rounded">
              <div className={`text-2xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                {analysis.overallScore || '--'}
              </div>
              <div className="text-xs text-gray-600">Overall</div>
            </div>
            <div className="text-center p-3 bg-slate-50 rounded">
              <div className={`text-2xl font-bold ${getScoreColor(analysis.deliverabilityScore)}`}>
                {analysis.deliverabilityScore || '--'}
              </div>
              <div className="text-xs text-gray-600">Deliverability</div>
            </div>
            <div className="text-center p-3 bg-slate-50 rounded">
              <div className={`text-2xl font-bold ${getScoreColor(analysis.mobileScore)}`}>
                {analysis.mobileScore || '--'}
              </div>
              <div className="text-xs text-gray-600">Mobile</div>
            </div>
            <div className="text-center p-3 bg-slate-50 rounded">
              <div className={`text-2xl font-bold ${analysis.spamScore !== null ? analysis.spamScore > 20 ? 'text-red-600' : 'text-green-600' : 'text-gray-600'}`}>
                {analysis.spamScore || '--'}
              </div>
              <div className="text-xs text-gray-600">Spam Risk</div>
            </div>
          </div>
        )}

        {isAnalyzing && !analysis && (
          <div className="text-center py-6">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
            <p className="text-sm text-gray-600">Analyzing email performance...</p>
          </div>
        )}
      </Card>

      {/* Detailed Metrics */}
      {analysis && (
        <Card className="p-4 animate-scale-in">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <Monitor className="w-4 h-4" />
            Technical Metrics
          </h4>
          <div className="space-y-3">
            {Object.entries(analysis.metrics).map(([key, metric]) => (
              <div key={key} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <Badge className={`text-xs ${getStatusColor(metric.status)}`}>
                    {metric.status}
                  </Badge>
                </div>
                <div className="text-sm font-mono">
                  {metric.value !== null ? 
                    (key === 'loadTime' ? `${metric.value}s` : metric.value) : 
                    '--'
                  }
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Accessibility Issues */}
      {analysis && analysis.accessibilityIssues.length > 0 && (
        <Card className="p-4 animate-slide-in-right">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Accessibility Issues ({analysis.accessibilityIssues.length})
          </h4>
          <ScrollArea className="max-h-48">
            <div className="space-y-2">
              {analysis.accessibilityIssues.map((issue, index) => (
                <div key={index} className="p-3 border rounded hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge className={`text-xs ${getSeverityColor(issue.severity)}`}>
                        {issue.severity}
                      </Badge>
                      <span className="text-sm font-medium">{issue.type}</span>
                    </div>
                    <AlertTriangle className={`w-4 h-4 ${getSeverityColor(issue.severity)}`} />
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{issue.description}</p>
                  <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                    💡 {issue.fix}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>
      )}

      {/* Optimization Suggestions */}
      {analysis && analysis.optimizationSuggestions.length > 0 && (
        <Card className="p-4 animate-fade-in">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            AI Optimization Suggestions
          </h4>
          <div className="space-y-2">
            {analysis.optimizationSuggestions.map((suggestion, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                <span className="text-sm text-blue-900 flex-1">{suggestion}</span>
                {onOptimize && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onOptimize(suggestion)}
                    className="ml-2 h-7 text-xs"
                  >
                    Apply
                  </Button>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* No Analysis State */}
      {!analysis && !isAnalyzing && (
        <Card className="p-6 text-center">
          <Mail className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">
            {autoAnalyze ? 'Add email content to see performance analysis' : 'Click Analyze to check performance'}
          </p>
        </Card>
      )}
    </div>
  );
};
