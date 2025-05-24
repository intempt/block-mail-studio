
import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, RefreshCw, Save, Wand2 } from 'lucide-react';
import { emailAIService, EmailGenerationRequest } from '@/services/EmailAIService';

interface EmailPromptEditorProps {
  editor: Editor | null;
  onEmailGenerated?: (emailData: any) => void;
}

export const EmailPromptEditor: React.FC<EmailPromptEditorProps> = ({ 
  editor,
  onEmailGenerated 
}) => {
  const [prompt, setPrompt] = useState('');
  const [tone, setTone] = useState<'professional' | 'casual' | 'friendly' | 'urgent'>('professional');
  const [type, setType] = useState<'welcome' | 'promotional' | 'newsletter' | 'announcement'>('welcome');
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGeneratedEmail, setLastGeneratedEmail] = useState<any>(null);

  const refinementPrompts = [
    { label: 'Make it more casual', prompt: 'Make this email more casual and conversational' },
    { label: 'Add urgency', prompt: 'Add urgency and time-sensitive language to this email' },
    { label: 'Shorten content', prompt: 'Make this email shorter and more concise' },
    { label: 'Add CTA', prompt: 'Add a clear and compelling call-to-action button' },
    { label: 'Professional tone', prompt: 'Make this email more professional and formal' },
    { label: 'Add personalization', prompt: 'Add personalization elements and make it feel more personal' }
  ];

  const generateEmail = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      const request: EmailGenerationRequest = {
        prompt,
        tone,
        type
      };

      const response = await emailAIService.generateEmail(request);
      setLastGeneratedEmail(response);
      
      if (editor) {
        editor.commands.setContent(response.html);
      }
      
      onEmailGenerated?.(response);
    } catch (error) {
      console.error('Failed to generate email:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const refineEmail = async (refinementPrompt: string) => {
    if (!editor || !lastGeneratedEmail) return;

    setIsGenerating(true);
    try {
      const currentHtml = editor.getHTML();
      const refinedHtml = await emailAIService.refineEmail(currentHtml, refinementPrompt);
      
      editor.commands.setContent(refinedHtml);
      
      // Update the last generated email
      setLastGeneratedEmail({
        ...lastGeneratedEmail,
        html: refinedHtml
      });
    } catch (error) {
      console.error('Failed to refine email:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const quickPrompts = [
    'Create a welcome email for new subscribers',
    'Design a promotional email for a 25% off sale',
    'Write a newsletter with company updates',
    'Create an event invitation email',
    'Design a product launch announcement',
    'Write a customer appreciation email'
  ];

  return (
    <Card className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Prompt Editor</h3>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Tone</label>
              <Select value={tone} onValueChange={(value: any) => setTone(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Type</label>
              <Select value={type} onValueChange={(value: any) => setType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="welcome">Welcome</SelectItem>
                  <SelectItem value="promotional">Promotional</SelectItem>
                  <SelectItem value="newsletter">Newsletter</SelectItem>
                  <SelectItem value="announcement">Announcement</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Quick Prompts</label>
            <div className="flex flex-wrap gap-1">
              {quickPrompts.map((quickPrompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setPrompt(quickPrompt)}
                  className="text-xs"
                >
                  {quickPrompt.split(' ').slice(0, 3).join(' ')}...
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Email Prompt</label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the email you want to create..."
            className="h-32 resize-none"
          />
        </div>

        <Button
          onClick={generateEmail}
          disabled={!prompt.trim() || isGenerating}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4 mr-2" />
              Generate Email
            </>
          )}
        </Button>

        {lastGeneratedEmail && (
          <div className="space-y-3">
            <div className="border-t pt-3">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Quick Refinements</h4>
              <div className="grid grid-cols-2 gap-2">
                {refinementPrompts.map((refinement, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => refineEmail(refinement.prompt)}
                    disabled={isGenerating}
                    className="text-xs"
                  >
                    {refinement.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="text-xs text-gray-600 p-3 bg-gray-50 rounded">
              <div><strong>Subject:</strong> {lastGeneratedEmail.subject}</div>
              <div className="mt-1"><strong>Preview:</strong> {lastGeneratedEmail.previewText}</div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
