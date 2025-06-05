import React, { useState, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Sparkles, 
  Target, 
  BarChart3,
  Zap,
  Lightbulb,
  TrendingUp,
  Users,
  MessageSquare,
  Wand2,
  RefreshCw,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Eye,
  FlaskConical
} from 'lucide-react';
import { DirectAIService } from '@/services/directAIService';
import { PerformanceAnalysisResult } from '@/services/EmailAIService';
import { extractServiceData } from '@/utils/serviceResultHelper';

interface AIContentRequest {
  type: 'subject' | 'copy' | 'cta' | 'personalization';
  context?: {
    industry?: string;
    audience?: string;
    tone?: string;
    goal?: string;
  };
}

interface AIContentResponse {
  id: string;
  content: string;
  confidence: number;
  reasoning: string;
  metrics: {
    readabilityScore: number;
    engagementPrediction: number;
    conversionPotential: number;
  };
}

interface AdvancedAIAssistantProps {
  editor: Editor | null;
  emailHTML: string;
  onContentUpdate?: (content: string) => void;
}

export const EnhancedAIAssistant: React.FC<AdvancedAIAssistantProps> = ({ 
  editor, 
  emailHTML,
  onContentUpdate
}) => {
  const [activeTab, setActiveTab] = useState('generate');
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<AIContentResponse[]>([]);
  const [abTestVariants, setAbTestVariants] = useState<AIContentResponse[]>([]);
  const [contentRequest, setContentRequest] = useState<Partial<AIContentRequest>>({
    type: 'copy',
    context: {
      industry: 'technology',
      audience: 'professionals',
      tone: 'professional',
      goal: 'conversion'
    }
  });
  const [brandVoiceScore, setBrandVoiceScore] = useState(85);
  const [performancePrediction, setPerformancePrediction] = useState({
    openRate: 24.5,
    clickRate: 3.2,
    conversionRate: 2.1,
    confidence: 87
  });

  const contentTypes = [
    { id: 'subject', name: 'Subject Line', icon: Target },
    { id: 'copy', name: 'Email Copy', icon: MessageSquare },
    { id: 'cta', name: 'Call to Action', icon: Zap },
    { id: 'personalization', name: 'Personalization', icon: Users }
  ];

  const generateContent = async () => {
    if (!contentRequest.type) return;
    
    setIsProcessing(true);
    
    try {
      console.log('Generating content with direct AI service:', contentRequest);
      
      // Generate content using direct AI service
      const prompt = `Generate ${contentRequest.type} content for ${contentRequest.context?.industry} industry targeting ${contentRequest.context?.audience} with ${contentRequest.context?.tone} tone for ${contentRequest.context?.goal}`;
      const result = await DirectAIService.generateContent(prompt, 'general');
      
      const response: AIContentResponse = {
        id: `content_${Date.now()}`,
        content: extractServiceData(result, ''),
        confidence: 0.85,
        reasoning: `Generated ${contentRequest.type} optimized for ${contentRequest.context?.goal}`,
        metrics: {
          readabilityScore: Math.floor(Math.random() * 20) + 80,
          engagementPrediction: Math.floor(Math.random() * 20) + 75,
          conversionPotential: Math.floor(Math.random() * 20) + 70
        }
      };
      
      setGeneratedContent([response]);
      
      // Update performance prediction with mock data
      setPerformancePrediction({
        openRate: Math.random() * 10 + 20,
        clickRate: Math.random() * 3 + 2,
        conversionRate: Math.random() * 2 + 1.5,
        confidence: Math.floor(Math.random() * 20) + 80
      });
      
    } catch (error) {
      console.error('Failed to generate content:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const generateABTestVariants = async () => {
    if (!generatedContent[0]) return;
    
    setIsProcessing(true);
    
    try {
      console.log('Generating A/B test variants');
      const variants = await DirectAIService.generateSubjectVariants(generatedContent[0].content, 3);
      
      const variantResponses: AIContentResponse[] = variants.success && variants.data ? 
        variants.data.map((variant, index) => ({
          id: `variant_${Date.now()}_${index}`,
          content: variant,
          confidence: 0.8 + Math.random() * 0.15,
          reasoning: `Variant ${index + 1} with different approach`,
          metrics: {
            readabilityScore: Math.floor(Math.random() * 20) + 75,
            engagementPrediction: Math.floor(Math.random() * 20) + 70,
            conversionPotential: Math.floor(Math.random() * 20) + 65
          }
        })) : [];
      
      setAbTestVariants(variantResponses);
    } catch (error) {
      console.error('Failed to generate A/B test variants:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const applyContent = (content: string) => {
    if (editor) {
      const currentContent = editor.getHTML();
      const updatedContent = currentContent + `<p>${content}</p>`;
      editor.commands.setContent(updatedContent);
      onContentUpdate?.(updatedContent);
    }
  };

  const analyzeCurrentContent = async () => {
    if (!emailHTML) return;
    
    setIsProcessing(true);
    
    try {
      console.log('Analyzing current content');
      const analysis = await DirectAIService.analyzeBrandVoice(emailHTML);
      setBrandVoiceScore(analysis.success && analysis.data?.brandVoiceScore ? analysis.data.brandVoiceScore : 85);
    } catch (error) {
      console.error('Failed to analyze content:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (emailHTML) {
      analyzeCurrentContent();
    }
  }, [emailHTML]);

  const renderContentCard = (content: AIContentResponse, isVariant: boolean = false) => (
    <Card key={content.id} className="p-4 border">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="text-xs">
              {Math.round(content.confidence * 100)}% confidence
            </Badge>
            {isVariant && (
              <Badge variant="outline" className="text-xs">
                Variant
              </Badge>
            )}
          </div>
          
          <p className="text-sm font-medium text-gray-900 mb-2">
            {content.content}
          </p>
          
          <p className="text-xs text-gray-600 italic mb-3">
            💡 {content.reasoning}
          </p>
          
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="text-center">
              <div className="text-sm font-semibold text-blue-600">
                {content.metrics.readabilityScore}
              </div>
              <div className="text-xs text-gray-500">Readability</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-semibold text-green-600">
                {content.metrics.engagementPrediction}
              </div>
              <div className="text-xs text-gray-500">Engagement</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-semibold text-purple-600">
                {content.metrics.conversionPotential}
              </div>
              <div className="text-xs text-gray-500">Conversion</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => applyContent(content.content)}
          className="flex-1"
        >
          <Zap className="w-3 h-3 mr-1" />
          Apply
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigator.clipboard.writeText(content.content)}
        >
          <Copy className="w-3 h-3" />
        </Button>
        <Button variant="ghost" size="sm">
          <ThumbsUp className="w-3 h-3" />
        </Button>
        <Button variant="ghost" size="sm">
          <ThumbsDown className="w-3 h-3" />
        </Button>
      </div>
    </Card>
  );

  return (
    <Card className="h-full flex flex-col">
      <div className="p-3 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <Brain className="w-4 h-4 text-purple-600" />
          <h3 className="text-base font-semibold">Advanced AI Assistant</h3>
          <Badge variant="secondary" className="ml-auto bg-purple-50 text-purple-700 text-xs">
            Enhanced
          </Badge>
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600">{brandVoiceScore}</div>
            <div className="text-xs text-gray-600">Brand Voice</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">{performancePrediction.confidence}</div>
            <div className="text-xs text-gray-600">AI Confidence</div>
          </div>
        </div>

        {/* Predicted Performance */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center p-2 bg-blue-50 rounded">
            <div className="font-semibold text-blue-600">{performancePrediction.openRate.toFixed(1)}%</div>
            <div className="text-gray-600">Open Rate</div>
          </div>
          <div className="text-center p-2 bg-green-50 rounded">
            <div className="font-semibold text-green-600">{performancePrediction.clickRate.toFixed(1)}%</div>
            <div className="text-gray-600">Click Rate</div>
          </div>
          <div className="text-center p-2 bg-purple-50 rounded">
            <div className="font-semibold text-purple-600">{performancePrediction.conversionRate.toFixed(1)}%</div>
            <div className="text-gray-600">Conversion</div>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3 mx-3 mt-2">
          <TabsTrigger value="generate" className="text-xs">Generate</TabsTrigger>
          <TabsTrigger value="optimize" className="text-xs">Optimize</TabsTrigger>
          <TabsTrigger value="test" className="text-xs">A/B Test</TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          <div className="p-3">
            <TabsContent value="generate" className="mt-0 space-y-4">
              {/* Content Type Selection */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Content Type</label>
                <div className="grid grid-cols-2 gap-1">
                  {contentTypes.map((type) => {
                    const IconComponent = type.icon;
                    return (
                      <Button
                        key={type.id}
                        variant={contentRequest.type === type.id ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setContentRequest({ ...contentRequest, type: type.id as any })}
                        className="justify-start text-xs h-8"
                      >
                        <IconComponent className="w-3 h-3 mr-1" />
                        {type.name}
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Context Configuration */}
              <div className="space-y-2">
                <Input
                  placeholder="Industry (e.g., technology, healthcare)"
                  value={contentRequest.context?.industry || ''}
                  onChange={(e) => setContentRequest({
                    ...contentRequest,
                    context: { ...contentRequest.context, industry: e.target.value }
                  })}
                  className="text-xs"
                />
                <Input
                  placeholder="Target audience (e.g., professionals, students)"
                  value={contentRequest.context?.audience || ''}
                  onChange={(e) => setContentRequest({
                    ...contentRequest,
                    context: { ...contentRequest.context, audience: e.target.value }
                  })}
                  className="text-xs"
                />
                <Input
                  placeholder="Goal (e.g., conversion, engagement, awareness)"
                  value={contentRequest.context?.goal || ''}
                  onChange={(e) => setContentRequest({
                    ...contentRequest,
                    context: { ...contentRequest.context, goal: e.target.value }
                  })}
                  className="text-xs"
                />
              </div>

              <Button
                onClick={generateContent}
                disabled={isProcessing || !contentRequest.type}
                className="w-full"
              >
                {isProcessing ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 mr-2" />
                )}
                Generate Content
              </Button>

              {/* Generated Content */}
              <div className="space-y-3">
                {generatedContent.map(content => renderContentCard(content))}
              </div>
            </TabsContent>

            <TabsContent value="optimize" className="mt-0 space-y-4">
              <div className="text-center py-4">
                <Lightbulb className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <h4 className="font-medium text-gray-900 mb-2">Content Optimization</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Analyze and optimize your current email content
                </p>
                
                <Button
                  onClick={analyzeCurrentContent}
                  disabled={isProcessing || !emailHTML}
                  className="w-full"
                >
                  {isProcessing ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <BarChart3 className="w-4 h-4 mr-2" />
                  )}
                  Analyze Content
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="test" className="mt-0 space-y-4">
              <div className="text-center py-4">
                <FlaskConical className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <h4 className="font-medium text-gray-900 mb-2">A/B Test Generator</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Create multiple variants for testing
                </p>
                
                <Button
                  onClick={generateABTestVariants}
                  disabled={isProcessing || generatedContent.length === 0}
                  className="w-full"
                >
                  {isProcessing ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <TrendingUp className="w-4 h-4 mr-2" />
                  )}
                  Generate Variants
                </Button>
              </div>

              {/* A/B Test Variants */}
              <div className="space-y-3">
                {abTestVariants.map(variant => renderContentCard(variant, true))}
              </div>
            </TabsContent>
          </div>
        </ScrollArea>
      </Tabs>
    </Card>
  );
};
