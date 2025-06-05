
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
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
  Star,
  ChevronDown,
  ChevronUp,
  PanelLeftOpen,
  PanelLeftClose
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
  const [allSuggestions, setAllSuggestions] = useState<CriticalSuggestion[]>([]);
  const [appliedFixes, setAppliedFixes] = useState<Set<string>>(new Set());
  const [analysisTimestamp, setAnalysisTimestamp] = useState<number>(0);
  const [comprehensiveMetrics, setComprehensiveMetrics] = useState<ComprehensiveEmailMetrics | null>(null);
  const [isAnalysisCenterCollapsed, setIsAnalysisCenterCollapsed] = useState(false);

  const { analyze, result, isAnalyzing: isAnalyticsAnalyzing, clearCache } = useEmailAnalytics();

  // Extract suggestions from comprehensive analysis and merge with critical suggestions
  const extractAndMergeSuggestions = useCallback((critical: CriticalSuggestion[], comprehensive: CompleteAnalysisResult | null) => {
    let merged = [...critical];

    if (comprehensive) {
      // Extract brand voice suggestions
      if (comprehensive.brandVoice?.suggestions) {
        comprehensive.brandVoice.suggestions.forEach((suggestion, index) => {
          merged.push({
            id: `brand-voice-${index}`,
            title: suggestion.title,
            reason: suggestion.reason,
            category: 'tone',
            type: 'tone',
            current: suggestion.current || '',
            suggested: suggestion.suggested || '',
            severity: suggestion.impact === 'high' ? 'high' : suggestion.impact === 'medium' ? 'medium' : 'low',
            impact: suggestion.impact === 'high' ? 'high' : suggestion.impact === 'medium' ? 'medium' : 'low',
            confidence: suggestion.confidence || 75,
            autoFixable: false,
            priority: index + 1,
            businessImpact: `Brand voice improvement: ${suggestion.reason}`
          });
        });
      }

      // Extract subject line alternatives
      if (comprehensive.subjectVariants && comprehensive.subjectVariants.length > 0) {
        comprehensive.subjectVariants.forEach((variant, index) => {
          merged.push({
            id: `subject-variant-${index}`,
            title: `Subject Line Alternative ${index + 1}`,
            reason: 'AI-generated subject line variant to improve engagement',
            category: 'subject',
            type: 'subject',
            current: subjectLine,
            suggested: variant,
            severity: 'medium',
            impact: 'medium',
            confidence: 80,
            autoFixable: true,
            priority: index + 1,
            businessImpact: 'May improve open rates with fresh messaging'
          });
        });
      }

      // Extract content optimizations
      if (comprehensive.optimizations) {
        Object.entries(comprehensive.optimizations).forEach(([key, value], index) => {
          if (value) {
            merged.push({
              id: `optimization-${key}-${index}`,
              title: `${key.charAt(0).toUpperCase() + key.slice(1)} Optimization`,
              reason: `Content optimized for ${key}`,
              category: 'structure',
              type: 'copy',
              current: 'Current content',
              suggested: value,
              severity: 'medium',
              impact: 'medium',
              confidence: 70,
              autoFixable: false,
              priority: index + 1,
              businessImpact: `Improves ${key} and overall engagement`
            });
          }
        });
      }

      // Extract accessibility issues
      if (comprehensive.performance?.accessibilityIssues) {
        comprehensive.performance.accessibilityIssues.forEach((issue, index) => {
          merged.push({
            id: `accessibility-${index}`,
            title: `Fix ${issue.type} Accessibility Issue`,
            reason: issue.description,
            category: 'accessibility',
            type: 'accessibility',
            current: issue.description,
            suggested: issue.fix,
            severity: issue.severity === 'high' ? 'high' : issue.severity === 'medium' ? 'medium' : 'low',
            impact: issue.severity === 'high' ? 'high' : issue.severity === 'medium' ? 'medium' : 'low',
            confidence: 85,
            autoFixable: issue.type === 'alt-text',
            priority: index + 1,
            businessImpact: 'Improves accessibility and compliance'
          });
        });
      }
    }

    // Sort by confidence (highest first)
    merged.sort((a, b) => b.confidence - a.confidence);
    
    return merged;
  }, [subjectLine]);

  // Update merged suggestions when critical suggestions or comprehensive analysis changes
  useEffect(() => {
    const merged = extractAndMergeSuggestions(criticalSuggestions, comprehensiveAnalysis);
    setAllSuggestions(merged);
  }, [criticalSuggestions, comprehensiveAnalysis, extractAndMergeSuggestions]);

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
      
      // Auto-expand analysis center after successful analysis
      setIsAnalysisCenterCollapsed(false);
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
    const autoFixableSuggestions = allSuggestions.filter(s => 
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
      case 'content': return <Type className="w-4 h-4" />;
      default: return <Lightbulb className="w-4 h-4" />;
    }
  };

  const hasAnalysisResults = allSuggestions.length > 0;
  const autoFixableCount = allSuggestions.filter(s => s.autoFixable && !appliedFixes.has(s.id)).length;
  const totalSuggestionsCount = allSuggestions.length;

  return (
    <TooltipProvider>
      <div className="h-full flex flex-col">
        {/* Always Visible Metrics Strip */}
        {comprehensiveMetrics && (
          <Card className="p-3 border-b border-gray-200">
            <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              
              {/* Content Group */}
              <div className="flex items-center gap-1 pr-3 border-r border-gray-200">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-center p-1 bg-blue-50 rounded border border-blue-100 min-w-[48px] cursor-help hover:bg-blue-100 transition-colors">
                      <Type className="w-2 h-2 mx-auto mb-0.5 text-blue-600" />
                      <div className="text-xs font-bold text-blue-600">{comprehensiveMetrics.wordCount}</div>
                      <div className="text-[10px] text-gray-600 leading-tight">Words</div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Total word count in email content. Optimal range: 150-300 words</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-center p-1 bg-green-50 rounded border border-green-100 min-w-[48px] cursor-help hover:bg-green-100 transition-colors">
                      <Timer className="w-2 h-2 mx-auto mb-0.5 text-green-600" />
                      <div className="text-xs font-bold text-green-600">{comprehensiveMetrics.readTimeMinutes}m</div>
                      <div className="text-[10px] text-gray-600 leading-tight">Read Time</div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Estimated reading time based on average reading speed (200 wpm)</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-center p-1 bg-purple-50 rounded border border-purple-100 min-w-[48px] cursor-help hover:bg-purple-100 transition-colors">
                      <Image className="w-2 h-2 mx-auto mb-0.5 text-purple-600" />
                      <div className="text-xs font-bold text-purple-600">{comprehensiveMetrics.imageCount}</div>
                      <div className="text-[10px] text-gray-600 leading-tight">Images</div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Number of images in email. Affects loading time and deliverability</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-center p-1 bg-indigo-50 rounded border border-indigo-100 min-w-[48px] cursor-help hover:bg-indigo-100 transition-colors">
                      <Link className="w-2 h-2 mx-auto mb-0.5 text-indigo-600" />
                      <div className="text-xs font-bold text-indigo-600">{comprehensiveMetrics.linkCount}</div>
                      <div className="text-[10px] text-gray-600 leading-tight">Links</div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Total clickable links. Too many can trigger spam filters</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-center p-1 bg-orange-50 rounded border border-orange-100 min-w-[48px] cursor-help hover:bg-orange-100 transition-colors">
                      <Target className="w-2 h-2 mx-auto mb-0.5 text-orange-600" />
                      <div className="text-xs font-bold text-orange-600">{comprehensiveMetrics.ctaCount}</div>
                      <div className="text-[10px] text-gray-600 leading-tight">CTAs</div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Call-to-action buttons/links. Optimal: 1-3 per email</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              {/* Performance Group */}
              <div className="flex items-center gap-1 px-3 border-r border-gray-200">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-center p-1 bg-gray-50 rounded border border-gray-100 min-w-[48px] cursor-help hover:bg-gray-100 transition-colors">
                      <Globe className="w-2 h-2 mx-auto mb-0.5 text-gray-600" />
                      <div className={`text-xs font-bold ${ComprehensiveMetricsService.getMetricColor(comprehensiveMetrics.sizeKB, 'size')}`}>
                        {comprehensiveMetrics.sizeKB}KB
                      </div>
                      <div className="text-[10px] text-gray-600 leading-tight">Size</div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Email file size in KB. Keep under 100KB for best performance</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-center p-1 bg-yellow-50 rounded border border-yellow-100 min-w-[48px] cursor-help hover:bg-yellow-100 transition-colors">
                      <Clock className="w-2 h-2 mx-auto mb-0.5 text-yellow-600" />
                      <div className="text-xs font-bold text-yellow-600">{comprehensiveMetrics.loadTimeEstimate}</div>
                      <div className="text-[10px] text-gray-600 leading-tight">Load Time</div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Estimated loading time. Faster = better engagement</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-center p-1 bg-pink-50 rounded border border-pink-100 min-w-[48px] cursor-help hover:bg-pink-100 transition-colors">
                      <Smartphone className="w-2 h-2 mx-auto mb-0.5 text-pink-600" />
                      <div className={`text-xs font-bold ${ComprehensiveMetricsService.getMetricColor(comprehensiveMetrics.mobileScore, 'score')}`}>
                        {comprehensiveMetrics.mobileScore}
                      </div>
                      <div className="text-[10px] text-gray-600 leading-tight">Mobile</div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Mobile-friendliness score out of 100</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-center p-1 bg-teal-50 rounded border border-teal-100 min-w-[48px] cursor-help hover:bg-teal-100 transition-colors">
                      <Eye className="w-2 h-2 mx-auto mb-0.5 text-teal-600" />
                      <div className={`text-xs font-bold ${ComprehensiveMetricsService.getMetricColor(comprehensiveMetrics.accessibilityScore, 'score')}`}>
                        {comprehensiveMetrics.accessibilityScore}
                      </div>
                      <div className="text-[10px] text-gray-600 leading-tight">A11y</div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Accessibility score for screen readers and disabilities</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              {/* Deliverability Group */}
              <div className="flex items-center gap-1 px-3 border-r border-gray-200">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-center p-1 bg-red-50 rounded border border-red-100 min-w-[48px] cursor-help hover:bg-red-100 transition-colors">
                      <Shield className="w-2 h-2 mx-auto mb-0.5 text-red-600" />
                      <div className={`text-xs font-bold ${ComprehensiveMetricsService.getMetricColor(100 - comprehensiveMetrics.spamScore, 'score')}`}>
                        {comprehensiveMetrics.spamScore}%
                      </div>
                      <div className="text-[10px] text-gray-600 leading-tight">Spam Risk</div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Spam risk percentage. Lower is better</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-center p-1 bg-emerald-50 rounded border border-emerald-100 min-w-[48px] cursor-help hover:bg-emerald-100 transition-colors">
                      <Mail className="w-2 h-2 mx-auto mb-0.5 text-emerald-600" />
                      <div className={`text-xs font-bold ${ComprehensiveMetricsService.getMetricColor(comprehensiveMetrics.deliverabilityScore, 'score')}`}>
                        {comprehensiveMetrics.deliverabilityScore}
                      </div>
                      <div className="text-[10px] text-gray-600 leading-tight">Deliver</div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Deliverability score out of 100</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-center p-1 bg-cyan-50 rounded border border-cyan-100 min-w-[48px] cursor-help hover:bg-cyan-100 transition-colors">
                      <MessageSquare className="w-2 h-2 mx-auto mb-0.5 text-cyan-600" />
                      <div className={`text-xs font-bold ${ComprehensiveMetricsService.getMetricColor(comprehensiveMetrics.subjectLineScore, 'score')}`}>
                        {comprehensiveMetrics.subjectLineScore}
                      </div>
                      <div className="text-[10px] text-gray-600 leading-tight">Subject</div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Subject line effectiveness score</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              {/* Engagement Group */}
              <div className="flex items-center gap-1 px-3 border-r border-gray-200">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-center p-1 bg-violet-50 rounded border border-violet-100 min-w-[48px] cursor-help hover:bg-violet-100 transition-colors">
                      <User className="w-2 h-2 mx-auto mb-0.5 text-violet-600" />
                      <div className={`text-xs font-bold ${ComprehensiveMetricsService.getMetricColor(comprehensiveMetrics.personalizationLevel, 'score')}`}>
                        {comprehensiveMetrics.personalizationLevel}
                      </div>
                      <div className="text-[10px] text-gray-600 leading-tight">Personal</div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Personalization level score</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-center p-1 bg-rose-50 rounded border border-rose-100 min-w-[48px] cursor-help hover:bg-rose-100 transition-colors">
                      <TrendingUp className="w-2 h-2 mx-auto mb-0.5 text-rose-600" />
                      <div className="text-xs font-bold text-rose-600">{comprehensiveMetrics.engagementPrediction}%</div>
                      <div className="text-[10px] text-gray-600 leading-tight">Engage</div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Predicted engagement rate percentage</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-center p-1 bg-amber-50 rounded border border-amber-100 min-w-[48px] cursor-help hover:bg-amber-100 transition-colors">
                      <Star className="w-2 h-2 mx-auto mb-0.5 text-amber-600" />
                      <div className="text-xs font-bold text-amber-600">{comprehensiveMetrics.conversionPrediction}%</div>
                      <div className="text-[10px] text-gray-600 leading-tight">Convert</div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Predicted conversion rate percentage</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              {/* Technical Group */}
              <div className="flex items-center gap-1 pl-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-center p-1 bg-slate-50 rounded border border-slate-100 min-w-[48px] cursor-help hover:bg-slate-100 transition-colors">
                      <Type className="w-2 h-2 mx-auto mb-0.5 text-slate-600" />
                      <div className="text-xs font-bold text-slate-600">{Math.round(comprehensiveMetrics.characterCount / 1000)}K</div>
                      <div className="text-[10px] text-gray-600 leading-tight">Chars</div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Character count in thousands</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-center p-1 bg-stone-50 rounded border border-stone-100 min-w-[48px] cursor-help hover:bg-stone-100 transition-colors">
                      <Layout className="w-2 h-2 mx-auto mb-0.5 text-stone-600" />
                      <div className="text-xs font-bold text-stone-600">{comprehensiveMetrics.paragraphCount}</div>
                      <div className="text-[10px] text-gray-600 leading-tight">Paras</div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Number of paragraphs for readability</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-center p-1 bg-zinc-50 rounded border border-zinc-100 min-w-[48px] cursor-help hover:bg-zinc-100 transition-colors">
                      <BarChart3 className="w-2 h-2 mx-auto mb-0.5 text-zinc-600" />
                      <div className="text-xs font-bold text-zinc-600">{comprehensiveMetrics.htmlComplexity}%</div>
                      <div className="text-[10px] text-gray-600 leading-tight">Complex</div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>HTML complexity percentage</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-center p-1 bg-neutral-50 rounded border border-neutral-100 min-w-[48px] cursor-help hover:bg-neutral-100 transition-colors">
                      <AlertTriangle className="w-2 h-2 mx-auto mb-0.5 text-neutral-600" />
                      <div className="text-xs font-bold text-neutral-600">{comprehensiveMetrics.unsubscribeRisk}%</div>
                      <div className="text-[10px] text-gray-600 leading-tight">Risk</div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Unsubscribe risk percentage</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </Card>
        )}

        {/* Enhanced AI Suggestions Toolbar with Always-Visible Actions */}
        <div className="p-3 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAnalysisCenterCollapsed(!isAnalysisCenterCollapsed)}
                className="p-1"
              >
                {isAnalysisCenterCollapsed ? (
                  <PanelLeftOpen className="w-4 h-4" />
                ) : (
                  <PanelLeftClose className="w-4 h-4" />
                )}
              </Button>
              
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">
                  AI Suggestions
                </span>
                
                {/* Quick Stats Badges */}
                {totalSuggestionsCount > 0 && (
                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                    {totalSuggestionsCount} issues
                  </Badge>
                )}
                
                {autoFixableCount > 0 && (
                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                    {autoFixableCount} auto-fixable
                  </Badge>
                )}
                
                {isAnalyzing && (
                  <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                    <RefreshCw className="w-2 h-2 mr-1 animate-spin" />
                    Analyzing...
                  </Badge>
                )}
                
                {analysisTimestamp > 0 && !isAnalyzing && (
                  <span className="text-xs text-gray-500">
                    Updated {new Date(analysisTimestamp).toLocaleTimeString()}
                  </span>
                )}
              </div>
            </div>

            {/* Always-Visible Action Buttons */}
            <div className="flex items-center gap-2">
              {!hasAnalysisResults ? (
                <Button 
                  onClick={runCompleteAnalysis} 
                  disabled={isAnalyzing || !emailHTML.trim()}
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-3 h-3 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-3 h-3 mr-2" />
                      Analyze & Fix Email
                    </>
                  )}
                </Button>
              ) : (
                <>
                  <Button 
                    onClick={runCompleteAnalysis} 
                    disabled={isAnalyzing}
                    variant="outline"
                    size="sm"
                    className="border-gray-300 hover:bg-gray-50"
                  >
                    <RefreshCw className="w-3 h-3 mr-2" />
                    Re-analyze
                  </Button>
                  {autoFixableCount > 0 && (
                    <Button 
                      onClick={handleApplyAllAutoFixes}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Zap className="w-3 h-3 mr-2" />
                      Apply All Auto-Fixes ({autoFixableCount})
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Collapsible Analysis Center Content */}
        {!isAnalysisCenterCollapsed && (
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              {/* Show message when no analysis has been run */}
              {!hasAnalysisResults && !isAnalyzing && (
                <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                  <Brain className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">AI Analysis Ready</h3>
                  <p className="text-gray-600 mb-4 max-w-md mx-auto">
                    Get intelligent suggestions to improve your email's performance, deliverability, and engagement.
                  </p>
                  <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Spam Detection
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-blue-500" />
                      Mobile Optimization
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-purple-500" />
                      Auto-Fixes
                    </div>
                  </div>
                </div>
              )}

              {/* AI Suggestions & Auto-Fixes - now showing all merged suggestions */}
              {allSuggestions.length > 0 && (
                <Card className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">AI Suggestions & Auto-Fixes</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        {allSuggestions.filter(s => s.severity === 'critical').length} critical
                      </Badge>
                      <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                        {allSuggestions.filter(s => s.severity === 'high').length} high
                      </Badge>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        {autoFixableCount} auto-fixable
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {allSuggestions.map((suggestion) => (
                      <div
                        key={suggestion.id}
                        className={`p-4 rounded-lg border ${
                          appliedFixes.has(suggestion.id)
                            ? 'bg-green-50 border-green-200'
                            : 'bg-white border-gray-200'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getCategoryIcon(suggestion.category)}
                            <span className="font-medium text-gray-900">{suggestion.title}</span>
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                suggestion.severity === 'critical'
                                  ? 'bg-red-50 text-red-700 border-red-200'
                                  : suggestion.severity === 'high'
                                  ? 'bg-orange-50 text-orange-700 border-orange-200'
                                  : suggestion.severity === 'medium'
                                  ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                  : 'bg-blue-50 text-blue-700 border-blue-200'
                              }`}
                            >
                              {suggestion.severity}
                            </Badge>
                            {suggestion.autoFixable && (
                              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                Auto-fixable
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            {getSeverityIcon(suggestion.severity)}
                            <span className="text-xs text-gray-500">{suggestion.confidence}% confidence</span>
                          </div>
                        </div>

                        <p className="text-sm text-gray-600 mb-3">{suggestion.reason}</p>

                        {suggestion.businessImpact && (
                          <p className="text-sm text-blue-600 mb-3 italic">💼 {suggestion.businessImpact}</p>
                        )}

                        {suggestion.current && suggestion.suggested && (
                          <div className="space-y-2 mb-3">
                            <div className="text-xs">
                              <span className="text-gray-500">Current:</span>
                              <div className="bg-red-50 p-2 rounded text-red-700 mt-1 text-sm font-mono">
                                {suggestion.current}
                              </div>
                            </div>
                            <div className="text-xs">
                              <span className="text-gray-500">Suggested:</span>
                              <div className="bg-green-50 p-2 rounded text-green-700 mt-1 text-sm font-mono">
                                {suggestion.suggested}
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="flex gap-2">
                          {suggestion.autoFixable ? (
                            <Button
                              size="sm"
                              onClick={() => handleApplyFix(suggestion)}
                              disabled={appliedFixes.has(suggestion.id)}
                              className={
                                appliedFixes.has(suggestion.id)
                                  ? 'bg-green-600 hover:bg-green-700'
                                  : 'bg-blue-600 hover:bg-blue-700'
                              }
                            >
                              {appliedFixes.has(suggestion.id) ? (
                                <>
                                  <CheckCircle className="w-3 h-3 mr-2" />
                                  Applied
                                </>
                              ) : (
                                <>
                                  <Zap className="w-3 h-3 mr-2" />
                                  Auto-Fix
                                </>
                              )}
                            </Button>
                          ) : (
                            <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-200">
                              Manual review required
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </ScrollArea>
        )}
      </div>
    </TooltipProvider>
  );
};
