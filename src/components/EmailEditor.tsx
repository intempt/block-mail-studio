import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import FontFamily from '@tiptap/extension-font-family';
import Placeholder from '@tiptap/extension-placeholder';
import Gapcursor from '@tiptap/extension-gapcursor';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Monitor, Smartphone, Code, Eye, Download, Upload, Settings, Layers, Sparkles } from 'lucide-react';

import { EmailBlockLibrary } from './EmailBlockLibrary';
import { EmailTemplateLibrary } from './EmailTemplateLibrary';
import { EmailPreview } from './EmailPreview';
import { EmailEditorToolbar } from './EmailEditorToolbar';
import { EmailPropertiesPanel } from './EmailPropertiesPanel';
import { CustomEmailExtension } from '../extensions/CustomEmailExtension';
import { EmailAIChat } from './EmailAIChat';
import { EmailPromptLibrary, EmailPrompt } from './EmailPromptLibrary';
import { TemplateManager, EmailTemplate } from './TemplateManager';
import { ImageUploader } from './ImageUploader';

const EmailEditor = () => {
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [viewMode, setViewMode] = useState<'visual' | 'code'>('visual');
  const [sidebarTab, setSidebarTab] = useState<'ai' | 'prompts' | 'blocks' | 'templates' | 'manager'>('ai');
  const [showProperties, setShowProperties] = useState(true);
  const [emailHTML, setEmailHTML] = useState('');
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      CustomEmailExtension,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'email-link',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'email-image',
          style: 'max-width: 100%; height: auto;',
        },
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Color,
      TextStyle,
      Underline,
      FontFamily,
      Placeholder.configure({
        placeholder: 'Start creating your email...',
      }),
      Gapcursor,
    ],
    content: `
      <div class="email-container">
        <div class="email-block header-block">
          <h1 style="font-family: Arial, sans-serif; color: #333; margin: 0; padding: 20px; text-align: center; background-color: #f8f9fa;">
            Professional Email Template
          </h1>
        </div>
        <div class="email-block paragraph-block">
          <p style="font-family: Arial, sans-serif; color: #666; line-height: 1.6; margin: 0; padding: 20px;">
            Create stunning, responsive email campaigns with our AI-powered editor. Drag and drop components, customize styling, and preview across devices.
          </p>
        </div>
      </div>
    `,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setEmailHTML(html);
    },
  });

  const handlePromptSelect = (prompt: EmailPrompt) => {
    setSidebarTab('ai');
    // The AI chat component will handle the prompt
  };

  const handleSaveTemplate = (template: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>) => {
    const newTemplate: EmailTemplate = {
      ...template,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      usageCount: 0
    };
    setTemplates(prev => [...prev, newTemplate]);
  };

  const handleLoadTemplate = (template: EmailTemplate) => {
    if (editor) {
      editor.commands.setContent(template.html);
      setTemplates(prev => 
        prev.map(t => 
          t.id === template.id 
            ? { ...t, usageCount: t.usageCount + 1 }
            : t
        )
      );
    }
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
  };

  const handleToggleFavorite = (id: string) => {
    setTemplates(prev => 
      prev.map(t => 
        t.id === id 
          ? { ...t, isFavorite: !t.isFavorite }
          : t
      )
    );
  };

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
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Email Template</title>
    <style>
        /* Reset styles */
        body, table, td, p, a, li, blockquote { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
        
        /* Base styles */
        body { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4; }
        .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .email-block { display: block; width: 100%; }
        
        /* Typography */
        .email-link { color: #007bff; text-decoration: none; }
        .email-link:hover { text-decoration: underline; }
        
        /* Lists */
        .email-bullet-list { margin: 0; padding-left: 20px; }
        .email-ordered-list { margin: 0; padding-left: 20px; }
        
        /* Images */
        .email-image { max-width: 100%; height: auto; display: block; }
        
        /* Tables */
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; font-weight: bold; }
        
        /* Responsive design */
        @media only screen and (max-width: 600px) {
            .email-container { width: 100% !important; }
            .email-block { padding: 10px !important; }
            h1 { font-size: 24px !important; }
            h2 { font-size: 20px !important; }
            h3 { font-size: 18px !important; }
            p { font-size: 16px !important; }
        }
        
        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
            .email-container { background-color: #1a1a1a !important; }
            h1, h2, h3, p { color: #ffffff !important; }
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
      {/* Left Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Email Builder Pro</h2>
          <p className="text-sm text-gray-600 mt-1">AI-powered email campaign editor</p>
        </div>
        
        <div className="border-b border-gray-200">
          <Tabs value={sidebarTab} onValueChange={(value) => setSidebarTab(value as any)}>
            <TabsList className="grid w-full grid-cols-5 text-xs">
              <TabsTrigger value="ai" className="flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                AI
              </TabsTrigger>
              <TabsTrigger value="prompts" className="flex items-center gap-1">
                <Layers className="w-3 h-3" />
                Prompts
              </TabsTrigger>
              <TabsTrigger value="blocks" className="flex items-center gap-1">
                <Layers className="w-3 h-3" />
                Blocks
              </TabsTrigger>
              <TabsTrigger value="templates" className="flex items-center gap-1">
                <Settings className="w-3 h-3" />
                Library
              </TabsTrigger>
              <TabsTrigger value="manager" className="flex items-center gap-1">
                <Settings className="w-3 h-3" />
                Saved
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="flex-1 overflow-hidden">
          {sidebarTab === 'ai' ? (
            <EmailAIChat editor={editor} />
          ) : sidebarTab === 'prompts' ? (
            <EmailPromptLibrary onSelectPrompt={handlePromptSelect} />
          ) : sidebarTab === 'blocks' ? (
            <EmailBlockLibrary editor={editor} />
          ) : sidebarTab === 'templates' ? (
            <EmailTemplateLibrary editor={editor} />
          ) : (
            <TemplateManager
              editor={editor}
              templates={templates}
              onSaveTemplate={handleSaveTemplate}
              onLoadTemplate={handleLoadTemplate}
              onDeleteTemplate={handleDeleteTemplate}
              onToggleFavorite={handleToggleFavorite}
            />
          )}
        </div>

        {!['ai', 'prompts', 'manager'].includes(sidebarTab) && (
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
        )}
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Enhanced Toolbar */}
        <EmailEditorToolbar editor={editor} />
        
        {/* View Controls */}
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
              <Button
                variant={showProperties ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowProperties(!showProperties)}
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Editor Content */}
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 overflow-hidden">
            {viewMode === 'visual' ? (
              <div className="h-full p-8 overflow-y-auto">
                <Card className={`mx-auto transition-all duration-300 ${
                  previewMode === 'desktop' ? 'max-w-4xl' : 'max-w-sm'
                }`}>
                  <div className="p-4">
                    <EditorContent 
                      editor={editor} 
                      className="prose max-w-none focus:outline-none min-h-[600px]"
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
          
          {/* Properties Panel */}
          {showProperties && (
            <EmailPropertiesPanel editor={editor} />
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailEditor;
