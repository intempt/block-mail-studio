import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Sparkles, 
  Target, 
  CheckCircle,
  RefreshCw,
  Copy,
  Smartphone,
  Mail,
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
  const isOptimal = characterCount >= 30 && characterCount <= 50;
  const isTooLong = characterCount > 50;

  const getScoreColor = (score: number | null) => {
    if (score === null || score === undefined) return 'text-gray-600';
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="p-3 mb-3">
      <div className="space-y-2">
        {/* Compact Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            <span className="text-sm font-medium">Email Subject Line</span>
            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
              Email Marketing
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            {analysis?.score !== null && analysis?.score !== undefined && (
              <Badge variant="outline" className={`text-xs ${getScoreColor(analysis.score)}`}>
                {analysis.score || '--'}
              </Badge>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={generateVariants}
              disabled={isGeneratingVariants || !value.trim()}
              className="h-6 text-xs"
            >
              {isGeneratingVariants ? (
                <RefreshCw className="w-3 h-3 animate-spin mr-1" />
              ) : (
                <Sparkles className="w-3 h-3 mr-1" />
              )}
              A/B Test
            </Button>
          </div>
        </div>

        {/* Input with Compact Status */}
        <div className="space-y-1">
          <div className="relative">
            <Input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Enter email subject line (30-50 chars optimal)..."
              className="text-sm pr-10"
            />
            {isAnalyzing && (
              <RefreshCw className="w-4 h-4 animate-spin absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
            )}
          </div>
          
          {/* Compact Status Bar */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <span className={isTooLong ? 'text-red-600' : isOptimal ? 'text-green-600' : 'text-yellow-600'}>
                {characterCount}/50 chars
              </span>
              <div className={`flex items-center gap-1 ${isOptimal ? 'text-green-600' : isTooLong ? 'text-red-600' : 'text-blue-600'}`}>
                {isTooLong ? <Smartphone className="w-3 h-3" /> : <Mail className="w-3 h-3" />}
                <span>{isTooLong ? 'May truncate' : isOptimal ? 'Optimal' : 'Good'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Compact Analysis Results */}
        {analysis && (
          <div className="grid grid-cols-4 gap-1 text-xs">
            <div className="text-center p-1 bg-blue-50 rounded">
              <div className="font-semibold text-blue-600">
                {analysis.predictions?.openRate?.toFixed(1) || '--'}%
              </div>
              <div className="text-gray-600">Open Rate</div>
            </div>
            <div className="text-center p-1 bg-purple-50 rounded">
              <div className="font-semibold text-purple-600">
                {analysis.score || '--'}
              </div>
              <div className="text-gray-600">Score</div>
            </div>
            <div className="text-center p-1 bg-green-50 rounded">
              <div className="font-semibold text-green-600">
                {analysis.predictions?.deliverabilityScore || '--'}
              </div>
              <div className="text-gray-600">Deliverability</div>
            </div>
            <div className="text-center p-1 bg-orange-50 rounded">
              <div className="font-semibold text-orange-600">
                {isTooLong ? 'Poor' : isOptimal ? 'Great' : 'Good'}
              </div>
              <div className="text-gray-600">Mobile</div>
            </div>
          </div>
        )}

        {/* Compact A/B Variants */}
        {showVariants && (
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-700">A/B Variants:</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowVariants(false)}
                className="h-5 w-5 p-0 text-gray-400"
              >
                ×
              </Button>
            </div>
            
            {isGeneratingVariants ? (
              <div className="text-center py-2">
                <RefreshCw className="w-3 h-3 animate-spin mx-auto mb-1 text-blue-600" />
                <p className="text-xs text-gray-600">Generating variants...</p>
              </div>
            ) : (
              <ScrollArea className="max-h-24">
                <div className="space-y-1">
                  {variants.map((variant, index) => {
                    const variantLength = variant.length;
                    const isVariantOptimal = variantLength >= 30 && variantLength <= 50;
                    
                    return (
                      <div key={index} className="flex items-center justify-between p-1 bg-white border rounded text-xs hover:bg-blue-50">
                        <div className="flex-1 min-w-0">
                          <span className="text-gray-900 truncate block">{variant}</span>
                          <span className={`${isVariantOptimal ? 'text-green-600' : variantLength > 50 ? 'text-red-600' : 'text-yellow-600'}`}>
                            {variantLength} chars
                          </span>
                        </div>
                        <div className="flex gap-1 ml-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigator.clipboard.writeText(variant)}
                            className="h-5 w-5 p-0"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              onChange(variant);
                              setShowVariants(false);
                            }}
                            className="h-5 px-2 text-xs"
                          >
                            Use
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
    </Card>
  );
};
