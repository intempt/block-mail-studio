
import React, { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmailBlock } from '@/types/emailBlocks';
import { PromptCanvas } from './ai/PromptCanvas';
import { ConversationalInterface } from './ai/ConversationalInterface';
import { ContextualToolbar } from './ai/ContextualToolbar';
import { OpenAIEmailService } from '@/services/openAIEmailService';

interface PromptBasedEmailEditorProps {
  onEmailExport?: (html: string) => void;
  initialBlocks?: EmailBlock[];
}

export const PromptBasedEmailEditor: React.FC<PromptBasedEmailEditorProps> = ({
  onEmailExport,
  initialBlocks = []
}) => {
  const [blocks, setBlocks] = useState<EmailBlock[]>(initialBlocks);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [emailContext, setEmailContext] = useState({
    type: 'newsletter',
    audience: 'business professionals',
    goal: 'engagement',
    brandVoice: 'professional'
  });

  const selectedBlock = blocks.find(block => block.id === selectedBlockId);

  const generateEmailFromPrompt = useCallback(async (prompt: string, context: any): Promise<EmailBlock[]> => {
    try {
      console.log('Generating email from prompt:', prompt);
      
      // Use the existing OpenAI service to generate content
      const emailResponse = await OpenAIEmailService.generateEmailContent({
        prompt,
        emailType: context.campaignType || 'newsletter',
        tone: 'professional',
        industry: 'general',
        targetAudience: context.targetAudience || 'general'
      });

      // Convert the HTML response into EmailBlock format
      const newBlocks: EmailBlock[] = [
        {
          id: `block-${Date.now()}`,
          type: 'text',
          content: {
            html: emailResponse.html || '<p>Generated content</p>'
          },
          styling: {
            desktop: {
              width: '100%',
              height: 'auto',
              backgroundColor: 'transparent',
              padding: '16px',
              margin: '8px 0',
              borderRadius: '6px'
            }
          }
        }
      ];

      return newBlocks;
    } catch (error) {
      console.error('Email generation failed:', error);
      
      // Fallback mock generation
      const mockBlock: EmailBlock = {
        id: `block-${Date.now()}`,
        type: 'text',
        content: {
          html: `
            <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
              <h1 style="color: #333; margin-bottom: 20px;">Welcome to Our Newsletter!</h1>
              <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                Thank you for subscribing! We're excited to share valuable insights and updates with you.
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="#" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  Get Started
                </a>
              </div>
              <p style="color: #999; font-size: 14px; text-align: center;">
                Generated with AI based on: "${prompt}"
              </p>
            </div>
          `
        },
        styling: {
          desktop: {
            width: '100%',
            height: 'auto',
            backgroundColor: 'transparent',
            padding: '16px',
            margin: '8px 0',
            borderRadius: '6px'
          }
        }
      };

      return [mockBlock];
    }
  }, []);

  const handleSuggestionApply = useCallback((suggestion: any) => {
    console.log('Applying suggestion:', suggestion);
    // Implementation would apply the suggestion to the selected block or email
  }, []);

  const handleContentGenerate = useCallback((type: string, context: any) => {
    console.log('Generating content type:', type, 'with context:', context);
    // Implementation would generate specific content types
  }, []);

  return (
    <div className="prompt-based-email-editor h-full flex">
      {/* Left Panel - AI Interface */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        <Tabs defaultValue="prompt" className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-2 m-2">
            <TabsTrigger value="prompt">Prompt</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
          </TabsList>
          
          <TabsContent value="prompt" className="flex-1 m-2">
            <PromptCanvas
              blocks={blocks}
              onBlocksUpdate={setBlocks}
              onPromptGeneration={async (prompt, context) => {
                const newBlocks = await generateEmailFromPrompt(prompt, context);
                setBlocks(newBlocks);
              }}
            />
          </TabsContent>
          
          <TabsContent value="chat" className="flex-1 m-2">
            <ConversationalInterface
              onEmailGeneration={generateEmailFromPrompt}
              onBlocksUpdate={setBlocks}
              currentBlocks={blocks}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Center Panel - Canvas */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-6 overflow-auto">
          {blocks.length === 0 ? (
            <Card className="h-full flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✨</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  AI-Powered Email Editor
                </h3>
                <p className="text-gray-600 max-w-md">
                  Start by describing your email in the prompt panel or chat with the AI to create your perfect email campaign.
                </p>
              </div>
            </Card>
          ) : (
            <div className="max-w-2xl mx-auto">
              {blocks.map((block, index) => (
                <div
                  key={block.id}
                  className={`mb-4 border rounded-lg overflow-hidden transition-all cursor-pointer ${
                    selectedBlockId === block.id 
                      ? 'border-purple-400 shadow-lg' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedBlockId(block.id)}
                >
                  <div 
                    className="p-4"
                    dangerouslySetInnerHTML={{ __html: block.content.html || '' }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Contextual Tools */}
      <div className="w-80 border-l border-gray-200 p-4">
        <ContextualToolbar
          selectedBlock={selectedBlock}
          emailContext={emailContext}
          onSuggestionApply={handleSuggestionApply}
          onContentGenerate={handleContentGenerate}
        />
      </div>
    </div>
  );
};
