
import React, { useMemo, useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  BarChart3, 
  Brain, 
  TrendingUp, 
  RefreshCw, 
  Shield,
  Sparkles,
  Target,
  FileText,
  MousePointer,
  Mail,
  Image,
  Link
} from 'lucide-react';
import { UnifiedEmailAnalyticsService, UnifiedEmailAnalytics } from '@/services/unifiedEmailAnalytics';

interface CanvasStatusProps {
  selectedBlockId: string | null;
  canvasWidth: number;
  previewMode: 'desktop' | 'mobile';
  emailHTML?: string;
  subjectLine?: string;
}

interface MetricDisplayItem {
  key: keyof UnifiedEmailAnalytics;
  label: string;
  icon?: React.ReactNode;
  format: (value: any) => string;
  priority: number;
}

export const CanvasStatus: React.FC<CanvasStatusProps> = ({
  selectedBlockId,
  canvasWidth,
  previewMode,
  emailHTML = '',
  subjectLine = ''
}) => {
  const [analytics, setAnalytics] = useState<UnifiedEmailAnalytics | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasContent, setHasContent] = useState(false);

  // Check if there's content to analyze
  useEffect(() => {
    const contentExists = emailHTML.trim().length > 0;
    setHasContent(contentExists);
  }, [emailHTML]);

  const analyzeEmail = async () => {
    if (!emailHTML.trim()) {
      setAnalytics(null);
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await UnifiedEmailAnalyticsService.analyzeEmail(emailHTML, subjectLine);
      setAnalytics(result);
    } catch (error) {
      console.error('Analytics error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const refreshAnalytics = () => {
    UnifiedEmailAnalyticsService.clearCache();
    analyzeEmail();
  };

  // Define metrics in priority order for display
  const metricDefinitions: MetricDisplayItem[] = [
    { key: 'overallScore', label: 'Overall', icon: <BarChart3 className="w-3 h-3" />, format: (v) => `${v || '--'}/100`, priority: 1 },
    { key: 'deliverabilityScore', label: 'Deliverability', icon: <Mail className="w-3 h-3" />, format: (v) => `${v || '--'}`, priority: 2 },
    { key: 'spamScore', label: 'Spam Risk', icon: <Shield className="w-3 h-3" />, format: (v) => `${v || '--'}%`, priority: 3 },
    { key: 'mobileScore', label: 'Mobile', icon: <Target className="w-3 h-3" />, format: (v) => `${v || '--'}`, priority: 4 },
    { key: 'performancePrediction', label: 'Open Rate', icon: <TrendingUp className="w-3 h-3" />, format: (v) => `${v?.openRate || '--'}%`, priority: 5 },
    { key: 'performancePrediction', label: 'Click Rate', icon: <MousePointer className="w-3 h-3" />, format: (v) => `${v?.clickRate || '--'}%`, priority: 6 },
    { key: 'subjectLineLength', label: 'Subject', icon: <FileText className="w-3 h-3" />, format: (v) => `${v}c`, priority: 7 },
    { key: 'ctaCount', label: 'CTAs', icon: <MousePointer className="w-3 h-3" />, format: (v) => `${v}`, priority: 8 },
    { key: 'readingLevel', label: 'Reading', icon: <Brain className="w-3 h-3" />, format: (v) => `${v}gr`, priority: 9 },
    { key: 'personalizedScore', label: 'Personal', icon: <Target className="w-3 h-3" />, format: (v) => `${v || '--'}%`, priority: 10 },
    { key: 'imageCount', label: 'Images', icon: <Image className="w-3 h-3" />, format: (v) => `${v}`, priority: 11 },
    { key: 'wordCount', label: 'Words', icon: <FileText className="w-3 h-3" />, format: (v) => `${v}`, priority: 12 }
  ];

  const getMetricColor = (key: keyof UnifiedEmailAnalytics, value: any) => {
    if (!analytics || value === null || value === undefined) return 'text-gray-500';
    
    let numericValue = value;
    if (key === 'performancePrediction') return 'text-blue-600';
    if (typeof value === 'object') return 'text-gray-600';
    
    const status = UnifiedEmailAnalyticsService.getMetricBenchmark(key, numericValue);
    switch (status) {
      case 'good': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  // No content state - prominent call-to-action style
  if (!hasContent && !analytics) {
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
                <p className="text-purple-100 text-sm">Get AI-powered optimization insights for your email</p>
              </div>
            </div>
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
              {isAnalyzing ? 'Analyzing...' : 'Analyze Email'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (isAnalyzing) {
    return (
      <div className="bg-gradient-to-r from-purple-600 via-violet-600 to-purple-700 border-t border-purple-500">
        <div className="px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-white/20 rounded-lg">
              <RefreshCw className="w-6 h-6 animate-spin text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-base">AI analyzing your email...</h3>
              <p className="text-purple-100 text-sm">Generating optimization insights and performance predictions</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-purple-600 via-violet-600 to-purple-700 border-t border-purple-500">
      <div className="px-6 py-3">
        {/* Header with controls */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-white/20 rounded">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-medium text-sm">Email Analytics</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={refreshAnalytics}
              disabled={isAnalyzing}
              className="h-6 px-2 text-xs text-white hover:bg-white/20 hover:text-white"
            >
              {isAnalyzing ? (
                <RefreshCw className="w-3 h-3 animate-spin mr-1" />
              ) : (
                <RefreshCw className="w-3 h-3 mr-1" />
              )}
              Refresh
            </Button>
          </div>
        </div>

        {/* Metrics Bar */}
        {analytics && (
          <ScrollArea className="w-full">
            <div className="flex items-center gap-4 pb-1">
              {metricDefinitions.map((metric, index) => {
                let value = analytics[metric.key];
                if (metric.key === 'performancePrediction' && metric.label === 'Click Rate') {
                  value = analytics.performancePrediction;
                }
                
                return (
                  <div key={`${metric.key}-${index}`} className="flex items-center gap-1.5 whitespace-nowrap">
                    <div className="text-white/80">
                      {metric.icon}
                    </div>
                    <span className="text-xs text-white/90">{metric.label}:</span>
                    <Badge 
                      variant="outline" 
                      className="text-xs px-1.5 py-0.5 bg-white/20 border-white/30 text-white"
                    >
                      {metric.format(value)}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
};
