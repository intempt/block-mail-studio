
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
import { Users, MessageSquare, TrendingUp } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Monitor, 
  Smartphone, 
  Code, 
  Eye, 
  Download, 
  Settings, 
  Sparkles, 
  Edit3,
  Mail,
  Zap,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Layout,
  PanelLeftClose,
  PanelRightClose
} from 'lucide-react';

import { EmailAIChat } from './EmailAIChat';
import { EmailEditorToolbar } from './EmailEditorToolbar';
import { EmailPropertiesPanel } from './EmailPropertiesPanel';
import { CustomEmailExtension } from '../extensions/CustomEmailExtension';
import { ProfessionalToolPalette } from './ProfessionalToolPalette';
import { CollaborativeEmailEditor } from './CollaborativeEmailEditor';

type EditorMode = 'design' | 'ai';
type PreviewMode = 'desktop' | 'mobile';

interface WorkspaceSettings {
  theme: 'light' | 'dark' | 'auto';
  sidebarPosition: 'left' | 'right';
  panelLayout: 'default' | 'minimal' | 'expanded';
  showToolbar: boolean;
  showStatusBar: boolean;
  autoSave: boolean;
  keyboardShortcuts: boolean;
  compactMode: boolean;
}

const EmailEditor = () => {
  const [editorMode, setEditorMode] = useState<EditorMode>('design');
  const [previewMode, setPreviewMode] = useState<PreviewMode>('desktop');
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);
  const [emailHTML, setEmailHTML] = useState('');
  const [collaborationMode, setCollaborationMode] = useState(false);
  const [documentId] = useState(`email-${Date.now()}`);
  const [userId] = useState(`user-${Math.random().toString(36).substr(2, 9)}`);
  const [userName] = useState('Email Editor User');
  const [workspaceSettings] = useState<WorkspaceSettings>({
    theme: 'light' as const,
    sidebarPosition: 'left' as const,
    panelLayout: 'default' as const,
    showToolbar: true,
    showStatusBar: true,
    autoSave: true,
    keyboardShortcuts: true,
    compactMode: false
  });

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
          <h1 style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1a1a1a; margin: 0; padding: 32px 24px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 8px 8px 0 0;">
            Welcome to Email Builder Pro
          </h1>
        </div>
        <div class="email-block paragraph-block">
          <p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #374151; line-height: 1.7; margin: 0; padding: 24px; font-size: 16px;">
            Create stunning, responsive email campaigns with our AI-powered editor. Design professional emails with precision and speed.
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

  const generateEmailHTML = (content: string) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Email Template</title>
    <style>
        /* Reset and base styles */
        body, table, td, p, a, li, blockquote { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
        
        body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; }
        .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        .email-block { display: block; width: 100%; }
        
        @media only screen and (max-width: 600px) {
            .email-container { width: 100% !important; margin: 0 !important; border-radius: 0 !important; }
            .email-block { padding: 16px !important; }
        }
    </style>
</head>
<body>
    ${content}
</body>
</html>`;
  };

  return (
    <div className={`h-screen bg-slate-50 flex flex-col ${workspaceSettings.theme === 'dark' ? 'dark' : ''}`}>
      {/* Professional Header */}
      <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6">
        {/* Left: Branding & Project */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Mail className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-slate-900">Email Builder Pro</h1>
              <p className="text-xs text-slate-500">Untitled Campaign</p>
            </div>
          </div>
          
          <Separator orientation="vertical" className="h-8" />
          
          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-100 rounded-lg p-1">
            <Button
              variant={editorMode === 'design' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setEditorMode('design')}
              className="h-8 px-4 rounded-md"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Design
            </Button>
            <Button
              variant={editorMode === 'ai' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setEditorMode('ai')}
              className="h-8 px-4 rounded-md"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              AI Assistant
            </Button>
          </div>
        </div>

        {/* Center: Preview Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 rounded-lg p-1">
            <Button
              variant={previewMode === 'desktop' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setPreviewMode('desktop')}
              className="h-8 px-3 rounded-md"
            >
              <Monitor className="w-4 h-4" />
            </Button>
            <Button
              variant={previewMode === 'mobile' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setPreviewMode('mobile')}
              className="h-8 px-3 rounded-md"
            >
              <Smartphone className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <Button
            variant={collaborationMode ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCollaborationMode(!collaborationMode)}
            className="h-8"
          >
            <Users className="w-4 h-4 mr-2" />
            {collaborationMode ? 'Team' : 'Solo'}
          </Button>
          
          <Separator orientation="vertical" className="h-6" />
          
          <Button variant="outline" size="sm" onClick={exportHTML} className="h-8">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          
          <Button size="sm" className="h-8 bg-blue-600 hover:bg-blue-700">
            <Zap className="w-4 h-4 mr-2" />
            Publish
          </Button>
        </div>
      </header>

      {/* Professional Toolbar */}
      {editorMode === 'design' && <EmailEditorToolbar editor={editor} />}

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel */}
        <div className={`bg-white border-r border-slate-200 transition-all duration-300 ${
          leftPanelCollapsed ? 'w-12' : 'w-80'
        } flex flex-col`}>
          {leftPanelCollapsed ? (
            <div className="flex flex-col items-center py-4 gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setLeftPanelCollapsed(false)}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
              {editorMode === 'design' ? (
                <Layout className="w-5 h-5 text-slate-400" />
              ) : (
                <Sparkles className="w-5 h-5 text-slate-400" />
              )}
            </div>
          ) : (
            <>
              <div className="p-4 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900">
                    {editorMode === 'design' ? 'Design Tools' : 'AI Assistant'}
                  </h3>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setLeftPanelCollapsed(true)}
                  >
                    <PanelLeftClose className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex-1 overflow-hidden">
                {editorMode === 'design' ? (
                  <ProfessionalToolPalette editor={editor} />
                ) : (
                  <EmailAIChat editor={editor} />
                )}
              </div>
            </>
          )}
        </div>

        {/* Center: Editor */}
        <div className="flex-1 flex flex-col bg-slate-50">
          <div className="flex-1 p-8 overflow-y-auto">
            {collaborationMode ? (
              <Card className={`mx-auto transition-all duration-300 shadow-lg ${
                previewMode === 'desktop' ? 'max-w-4xl' : 'max-w-sm'
              }`}>
                <CollaborativeEmailEditor
                  documentId={documentId}
                  userId={userId}
                  userName={userName}
                  onContentChange={setEmailHTML}
                />
              </Card>
            ) : (
              <Card className={`mx-auto transition-all duration-300 shadow-lg ${
                previewMode === 'desktop' ? 'max-w-4xl' : 'max-w-sm'
              }`}>
                <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    <span className="text-xs text-slate-500 ml-2">Email Preview</span>
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {previewMode === 'desktop' ? 'Desktop' : 'Mobile'}
                    </Badge>
                  </div>
                </div>
                <div className="p-6 bg-white rounded-b-lg">
                  <EditorContent 
                    editor={editor} 
                    className="prose max-w-none focus:outline-none min-h-[600px]"
                  />
                </div>
              </Card>
            )}
          </div>
        </div>
        
        {/* Right Panel */}
        {!rightPanelCollapsed && editorMode === 'design' && (
          <div className="w-80 border-l border-slate-200 bg-white">
            <div className="p-4 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">Properties</h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setRightPanelCollapsed(true)}
                >
                  <PanelRightClose className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <EmailPropertiesPanel editor={editor} />
          </div>
        )}

        {/* Right Panel Toggle (when collapsed) */}
        {rightPanelCollapsed && editorMode === 'design' && (
          <div className="w-12 bg-white border-l border-slate-200 flex flex-col items-center py-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setRightPanelCollapsed(false)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Settings className="w-5 h-5 text-slate-400 mt-4" />
          </div>
        )}
      </div>

      {/* Status Bar */}
      {workspaceSettings.showStatusBar && (
        <div className="bg-white border-t border-slate-200 px-6 py-2 text-xs text-slate-600 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span>Words: {emailHTML.replace(/<[^>]*>/g, '').split(/\s+/).length}</span>
            <span>Characters: {emailHTML.replace(/<[^>]*>/g, '').length}</span>
            <span>Est. read time: {Math.ceil(emailHTML.replace(/<[^>]*>/g, '').split(/\s+/).length / 200)} min</span>
          </div>
          <div className="flex items-center gap-4">
            {workspaceSettings.autoSave && (
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Auto-saved just now
              </span>
            )}
            <span className="text-slate-400">Email Builder Pro v2.0</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailEditor;
