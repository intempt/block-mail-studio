
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Wand2, Eye, Smartphone, Monitor, BarChart3 } from 'lucide-react';
import { EmailBlock } from '@/types/emailBlocks';

interface PromptCanvasProps {
  blocks: EmailBlock[];
  onBlocksUpdate: (blocks: EmailBlock[]) => void;
  onPromptGeneration: (prompt: string, context: any) => Promise<void>;
}

export const PromptCanvas: React.FC<PromptCanvasProps> = ({
  blocks,
  onBlocksUpdate,
  onPromptGeneration
}) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const canvasRef = useRef<HTMLDivElement>(null);

  const generationSteps = [
    'Analyzing prompt intent...',
    'Understanding brand context...',
    'Generating content structure...',
    'Optimizing for engagement...',
    'Applying visual design...',
    'Performance optimization...'
  ];

  const handlePromptSubmit = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      for (let i = 0; i < generationSteps.length; i++) {
        setCurrentStep(generationSteps[i]);
        setGenerationProgress((i + 1) * (100 / generationSteps.length));
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      const context = {
        existingBlocks: blocks,
        brandContext: 'professional',
        targetAudience: 'business',
        campaignType: 'newsletter'
      };

      await onPromptGeneration(prompt, context);
      setPrompt('');
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
      setCurrentStep('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handlePromptSubmit();
    }
  };

  return (
    <div className="prompt-canvas h-full flex flex-col">
      {/* Conversational Input */}
      <Card className="p-4 mb-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-gray-900">Describe Your Email</h3>
          </div>
          
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Create a welcome email for new users with a modern design, include a call-to-action button, and add our company logo..."
            className="min-h-20 resize-none border-gray-200 focus:border-purple-400 focus:ring-purple-400"
            disabled={isGenerating}
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                ⌘ + Enter to generate
              </Badge>
              {blocks.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {blocks.length} blocks in canvas
                </Badge>
              )}
            </div>
            
            <Button 
              onClick={handlePromptSubmit}
              disabled={!prompt.trim() || isGenerating}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isGenerating ? (
                <>
                  <Wand2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate
                </>
              )}
            </Button>
          </div>

          {/* Generation Progress */}
          {isGenerating && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Wand2 className="w-4 h-4 animate-spin" />
                {currentStep}
              </div>
              <Progress value={generationProgress} className="h-2" />
            </div>
          )}
        </div>
      </Card>

      {/* Canvas Preview Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button
            variant={previewMode === 'desktop' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPreviewMode('desktop')}
          >
            <Monitor className="w-4 h-4 mr-1" />
            Desktop
          </Button>
          <Button
            variant={previewMode === 'mobile' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPreviewMode('mobile')}
          >
            <Smartphone className="w-4 h-4 mr-1" />
            Mobile
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-1" />
            Preview
          </Button>
          <Button variant="outline" size="sm">
            <BarChart3 className="w-4 h-4 mr-1" />
            Analytics
          </Button>
        </div>
      </div>

      {/* Canvas Area */}
      <div 
        ref={canvasRef}
        className={`flex-1 border border-gray-200 rounded-lg bg-white overflow-auto ${
          previewMode === 'mobile' ? 'max-w-sm mx-auto' : ''
        }`}
      >
        {blocks.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center p-8">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Ready to create with AI
                </h3>
                <p className="text-gray-600 max-w-sm">
                  Describe your email in the prompt above and watch as AI generates a complete email design for you.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6">
            {blocks.map((block) => (
              <div
                key={block.id}
                className="mb-4 p-4 border border-gray-100 rounded-lg hover:border-purple-200 transition-colors"
                dangerouslySetInnerHTML={{ __html: block.content.html || '' }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
