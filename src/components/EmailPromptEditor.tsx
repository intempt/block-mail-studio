import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Wand2, 
  Copy, 
  RefreshCw, 
  Target, 
  Users, 
  Palette,
  TrendingUp,
  FileText,
  Settings
} from 'lucide-react';
import { DirectAIService } from '@/services/directAIService';
import { extractServiceData } from '@/utils/serviceResultHelper';

interface EmailPromptEditorProps {
  onEmailGenerated?: (html: string, subject?: string, previewText?: string) => void;
}

export const EmailPromptEditor: React.FC<EmailPromptEditorProps> = ({ onEmailGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [previewText, setPreviewText] = useState('');

  const generateEmail = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      const result = await DirectAIService.generateEmail(prompt, 'general');
      const emailData = extractServiceData(result, { html: '', subject: '', previewText: '' });
      
      if (emailData.html) {
        setGeneratedEmail(emailData.html);
        setEmailSubject(emailData.subject || 'Generated Email');
        setPreviewText(emailData.previewText || '');
        onEmailGenerated?.(emailData.html, emailData.subject, emailData.previewText);
      }
    } catch (error) {
      console.error('Failed to generate email:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center space-x-2 mb-4">
        <FileText className="h-4 w-4 text-gray-500" />
        <h2 className="text-lg font-semibold">Email Generator</h2>
        <Badge variant="secondary" className="ml-auto">AI Powered</Badge>
      </div>

      <Textarea
        placeholder="Enter a prompt to generate an email..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="mb-4"
      />

      <Button onClick={generateEmail} disabled={isGenerating} className="w-full">
        {isGenerating ? (
          <>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Wand2 className="mr-2 h-4 w-4" />
            Generate Email
          </>
        )}
      </Button>

      {generatedEmail && (
        <div className="mt-6">
          <Separator className="my-4" />
          <h3 className="text-md font-semibold mb-2">Generated Email</h3>
          <div className="rounded-md border p-4 bg-gray-50">
            <div className="font-bold text-gray-800">{emailSubject}</div>
            <div className="text-gray-600">{previewText}</div>
            <div dangerouslySetInnerHTML={{ __html: generatedEmail }} />
          </div>
          <Button
            variant="secondary"
            onClick={() => navigator.clipboard.writeText(generatedEmail)}
            className="mt-4 w-full"
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy to Clipboard
          </Button>
        </div>
      )}
    </Card>
  );
};
