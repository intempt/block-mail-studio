
import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Monitor, Smartphone, Code, Eye, Download, Upload } from 'lucide-react';
import { EmailBlockLibrary } from './EmailBlockLibrary';
import { EmailPreview } from './EmailPreview';
import { CustomEmailExtension } from '../extensions/CustomEmailExtension';

const EmailEditor = () => {
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [viewMode, setViewMode] = useState<'visual' | 'code'>('visual');
  const [emailHTML, setEmailHTML] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit,
      CustomEmailExtension,
    ],
    content: `
      <div class="email-container">
        <div class="email-block header-block">
          <h1 style="font-family: Arial, sans-serif; color: #333; margin: 0; padding: 20px; text-align: center; background-color: #f8f9fa;">
            Welcome to Your Email
          </h1>
        </div>
        <div class="email-block paragraph-block">
          <p style="font-family: Arial, sans-serif; color: #666; line-height: 1.6; margin: 0; padding: 20px;">
            Start building your professional email template here. Drag blocks from the sidebar to add content.
          </p>
        </div>
      </div>
    `,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setEmailHTML(html);
    },
  });

  const exportHTML = () => {
    if (editor) {
      const htmlContent = generateEmailHTML(editor.getHTML());
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'email-template.html';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const importHTML = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        editor?.commands.setContent(content);
      };
      reader.readAsText(file);
    }
  };

  const generateEmailHTML = (content: string) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Template</title>
    <style>
        body { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4; }
        .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .email-block { display: block; width: 100%; }
        @media only screen and (max-width: 600px) {
            .email-container { width: 100% !important; }
            .email-block { padding: 10px !important; }
        }
    </style>
</head>
<body>
    ${content}
</body>
</html>`;
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Email Editor</h2>
          <p className="text-sm text-gray-600 mt-1">Build professional HTML emails</p>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <EmailBlockLibrary editor={editor} />
        </div>

        <div className="p-4 border-t border-gray-200 space-y-2">
          <div className="flex gap-2">
            <Button 
              onClick={exportHTML} 
              size="sm" 
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <label className="flex-1">
              <Button size="sm" variant="outline" className="w-full">
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
              <input
                type="file"
                accept=".html,.htm"
                onChange={importHTML}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'visual' | 'code')}>
                <TabsList>
                  <TabsTrigger value="visual" className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Visual
                  </TabsTrigger>
                  <TabsTrigger value="code" className="flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    Code
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={previewMode === 'desktop' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPreviewMode('desktop')}
              >
                <Monitor className="w-4 h-4" />
              </Button>
              <Button
                variant={previewMode === 'mobile' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPreviewMode('mobile')}
              >
                <Smartphone className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Editor Content */}
        <div className="flex-1 overflow-hidden">
          {viewMode === 'visual' ? (
            <div className="h-full p-8 overflow-y-auto">
              <Card className={`mx-auto transition-all duration-300 ${
                previewMode === 'desktop' ? 'max-w-4xl' : 'max-w-sm'
              }`}>
                <div className="p-4">
                  <EditorContent 
                    editor={editor} 
                    className="prose max-w-none focus:outline-none"
                  />
                </div>
              </Card>
            </div>
          ) : (
            <EmailPreview 
              html={generateEmailHTML(emailHTML)} 
              previewMode={previewMode}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailEditor;
