
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Eye, 
  Monitor, 
  Smartphone, 
  Download,
  Settings,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { EmailBlockCanvas } from './EmailBlockCanvas';
import { EnhancedEmailBlockPalette } from './EnhancedEmailBlockPalette';
import { GlobalStylesPanel } from './GlobalStylesPanel';
import { EmailPreview } from './EmailPreview';
import { OmnipresentRibbon } from './OmnipresentRibbon';
import { EmailTemplateLibrary } from './EmailTemplateLibrary';
import { StatusBar } from './StatusBar';
import { PerformanceAnalyzer } from './PerformanceAnalyzer';
import { EmailBlock, UniversalContent } from '@/types/emailBlocks';
import { EmailSnippet } from '@/types/snippets';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import './EmailEditor.css';

interface EmailEditorProps {
  content: string;
  subject: string;
  onContentChange: (content: string) => void;
  onSubjectChange: (subject: string) => void;
  onBack?: () => void;
}

export default function EmailEditor({
  content: initialContent,
  subject: initialSubject,
  onContentChange,
  onSubjectChange,
  onBack
}: EmailEditorProps) {
  const [emailHTML, setEmailHTML] = useState<string>(initialContent);
  const [subject, setSubject] = useState<string>(initialSubject);
  const [blocks, setBlocks] = useState<EmailBlock[]>([]);
  const [globalStyles, setGlobalStyles] = useState<any>({});
  const [universalContent, setUniversalContent] = useState<UniversalContent[]>([]);
  const [showLeftPanel, setShowLeftPanel] = useState<boolean>(true);
  const [showRightPanel, setShowRightPanel] = useState<boolean>(true);
  const [rightPanelTab, setRightPanelTab] = useState<'properties' | 'preview'>('properties');
  const [showTemplateLibrary, setShowTemplateLibrary] = useState<boolean>(false);
  const [showPerformanceAnalyzer, setShowPerformanceAnalyzer] = useState<boolean>(false);
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [snippetRefreshTrigger, setSnippetRefreshTrigger] = useState<number>(0);
  const canvasRef = useRef<any>(null);

  useKeyboardShortcuts({
    editor: null,
    canvasRef,
    onToggleLeftPanel: () => setShowLeftPanel(prev => !prev),
    onToggleRightPanel: () => setShowRightPanel(prev => !prev),
    onToggleFullscreen: () => setIsFullscreen(prev => !prev),
    onSave: () => console.log('Save shortcut triggered')
  });

  useEffect(() => {
    setEmailHTML(initialContent);
    setSubject(initialSubject);
  }, [initialContent, initialSubject]);

  const handleContentChange = useCallback((content: string) => {
    setEmailHTML(content);
    onContentChange(content);
  }, [onContentChange]);

  const handleSubjectChange = useCallback((subject: string) => {
    setSubject(subject);
    onSubjectChange(subject);
  }, [onSubjectChange]);

  const handleBlockAdd = useCallback((blockType: string, layoutConfig?: any) => {
    if (canvasRef.current) {
      canvasRef.current.handleBlockAdd(blockType, layoutConfig);
    }
  }, []);

  const handleSnippetAdd = useCallback((snippet: EmailSnippet) => {
    if (canvasRef.current) {
      canvasRef.current.handleSnippetAdd(snippet);
    }
    setSnippetRefreshTrigger(prev => prev + 1);
  }, []);

  const handleUniversalContentAdd = useCallback((content: UniversalContent) => {
    setUniversalContent(prev => [...prev, content]);
    if (canvasRef.current) {
      canvasRef.current.handleUniversalContentAdd(content);
    }
  }, []);

  const handleBlocksChange = useCallback((newBlocks: EmailBlock[]) => {
    setBlocks(newBlocks);
    const htmlContent = canvasRef.current ? canvasRef.current.getHTML() : '';
    handleContentChange(htmlContent);
  }, [handleContentChange]);

  const handleGlobalStylesChange = useCallback((newStyles: any) => {
    setGlobalStyles(newStyles);
  }, []);

  const handleTemplateSelect = useCallback((templateHTML: string) => {
    handleContentChange(templateHTML);
    setShowTemplateLibrary(false);
  }, [handleContentChange]);

  const handlePreviewToggle = () => {
    setShowRightPanel(prev => !prev);
    setRightPanelTab('preview');
  };

  const toggleFullscreen = () => {
    setIsFullscreen(prev => !prev);
  };

  const handleDeviceChange = (device: 'desktop' | 'mobile' | 'tablet' | 'custom') => {
    if (device === 'desktop' || device === 'mobile') {
      setDeviceMode(device);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-brand-bg text-brand-fg font-switzer">
      {/* Top Navigation Bar */}
      <div className="bg-brand-bg border-b border-brand flex items-center justify-between u-p-4">
        <div className="flex items-center u-gap-3">
          {onBack && (
            <Button
              variant="ghost" 
              size="sm"
              onClick={onBack}
              className="text-brand-fg hover:bg-brand-muted"
            >
              <ArrowLeft className="w-4 h-4 u-m-2" />
              Back
            </Button>
          )}
          <Input 
            value={subject}
            onChange={(e) => onSubjectChange(e.target.value)}
            className="text-h2 border-none bg-transparent focus:ring-0 focus:border-none p-0 font-switzer"
            placeholder="Email Subject Line"
          />
        </div>
        
        <div className="flex items-center u-gap-2">
          <Badge variant="secondary" className="text-caption bg-brand-muted text-brand-fg">
            {deviceMode === 'desktop' ? 'Desktop' : 'Mobile'} Preview
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviewToggle}
            className="border-brand text-brand-fg hover:bg-brand-muted"
          >
            <Eye className="w-4 h-4 u-m-2" />
            Preview
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            className="text-brand-fg hover:bg-brand-muted"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Omnipresent Ribbon */}
      {!isFullscreen && (
        <OmnipresentRibbon
          onBlockAdd={handleBlockAdd}
          onSnippetAdd={handleSnippetAdd}
          universalContent={universalContent}
          onUniversalContentAdd={handleUniversalContentAdd}
          onGlobalStylesChange={handleGlobalStylesChange}
          emailHTML={emailHTML}
          subjectLine={subject}
          editor={canvasRef.current}
          snippetRefreshTrigger={snippetRefreshTrigger}
          onTemplateLibraryOpen={() => setShowTemplateLibrary(true)}
          onPreviewModeChange={setDeviceMode}
          previewMode={deviceMode}
          canvasWidth={deviceMode === 'desktop' ? 600 : 375}
          deviceMode={deviceMode}
          onDeviceChange={handleDeviceChange}
        />
      )}

      {/* Main Editor Layout */}
      <div className={`flex-1 flex overflow-hidden ${isFullscreen ? 'fullscreen-mode' : ''}`}>
        {/* Left Sidebar - Block Palette */}
        {showLeftPanel && !isFullscreen && (
          <div className="w-80 bg-brand-bg border-r border-brand flex flex-col panel-transition">
            <div className="u-p-4 border-b border-brand">
              <h3 className="text-h3 text-brand-fg u-m-2">Blocks & Elements</h3>
              <p className="text-caption text-brand-fg opacity-75">Drag blocks to build your email</p>
            </div>
            
            <div className="flex-1 overflow-hidden">
              <EnhancedEmailBlockPalette 
                onBlockAdd={handleBlockAdd}
                onSnippetAdd={handleSnippetAdd}
                universalContent={universalContent}
                onUniversalContentAdd={handleUniversalContentAdd}
                compactMode={false}
                snippetRefreshTrigger={snippetRefreshTrigger}
              />
            </div>
          </div>
        )}

        {/* Center Canvas Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Canvas Container */}
          <div className="flex-1 overflow-auto bg-brand-muted">
            <div className="u-p-6 flex justify-center">
              <div 
                className={`bg-brand-bg rounded-lg shadow-sm border border-brand transition-all duration-300 ${
                  deviceMode === 'desktop' ? 'w-full max-w-4xl' : 'w-96'
                }`}
                data-testid="email-canvas"
              >
                <EmailBlockCanvas
                  ref={canvasRef}
                  onBlocksChange={handleBlocksChange}
                  onContentChange={handleContentChange}
                  onBlockSelect={() => {}}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Properties & Preview */}
        {showRightPanel && !isFullscreen && (
          <div className="w-80 bg-brand-bg border-l border-brand flex flex-col panel-transition">
            <div className="u-p-4 border-b border-brand">
              <div className="flex items-center justify-between u-m-2">
                <h3 className="text-h3 text-brand-fg">Properties</h3>
                <div className="flex u-gap-1">
                  <Button
                    variant={rightPanelTab === 'properties' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setRightPanelTab('properties')}
                    className="text-xs"
                  >
                    <Settings className="w-3 h-3" />
                  </Button>
                  <Button
                    variant={rightPanelTab === 'preview' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setRightPanelTab('preview')}
                    className="text-xs"
                  >
                    <Eye className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              {rightPanelTab === 'properties' && (
                <div className="h-full overflow-auto">
                  <GlobalStylesPanel 
                    onStylesChange={handleGlobalStylesChange}
                  />
                </div>
              )}
              
              {rightPanelTab === 'preview' && (
                <EmailPreview 
                  html={emailHTML}
                  previewMode={deviceMode}
                  subject={subject}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <StatusBar 
        blockCount={blocks.length}
        canvasWidth={deviceMode === 'desktop' ? 600 : 375}
        previewMode={deviceMode}
        wordCount={emailHTML.length}
      />

      {/* Template Library Modal */}
      {showTemplateLibrary && (
        <EmailTemplateLibrary 
          editor={canvasRef.current}
        />
      )}

      {/* Performance Analyzer Modal */}
      {showPerformanceAnalyzer && (
        <PerformanceAnalyzer
          editor={canvasRef.current}
          emailHTML={emailHTML}
          subjectLine={subject}
        />
      )}
    </div>
  );
}
