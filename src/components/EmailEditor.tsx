import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
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
  Brain,
  Minimize2,
  Maximize2,
  RefreshCw
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

import { EmailAIChat } from './EmailAIChat';
import { ProfessionalToolPalette } from './ProfessionalToolPalette';
import { BrandVoiceOptimizer } from './BrandVoiceOptimizer';
import { SmartDesignAssistant } from './SmartDesignAssistant';
import { PerformanceAnalyzer } from './PerformanceAnalyzer';
import { TemplateManager, EmailTemplate } from './TemplateManager';
import { EmailAIChatWithTemplates } from './EmailAIChatWithTemplates';
import { EmailBlockCanvas, EmailBlockCanvasRef } from './EmailBlockCanvas';
import { EmailBlockPalette } from './EmailBlockPalette';
import { EmailPropertiesPanel } from './EmailPropertiesPanel';
import { EnhancedEmailBlockPalette } from './EnhancedEmailBlockPalette';
import { EnhancedPropertiesPanel } from './EnhancedPropertiesPanel';
import { EnhancedCollaborativeEditor } from './EnhancedCollaborativeEditor';
import { EmailSubjectLine } from './EmailSubjectLine';
import { EnhancedEmailSubjectLine } from './EnhancedEmailSubjectLine';
import { EnhancedPerformanceAnalyzer } from './EnhancedPerformanceAnalyzer';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useUndoRedo } from '@/hooks/useUndoRedo';
import { useToast } from '@/hooks/use-toast';
import { enhancedAIService } from '@/services/EnhancedAIService';
import { EmailSnippet } from '@/types/snippets';
import { EmailBlockEditor } from './EmailBlockEditor';

type PreviewMode = 'desktop' | 'mobile' | 'tablet';
type LeftPanelTab = 'ai' | 'design' | 'blocks' | 'editor';
type RightPanelTab = 'analytics' | 'optimization';
type ViewDensity = 'comfortable' | 'normal' | 'compact';

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
  const [leftPanelTab, setLeftPanelTab] = useState<LeftPanelTab>('blocks');
  const [rightPanelTab, setRightPanelTab] = useState<RightPanelTab>('analytics');
  const [emailHTML, setEmailHTML] = useState('');
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [viewDensity, setViewDensity] = useState<ViewDensity>('normal');
  const [compactMode, setCompactMode] = useState(false);
  const canvasRef = useRef<EmailBlockCanvasRef>(null);
  const [collaborationMode, setCollaborationMode] = useState(false);
  const [collaborationConfig, setCollaborationConfig] = useState({
    documentId: `email-${Date.now()}`,
    userId: `user-${Math.random().toString(36).substr(2, 9)}`,
    userName: 'Anonymous User',
    userColor: '#3B82F6'
  });
  const [fullscreenMode, setFullscreenMode] = useState(false);
  const [subjectLine, setSubjectLine] = useState('Welcome to Email Builder Pro');
  const [subjectLineScore, setSubjectLineScore] = useState(75);
  const { toast } = useToast();
  
  // Enhanced undo/redo for email content
  const [emailContent, emailActions] = useUndoRedo('');
  
  const handleEmailContentChange = (newContent: string) => {
    setEmailHTML(newContent);
    emailActions.set(newContent);
  };

  const handleSave = () => {
    const templateName = prompt('Enter template name:');
    if (!templateName) return;
    
    const newTemplate: EmailTemplate = {
      id: `template-${Date.now()}`,
      name: templateName,
      description: 'Created from email canvas',
      html: emailHTML,
      subject: subjectLine,
      category: 'Custom',
      tags: ['canvas-created'],
      createdAt: new Date(),
      updatedAt: new Date(),
      isFavorite: false,
      usageCount: 0
    };
    
    setTemplates(prev => [...prev, newTemplate]);
    
    toast({
      title: "Template Saved",
      description: `"${templateName}" has been saved to your templates.`,
    });
    
    const htmlContent = generateEmailHTML(emailHTML);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `email-template-${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleUndo = () => {
    if (emailActions.canUndo) {
      emailActions.undo();
      setEmailHTML(emailActions.getHistory().past[emailActions.getHistory().past.length - 1] || '');
      toast({
        title: "Undone",
        description: "Last change has been undone."
      });
    }
  };

  const handleRedo = () => {
    if (emailActions.canRedo) {
      emailActions.redo();
      setEmailHTML(emailActions.getHistory().future[0] || '');
      toast({
        title: "Redone",
        description: "Change has been restored."
      });
    }
  };

  const handleClearCache = () => {
    enhancedAIService.clearCache();
    toast({
      title: "Cache Cleared",
      description: "AI analysis cache has been cleared."
    });
  };

  const handleToggleFullscreen = () => {
    setFullscreenMode(prev => !prev);
  };

  useKeyboardShortcuts({
    editor: null,
    canvasRef,
    onToggleLeftPanel: () => setLeftPanelCollapsed(prev => !prev),
    onToggleRightPanel: () => setRightPanelCollapsed(prev => !prev),
    onToggleFullscreen: handleToggleFullscreen,
    onSave: handleSave,
    onUndo: handleUndo,
    onRedo: handleRedo,
    collaborationMode
  });

  const keyboardShortcuts = [
    { key: 'Ctrl + S', action: 'Save email', status: 'active' },
    { key: 'Ctrl + Z', action: 'Undo', status: emailActions.canUndo ? 'active' : 'disabled' },
    { key: 'Ctrl + Y', action: 'Redo', status: emailActions.canRedo ? 'active' : 'disabled' },
    { key: 'Ctrl + B', action: 'Bold text (collaboration mode)', status: 'active' },
    { key: 'Ctrl + I', action: 'Italic text (collaboration mode)', status: 'active' },
    { key: 'Ctrl + K', action: 'Insert link (collaboration mode)', status: 'active' },
    { key: 'F11', action: 'Toggle fullscreen', status: 'active' },
    { key: 'Ctrl + [', action: 'Toggle left panel', status: 'active' },
    { key: 'Ctrl + ]', action: 'Toggle right panel', status: 'active' }
  ];

  const getLeftPanelWidth = () => {
    if (leftPanelCollapsed) return 'w-12';
    if (compactMode) return 'w-56 lg:w-64 xl:w-72';
    return 'w-64 lg:w-72 xl:w-80';
  };

  const getRightPanelWidth = () => {
    if (rightPanelCollapsed) return 'w-12';
    if (compactMode) return 'w-56 lg:w-64 xl:w-72';
    return 'w-64 lg:w-72 xl:w-80';
  };

  const getCanvasPadding = () => {
    if (compactMode) return 'p-2 lg:p-4';
    return 'p-4 lg:p-6 xl:p-8';
  };

  const getHeaderHeight = () => {
    return compactMode ? 'h-10' : 'h-12';
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const exportHTML = () => {
    const htmlContent = generateEmailHTML(emailHTML);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'email-template.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateEmailHTML = (content: string) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>${subjectLine}</title>
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
    setEmailHTML(template.html);
    if (template.subject) {
      setSubjectLine(template.subject);
    }
    setTemplates(prev => prev.map(t => 
      t.id === template.id ? { ...t, usageCount: t.usageCount + 1 } : t
    ));
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
  };

  const handleToggleFavorite = (id: string) => {
    setTemplates(prev => prev.map(t => 
      t.id === id ? { ...t, isFavorite: !t.isFavorite } : t
    ));
  };

  const handleBlockAdd = (blockType: string) => {
    canvasRef.current?.insertBlock(blockType);
  };

  const handleSnippetAdd = (snippet: EmailSnippet) => {
    canvasRef.current?.insertSnippet(snippet);
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
          <Blocks className="w-5 h-5 text-slate-400" />
        </div>
      );
    }

    switch (leftPanelTab) {
      case 'ai':
        return (
          <EmailAIChatWithTemplates 
            editor={null} 
            templates={templates}
            onLoadTemplate={handleLoadTemplate}
            onSaveTemplate={handleSaveTemplate}
          />
        );
      case 'design':
        return <ProfessionalToolPalette editor={null} />;
      case 'blocks':
        return (
          <EnhancedEmailBlockPalette 
            onBlockAdd={handleBlockAdd}
            onSnippetAdd={handleSnippetAdd}
            universalContent={[]}
            onUniversalContentAdd={(content) => console.log('Universal content:', content)}
            compactMode={compactMode}
          />
        );
      case 'editor':
        return <EmailBlockEditor editor={null} />;
      default:
        return (
          <EnhancedEmailBlockPalette 
            onBlockAdd={handleBlockAdd}
            onSnippetAdd={handleSnippetAdd}
            universalContent={[]}
            onUniversalContentAdd={(content) => console.log('Universal content:', content)}
            compactMode={compactMode}
          />
        );
    }
  };

  const handlePreviewModeChange = (mode: PreviewMode) => {
    setPreviewMode(mode);
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
      case 'analytics':
        return (
          <EnhancedPerformanceAnalyzer 
            emailHTML={emailHTML}
            subjectLine={subjectLine}
            onOptimize={(suggestion) => {
              console.log('Applying optimization:', suggestion);
              toast({
                title: "Optimization Applied",
                description: suggestion
              });
            }}
          />
        );
      case 'optimization':
        return (
          <BrandVoiceOptimizer 
            editor={null} 
            emailHTML={emailHTML}
          />
        );
      default:
        return (
          <EnhancedPerformanceAnalyzer 
            emailHTML={emailHTML}
            subjectLine={subjectLine}
            onOptimize={(suggestion) => {
              console.log('Applying optimization:', suggestion);
              toast({
                title: "Optimization Applied",
                description: suggestion
              });
            }}
          />
        );
    }
  };

  const renderHeaderActions = () => (
    <div className="flex items-center gap-2 lg:gap-3">
      <div className="flex items-center gap-1 hidden lg:flex">
        <Button
          variant="outline"
          size="sm"
          onClick={handleUndo}
          disabled={!emailActions.canUndo}
          className="h-6 lg:h-8 px-2"
          title="Undo (Ctrl+Z)"
        >
          <RefreshCw className="w-3 h-3 lg:w-4 lg:h-4 rotate-180" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRedo}
          disabled={!emailActions.canRedo}
          className="h-6 lg:h-8 px-2"
          title="Redo (Ctrl+Y)"
        >
          <RefreshCw className="w-3 h-3 lg:w-4 lg:h-4" />
        </Button>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={handleClearCache}
        className="h-6 lg:h-8 hidden lg:flex"
        title="Clear AI Cache"
      >
        <RefreshCw className="w-3 h-3 lg:w-4 lg:h-4" />
      </Button>

      <Button variant="outline" size="sm" onClick={exportHTML} className="h-6 lg:h-8 hidden sm:flex">
        <Download className="w-3 h-3 lg:w-4 lg:h-4 lg:mr-2" />
        <span className="hidden lg:inline">Export</span>
      </Button>
      
      <Button size="sm" onClick={handleSave} className="h-6 lg:h-8 bg-blue-600 hover:bg-blue-700">
        <Zap className="w-3 h-3 lg:w-4 lg:h-4 lg:mr-2" />
        <span className="hidden lg:inline">Publish</span>
      </Button>
    </div>
  );

  return (
    <div className={`h-screen bg-slate-50 flex flex-col ${theme === 'dark' ? 'dark' : ''} ${fullscreenMode ? 'fullscreen-mode' : ''}`}>
      {!fullscreenMode && (
        <header className={`bg-white border-b border-slate-200 ${getHeaderHeight()} flex items-center justify-between px-4 lg:px-6`}>
          <div className="flex items-center gap-2 lg:gap-3">
            <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Mail className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xs lg:text-sm font-semibold text-slate-900">Email Builder Pro</h1>
              <p className="text-xs text-slate-500 hidden lg:block">Canvas Edition</p>
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
            <div className="flex items-center bg-slate-100 rounded-lg p-1">
              <Button
                variant={previewMode === 'desktop' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handlePreviewModeChange('desktop')}
                className="h-6 px-2 lg:h-8 lg:px-3 rounded-md"
              >
                <Monitor className="w-3 h-3 lg:w-4 lg:h-4" />
              </Button>
              <Button
                variant={previewMode === 'tablet' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handlePreviewModeChange('tablet')}
                className="h-6 px-2 lg:h-8 lg:px-3 rounded-md"
              >
                <Layout className="w-3 h-3 lg:w-4 lg:h-4" />
              </Button>
              <Button
                variant={previewMode === 'mobile' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handlePreviewModeChange('mobile')}
                className="h-6 px-2 lg:h-8 lg:px-3 rounded-md"
              >
                <Smartphone className="w-3 h-3 lg:w-4 lg:h-4" />
              </Button>
            </div>
            
            <div className="hidden lg:flex items-center gap-3 min-w-[150px] xl:min-w-[200px]">
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

          {renderHeaderActions()}
        </header>
      )}

      <div className="flex-1 flex overflow-hidden">
        {!(fullscreenMode || leftPanelCollapsed) && (
          <div className={`bg-white border-r border-slate-200 transition-all duration-300 ${getLeftPanelWidth()} flex flex-col`}>
            {leftPanelCollapsed ? (
              renderLeftPanel()
            ) : (
              <>
                <div className={`${compactMode ? 'p-2' : 'p-4'} border-b border-slate-200`}>
                  <div className="flex items-center justify-between mb-2 lg:mb-3">
                    <h3 className="font-semibold text-slate-900 text-sm lg:text-base">Tools</h3>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setLeftPanelCollapsed(true)}
                      className="h-6 w-6 p-0 lg:h-8 lg:w-8"
                    >
                      <PanelLeftClose className="w-3 h-3 lg:w-4 lg:h-4" />
                    </Button>
                  </div>
                  
                  <div className="flex gap-1">
                    <Button
                      variant={leftPanelTab === 'ai' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setLeftPanelTab('ai')}
                      className="flex-1 h-6 lg:h-8"
                    >
                      <Brain className="w-3 h-3 lg:w-4 lg:h-4" />
                    </Button>
                    <Button
                      variant={leftPanelTab === 'design' ? 'default' : 'outline'}
                      size="sm"
                      onClick={()={() => setLeftPanelTab('design')}
                      className="flex-1 h-6 lg:h-8"
                    >
                      <Palette className="w-3 h-3 lg:w-4 lg:h-4" />
                    </Button>
                    <Button
                      variant={leftPanelTab === 'blocks' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setLeftPanelTab('blocks')}
                      className="flex-1 h-6 lg:h-8"
                    >
                      <Blocks className="w-3 h-3 lg:w-4 lg:h-4" />
                    </Button>
                    <Button
                      variant={leftPanelTab === 'editor' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setLeftPanelTab('editor')}
                      className="flex-1 h-6 lg:h-8"
                    >
                      <Edit3 className="w-3 h-3 lg:w-4 lg:h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex-1 overflow-hidden">
                  {renderLeftPanel()}
                </div>
              </>
            )}
          </div>
        )}

        {leftPanelCollapsed && !fullscreenMode && (
          <div className="w-12 bg-white border-r border-slate-200 flex flex-col items-center py-4 gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setLeftPanelCollapsed(false)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Blocks className="w-5 h-5 text-slate-400" />
          </div>
        )}

        <div className="flex-1 flex flex-col bg-slate-50">
          <div className={`flex-1 ${getCanvasPadding()} overflow-y-auto`}>
            <EnhancedEmailSubjectLine
              value={subjectLine}
              onChange={setSubjectLine}
              emailContent={emailHTML}
              onAnalysisComplete={(analysis) => {
                console.log('Subject line analysis completed:', analysis);
              }}
            />
            
            {collaborationMode ? (
              <EnhancedCollaborativeEditor
                documentId={collaborationConfig.documentId}
                userId={collaborationConfig.userId}
                userName={collaborationConfig.userName}
                userColor={collaborationConfig.userColor}
                onContentChange={handleEmailContentChange}
              />
            ) : (
              <EmailBlockCanvas 
                ref={canvasRef}
                onContentChange={handleEmailContentChange}
                previewWidth={previewWidth}
                previewMode={previewMode}
                compactMode={compactMode}
              />
            )}
          </div>
        </div>
        
        {!(fullscreenMode || rightPanelCollapsed) && (
          <div className={`border-l border-slate-200 bg-white ${getRightPanelWidth()}`}>
            <div className={`${compactMode ? 'p-2' : 'p-4'} border-b border-slate-200`}>
              <div className="flex items-center justify-between mb-2 lg:mb-3">
                <h3 className="font-semibold text-slate-900 text-sm lg:text-base">Analytics & Tools</h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setRightPanelCollapsed(true)}
                  className="h-6 w-6 p-0 lg:h-8 lg:w-8"
                >
                  <PanelRightClose className="w-3 h-3 lg:w-4 lg:h-4" />
                </Button>
              </div>
              
              <div className="flex gap-1">
                <Button
                  variant={rightPanelTab === 'analytics' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setRightPanelTab('analytics')}
                  className="flex-1 h-6 lg:h-8"
                >
                  <BarChart3 className="w-3 h-3 lg:w-4 lg:h-4" />
                </Button>
                <Button
                  variant={rightPanelTab === 'optimization' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setRightPanelTab('optimization')}
                  className="flex-1 h-6 lg:h-8"
                >
                  <Target className="w-3 h-3 lg:w-4 lg:h-4" />
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              {renderRightPanel()}
            </div>
          </div>
        )}

        {rightPanelCollapsed && !fullscreenMode && (
          <div className="w-12 bg-white border-l border-slate-200 flex flex-col items-center py-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setRightPanelCollapsed(false)}
              className="h-6 w-6 p-0 lg:h-8 lg:w-8"
            >
              <ChevronLeft className="w-3 h-3 lg:w-4 lg:h-4" />
            </Button>
            <Settings className="w-4 h-4 lg:w-5 lg:h-5 text-slate-400 mt-4" />
          </div>
        )}
      </div>

      {!fullscreenMode && (
        <div className={`bg-white border-t border-slate-200 px-4 lg:px-6 ${compactMode ? 'py-1' : 'py-2'} text-xs text-slate-600 flex items-center justify-between`}>
          <div className="flex items-center gap-4 lg:gap-6">
            <span>Characters: {emailHTML.replace(/<[^>]*>/g, '').length}</span>
            <span className="hidden sm:inline">Templates: {templates.length}</span>
            <span className="hidden lg:flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Enhanced AI-powered editor
            </span>
            {(emailActions.canUndo || emailActions.canRedo) && (
              <span className="hidden lg:flex items-center gap-2 text-blue-600">
                <RefreshCw className="w-3 h-3" />
                {emailActions.canUndo ? 'Can undo' : ''} {emailActions.canRedo ? 'Can redo' : ''}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 lg:gap-4">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Enhanced auto-save
            </span>
            <span className="text-slate-400 hidden lg:inline">Email Builder Pro v4.0</span>
          </div>
        </div>
      )}

      {fullscreenMode && (
        <div className="fixed top-4 right-4 z-50">
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleFullscreen}
            className="bg-white/90 backdrop-blur-sm"
          >
            <Minimize2 className="w-4 h-4 mr-2" />
            Exit Fullscreen
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmailEditor;
