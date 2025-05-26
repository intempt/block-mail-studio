
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
  BarChart3,
  Mail,
  Smartphone,
  Shield,
  Eye
} from 'lucide-react';
import { directAIService } from '@/services/directAIService';
import { SubjectLineAnalysisResult } from '@/services/EmailAIService';

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
  const [showAnalysisDetails, setShowAnalysisDetails] = useState(false);

  const analyzeSubjectLine = useCallback(async () => {
    if (!value.trim()) {
      setAnalysis(null);
      return;
    }

    setIsAnalyzing(true);
    try {
      console.log('Email marketing subject line analysis:', value);
      
      const result = await directAIService.analyzeSubjectLine(value, emailContent);
      
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
      console.log('Email marketing variant generation:', value);
      
      const newVariants = await directAIService.generateSubjectVariants(value, 5);
      setVariants(newVariants);
    } catch (error) {
      console.error('Error generating variants:', error);
      setVariants([]);
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
  const isTooLong = characterCount > 50; // Email marketing standard
  const isTooShort = characterCount < 10 && characterCount > 0;
  const isOptimal = characterCount >= 30 && characterCount <= 50;

  const getScoreColor = (score: number | null) => {
    if (score === null || score === undefined) return 'text-gray-600';
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getEmailMarketingStatus = () => {
    if (isTooLong) return { icon: Smartphone, text: 'May truncate on mobile', color: 'text-red-600' };
    if (isTooShort) return { icon: AlertTriangle, text: 'Too short for impact', color: 'text-yellow-600' };
    if (isOptimal) return { icon: CheckCircle, text: 'Email marketing optimal', color: 'text-green-600' };
    return { icon: Mail, text: 'Standard length', color: 'text-blue-600' };
  };

  const emailStatus = getEmailMarketingStatus();
  const StatusIcon = emailStatus.icon;

  return (
    <Card className="p-4 mb-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2">
            <Target className="w-4 h-4" />
            Email Subject Line
            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
              Email Marketing
            </Badge>
          </h3>
          <div className="flex items-center gap-2">
            {analysis?.score !== null && analysis?.score !== undefined && (
              <Badge variant="outline" className={`text-xs ${getScoreColor(analysis.score)}`}>
                Score: {analysis.score || '--'}
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
              A/B Variants
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="relative">
            <Input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Enter your email subject line (30-50 chars optimal)..."
              className="text-sm pr-10"
            />
            {isAnalyzing && (
              <RefreshCw className="w-4 h-4 animate-spin absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
            )}
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <span className={isTooLong ? 'text-red-600' : isTooShort ? 'text-yellow-600' : isOptimal ? 'text-green-600' : 'text-blue-600'}>
                {characterCount}/50 characters
              </span>
              <div className={`flex items-center gap-1 ${emailStatus.color}`}>
                <StatusIcon className="w-3 h-3" />
                <span>{emailStatus.text}</span>
              </div>
            </div>
            
            {analysis && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAnalysisDetails(!showAnalysisDetails)}
                className="h-5 text-xs text-gray-500"
              >
                <Eye className="w-3 h-3 mr-1" />
                Details
              </Button>
            )}
          </div>

          {/* Email Marketing Analysis Results */}
          {analysis && (
            <div className="space-y-2 p-3 bg-slate-50 rounded-lg">
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div className="text-center p-2 bg-white rounded">
                  <div className="font-semibold text-blue-600">
                    {analysis.predictions?.openRate?.toFixed(1) || '--'}%
                  </div>
                  <div className="text-gray-600">Open Rate</div>
                </div>
                <div className="text-center p-2 bg-white rounded">
                  <div className="font-semibold text-purple-600">
                    {analysis.score || '--'}
                  </div>
                  <div className="text-gray-600">Marketing Score</div>
                </div>
                <div className="text-center p-2 bg-white rounded">
                  <div className="font-semibold text-green-600">
                    {analysis.predictions?.deliverabilityScore || '--'}
                  </div>
                  <div className="text-gray-600">Deliverability</div>
                </div>
                <div className="text-center p-2 bg-white rounded">
                  <div className="font-semibold text-orange-600 flex items-center justify-center gap-1">
                    <Smartphone className="w-3 h-3" />
                    {isTooLong ? 'Poor' : isOptimal ? 'Great' : 'Good'}
                  </div>
                  <div className="text-gray-600">Mobile</div>
                </div>
              </div>

              {showAnalysisDetails && analysis.suggestions && analysis.suggestions.length > 0 && (
                <div className="bg-blue-50 p-2 rounded">
                  <div className="text-xs font-medium text-blue-900 mb-1 flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Email Marketing Insights:
                  </div>
                  <div className="space-y-1">
                    {analysis.suggestions.slice(0, 3).map((rec, index) => (
                      <div key={index} className="text-xs text-blue-800">• {rec}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* A/B Test Variants for Email Marketing */}
          {showVariants && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-medium text-gray-700 flex items-center gap-1">
                  <BarChart3 className="w-3 h-3" />
                  Email Marketing A/B Variants:
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
                  <p className="text-xs text-gray-600">Generating email marketing optimized variants...</p>
                </div>
              ) : (
                <ScrollArea className="max-h-48">
                  <div className="space-y-1">
                    {variants.map((variant, index) => {
                      const variantLength = variant.length;
                      const isVariantOptimal = variantLength >= 30 && variantLength <= 50;
                      
                      return (
                        <div key={index} className="flex items-center justify-between p-2 bg-white border rounded hover:bg-blue-50 transition-colors">
                          <div className="flex-1">
                            <span className="text-xs text-gray-900">{variant}</span>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-xs ${isVariantOptimal ? 'text-green-600' : variantLength > 50 ? 'text-red-600' : 'text-yellow-600'}`}>
                                {variantLength} chars
                              </span>
                              {isVariantOptimal && (
                                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 px-1 py-0">
                                  Optimal
                                </Badge>
                              )}
                            </div>
                          </div>
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
                      );
                    })}
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
