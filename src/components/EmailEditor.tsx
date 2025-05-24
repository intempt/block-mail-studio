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
import { Users, MessageSquare, Image as ImageIcon, TrendingUp } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Monitor, 
  Smartphone, 
  Code, 
  Eye, 
  Download, 
  Upload, 
  Settings, 
  Layers, 
  Sparkles, 
  Edit3,
  Wrench,
  Mail,
  Zap,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Palette,
  Table as TableIcon,
  Brain,
  Store,
  User,
  Layout
} from 'lucide-react';

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
import { EmailCodeEditor } from './EmailCodeEditor';
import { EmailPromptEditor } from './EmailPromptEditor';
import { EmailBlockEditor } from './EmailBlockEditor';
import { CollaborativeEmailEditor } from './CollaborativeEmailEditor';
import { AdvancedBlockLibrary } from './AdvancedBlockLibrary';
import { BrandKitManager, BrandKit } from './BrandKitManager';
import { AdvancedTableBuilder } from './AdvancedTableBuilder';
import { ResponsiveLayoutControls } from './ResponsiveLayoutControls';
import { DynamicContentEditor } from './DynamicContentEditor';
import { IndustryTemplateLibrary } from './IndustryTemplateLibrary';
import { SmartDesignAssistant } from './SmartDesignAssistant';
import { IntelligentAssistant } from './IntelligentAssistant';
import { WorkspaceManager } from './WorkspaceManager';
import { TemplateEvolution } from './TemplateEvolution';
import { CollaborationHub } from './CollaborationHub';

type ViewMode = 'chat' | 'build';
type EditorMode = 'visual' | 'code' | 'prompt' | 'blocks';
type BuildTool = 'blocks' | 'advanced' | 'brand' | 'table' | 'responsive' | 'dynamic' | 'templates' | 'assistant' | 'intelligent' | 'evolution' | 'collaboration' | 'workspace';

interface DevicePreset {
  name: string;
  width: number;
  height: number;
  icon: React.ReactNode;
}

interface ResponsiveLayoutControlsProps {
  currentDevice: string;
  onDeviceChange: (device: string) => void;
  onWidthChange: (width: number) => void;
}

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
  const [viewMode, setViewMode] = useState<ViewMode>('chat');
  const [editorMode, setEditorMode] = useState<EditorMode>('visual');
  const [buildTool, setBuildTool] = useState<BuildTool>('blocks');
  const [previewMode, setPreviewMode<'desktop' | 'mobile'>('desktop');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);
  const [emailHTML, setEmailHTML] = useState('');
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [collaborationMode, setCollaborationMode] = useState(false);
  const [documentId] = useState(`email-${Date.now()}`);
  const [userId] = useState(`user-${Math.random().toString(36).substr(2, 9)}`);
  const [userName] = useState('Email Editor User');
  const [currentBrandKit, setCurrentBrandKit] = useState<BrandKit>();
  const [customWidth, setCustomWidth] = useState(600);
  const [workspaceSettings, setWorkspaceSettings] = useState({
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
            Create stunning, responsive email campaigns with our AI-powered editor. Chat with AI to generate content, then refine using our visual, code, or block editors.
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
    setViewMode('chat');
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

  const buildTools = [
    { id: 'blocks', name: 'Blocks', icon: <Layers className="w-4 h-4" /> },
    { id: 'advanced', name: 'Advanced', icon: <Edit3 className="w-4 h-4" /> },
    { id: 'brand', name: 'Brand Kit', icon: <Palette className="w-4 h-4" /> },
    { id: 'table', name: 'Tables', icon: <TableIcon className="w-4 h-4" /> },
    { id: 'dynamic', name: 'Dynamic', icon: <User className="w-4 h-4" /> },
    { id: 'templates', name: 'Industry', icon: <Store className="w-4 h-4" /> },
    { id: 'assistant', name: 'AI Assistant', icon: <Brain className="w-4 h-4" /> },
    { id: 'intelligent', name: 'Smart AI', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'evolution', name: 'Evolution', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'collaboration', name: 'Team', icon: <Users className="w-4 h-4" /> },
    { id: 'workspace', name: 'Workspace', icon: <Layout className="w-4 h-4" /> }
  ];

  return (
    <div className={`h-screen bg-slate-50 flex flex-col ${workspaceSettings.theme === 'dark' ? 'dark' : ''}`}>
      {/* Header */}
      <header className={`bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between ${!workspaceSettings.showToolbar ? 'hidden' : ''}`}>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Mail className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-slate-900">Email Builder Pro</h1>
              <p className="text-xs text-slate-500">Professional email marketing platform</p>
            </div>
          </div>
          
          <Separator orientation="vertical" className="h-6" />
          
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)}>
            <TabsList className="bg-slate-100">
              <TabsTrigger value="chat" className="flex items-center gap-2 data-[state=active]:bg-white">
                <MessageSquare className="w-4 h-4" />
                AI Chat
              </TabsTrigger>
              <TabsTrigger value="build" className="flex items-center gap-2 data-[state=active]:bg-white">
                <Wrench className="w-4 h-4" />
                Professional Tools
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={collaborationMode ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCollaborationMode(!collaborationMode)}
            className="flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            {collaborationMode ? 'Collaborative' : 'Solo'}
          </Button>
          
          <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
            Professional
          </Badge>
          
          <Button variant="outline" size="sm" onClick={exportHTML}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Zap className="w-4 h-4 mr-2" />
            Publish
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        {viewMode === 'chat' && (
          <div className={`bg-white border-r border-slate-200 transition-all duration-300 ${
            sidebarCollapsed ? 'w-0' : 'w-80'
          } flex flex-col ${workspaceSettings.sidebarPosition === 'right' ? 'order-last border-l border-r-0' : ''}`}>
            {!sidebarCollapsed && (
              <>
                <div className="p-4 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-slate-900">AI Assistant</h3>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setSidebarCollapsed(true)}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex-1 overflow-hidden">
                  <EmailAIChat editor={editor} />
                </div>
              </>
            )}
          </div>
        )}

        {viewMode === 'build' && (
          <div className={`bg-white border-r border-slate-200 transition-all duration-300 ${
            sidebarCollapsed ? 'w-0' : 'w-80'
          } flex flex-col ${workspaceSettings.sidebarPosition === 'right' ? 'order-last border-l border-r-0' : ''}`}>
            {!sidebarCollapsed && (
              <>
                <div className="p-4 border-b border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-slate-900">Professional Tools</h3>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setSidebarCollapsed(true)}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className={`grid gap-1 ${workspaceSettings.compactMode ? 'grid-cols-3' : 'grid-cols-2'}`}>
                    {buildTools.map((tool) => (
                      <Button
                        key={tool.id}
                        variant={buildTool === tool.id ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setBuildTool(tool.id as BuildTool)}
                        className={`flex items-center gap-1 text-xs p-2 h-auto ${workspaceSettings.compactMode ? 'flex-col' : ''}`}
                      >
                        {tool.icon}
                        <span className={workspaceSettings.compactMode ? 'text-xs' : 'hidden sm:inline'}>{tool.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="flex-1 overflow-hidden">
                  {buildTool === 'blocks' && <AdvancedBlockLibrary editor={editor} />}
                  {buildTool === 'advanced' && <EmailBlockEditor editor={editor} />}
                  {buildTool === 'brand' && (
                    <BrandKitManager 
                      currentBrandKit={currentBrandKit}
                      onBrandKitChange={setCurrentBrandKit}
                    />
                  )}
                  {buildTool === 'table' && <AdvancedTableBuilder editor={editor} />}
                  {buildTool === 'dynamic' && <DynamicContentEditor editor={editor} />}
                  {buildTool === 'templates' && <IndustryTemplateLibrary editor={editor} />}
                  {buildTool === 'assistant' && (
                    <SmartDesignAssistant editor={editor} emailHTML={emailHTML} />
                  )}
                  {buildTool === 'intelligent' && (
                    <IntelligentAssistant editor={editor} emailHTML={emailHTML} />
                  )}
                  {buildTool === 'evolution' && (
                    <TemplateEvolution editor={editor} templateId={documentId} />
                  )}
                  {buildTool === 'collaboration' && (
                    <CollaborationHub projectId={documentId} />
                  )}
                  {buildTool === 'workspace' && (
                    <WorkspaceManager onSettingsChange={setWorkspaceSettings} />
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* Collapsed Sidebar Toggle */}
        {sidebarCollapsed && (
          <div className="w-12 bg-white border-r border-slate-200 flex flex-col items-center py-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setSidebarCollapsed(false)}
              className="mb-4"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            
            {viewMode === 'chat' ? (
              <MessageSquare className="w-5 h-5 text-slate-400" />
            ) : (
              <Wrench className="w-5 h-5 text-slate-400" />
            )}
          </div>
        )}

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col bg-slate-50">
          {/* Editor Toolbar */}
          {viewMode === 'build' && <EmailEditorToolbar editor={editor} />}
          
          {/* View Controls */}
          <div className="bg-white border-b border-slate-200 px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {viewMode === 'build' && (
                  <Tabs value={editorMode} onValueChange={(value) => setEditorMode(value as EditorMode)}>
                    <TabsList className="bg-slate-100">
                      <TabsTrigger value="visual" className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        Visual
                      </TabsTrigger>
                      <TabsTrigger value="code" className="flex items-center gap-2">
                        <Code className="w-4 h-4" />
                        Code
                      </TabsTrigger>
                      <TabsTrigger value="prompt" className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Prompt
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                )}
                
                {viewMode === 'build' && (
                  <ResponsiveLayoutControls
                    currentDevice={previewMode}
                    onDeviceChange={(device) => setPreviewMode(device as 'desktop' | 'mobile')}
                    onWidthChange={setCustomWidth}
                  />
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={previewMode === 'desktop' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewMode('desktop')}
                  className="h-8"
                >
                  <Monitor className="w-4 h-4" />
                </Button>
                <Button
                  variant={previewMode === 'mobile' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewMode('mobile')}
                  className="h-8"
                >
                  <Smartphone className="w-4 h-4" />
                </Button>
                <Separator orientation="vertical" className="h-6" />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRightPanelCollapsed(!rightPanelCollapsed)}
                  className="h-8"
                >
                  {rightPanelCollapsed ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </div>

          {/* Editor Content */}
          <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 overflow-hidden">
              {collaborationMode ? (
                <div className="h-full p-8 overflow-y-auto">
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
                </div>
              ) : viewMode === 'chat' ? (
                <div className="h-full p-8 overflow-y-auto">
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
                      </div>
                    </div>
                    <div className="p-4 bg-white">
                      <EditorContent 
                        editor={editor} 
                        className="prose max-w-none focus:outline-none min-h-[600px]"
                      />
                    </div>
                  </Card>
                </div>
              ) : viewMode === 'build' && editorMode === 'visual' ? (
                <div className="h-full p-8 overflow-y-auto">
                  <Card className={`mx-auto transition-all duration-300 shadow-lg ${
                    previewMode === 'desktop' ? 'max-w-4xl' : 'max-w-sm'
                  }`} style={{ maxWidth: previewMode === 'desktop' ? `${customWidth}px` : '375px' }}>
                    <div className="p-6 bg-white rounded-lg">
                      <EditorContent 
                        editor={editor} 
                        className="prose max-w-none focus:outline-none min-h-[600px]"
                      />
                    </div>
                  </Card>
                </div>
              ) : viewMode === 'build' && editorMode === 'code' ? (
                <div className="h-full p-6">
                  <EmailCodeEditor editor={editor} />
                </div>
              ) : viewMode === 'build' && editorMode === 'prompt' ? (
                <div className="h-full p-6">
                  <EmailPromptEditor editor={editor} />
                </div>
              ) : (
                <EmailPreview 
                  html={generateEmailHTML(emailHTML)} 
                  previewMode={previewMode}
                />
              )}
            </div>
            
            {/* Right Properties Panel */}
            {!rightPanelCollapsed && viewMode === 'build' && (
              <div className="w-80 border-l border-slate-200 bg-white">
                <EmailPropertiesPanel editor={editor} />
              </div>
            )}
          </div>
          {workspaceSettings.showStatusBar && (
            <div className="bg-white border-t border-slate-200 px-6 py-2 text-xs text-gray-600 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span>Words: {emailHTML.replace(/<[^>]*>/g, '').split(/\s+/).length}</span>
                <span>Characters: {emailHTML.replace(/<[^>]*>/g, '').length}</span>
                <span>Est. read time: {Math.ceil(emailHTML.replace(/<[^>]*>/g, '').split(/\s+/).length / 200)} min</span>
              </div>
              <div className="flex items-center gap-2">
                {workspaceSettings.autoSave && (
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Auto-saved
                  </span>
                )}
                <span>v{Date.now().toString().slice(-3)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailEditor;
