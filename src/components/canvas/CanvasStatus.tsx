
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  BarChart3, 
  CheckCircle, 
  AlertTriangle, 
  Zap, 
  Clock,
  Smartphone,
  Monitor,
  Target,
  TrendingUp,
  RefreshCw,
  Wifi,
  WifiOff,
  Shield,
  Lightbulb,
  FileCheck,
  Eye,
  Layout,
  User,
  Brain,
  Type,
  Image,
  Link,
  Mail,
  Globe,
  Accessibility,
  Timer,
  MessageSquare,
  Star
} from 'lucide-react';
import { useEmailAnalytics } from '@/analytics/react/useEmailAnalytics';
import { CriticalEmailAnalysisService, CriticalSuggestion } from '@/services/criticalEmailAnalysisService';
import { CentralizedAIAnalysisService, CompleteAnalysisResult } from '@/services/CentralizedAIAnalysisService';
import { ApiKeyService } from '@/services/apiKeyService';
import { toast } from 'sonner';
import { ComprehensiveMetricsService, ComprehensiveEmailMetrics } from '@/services/comprehensiveMetricsService';

interface CanvasStatusProps {
  selectedBlockId: string | null;
  canvasWidth: number;
  previewMode: 'desktop' | 'mobile';
  emailHTML: string;
  subjectLine: string;
  onApplyFix: (fixedContent: string, fixType?: 'subject' | 'content') => void;
}

export const CanvasStatus: React.FC<CanvasStatusProps> = ({
  selectedBlockId,
  canvasWidth,
  previewMode,
  emailHTML,
  subjectLine,
  onApplyFix
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [criticalSuggestions, setCriticalSuggestions] = useState<CriticalSuggestion[]>([]);
  const [comprehensiveAnalysis, setComprehensiveAnalysis] = useState<CompleteAnalysisResult | null>(null);
  const [appliedFixes, setAppliedFixes] = useState<Set<string>>(new Set());
  const [analysisTimestamp, setAnalysisTimestamp] = useState<number>(0);
  const [comprehensiveMetrics, setComprehensiveMetrics] = useState<ComprehensiveEmailMetrics | null>(null);

  const { analyze, result, isAnalyzing: isAnalyticsAnalyzing, clearCache } = useEmailAnalytics();

  const runCompleteAnalysis = async () => {
    if (!emailHTML.trim() || emailHTML.length < 50) {
      toast.error('Add more content before analyzing');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisTimestamp(Date.now());
    
    try {
      // Calculate comprehensive metrics using the new service
      const metrics = ComprehensiveMetricsService.calculateMetrics(emailHTML, subjectLine);
      setComprehensiveMetrics(metrics);

      // Clear previous results and cache
      setCriticalSuggestions([]);
      setComprehensiveAnalysis(null);
      setAppliedFixes(new Set());
      clearCache();

      await analyze({ html: emailHTML, subjectLine });

      const critical = await CriticalEmailAnalysisService.analyzeCriticalIssues(emailHTML, subjectLine);
      setCriticalSuggestions(critical);

      if (ApiKeyService.isKeyAvailable()) {
        const comprehensive = await CentralizedAIAnalysisService.runCompleteAnalysis(emailHTML, subjectLine);
        setComprehensiveAnalysis(comprehensive);
      }

      toast.success('Analysis complete! Review suggestions below.');
    } catch (error) {
      console.error('Analysis failed:', error);
      toast.error('Analysis failed. Check your API configuration.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Auto-calculate metrics when content changes
  useEffect(() => {
    if (emailHTML.trim()) {
      const metrics = ComprehensiveMetricsService.calculateMetrics(emailHTML, subjectLine);
      setComprehensiveMetrics(metrics);
    }
  }, [emailHTML, subjectLine]);

  const handleApplyFix = async (suggestion: CriticalSuggestion) => {
    if (appliedFixes.has(suggestion.id)) {
      toast.warning('Fix already applied');
      return;
    }

    try {
      let updatedContent = emailHTML;
      let fixType: 'subject' | 'content' = 'content';

      if (suggestion.category === 'subject' && suggestion.suggested) {
        onApplyFix(suggestion.suggested, 'subject');
        fixType = 'subject';
        toast.success('Subject line updated!');
      } else if (suggestion.current && suggestion.suggested) {
        updatedContent = emailHTML.replace(suggestion.current, suggestion.suggested);
        
        if (updatedContent !== emailHTML) {
          onApplyFix(updatedContent, 'content');
          toast.success('Content updated!');
        } else {
          const lines = emailHTML.split('\n');
          const updatedLines = lines.map(line => {
            if (line.includes(suggestion.current)) {
              return line.replace(suggestion.current, suggestion.suggested);
            }
            return line;
          });
          updatedContent = updatedLines.join('\n');
          
          if (updatedContent !== emailHTML) {
            onApplyFix(updatedContent, 'content');
            toast.success('Content updated!');
          } else {
            toast.warning('Could not automatically apply this fix');
            return;
          }
        }
      } else {
        toast.warning('This fix cannot be applied automatically');
        return;
      }

      setAppliedFixes(prev => new Set([...prev, suggestion.id]));
      
    } catch (error) {
      console.error('Error applying fix:', error);
      toast.error('Failed to apply fix');
    }
  };

  const handleApplyAllAutoFixes = async () => {
    const autoFixableSuggestions = criticalSuggestions.filter(s => 
      s.autoFixable && !appliedFixes.has(s.id)
    );

    if (autoFixableSuggestions.length === 0) {
      toast.info('No auto-fixable suggestions available');
      return;
    }

    for (const suggestion of autoFixableSuggestions) {
      await handleApplyFix(suggestion);
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    toast.success(`Applied ${autoFixableSuggestions.length} auto-fixes!`);
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'high': return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'medium': return <CheckCircle className="w-4 h-4 text-yellow-500" />;
      case 'low': return <CheckCircle className="w-4 h-4 text-blue-500" />;
      default: return <Lightbulb className="w-4 h-4 text-gray-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'subject': return <Target className="w-4 h-4" />;
      case 'deliverability': return <Shield className="w-4 h-4" />;
      case 'cta': return <Zap className="w-4 h-4" />;
      case 'mobile': return <Smartphone className="w-4 h-4" />;
      case 'compliance': return <FileCheck className="w-4 h-4" />;
      case 'accessibility': return <Eye className="w-4 h-4" />;
      case 'structure': return <Layout className="w-4 h-4" />;
      case 'personalization': return <User className="w-4 h-4" />;
      case 'tone': return <Brain className="w-4 h-4" />;
      default: return <Lightbulb className="w-4 h-4" />;
    }
  };

  const hasAnalysisResults = criticalSuggestions.length > 0 || comprehensiveAnalysis || result;
  const autoFixableCount = criticalSuggestions.filter(s => s.autoFixable && !appliedFixes.has(s.id)).length;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">AI Analysis Center</h3>
              <p className="text-sm text-gray-600">Analyze • Suggest • Fix your email automatically</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800">
              {previewMode === 'mobile' ? 'Mobile' : 'Desktop'} View
            </Badge>
          </div>
        </div>

        {!hasAnalysisResults ? (
          <Button 
            onClick={runCompleteAnalysis} 
            disabled={isAnalyzing || !emailHTML.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Analyzing Email...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Analyze & Fix Email
              </>
            )}
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button 
              onClick={runCompleteAnalysis} 
              disabled={isAnalyzing}
              variant="outline"
              size="sm"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Re-analyze
            </Button>
            {autoFixableCount > 0 && (
              <Button 
                onClick={handleApplyAllAutoFixes}
                size="sm"
                className="bg-green-600 hover:bg-green-700"
              >
                <Zap className="w-4 h-4 mr-2" />
                Apply All Auto-Fixes ({autoFixableCount})
              </Button>
            )}
          </div>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Compact Horizontal Metrics Strip */}
          {comprehensiveMetrics && (
            <Card className="p-3">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Comprehensive Email Metrics
              </h4>
              
              {/* Horizontal Scrollable Metrics Strip */}
              <div className="relative">
                <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  
                  {/* Content Group */}
                  <div className="flex items-center gap-1 pr-3 border-r border-gray-200">
                    <div className="text-center p-1 bg-blue-50 rounded border border-blue-100 min-w-[48px]">
                      <Type className="w-2 h-2 mx-auto mb-0.5 text-blue-600" />
                      <div className="text-xs font-bold text-blue-600">{comprehensiveMetrics.wordCount}</div>
                      <div className="text-[10px] text-gray-600 leading-tight">Words</div>
                    </div>
                    <div className="text-center p-1 bg-green-50 rounded border border-green-100 min-w-[48px]">
                      <Timer className="w-2 h-2 mx-auto mb-0.5 text-green-600" />
                      <div className="text-xs font-bold text-green-600">{comprehensiveMetrics.readTimeMinutes}m</div>
                      <div className="text-[10px] text-gray-600 leading-tight">Read</div>
                    </div>
                    <div className="text-center p-1 bg-purple-50 rounded border border-purple-100 min-w-[48px]">
                      <Image className="w-2 h-2 mx-auto mb-0.5 text-purple-600" />
                      <div className="text-xs font-bold text-purple-600">{comprehensiveMetrics.imageCount}</div>
                      <div className="text-[10px] text-gray-600 leading-tight">Images</div>
                    </div>
                    <div className="text-center p-1 bg-indigo-50 rounded border border-indigo-100 min-w-[48px]">
                      <Link className="w-2 h-2 mx-auto mb-0.5 text-indigo-600" />
                      <div className="text-xs font-bold text-indigo-600">{comprehensiveMetrics.linkCount}</div>
                      <div className="text-[10px] text-gray-600 leading-tight">Links</div>
                    </div>
                    <div className="text-center p-1 bg-orange-50 rounded border border-orange-100 min-w-[48px]">
                      <Target className="w-2 h-2 mx-auto mb-0.5 text-orange-600" />
                      <div className="text-xs font-bold text-orange-600">{comprehensiveMetrics.ctaCount}</div>
                      <div className="text-[10px] text-gray-600 leading-tight">CTAs</div>
                    </div>
                  </div>

                  {/* Performance Group */}
                  <div className="flex items-center gap-1 px-3 border-r border-gray-200">
                    <div className="text-center p-1 bg-gray-50 rounded border border-gray-100 min-w-[48px]">
                      <Globe className="w-2 h-2 mx-auto mb-0.5 text-gray-600" />
                      <div className={`text-xs font-bold ${ComprehensiveMetricsService.getMetricColor(comprehensiveMetrics.sizeKB, 'size')}`}>
                        {comprehensiveMetrics.sizeKB}KB
                      </div>
                      <div className="text-[10px] text-gray-600 leading-tight">Size</div>
                    </div>
                    <div className="text-center p-1 bg-yellow-50 rounded border border-yellow-100 min-w-[48px]">
                      <Clock className="w-2 h-2 mx-auto mb-0.5 text-yellow-600" />
                      <div className="text-xs font-bold text-yellow-600">{comprehensiveMetrics.loadTimeEstimate}</div>
                      <div className="text-[10px] text-gray-600 leading-tight">Load</div>
                    </div>
                    <div className="text-center p-1 bg-pink-50 rounded border border-pink-100 min-w-[48px]">
                      <Smartphone className="w-2 h-2 mx-auto mb-0.5 text-pink-600" />
                      <div className={`text-xs font-bold ${ComprehensiveMetricsService.getMetricColor(comprehensiveMetrics.mobileScore, 'score')}`}>
                        {comprehensiveMetrics.mobileScore}
                      </div>
                      <div className="text-[10px] text-gray-600 leading-tight">Mobile</div>
                    </div>
                    <div className="text-center p-1 bg-teal-50 rounded border border-teal-100 min-w-[48px]">
                      <Eye className="w-2 h-2 mx-auto mb-0.5 text-teal-600" />
                      <div className={`text-xs font-bold ${ComprehensiveMetricsService.getMetricColor(comprehensiveMetrics.accessibilityScore, 'score')}`}>
                        {comprehensiveMetrics.accessibilityScore}
                      </div>
                      <div className="text-[10px] text-gray-600 leading-tight">A11y</div>
                    </div>
                  </div>

                  {/* Deliverability Group */}
                  <div className="flex items-center gap-1 px-3 border-r border-gray-200">
                    <div className="text-center p-1 bg-red-50 rounded border border-red-100 min-w-[48px]">
                      <Shield className="w-2 h-2 mx-auto mb-0.5 text-red-600" />
                      <div className={`text-xs font-bold ${ComprehensiveMetricsService.getMetricColor(100 - comprehensiveMetrics.spamScore, 'score')}`}>
                        {comprehensiveMetrics.spamScore}%
                      </div>
                      <div className="text-[10px] text-gray-600 leading-tight">Spam</div>
                    </div>
                    <div className="text-center p-1 bg-emerald-50 rounded border border-emerald-100 min-w-[48px]">
                      <Mail className="w-2 h-2 mx-auto mb-0.5 text-emerald-600" />
                      <div className={`text-xs font-bold ${ComprehensiveMetricsService.getMetricColor(comprehensiveMetrics.deliverabilityScore, 'score')}`}>
                        {comprehensiveMetrics.deliverabilityScore}
                      </div>
                      <div className="text-[10px] text-gray-600 leading-tight">Deliver</div>
                    </div>
                    <div className="text-center p-1 bg-cyan-50 rounded border border-cyan-100 min-w-[48px]">
                      <MessageSquare className="w-2 h-2 mx-auto mb-0.5 text-cyan-600" />
                      <div className={`text-xs font-bold ${ComprehensiveMetricsService.getMetricColor(comprehensiveMetrics.subjectLineScore, 'score')}`}>
                        {comprehensiveMetrics.subjectLineScore}
                      </div>
                      <div className="text-[10px] text-gray-600 leading-tight">Subject</div>
                    </div>
                  </div>

                  {/* Engagement Group */}
                  <div className="flex items-center gap-1 px-3 border-r border-gray-200">
                    <div className="text-center p-1 bg-violet-50 rounded border border-violet-100 min-w-[48px]">
                      <User className="w-2 h-2 mx-auto mb-0.5 text-violet-600" />
                      <div className={`text-xs font-bold ${ComprehensiveMetricsService.getMetricColor(comprehensiveMetrics.personalizationLevel, 'score')}`}>
                        {comprehensiveMetrics.personalizationLevel}
                      </div>
                      <div className="text-[10px] text-gray-600 leading-tight">Personal</div>
                    </div>
                    <div className="text-center p-1 bg-rose-50 rounded border border-rose-100 min-w-[48px]">
                      <TrendingUp className="w-2 h-2 mx-auto mb-0.5 text-rose-600" />
                      <div className="text-xs font-bold text-rose-600">{comprehensiveMetrics.engagementPrediction}%</div>
                      <div className="text-[10px] text-gray-600 leading-tight">Engage</div>
                    </div>
                    <div className="text-center p-1 bg-amber-50 rounded border border-amber-100 min-w-[48px]">
                      <Star className="w-2 h-2 mx-auto mb-0.5 text-amber-600" />
                      <div className="text-xs font-bold text-amber-600">{comprehensiveMetrics.conversionPrediction}%</div>
                      <div className="text-[10px] text-gray-600 leading-tight">Convert</div>
                    </div>
                  </div>

                  {/* Technical Group */}
                  <div className="flex items-center gap-1 pl-3">
                    <div className="text-center p-1 bg-slate-50 rounded border border-slate-100 min-w-[48px]">
                      <Type className="w-2 h-2 mx-auto mb-0.5 text-slate-600" />
                      <div className="text-xs font-bold text-slate-600">{Math.round(comprehensiveMetrics.characterCount / 1000)}K</div>
                      <div className="text-[10px] text-gray-600 leading-tight">Chars</div>
                    </div>
                    <div className="text-center p-1 bg-stone-50 rounded border border-stone-100 min-w-[48px]">
                      <Layout className="w-2 h-2 mx-auto mb-0.5 text-stone-600" />
                      <div className="text-xs font-bold text-stone-600">{comprehensiveMetrics.paragraphCount}</div>
                      <div className="text-[10px] text-gray-600 leading-tight">Paras</div>
                    </div>
                    <div className="text-center p-1 bg-zinc-50 rounded border border-zinc-100 min-w-[48px]">
                      <BarChart3 className="w-2 h-2 mx-auto mb-0.5 text-zinc-600" />
                      <div className="text-xs font-bold text-zinc-600">{comprehensiveMetrics.htmlComplexity}%</div>
                      <div className="text-[10px] text-gray-600 leading-tight">Complex</div>
                    </div>
                    <div className="text-center p-1 bg-neutral-50 rounded border border-neutral-100 min-w-[48px]">
                      <AlertTriangle className="w-2 h-2 mx-auto mb-0.5 text-neutral-600" />
                      <div className="text-xs font-bold text-neutral-600">{comprehensiveMetrics.unsubscribeRisk}%</div>
                      <div className="text-[10px] text-gray-600 leading-tight">Risk</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Compact Summary Stats */}
              <div className="flex justify-between items-center text-[10px] text-gray-500 pt-2 border-t border-gray-100 mt-2">
                <span>{comprehensiveMetrics.sentenceCount} sentences</span>
                <span>{comprehensiveMetrics.videoCount} videos</span>
                <span>{comprehensiveMetrics.cssInlineCount} inline styles</span>
                <span>Auth: {comprehensiveMetrics.authenticationScore}</span>
              </div>
            </Card>
          )}

          {/* Performance Metrics from Analytics */}
          {result && (
            <Card className="p-4">
              <h4 className="font-medium text-gray-900 mb-3">AI Analytics Results</h4>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{result.scores?.overallScore || 0}</div>
                  <div className="text-xs text-gray-600">Overall Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{result.scores?.deliverabilityScore || 0}</div>
                  <div className="text-xs text-gray-600">Deliverability</div>
                </div>
              </div>
              
              {result.prediction && (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Predicted Open Rate:</span>
                    <span className="font-medium">{result.prediction.openRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Predicted Click Rate:</span>
                    <span className="font-medium">{result.prediction.clickRate}%</span>
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* Critical Suggestions - keep existing implementation */}
          {criticalSuggestions.length > 0 && (
            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">AI Suggestions & Auto-Fixes</h4>
                <Badge variant="outline" className="text-xs">
                  {criticalSuggestions.length} suggestions
                </Badge>
              </div>
              
              <div className="space-y-3">
                {criticalSuggestions.map((suggestion) => (
                  <div key={suggestion.id} className="border rounded-lg p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2 flex-1">
                        {getCategoryIcon(suggestion.category)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{suggestion.title}</span>
                            {getSeverityIcon(suggestion.severity)}
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${CriticalEmailAnalysisService.getSeverityColor(suggestion.severity)}`}
                            >
                              {suggestion.severity}
                            </Badge>
                            {suggestion.autoFixable && (
                              <Badge variant="secondary" className="text-xs bg-green-50 text-green-700">
                                Auto-fixable
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{suggestion.reason}</p>
                          {suggestion.businessImpact && (
                            <p className="text-xs text-blue-600 mb-2">💡 {suggestion.businessImpact}</p>
                          )}
                          {suggestion.current && suggestion.suggested && (
                            <div className="text-xs space-y-1">
                              <div className="text-gray-500">Current: "{suggestion.current}"</div>
                              <div className="text-green-600">Suggested: "{suggestion.suggested}"</div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        {appliedFixes.has(suggestion.id) ? (
                          <Badge variant="default" className="bg-green-100 text-green-700">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Applied
                          </Badge>
                        ) : suggestion.autoFixable ? (
                          <Button 
                            size="sm" 
                            onClick={() => handleApplyFix(suggestion)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Zap className="w-3 h-3 mr-1" />
                            Auto-Fix
                          </Button>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            Manual Fix
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
