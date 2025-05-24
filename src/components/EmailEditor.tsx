import React, { useState, useEffect } from 'react';
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
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Monitor, 
  Smartphone, 
  Eye, 
  Download, 
  Settings, 
  Sparkles, 
  Edit3,
  Mail,
  Zap,
  ChevronLeft,
  ChevronRight,
  Layout,
  PanelLeftClose,
  PanelRightClose,
  Users,
  BarChart3,
  Palette,
  FileText,
  Code2,
  Target,
  Sun,
  Moon,
  Keyboard,
  UserPlus,
  Share2,
  Wifi,
  WifiOff,
  Blocks,
  Brain
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { EmailAIChat } from './EmailAIChat';
import { EmailEditorToolbar } from './EmailEditorToolbar';
import { ProfessionalToolPalette } from './ProfessionalToolPalette';
import { BrandVoiceOptimizer } from './BrandVoiceOptimizer';
import { SmartDesignAssistant } from './SmartDesignAssistant';
import { PerformanceAnalyzer } from './PerformanceAnalyzer';
import { TemplateManager, EmailTemplate } from './TemplateManager';
import { CustomEmailExtension } from '../extensions/CustomEmailExtension';
import { TipTapProCollabService, CollaborationConfig } from '@/services/TipTapProCollabService';
import { EmailAIChatWithTemplates } from './EmailAIChatWithTemplates';

type PreviewMode = 'desktop' | 'mobile' | 'tablet';
type LeftPanelTab = 'ai' | 'design' | 'blocks';
type RightPanelTab = 'properties' | 'analytics' | 'optimization' | 'code';

interface Collaborator {
  id: string;
  name: string;
  color: string;
  isOnline: boolean;
}

const EmailEditor = () => {
  const [previewMode, setPreviewMode] = useState<PreviewMode>('desktop');
  const [previewWidth, setPreviewWidth] = useState(1200);
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);
  const [leftPanelTab, setLeftPanelTab] = useState<LeftPanelTab>('ai');
  const [rightPanelTab, setRightPanelTab] = useState<RightPanelTab>('properties');
  const [emailHTML, setEmailHTML] = useState('');
  const [documentId] = useState(`email-${Date.now()}`);
  const [userId] = useState(`user-${Math.random().toString(36).substr(2, 9)}`);
  const [userName] = useState('Email Editor User');
  const [userColor] = useState('#3B82F6');
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [ydoc] = useState(() => new Y.Doc());
  const [provider, setProvider] = useState<WebsocketProvider | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connecting');
  const [isProviderReady, setIsProviderReady] = useState(false);

  const keyboardShortcuts = [
    { key: 'Ctrl + S', action: 'Save email' },
    { key: 'Ctrl + Z', action: 'Undo' },
    { key: 'Ctrl + Y', action: 'Redo' },
    { key: 'Ctrl + B', action: 'Bold text' },
    { key: 'Ctrl + I', action: 'Italic text' },
    { key: 'Ctrl + K', action: 'Insert link' },
    { key: 'F11', action: 'Toggle fullscreen' }
  ];

  // Set up WebSocket provider
  useEffect(() => {
    const wsProvider = new WebsocketProvider('wss://demos.yjs.dev', documentId, ydoc);
    
    wsProvider.on('status', (event: any) => {
      console.log('WebSocket status:', event.status);
      setConnectionStatus(event.status);
      if (event.status === 'connected') {
        setIsProviderReady(true);
      }
    });

    wsProvider.awareness.setLocalStateField('user', {
      name: userName,
      color: userColor,
    });

    // Listen for awareness changes to update collaborators
    wsProvider.awareness.on('change', () => {
      const states = wsProvider.awareness.getStates();
      const users: Collaborator[] = [];
      
      states.forEach((state, clientId) => {
        if (state.user) {
          users.push({
            id: clientId.toString(),
            name: state.user.name,
            color: state.user.color,
            isOnline: true
          });
        }
      });
      
      setCollaborators(users);
    });

    setProvider(wsProvider);
    // Set provider ready after a short delay to ensure connection is stable
    setTimeout(() => setIsProviderReady(true), 1000);

    return () => {
      wsProvider.destroy();
    };
  }, [documentId, userName, userColor, ydoc]);

  // Only create editor when provider is ready
  const editor = useEditor({
    extensions: [
      StarterKit,
      CustomEmailExtension,
      Collaboration.configure({
        document: ydoc,
      }),
      ...(provider ? [CollaborationCursor.configure({
        provider: provider,
        user: {
          name: userName,
          color: userColor,
        },
      })] : []),
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
  }, [isProviderReady, provider]);

  useEffect(() => {
    const initCollaboration = async () => {
      try {
        await TipTapProCollabService.createDocument(documentId);
        
        const config: CollaborationConfig = {
          documentId,
          userId,
          userName,
          userColor
        };
        
        await TipTapProCollabService.joinCollaboration(config);
        loadCollaborators();
      } catch (error) {
        console.error('Failed to initialize collaboration:', error);
      }
    };

    initCollaboration();
  }, [documentId, userId, userName, userColor]);

  const loadCollaborators = async () => {
    try {
      const response = await TipTapProCollabService.getCollaborators(documentId);
      const data = await response.json();
      const collabData = data.users || [];
      
      // Transform API response to our collaborator format
      const transformedCollaborators: Collaborator[] = collabData.map((user: any) => ({
        id: user.id || user.userId,
        name: user.name || user.userName,
        color: user.color || user.userColor || '#3B82F6',
        isOnline: user.isOnline !== false
      }));
      
      setCollaborators(transformedCollaborators);
    } catch (error) {
      console.error('Failed to load collaborators:', error);
      // Add current user as fallback
      setCollaborators([{
        id: userId,
        name: userName,
        color: userColor,
        isOnline: true
      }]);
    }
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
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

  const inviteCollaborator = () => {
    const email = window.prompt('Enter email address to invite:');
    if (email) {
      console.log(`Inviting ${email} to collaborate on document ${documentId}`);
      // In a real implementation, this would send an invitation
    }
  };

  const handleSaveTemplate = (template: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>) => {
    const newTemplate: EmailTemplate = {
      ...template,
      id: `template-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      usageCount: 0
    };
    setTemplates(prev => [...prev, newTemplate]);
  };

  const handleLoadTemplate = (template: EmailTemplate) => {
    if (editor) {
      editor.commands.setContent(template.html);
      setTemplates(prev => prev.map(t => 
        t.id === template.id ? { ...t, usageCount: t.usageCount + 1 } : t
      ));
    }
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
  };

  const handleToggleFavorite = (id: string) => {
    setTemplates(prev => prev.map(t => 
      t.id === id ? { ...t, isFavorite: !t.isFavorite } : t
    ));
  };

  const renderLeftPanel = () => {
    if (leftPanelCollapsed) {
      return (
        <div className="flex flex-col items-center py-4 gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setLeftPanelCollapsed(false)}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Brain className="w-5 h-5 text-slate-400" />
        </div>
      );
    }

    switch (leftPanelTab) {
      case 'ai':
        return (
          <EmailAIChatWithTemplates 
            editor={editor} 
            templates={templates}
            onLoadTemplate={handleLoadTemplate}
            onSaveTemplate={handleSaveTemplate}
          />
        );
      case 'design':
        return <ProfessionalToolPalette editor={editor} />;
      case 'blocks':
        return (
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Blocks</h3>
            <p className="text-sm text-gray-500">Drag and drop components coming soon...</p>
          </div>
        );
      default:
        return (
          <EmailAIChatWithTemplates 
            editor={editor} 
            templates={templates}
            onLoadTemplate={handleLoadTemplate}
            onSaveTemplate={handleSaveTemplate}
          />
        );
    }
  };

  const handlePreviewModeChange = (mode: PreviewMode) => {
    setPreviewMode(mode);
    // Set default widths for each device type
    switch (mode) {
      case 'desktop':
        setPreviewWidth(1200);
        break;
      case 'tablet':
        setPreviewWidth(768);
        break;
      case 'mobile':
        setPreviewWidth(375);
        break;
    }
  };

  const handleWidthChange = (value: number[]) => {
    setPreviewWidth(value[0]);
    // Auto-update preview mode based on width
    if (value[0] <= 480) {
      setPreviewMode('mobile');
    } else if (value[0] <= 1024) {
      setPreviewMode('tablet');
    } else {
      setPreviewMode('desktop');
    }
  };

  const renderRightPanel = () => {
    switch (rightPanelTab) {
      case 'properties':
        return <SmartDesignAssistant editor={editor} emailHTML={emailHTML} />;
      case 'analytics':
        return <PerformanceAnalyzer editor={editor} emailHTML={emailHTML} />;
      case 'optimization':
        return <BrandVoiceOptimizer editor={editor} emailHTML={emailHTML} />;
      case 'code':
        return (
          <div className="p-4">
            <h4 className="font-medium mb-4">HTML Preview</h4>
            <div className="bg-slate-100 rounded-lg p-4 text-xs font-mono overflow-auto max-h-96">
              <pre>{emailHTML}</pre>
            </div>
          </div>
        );
      default:
        return <SmartDesignAssistant editor={editor} emailHTML={emailHTML} />;
    }
  };

  const getConnectionStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Wifi className="w-4 h-4 text-green-500" />;
      case 'connecting':
        return <Wifi className="w-4 h-4 text-yellow-500 animate-pulse" />;
      case 'disconnected':
        return <WifiOff className="w-4 h-4 text-red-500" />;
      default:
        return <WifiOff className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className={`h-screen bg-slate-50 flex flex-col ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Professional Header */}
      <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6">
        {/* Left: Branding & Project */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Mail className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-slate-900">Email Builder Pro</h1>
            <p className="text-xs text-slate-500">Professional Campaign</p>
          </div>
        </div>

        {/* Center: Enhanced Preview Controls */}
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-slate-100 rounded-lg p-1">
            <Button
              variant={previewMode === 'desktop' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handlePreviewModeChange('desktop')}
              className="h-8 px-3 rounded-md"
            >
              <Monitor className="w-4 h-4" />
            </Button>
            <Button
              variant={previewMode === 'tablet' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handlePreviewModeChange('tablet')}
              className="h-8 px-3 rounded-md"
            >
              <Layout className="w-4 h-4" />
            </Button>
            <Button
              variant={previewMode === 'mobile' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handlePreviewModeChange('mobile')}
              className="h-8 px-3 rounded-md"
            >
              <Smartphone className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Width Slider */}
          <div className="flex items-center gap-3 min-w-[200px]">
            <span className="text-xs text-slate-500 font-mono">Width:</span>
            <div className="flex-1">
              <Slider
                value={[previewWidth]}
                onValueChange={handleWidthChange}
                max={1440}
                min={320}
                step={10}
                className="w-full"
              />
            </div>
            <Badge variant="secondary" className="text-xs font-mono min-w-[60px] justify-center">
              {previewWidth}px
            </Badge>
          </div>
        </div>

        {/* Right: Collaborators & Actions */}
        <div className="flex items-center gap-3">
          {/* Connection Status */}
          <div className="flex items-center gap-2">
            {getConnectionStatusIcon()}
            <span className="text-xs text-slate-500 capitalize">{connectionStatus}</span>
          </div>

          {/* Collaborators */}
          {collaborators.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {collaborators.slice(0, 3).map((collaborator) => (
                  <Avatar key={collaborator.id} className="w-8 h-8 border-2 border-white">
                    <AvatarFallback 
                      className="text-xs font-medium"
                      style={{ backgroundColor: collaborator.color }}
                    >
                      {collaborator.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {collaborators.length > 3 && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    +{collaborators.length - 3}
                  </Badge>
                )}
              </div>
              
              <Button variant="outline" size="sm" onClick={inviteCollaborator} className="h-8">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          )}

          <Separator orientation="vertical" className="h-6" />

          {/* Theme Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            className="h-8"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </Button>

          {/* Keyboard Shortcuts */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <Keyboard className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Keyboard Shortcuts</h4>
                <div className="space-y-2">
                  {keyboardShortcuts.map((shortcut, index) => (
                    <div key={index} className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">{shortcut.action}</span>
                      <Badge variant="outline" className="text-xs font-mono">
                        {shortcut.key}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
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
      <EmailEditorToolbar editor={editor} />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Tools */}
        <div className={`bg-white border-r border-slate-200 transition-all duration-300 ${
          leftPanelCollapsed ? 'w-12' : 'w-80'
        } flex flex-col`}>
          {leftPanelCollapsed ? (
            renderLeftPanel()
          ) : (
            <>
              <div className="p-4 border-b border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-slate-900">Tools</h3>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setLeftPanelCollapsed(true)}
                  >
                    <PanelLeftClose className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex gap-1">
                  <Button
                    variant={leftPanelTab === 'ai' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setLeftPanelTab('ai')}
                    className="flex-1"
                  >
                    <Brain className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={leftPanelTab === 'design' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setLeftPanelTab('design')}
                    className="flex-1"
                  >
                    <Palette className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={leftPanelTab === 'blocks' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setLeftPanelTab('blocks')}
                    className="flex-1"
                  >
                    <Blocks className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex-1 overflow-hidden">
                {renderLeftPanel()}
              </div>
            </>
          )}
        </div>

        {/* Center: Editor */}
        <div className="flex-1 flex flex-col bg-slate-50">
          <div className="flex-1 p-8 overflow-y-auto">
            <Card 
              className="mx-auto transition-all duration-300 shadow-lg"
              style={{ maxWidth: `${previewWidth}px` }}
            >
              <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <span className="text-xs text-slate-500 ml-2">Email Preview</span>
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {previewMode.charAt(0).toUpperCase() + previewMode.slice(1)} • {previewWidth}px
                  </Badge>
                  {collaborators.filter(c => c.isOnline).length > 1 && (
                    <Badge variant="outline" className="text-xs">
                      {collaborators.filter(c => c.isOnline).length} collaborating
                    </Badge>
                  )}
                  {connectionStatus === 'connected' && (
                    <Badge variant="outline" className="text-xs text-green-600">
                      Live
                    </Badge>
                  )}
                </div>
              </div>
              <div className="p-6 bg-white rounded-b-lg">
                <EditorContent 
                  editor={editor} 
                  className="prose max-w-none focus:outline-none min-h-[600px]"
                />
              </div>
            </Card>
          </div>
        </div>
        
        {/* Right Panel - Analytics & Tools */}
        {!rightPanelCollapsed && (
          <div className="w-80 border-l border-slate-200 bg-white">
            <div className="p-4 border-b border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-slate-900">Analytics & Tools</h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setRightPanelCollapsed(true)}
                >
                  <PanelRightClose className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex gap-1">
                <Button
                  variant={rightPanelTab === 'properties' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setRightPanelTab('properties')}
                  className="flex-1"
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  variant={rightPanelTab === 'analytics' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setRightPanelTab('analytics')}
                  className="flex-1"
                >
                  <BarChart3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={rightPanelTab === 'optimization' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setRightPanelTab('optimization')}
                  className="flex-1"
                >
                  <Target className="w-4 h-4" />
                </Button>
                <Button
                  variant={rightPanelTab === 'code' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setRightPanelTab('code')}
                  className="flex-1"
                >
                  <Code2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              {renderRightPanel()}
            </div>
          </div>
        )}

        {/* Right Panel Toggle (when collapsed) */}
        {rightPanelCollapsed && (
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
      <div className="bg-white border-t border-slate-200 px-6 py-2 text-xs text-slate-600 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span>Words: {emailHTML.replace(/<[^>]*>/g, '').split(/\s+/).length}</span>
          <span>Characters: {emailHTML.replace(/<[^>]*>/g, '').length}</span>
          <span>Est. read time: {Math.ceil(emailHTML.replace(/<[^>]*>/g, '').split(/\s+/).length / 200)} min</span>
          <span>Templates: {templates.length}</span>
          {collaborators.length > 1 && (
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              {collaborators.filter(c => c.isOnline).length} collaborating
            </span>
          )}
          <span className="flex items-center gap-2">
            {getConnectionStatusIcon()}
            WebSocket {connectionStatus}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Auto-saved just now
          </span>
          <span className="text-slate-400">Email Builder Pro v2.0 - Collaborative Edition</span>
        </div>
      </div>
    </div>
  );
};

export default EmailEditor;
