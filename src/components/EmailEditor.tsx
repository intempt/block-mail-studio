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
import { RibbonInterface } from './RibbonInterface';
import { EmailTemplateLibrary } from './EmailTemplateLibrary';
import { StatusBar } from './StatusBar';
import { HeaderAnalyticsBar } from './HeaderAnalyticsBar';
import { EmailTemplate } from './TemplateManager';
import { DirectTemplateService } from '@/services/directTemplateService';
import { UniversalContent } from '@/types/emailBlocks';
import { EmailSnippet } from '@/types/snippets';
import { EmailBlock } from '@/types/emailBlocks';

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

export default function EmailEditor({ 
  content,
  subject,
  onContentChange,
  onSubjectChange,
  onBack 
}: EmailEditorProps) {
  console.log('EmailEditor: Component starting to render');

  // Local UI state only - no content state
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [emailBlocks, setEmailBlocks] = useState<EmailBlock[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [universalContent] = useState<UniversalContent[]>([]);
  const [snippetRefreshTrigger, setSnippetRefreshTrigger] = useState(0);

  // Add performance and brand metrics state
  const [performanceMetrics, setPerformanceMetrics] = useState({
    overallScore: 87 as number | null,
    deliverabilityScore: 91 as number | null,
    mobileScore: 94 as number | null,
    spamScore: 12 as number | null
  });

  const [brandMetrics, setBrandMetrics] = useState({
    brandVoiceScore: 88,
    engagementScore: 82,
    toneConsistency: 95,
    readabilityScore: 91
  });

  const [performancePrediction, setPerformancePrediction] = useState({
    openRate: 26.3,
    clickRate: 4.1,
    conversionRate: 2.8
  });

  // Add AI suggestions state
  const [aiSuggestions, setAiSuggestions] = useState([
    {
      id: '1',
      type: 'subject' as const,
      title: 'Optimize Subject Line',
      description: 'Make your subject line more compelling and action-oriented',
      impact: 'high' as const,
      confidence: 87,
      suggestion: 'Add urgency words like "Limited Time" or personalization tokens'
    },
    {
      id: '2',
      type: 'cta' as const,
      title: 'Enhance Call-to-Action',
      description: 'Improve button text for better click-through rates',
      impact: 'high' as const,
      confidence: 92,
      suggestion: 'Use action verbs like "Get Started Now" instead of "Click Here"'
    },
    {
      id: '3',
      type: 'copy' as const,
      title: 'Improve Content Flow',
      description: 'Restructure content for better readability',
      impact: 'medium' as const,
      confidence: 78,
      suggestion: 'Break long paragraphs into shorter, scannable chunks'
    }
  ]);

  // Stable layout config
  const layoutConfig = useMemo<LayoutConfig>(() => ({
    direction: 'column',
    alignItems: 'center',
    justifyContent: 'start'
  }), []);

  console.log('EmailEditor: State initialized, creating extensions');

  // Stable extensions array
  const extensions = useMemo(() => {
    console.log('EmailEditor: Creating TipTap extensions');
    return [
      StarterKit.configure({
        history: false,
      }),
      Underline,
      Link,
      Image,
      Placeholder.configure({
        placeholder: 'Write something here...'
      }),
      TextStyle,
      Color,
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
    ];
  }, []);

  // Stable update handler
  const handleEditorUpdate = useCallback(({ editor }) => {
    const newContent = editor.getHTML();
    onContentChange(newContent);
  }, [onContentChange]);

  console.log('EmailEditor: About to create TipTap editor');

  // Create editor once with stable configuration
  const editor = useEditor({
    extensions,
    content: '', // Start with empty content
    onUpdate: handleEditorUpdate,
    immediatelyRender: false,
  });

  console.log('EmailEditor: TipTap editor created', { editor: !!editor });

  // Update editor content when prop changes
  useEffect(() => {
    if (editor && editor.getHTML() !== content) {
      console.log('EmailEditor: Updating editor content from prop');
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  // Load templates once
  useEffect(() => {
    console.log('EmailEditor: Loading templates');
    const initialTemplates = DirectTemplateService.getAllTemplates();
    setTemplates(initialTemplates);
  }, []);

  const handleBlockAdd = (blockType: string, layoutConfig?: any) => {
    if (!editor) return;

    const newBlock: Block = {
      id: `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: blockType,
      content: `New ${blockType} block`,
      styles: {}
    };

    setBlocks(prev => [...prev, newBlock]);
  };

  const handleBlocksChange = (newBlocks: Block[]) => {
    setBlocks(newBlocks);
  };

  const handleBlockUpdate = (block: EmailBlock) => {
    setEmailBlocks(prev => 
      prev.map(b => b.id === block.id ? block : b)
    );
  };

  const handleBlockDelete = (blockId: string) => {
    setBlocks(prev => prev.filter(block => block.id !== blockId));
    setEmailBlocks(prev => prev.filter(block => block.id !== blockId));
  };

  const handleGlobalStylesChange = (styles: any) => {
    // Apply styles to all blocks or the canvas
    console.log('Applying global styles:', styles);
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  const handlePublish = async () => {
    // Save template on publish
    const existingTemplateNames = templates.map(t => t.name);
    const newTemplate = DirectTemplateService.savePublishedTemplate(
      content,
      subject,
      existingTemplateNames
    );
    setTemplates(prev => [...prev, newTemplate]);
    setShowTemplateLibrary(false);
  };

  const handleTemplateLoad = (template: EmailTemplate) => {
    onContentChange(template.html);
    onSubjectChange(template.subject);
  };

  const handleSaveAsTemplate = (template: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>) => {
    const newTemplate = DirectTemplateService.saveTemplate(template);
    setTemplates(prev => [...prev, newTemplate]);
    setShowTemplateLibrary(false);
  };

  const handleSnippetAdd = (snippet: EmailSnippet) => {
    // Handle snippet addition
    console.log('Adding snippet:', snippet);
    setSnippetRefreshTrigger(prev => prev + 1);
  };

  const handleUniversalContentAdd = (content: UniversalContent) => {
    // Handle universal content addition
    console.log('Adding universal content:', content);
  };

  const handleContentChangeFromCanvas = (newContent: string) => {
    onContentChange(newContent);
  };

  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [canvasWidth] = useState(600);
  const [blockCount] = useState(0);
  const [wordCount] = useState(0);
  const [zoom, setZoom] = useState(100);

  const handlePreviewModeChange = (mode: 'desktop' | 'mobile') => {
    setPreviewMode(mode);
  };

  const handleTemplateLibraryOpen = () => {
    setShowTemplateLibrary(true);
  };

  const handleZoomChange = (newZoom: number) => {
    setZoom(newZoom);
  };

  const handleRefreshAnalysis = () => {
    // Trigger analysis refresh - this could integrate with existing analysis components
    console.log('Refreshing performance and brand analysis...');
    // In a real implementation, this would trigger the analysis components to re-run
  };

  const handleApplySuggestion = (suggestion: any) => {
    setAiSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
    console.log(`Applied: ${suggestion.title}`);
  };

  const handleRefreshAnalysis = () => {
    console.log('Refreshing performance and brand analysis...');
    // Simulate refreshed data
    setPerformanceMetrics(prev => ({
      ...prev,
      overallScore: Math.min(100, (prev.overallScore || 0) + Math.floor(Math.random() * 10) - 5)
    }));
  };

  console.log('EmailEditor: About to render main component');

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
          <h1 className="text-xl font-semibold text-gray-900">Email Builder</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <Button onClick={handlePreview} variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button onClick={handlePublish} className="bg-blue-600 hover:bg-blue-700" size="sm">
            <Send className="w-4 h-4 mr-2" />
            Publish
          </Button>
        </div>
      </div>

      {/* Analytics Header Bar */}
      <HeaderAnalyticsBar
        performanceMetrics={performanceMetrics}
        brandMetrics={brandMetrics}
        performancePrediction={performancePrediction}
        suggestions={aiSuggestions}
        onRefreshAnalysis={handleRefreshAnalysis}
        onApplySuggestion={handleApplySuggestion}
      />

      {/* Ribbon Interface */}
      <RibbonInterface
        onBlockAdd={handleBlockAdd}
        onSnippetAdd={handleSnippetAdd}
        universalContent={universalContent}
        onUniversalContentAdd={handleUniversalContentAdd}
        onGlobalStylesChange={handleGlobalStylesChange}
        emailHTML={content}
        subjectLine={subject}
        editor={editor}
        snippetRefreshTrigger={snippetRefreshTrigger}
        onTemplateLibraryOpen={handleTemplateLibraryOpen}
        onPreviewModeChange={handlePreviewModeChange}
        previewMode={previewMode}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-gray-100 p-6 min-h-0">
        <div className="max-w-4xl mx-auto">
          <EmailBlockCanvas
            onContentChange={handleContentChangeFromCanvas}
            onBlockSelect={() => {}}
            previewWidth={canvasWidth}
            previewMode={previewMode}
            compactMode={false}
            subject={subject}
            onSubjectChange={onSubjectChange}
          />
        </div>
      </div>

      {/* Enhanced Status Bar with Performance and Brand Metrics */}
      <StatusBar
        canvasWidth={canvasWidth}
        previewMode={previewMode}
        blockCount={blockCount}
        wordCount={wordCount}
        zoom={zoom}
        onZoomChange={handleZoomChange}
        performanceMetrics={performanceMetrics}
        brandMetrics={brandMetrics}
        performancePrediction={performancePrediction}
        onRefreshAnalysis={handleRefreshAnalysis}
      />

      {/* Modals */}
      {showPreview && (
        <EmailPreview
          html={content}
          previewMode={previewMode}
        />
      )}

      {showTemplateLibrary && (
        <EmailTemplateLibrary
          editor={editor}
        />
      )}
    </div>
  );
}
