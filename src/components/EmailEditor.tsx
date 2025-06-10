import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo
} from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Link } from '@tiptap/extension-link';
import { Image } from '@tiptap/extension-image';
import { Underline } from '@tiptap/extension-underline';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Color } from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import TextAlign from '@tiptap/extension-text-align';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Eye,
  Send
} from 'lucide-react';
import { EmailPreview } from './EmailPreview';
import { EmailBlockCanvas } from './EmailBlockCanvas';
import { OmnipresentRibbon } from './OmnipresentRibbon';
import { SnippetRibbon } from './SnippetRibbon';
import { EmailTemplateLibrary } from './EmailTemplateLibrary';
import { CanvasStatus } from './canvas/CanvasStatus';
import { EmailTemplate } from '@/types/emailBlocks';
import { DirectTemplateService } from '@/services/directTemplateService';
import { UniversalContent } from '@/types/emailBlocks';
import { EmailSnippet } from '@/types/snippets';
import { EmailBlock } from '@/types/emailBlocks';
import { useNotification } from '@/contexts/NotificationContext';
import { InlineNotificationContainer } from '@/components/ui/inline-notification';
import { UndoManager, UndoManagerRef } from './UndoManager';
import { MetricsPanel } from './panels/MetricsPanel';
import { AISuggestionsPanel } from './panels/AISuggestionsPanel';
import { CollapsiblePanel } from '@/components/ui/CollapsiblePanel';
import { CriticalEmailAnalysisService, CriticalSuggestion } from '@/services/criticalEmailAnalysisService';
import { CentralizedAIAnalysisService, CompleteAnalysisResult } from '@/services/CentralizedAIAnalysisService';
import { ApiKeyService } from '@/services/apiKeyService';
import { ComprehensiveMetricsService, ComprehensiveEmailMetrics } from '@/services/comprehensiveMetricsService';

interface Block {
  id: string;
  type: string;
  content: string;
  styles: Record<string, string>;
}

interface LayoutConfig {
  direction: 'row' | 'column';
  alignItems: 'start' | 'center' | 'end';
  justifyContent: 'start' | 'center' | 'space-between';
}

type LeftPanelTab = 'blocks' | 'design' | 'performance';

interface EmailEditorProps {
  content: string;
  subject: string;
  onContentChange: (content: string) => void;
  onSubjectChange: (subject: string) => void;
  onBack?: () => void;
}

type ViewMode = 'edit' | 'desktop-preview' | 'mobile-preview';

export default function EmailEditor({ 
  content,
  subject,
  onContentChange,
  onSubjectChange,
  onBack 
}: EmailEditorProps) {
  console.log('EmailEditor: Component starting to render');

  const { notifications, removeNotification, error } = useNotification();

  const [blocks, setBlocks] = useState<Block[]>([]);
  const [emailBlocks, setEmailBlocks] = useState<EmailBlock[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [universalContent] = useState<UniversalContent[]>([]);
  const [snippetRefreshTrigger, setSnippetRefreshTrigger] = useState(0);
  const [showAIAnalytics, setShowAIAnalytics] = useState(true);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  const [canvasWidth, setCanvasWidth] = useState(600);
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile' | 'custom'>('desktop');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [viewMode, setViewMode] = useState<ViewMode>('edit');

  // Track the actual email content for preview synchronization
  const [emailContent, setEmailContent] = useState(content);

  // New state for panel collapse functionality
  const [isMetricsPanelCollapsed, setIsMetricsPanelCollapsed] = useState(false);
  const [isAISuggestionsPanelCollapsed, setIsAISuggestionsPanelCollapsed] = useState(false);

  const canvasRef = useRef<any>(null);
  const undoManagerRef = useRef<UndoManagerRef>(null);

  console.log('EmailEditor: State initialized, creating extensions');

  const extensions = useMemo(() => [
    StarterKit,
    Link.configure({
      openOnClick: false,
    }),
    Image,
    Underline,
    Color,
    TextStyle,
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    Placeholder.configure({
      placeholder: 'Start writing your email content...',
    }),
  ], []);

  console.log('EmailEditor: About to create TipTap editor');

  const editor = useEditor({
    extensions,
    content: emailContent,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setEmailContent(html);
      onContentChange(html);
    },
    immediatelyRender: false,
  });

  console.log('EmailEditor: TipTap editor created', { editor: !!editor });

  // Sync emailContent when content prop changes
  useEffect(() => {
    if (content !== emailContent) {
      console.log('EmailEditor: Updating editor content from prop');
      setEmailContent(content);
      if (editor && content !== editor.getHTML()) {
        editor.commands.setContent(content);
      }
    }
  }, [content, emailContent, editor]);

  // Handle blocks change from canvas
  const handleBlocksChange = useCallback((blocks: EmailBlock[]) => {
    console.log('EmailEditor: Received blocks update from canvas:', blocks.length);
    setEmailBlocks(blocks);
  }, []);

  // Handle content change from canvas (this ensures preview gets the latest content)
  const handleContentChange = useCallback((newContent: string) => {
    console.log('EmailEditor: Content updated from canvas');
    setEmailContent(newContent);
    onContentChange(newContent);
  }, [onContentChange]);

  // Load templates on mount
  useEffect(() => {
    try {
      const loadedTemplates = DirectTemplateService.getAllTemplates();
      setTemplates(loadedTemplates);
    } catch (error) {
      console.warn('Error loading templates:', error);
      setTemplates([]);
    }
  }, []);

  // State restoration callback for UndoManager
  const handleStateRestore = useCallback((state: any) => {
    console.log('EmailEditor: Restoring state from UndoManager:', state);
    
    // Restore blocks via canvas
    if (canvasRef.current && state.blocks) {
      canvasRef.current.replaceAllBlocks(state.blocks);
    }
    
    // Restore subject
    if (state.subject !== undefined) {
      onSubjectChange(state.subject);
    }
  }, [onSubjectChange]);

  // Undo/Redo handlers
  const handleUndo = useCallback(() => {
    if (undoManagerRef.current) {
      undoManagerRef.current.handleUndo();
    }
  }, []);

  const handleRedo = useCallback(() => {
    if (undoManagerRef.current) {
      undoManagerRef.current.handleRedo();
    }
  }, []);

  // Event handlers
  const handleBlockAdd = useCallback((blockType: string, layoutConfig?: any) => {
    if (canvasRef.current) {
      const newBlock: EmailBlock = {
        id: `${blockType}_${Date.now()}`,
        type: blockType as any,
        content: getDefaultContent(blockType),
        styling: getDefaultStyles(blockType),
        position: { x: 0, y: 0 },
        displayOptions: {
          showOnDesktop: true,
          showOnTablet: true,
          showOnMobile: true
        },
        isStarred: false
      };

      if (layoutConfig) {
        newBlock.content = { ...newBlock.content, ...layoutConfig };
      }

      canvasRef.current.addBlock(newBlock);
    }
  }, []);

  const getDefaultContent = (blockType: string) => {
    switch (blockType) {
      case 'text':
        return { html: '<p>Start typing your content here...</p>', textStyle: 'normal' };
      case 'button':
        return { text: 'Click Here', link: '#', style: 'solid', size: 'medium' };
      case 'image':
        return { src: '', alt: '', alignment: 'center', width: '100%', isDynamic: false };
      default:
        return {};
    }
  };

  const getDefaultStyles = (blockType: string) => {
    return {
      desktop: { width: '100%', height: 'auto' },
      tablet: { width: '100%', height: 'auto' },
      mobile: { width: '100%', height: 'auto' }
    };
  };

  const handleSnippetAdd = useCallback((snippet: EmailSnippet) => {
    if (snippet.blockData && canvasRef.current) {
      canvasRef.current.addBlock(snippet.blockData);
    }
  }, []);

  const handleDeviceChange = useCallback((device: 'desktop' | 'tablet' | 'mobile' | 'custom') => {
    setDeviceMode(device);
    
    const widthMap = {
      desktop: 600,
      tablet: 768,
      mobile: 375,
      custom: canvasWidth
    };
    
    if (device !== 'custom') {
      setCanvasWidth(widthMap[device]);
    }
  }, [canvasWidth]);

  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
    if (mode !== 'edit') {
      setPreviewMode(mode === 'desktop-preview' ? 'desktop' : 'mobile');
    }
  }, []);

  const handleImportBlocks = useCallback((blocks: EmailBlock[], subject?: string) => {
    if (canvasRef.current) {
      canvasRef.current.replaceAllBlocks(blocks);
      
      if (subject) {
        onSubjectChange(subject);
      }
    }
  }, [onSubjectChange]);

  const handleSaveTemplate = useCallback((template: any) => {
    try {
      DirectTemplateService.saveTemplate(template);
      const updatedTemplates = DirectTemplateService.getAllTemplates();
      setTemplates(updatedTemplates);
    } catch (err) {
      error('Failed to save template');
    }
  }, [error]);

  const handlePublish = useCallback(() => {
    // Silent publish - no notification
  }, []);

  const handlePreview = useCallback(() => {
    setShowPreview(true);
  }, []);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [criticalSuggestions, setCriticalSuggestions] = useState<CriticalSuggestion[]>([]);
  const [comprehensiveAnalysis, setComprehensiveAnalysis] = useState<CompleteAnalysisResult | null>(null);
  const [allSuggestions, setAllSuggestions] = useState<CriticalSuggestion[]>([]);
  const [appliedFixes, setAppliedFixes] = useState<Set<string>>(new Set());
  const [analysisTimestamp, setAnalysisTimestamp] = useState<number>(0);
  const [comprehensiveMetrics, setComprehensiveMetrics] = useState<ComprehensiveEmailMetrics | null>(null);

  const extractAndMergeSuggestions = useCallback((critical: CriticalSuggestion[], comprehensive: CompleteAnalysisResult | null) => {
    let merged = [...critical];

    if (comprehensive) {
      if (comprehensive.brandVoice?.suggestions) {
        comprehensive.brandVoice.suggestions.forEach((suggestion, index) => {
          merged.push({
            id: `brand-voice-${index}`,
            title: suggestion.title,
            reason: suggestion.reason,
            category: 'tone',
            type: 'tone',
            current: suggestion.current || '',
            suggested: suggestion.suggested || '',
            severity: suggestion.impact === 'high' ? 'high' : suggestion.impact === 'medium' ? 'medium' : 'low',
            impact: suggestion.impact === 'high' ? 'high' : suggestion.impact === 'medium' ? 'medium' : 'low',
            confidence: suggestion.confidence || 75,
            autoFixable: false,
            priority: index + 1,
            businessImpact: `Brand voice improvement: ${suggestion.reason}`
          });
        });
      }

      if (comprehensive.subjectVariants && comprehensive.subjectVariants.length > 0) {
        comprehensive.subjectVariants.forEach((variant, index) => {
          merged.push({
            id: `subject-variant-${index}`,
            title: `Subject Line Alternative ${index + 1}`,
            reason: 'AI-generated subject line variant to improve engagement',
            category: 'subject',
            type: 'subject',
            current: subject,
            suggested: variant,
            severity: 'medium',
            impact: 'medium',
            confidence: 80,
            autoFixable: true,
            priority: index + 1,
            businessImpact: 'May improve open rates with fresh messaging'
          });
        });
      }
    }

    merged.sort((a, b) => b.confidence - a.confidence);
    return merged;
  }, [subject]);

  useEffect(() => {
    const merged = extractAndMergeSuggestions(criticalSuggestions, comprehensiveAnalysis);
    setAllSuggestions(merged);
  }, [criticalSuggestions, comprehensiveAnalysis, extractAndMergeSuggestions]);

  const runCompleteAnalysis = async () => {
    const analysisId = `analysis-${Date.now()}`;
    
    if (!emailContent.trim() || emailContent.length < 50) {
      error('Add more content before analyzing');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisTimestamp(Date.now());
    
    try {
      const isKeyAvailable = await ApiKeyService.isKeyAvailable();
      
      if (!isKeyAvailable) {
        error('OpenAI API key not available. Please check your configuration.');
        return;
      }

      const metrics = ComprehensiveMetricsService.calculateMetrics(emailContent, subject);
      setComprehensiveMetrics(metrics);

      setCriticalSuggestions([]);
      setComprehensiveAnalysis(null);
      setAppliedFixes(new Set());

      const critical = await CriticalEmailAnalysisService.analyzeCriticalIssues(emailContent, subject);
      setCriticalSuggestions(critical);

      const comprehensive = await CentralizedAIAnalysisService.runCompleteAnalysis(emailContent, subject);
      setComprehensiveAnalysis(comprehensive);
      
    } catch (analysisError: any) {
      if (analysisError.message?.includes('OpenAI API key')) {
        error('OpenAI API key issue: ' + analysisError.message);
      } else if (analysisError.message?.includes('rate limit')) {
        error('OpenAI rate limit exceeded. Please try again later.');
      } else if (analysisError.message?.includes('network')) {
        error('Network error. Please check your connection and try again.');
      } else {
        error('Analysis failed: ' + (analysisError.message || 'Unknown error'));
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (emailContent.trim()) {
      const metrics = ComprehensiveMetricsService.calculateMetrics(emailContent, subject);
      setComprehensiveMetrics(metrics);
    }
  }, [emailContent, subject]);

  const handleApplyFix = async (suggestion: CriticalSuggestion) => {
    if (appliedFixes.has(suggestion.id)) {
      return;
    }

    try {
      let updatedContent = emailContent;
      let fixType: 'subject' | 'content' = 'content';

      if (suggestion.category === 'subject' && suggestion.suggested) {
        onSubjectChange(suggestion.suggested);
        fixType = 'subject';
      } else if (suggestion.current && suggestion.suggested) {
        if (suggestion.category === 'compatibility') {
          if (suggestion.current.includes('box-shadow') || suggestion.current.includes('border-radius')) {
            updatedContent = emailContent.replace(new RegExp(suggestion.current.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), suggestion.suggested);
          } else if (suggestion.current.includes('<style') && !suggestion.current.includes('data-embed')) {
            updatedContent = emailContent.replace(suggestion.current, suggestion.suggested);
          } else if (suggestion.current.includes('background-image')) {
            updatedContent = emailContent.replace(suggestion.current, suggestion.suggested);
          }
        } else {
          updatedContent = emailContent.replace(suggestion.current, suggestion.suggested);
        }
        
        if (updatedContent !== emailContent) {
          onContentChange(updatedContent);
        } else {
          const lines = emailContent.split('\n');
          const updatedLines = lines.map(line => {
            if (line.includes(suggestion.current)) {
              return line.replace(suggestion.current, suggestion.suggested);
            }
            return line;
          });
          updatedContent = updatedLines.join('\n');
          
          if (updatedContent !== emailContent) {
            onContentChange(updatedContent);
          } else {
            return;
          }
        }
      } else {
        return;
      }

      setAppliedFixes(prev => new Set([...prev, suggestion.id]));
      
    } catch (fixError) {
      console.error('Error applying fix:', fixError);
      error('Failed to apply fix');
    }
  };

  const handleApplyAllAutoFixes = async () => {
    const autoFixableSuggestions = allSuggestions.filter(s => 
      s.autoFixable && !appliedFixes.has(s.id)
    );

    if (autoFixableSuggestions.length === 0) {
      return;
    }

    for (const suggestion of autoFixableSuggestions) {
      await handleApplyFix(suggestion);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  };

  useEffect(() => {
    if (viewMode === 'desktop-preview' && canvasWidth < 600) {
      setCanvasWidth(600);
    } else if (viewMode === 'mobile-preview' && canvasWidth > 375) {
      setCanvasWidth(375);
    }
  }, [viewMode, canvasWidth]);

  console.log('EmailEditor: About to render main component');

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <InlineNotificationContainer 
        notifications={notifications}
        onRemove={removeNotification}
      />

      {/* Omnipresent Ribbon */}
      <OmnipresentRibbon
        onBlockAdd={handleBlockAdd}
        onSnippetAdd={handleSnippetAdd}
        universalContent={universalContent}
        onUniversalContentAdd={() => {}}
        onGlobalStylesChange={() => {}}
        emailHTML={emailContent}
        subjectLine={subject}
        editor={editor}
        snippetRefreshTrigger={snippetRefreshTrigger}
        onTemplateLibraryOpen={() => setShowTemplateLibrary(true)}
        onPreviewModeChange={setPreviewMode}
        previewMode={previewMode}
        onBack={onBack}
        canvasWidth={canvasWidth}
        deviceMode={deviceMode}
        onDeviceChange={handleDeviceChange}
        onWidthChange={setCanvasWidth}
        onPreview={handlePreview}
        onSaveTemplate={handleSaveTemplate}
        onPublish={handlePublish}
        canvasRef={canvasRef}
        onSubjectLineChange={onSubjectChange}
        onToggleAIAnalytics={() => setShowAIAnalytics(!showAIAnalytics)}
        onImportBlocks={handleImportBlocks}
        blocks={emailBlocks}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
      />

      {/* Main Content Area - 3 Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Metrics (Only show in edit mode) */}
        {viewMode === 'edit' && (
          <CollapsiblePanel
            isCollapsed={isMetricsPanelCollapsed}
            onToggle={() => setIsMetricsPanelCollapsed(!isMetricsPanelCollapsed)}
            title="Metrics"
            side="left"
            expandedWidth="w-[200px]"
          >
            <MetricsPanel
              comprehensiveMetrics={comprehensiveMetrics}
              emailHTML={emailContent}
              subjectLine={subject}
              canvasWidth={canvasWidth}
              previewMode={previewMode}
            />
          </CollapsiblePanel>
        )}

        {/* Snippet Ribbon - Only show in edit mode */}
        {viewMode === 'edit' && (
          <SnippetRibbon
            refreshTrigger={snippetRefreshTrigger}
            onSnippetSelect={handleSnippetAdd}
          />
        )}

        {/* Center - Canvas Area */}
        <div className="flex-1 overflow-auto bg-gray-50 p-6 relative">
          <EmailBlockCanvas
            ref={canvasRef}
            onContentChange={handleContentChange}
            onBlockSelect={setSelectedBlockId}
            onBlocksChange={handleBlocksChange}
            previewWidth={canvasWidth}
            previewMode={previewMode}
            compactMode={false}
            subject={subject}
            onSubjectChange={onSubjectChange}
            showAIAnalytics={showAIAnalytics}
            onSnippetRefresh={() => setSnippetRefreshTrigger(prev => prev + 1)}
            viewMode={viewMode}
          />

          {/* UndoManager - Hidden for now */}
          {/* 
          {viewMode === 'edit' && (
            <div className="absolute top-4 right-4 z-50">
              <div className="bg-white rounded-lg shadow-lg border p-2">
                <UndoManager 
                  ref={undoManagerRef}
                  blocks={emailBlocks} 
                  subject={subject}
                  onStateRestore={handleStateRestore}
                />
              </div>
            </div>
          )}
          */}
        </div>

        {/* Right Panel - AI Suggestions (Only show in edit mode) */}
        {viewMode === 'edit' && (
          <CollapsiblePanel
            isCollapsed={isAISuggestionsPanelCollapsed}
            onToggle={() => setIsAISuggestionsPanelCollapsed(!isAISuggestionsPanelCollapsed)}
            title="AI Suggestions"
            side="right"
            expandedWidth="w-96"
          >
            <AISuggestionsPanel
              isAnalyzing={isAnalyzing}
              allSuggestions={allSuggestions}
              appliedFixes={appliedFixes}
              analysisTimestamp={analysisTimestamp}
              onRunAnalysis={runCompleteAnalysis}
              onApplyFix={handleApplyFix}
              onApplyAllAutoFixes={handleApplyAllAutoFixes}
              emailHTML={emailContent}
              subjectLine={subject}
            />
          </CollapsiblePanel>
        )}
      </div>

      {/* Modals */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl h-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Email Preview</h2>
              <Button variant="ghost" onClick={() => setShowPreview(false)}>
                ×
              </Button>
            </div>
            <EmailPreview 
              html={emailContent}
              previewMode={previewMode}
              subject={subject}
            />
          </div>
        </div>
      )}

      {/* Template Library Modal */}
      {showTemplateLibrary && (
        <EmailTemplateLibrary
          onSelectTemplate={(template) => {
            if (template.blocks && canvasRef.current) {
              canvasRef.current.replaceAllBlocks(template.blocks);
              if (template.subject) {
                onSubjectChange(template.subject);
              }
            } else if (template.html && editor) {
              editor.commands.setContent(template.html);
              if (template.subject) {
                onSubjectChange(template.subject);
              }
            }
            setShowTemplateLibrary(false);
          }}
          templates={templates}
          onClose={() => setShowTemplateLibrary(false)}
        />
      )}
    </div>
  );
}
