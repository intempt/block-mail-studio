
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
  Lightbulb,
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

  // Loading state
  if (isAnalyzing) {
    return (
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-t border-gray-200">
        <div className="px-6 py-3">
          <div className="flex items-center gap-3">
            <RefreshCw className="w-4 h-4 animate-spin text-purple-600" />
            <span className="text-sm text-gray-600">AI analyzing email content...</span>
          </div>
        </div>
      </div>
    );
  }

  // No content state
  if (!hasContent && !analytics) {
    return (
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-t border-gray-200">
        <div className="px-6 py-3">
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={analyzeEmail} 
              className="h-6 text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50"
            >
              <Lightbulb className="w-4 h-4 mr-1" />
              AI Analytics
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-t border-gray-200">
      <div className="px-6 py-3">
        {/* Header with controls */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium">Email Analytics</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={refreshAnalytics}
              disabled={isAnalyzing}
              className="h-6 px-2 text-xs text-purple-600 hover:text-purple-700"
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
                    {metric.icon}
                    <span className="text-xs text-gray-700">{metric.label}:</span>
                    <Badge 
                      variant="outline" 
                      className={`text-xs px-1.5 py-0.5 ${getMetricColor(metric.key, value)}`}
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
