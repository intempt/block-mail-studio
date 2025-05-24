
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Wand2, 
  Sparkles, 
  Zap, 
  Target, 
  Palette, 
  Type,
  Image,
  BarChart3,
  Clock,
  RefreshCw,
  Download,
  Eye,
  Heart,
  CheckCircle2,
  ChevronRight,
  Lightbulb
} from 'lucide-react';
import { Editor } from '@tiptap/react';

interface TemplateGenerationRequest {
  industry: string;
  purpose: string;
  tone: string;
  length: string;
  includeImages: boolean;
  colorScheme: string;
  audience: string;
}

interface GeneratedTemplate {
  id: string;
  name: string;
  html: string;
  description: string;
  features: string[];
  confidence: number;
  generatedAt: Date;
}

interface TemplateAIGeneratorProps {
  editor: Editor | null;
  onTemplateGenerated?: (template: GeneratedTemplate) => void;
}

export const TemplateAIGenerator: React.FC<TemplateAIGeneratorProps> = ({ 
  editor, 
  onTemplateGenerated 
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTemplates, setGeneratedTemplates] = useState<GeneratedTemplate[]>([]);
  const [currentStep, setCurrentStep] = useState<'setup' | 'generating' | 'results'>('setup');
  const [request, setRequest] = useState<TemplateGenerationRequest>({
    industry: '',
    purpose: '',
    tone: 'professional',
    length: 'medium',
    includeImages: true,
    colorScheme: 'blue',
    audience: ''
  });

  const industries = [
    { id: 'ecommerce', name: 'E-commerce', icon: '🛍️' },
    { id: 'saas', name: 'SaaS', icon: '💻' },
    { id: 'healthcare', name: 'Healthcare', icon: '🏥' },
    { id: 'education', name: 'Education', icon: '🎓' },
    { id: 'finance', name: 'Finance', icon: '💰' },
    { id: 'realestate', name: 'Real Estate', icon: '🏠' },
    { id: 'nonprofit', name: 'Non-profit', icon: '❤️' },
    { id: 'fitness', name: 'Fitness', icon: '💪' }
  ];

  const purposes = [
    { id: 'welcome', name: 'Welcome Series', desc: 'Onboard new users' },
    { id: 'promotional', name: 'Promotional', desc: 'Sales and offers' },
    { id: 'newsletter', name: 'Newsletter', desc: 'Regular updates' },
    { id: 'transactional', name: 'Transactional', desc: 'Order confirmations' },
    { id: 'winback', name: 'Win-back', desc: 'Re-engage users' },
    { id: 'announcement', name: 'Announcement', desc: 'News and updates' }
  ];

  const tones = ['professional', 'friendly', 'casual', 'formal', 'enthusiastic', 'minimalist'];
  const lengths = [
    { id: 'short', name: 'Short', desc: 'Quick and concise' },
    { id: 'medium', name: 'Medium', desc: 'Balanced content' },
    { id: 'long', name: 'Long', desc: 'Detailed and comprehensive' }
  ];

  const colorSchemes = [
    { id: 'blue', name: 'Professional Blue', color: '#3B82F6' },
    { id: 'green', name: 'Growth Green', color: '#10B981' },
    { id: 'purple', name: 'Creative Purple', color: '#8B5CF6' },
    { id: 'orange', name: 'Energetic Orange', color: '#F59E0B' },
    { id: 'red', name: 'Bold Red', color: '#EF4444' },
    { id: 'gray', name: 'Modern Gray', color: '#6B7280' }
  ];

  const generateTemplates = async () => {
    setIsGenerating(true);
    setCurrentStep('generating');

    // Simulate AI generation process
    await new Promise(resolve => setTimeout(resolve, 3000));

    const mockTemplates: GeneratedTemplate[] = [
      {
        id: '1',
        name: `${request.industry} ${request.purpose} Template`,
        html: generateMockHTML(request),
        description: `A ${request.tone} ${request.purpose.toLowerCase()} email template designed for ${request.industry} companies targeting ${request.audience}.`,
        features: ['Responsive Design', 'CTA Optimization', 'Brand Integration', 'A/B Test Ready'],
        confidence: 0.92,
        generatedAt: new Date()
      },
      {
        id: '2',
        name: `Alternative ${request.purpose} Design`,
        html: generateMockHTML({ ...request, colorScheme: 'green' }),
        description: `An alternative approach focusing on conversion optimization and modern design principles.`,
        features: ['Mobile-First', 'High Contrast', 'Social Proof', 'Trust Signals'],
        confidence: 0.88,
        generatedAt: new Date()
      }
    ];

    setGeneratedTemplates(mockTemplates);
    setIsGenerating(false);
    setCurrentStep('results');
  };

  const generateMockHTML = (req: TemplateGenerationRequest): string => {
    const colorMap: Record<string, string> = {
      blue: '#3B82F6',
      green: '#10B981',
      purple: '#8B5CF6',
      orange: '#F59E0B',
      red: '#EF4444',
      gray: '#6B7280'
    };

    const color = colorMap[req.colorScheme] || '#3B82F6';

    return `
      <div class="email-container" style="max-width: 600px; margin: 0 auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #ffffff;">
        <div class="email-block header-block" style="background: linear-gradient(135deg, ${color}22 0%, ${color}44 100%); padding: 40px 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px; font-weight: bold; color: ${color}; text-transform: capitalize;">
            ${req.purpose} Email
          </h1>
          <p style="margin: 16px 0 0 0; font-size: 16px; color: #666; text-transform: capitalize;">
            For ${req.industry} • ${req.tone} tone
          </p>
        </div>
        
        <div class="email-block content-block" style="padding: 40px 20px;">
          <h2 style="color: #1a1a1a; font-size: 24px; margin: 0 0 20px 0; text-align: center;">
            Crafted for Your ${req.audience}
          </h2>
          
          <p style="font-size: 16px; line-height: 1.7; color: #555; margin: 0 0 30px 0; text-align: center;">
            This ${req.tone} email template has been specifically designed for ${req.industry} businesses to effectively communicate with their ${req.audience}.
          </p>
          
          ${req.includeImages ? `
          <div style="text-align: center; margin: 30px 0;">
            <div style="width: 100%; height: 200px; background: linear-gradient(135deg, ${color}22 0%, ${color}44 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: ${color}; font-size: 18px; font-weight: bold;">
              AI-Generated Image Placeholder
            </div>
          </div>
          ` : ''}
          
          <div style="text-align: center; margin: 40px 0;">
            <a href="#" style="display: inline-block; padding: 16px 32px; background-color: ${color}; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; text-transform: uppercase; letter-spacing: 0.5px;">
              Take Action Now
            </a>
          </div>
          
          <div style="border-top: 2px solid ${color}22; padding-top: 30px; margin-top: 30px;">
            <p style="font-size: 14px; color: #888; text-align: center; margin: 0;">
              Generated with AI • Optimized for ${req.length} content • ${req.tone} tone
            </p>
          </div>
        </div>
      </div>
    `;
  };

  const useTemplate = (template: GeneratedTemplate) => {
    if (editor) {
      editor.commands.setContent(template.html);
      if (onTemplateGenerated) {
        onTemplateGenerated(template);
      }
    }
  };

  const resetGenerator = () => {
    setCurrentStep('setup');
    setGeneratedTemplates([]);
    setRequest({
      industry: '',
      purpose: '',
      tone: 'professional',
      length: 'medium',
      includeImages: true,
      colorScheme: 'blue',
      audience: ''
    });
  };

  if (currentStep === 'generating') {
    return (
      <Card className="h-full flex flex-col items-center justify-center p-8">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
            <Wand2 className="w-8 h-8 text-blue-600 animate-pulse" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-900">Generating Your Template</h3>
            <p className="text-gray-600">AI is crafting the perfect email template for your needs...</p>
          </div>

          <div className="w-full max-w-xs mx-auto">
            <div className="bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '75%' }}></div>
            </div>
          </div>

          <div className="space-y-2 text-sm text-gray-500">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>Analyzing industry requirements</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>Optimizing for {request.audience}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
              <span>Creating template variations</span>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  if (currentStep === 'results') {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Generated Templates</h3>
              <p className="text-sm text-gray-600">{generatedTemplates.length} templates created</p>
            </div>
            <Button
              variant="outline"
              onClick={resetGenerator}
              className="text-sm"
            >
              <Wand2 className="w-4 h-4 mr-2" />
              Generate New
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {generatedTemplates.map((template) => (
              <Card key={template.id} className="p-4 border border-gray-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-gray-900">{template.name}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {Math.round(template.confidence * 100)}% match
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">
                      {template.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {template.features.map((feature) => (
                        <Badge key={feature} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {template.generatedAt.toLocaleTimeString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <BarChart3 className="w-3 h-3" />
                        Optimized
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => useTemplate(template)}
                    className="flex-1"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Use Template
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      // Preview functionality
                      console.log('Preview template:', template.id);
                    }}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      // Save to favorites
                      console.log('Save template:', template.id);
                    }}
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">AI Template Generator</h3>
        </div>
        <p className="text-sm text-gray-600">Create professional email templates with AI assistance</p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Industry Selection */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-3 block">Industry</label>
            <div className="grid grid-cols-2 gap-2">
              {industries.map((industry) => (
                <Button
                  key={industry.id}
                  variant={request.industry === industry.id ? 'default' : 'outline'}
                  onClick={() => setRequest({ ...request, industry: industry.id })}
                  className="justify-start text-sm h-12"
                >
                  <span className="mr-2">{industry.icon}</span>
                  {industry.name}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Purpose Selection */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-3 block">Email Purpose</label>
            <div className="space-y-2">
              {purposes.map((purpose) => (
                <Button
                  key={purpose.id}
                  variant={request.purpose === purpose.id ? 'default' : 'outline'}
                  onClick={() => setRequest({ ...request, purpose: purpose.id })}
                  className="w-full justify-between text-sm h-auto p-3"
                >
                  <div className="text-left">
                    <div className="font-medium">{purpose.name}</div>
                    <div className="text-xs opacity-70">{purpose.desc}</div>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Target Audience */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Target Audience</label>
            <Input
              placeholder="e.g., new subscribers, existing customers, premium users"
              value={request.audience}
              onChange={(e) => setRequest({ ...request, audience: e.target.value })}
              className="text-sm"
            />
          </div>

          {/* Tone Selection */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-3 block">Tone</label>
            <div className="flex flex-wrap gap-2">
              {tones.map((tone) => (
                <Button
                  key={tone}
                  variant={request.tone === tone ? 'default' : 'outline'}
                  onClick={() => setRequest({ ...request, tone })}
                  size="sm"
                  className="text-xs capitalize"
                >
                  {tone}
                </Button>
              ))}
            </div>
          </div>

          {/* Length Selection */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-3 block">Content Length</label>
            <div className="space-y-2">
              {lengths.map((length) => (
                <Button
                  key={length.id}
                  variant={request.length === length.id ? 'default' : 'outline'}
                  onClick={() => setRequest({ ...request, length: length.id })}
                  className="w-full justify-between text-sm"
                >
                  <div className="text-left">
                    <div className="font-medium">{length.name}</div>
                    <div className="text-xs opacity-70">{length.desc}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Color Scheme */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-3 block">Color Scheme</label>
            <div className="grid grid-cols-2 gap-2">
              {colorSchemes.map((scheme) => (
                <Button
                  key={scheme.id}
                  variant={request.colorScheme === scheme.id ? 'default' : 'outline'}
                  onClick={() => setRequest({ ...request, colorScheme: scheme.id })}
                  className="justify-start text-sm h-12"
                >
                  <div 
                    className="w-4 h-4 rounded-full mr-2" 
                    style={{ backgroundColor: scheme.color }}
                  />
                  {scheme.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-gray-200">
        <Button
          onClick={generateTemplates}
          disabled={!request.industry || !request.purpose || !request.audience}
          className="w-full"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Generate Templates
        </Button>
        
        {(!request.industry || !request.purpose || !request.audience) && (
          <p className="text-xs text-gray-500 mt-2 text-center flex items-center justify-center gap-1">
            <Lightbulb className="w-3 h-3" />
            Complete all required fields to generate templates
          </p>
        )}
      </div>
    </div>
  );
};
