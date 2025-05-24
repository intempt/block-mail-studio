
import React, { useState } from 'react';
import { HtmlBlock } from '@/types/emailBlocks';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code, Eye } from 'lucide-react';

interface HtmlBlockPropertyEditorProps {
  block: HtmlBlock;
  onUpdate: (block: HtmlBlock) => void;
}

export const HtmlBlockPropertyEditor: React.FC<HtmlBlockPropertyEditorProps> = ({
  block,
  onUpdate
}) => {
  const [activeTab, setActiveTab] = useState('code');

  const updateContent = (updates: Partial<HtmlBlock['content']>) => {
    onUpdate({
      ...block,
      content: { ...block.content, ...updates }
    });
  };

  const insertSnippet = (snippet: string) => {
    const textarea = document.getElementById('html-content') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = block.content.html.substring(0, start) + snippet + block.content.html.substring(end);
      updateContent({ html: newValue });
    }
  };

  const commonSnippets = [
    { name: 'Button', code: '<a href="#" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Click me</a>' },
    { name: 'Heading', code: '<h2 style="color: #333; margin: 0 0 16px 0;">Your Heading</h2>' },
    { name: 'Paragraph', code: '<p style="color: #666; line-height: 1.6; margin: 0 0 16px 0;">Your paragraph text here.</p>' },
  ];

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="code">
            <Code className="w-4 h-4 mr-2" />
            Code
          </TabsTrigger>
          <TabsTrigger value="preview">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="code" className="space-y-4">
          <div>
            <Label htmlFor="html-content">HTML Content</Label>
            <Textarea
              id="html-content"
              value={block.content.html}
              onChange={(e) => updateContent({ html: e.target.value })}
              className="mt-2 font-mono text-sm"
              rows={8}
              placeholder="Enter your HTML code here..."
            />
          </div>

          <div>
            <Label htmlFor="custom-css">Custom CSS (optional)</Label>
            <Textarea
              id="custom-css"
              value={block.content.customCSS || ''}
              onChange={(e) => updateContent({ customCSS: e.target.value })}
              className="mt-2 font-mono text-sm"
              rows={4}
              placeholder=".custom-class { color: red; }"
            />
          </div>

          <div>
            <Label>Quick Snippets</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {commonSnippets.map((snippet) => (
                <Button
                  key={snippet.name}
                  size="sm"
                  variant="outline"
                  onClick={() => insertSnippet(snippet.code)}
                >
                  {snippet.name}
                </Button>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="preview">
          <div className="border rounded-md p-4 bg-white">
            <div dangerouslySetInnerHTML={{ __html: block.content.html }} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
