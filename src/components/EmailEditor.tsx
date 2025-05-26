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
import { EnhancedTopBar } from './EnhancedTopBar';
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

interface Suggestion {
  id: string;
  type: 'subject' | 'copy' | 'cta' | 'tone' | 'design' | 'accessibility' | 'performance';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  suggestion: string;
  category?: string;
}

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

  // Responsive state
  const [canvasWidth, setCanvasWidth] = useState(600);
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile' | 'custom'>('desktop');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

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

  // Enhanced AI suggestions with proper typing
  const [aiSuggestions, setAiSuggestions] = useState<Suggestion[]>([
    {
      id: '1',
      type: 'subject',
      title: 'Optimize Subject Line',
      description: 'Make your subject line more compelling and action-oriented to improve open rates',
      impact: 'high',
      confidence: 87,
      suggestion: 'Add urgency words like "Limited Time" or personalization tokens like [First Name]',
      category: 'Engagement'
    },
    {
      id: '2',
      type: 'cta',
      title: 'Enhance Call-to-Action',
      description: 'Improve button text and placement for better click-through rates',
      impact: 'high',
      confidence: 92,
      suggestion: 'Use action verbs like "Get Started Now" instead of "Click Here" and make buttons more prominent',
      category: 'Conversion'
    },
    {
      id: '3',
      type: 'accessibility',
      title: 'Add Alt Text to Images',
      description: 'Some images are missing alt text, affecting accessibility and deliverability',
      impact: 'high',
      confidence: 95,
      suggestion: 'Add descriptive alt text to all images for better accessibility and spam filter compliance',
      category: 'Accessibility'
    },
    {
      id: '4',
      type: 'copy',
      title: 'Improve Content Flow',
      description: 'Restructure content for better readability and engagement',
      impact: 'medium',
      confidence: 78,
      suggestion: 'Break long paragraphs into shorter, scannable chunks with bullet points',
      category: 'Readability'
    },
    {
      id: '5',
      type: 'design',
      title: 'Optimize Color Contrast',
      description: 'Some text elements may not meet accessibility contrast requirements',
      impact: 'medium',
      confidence: 73,
      suggestion: 'Increase contrast ratio to 4.5:1 or higher for better readability',
      category: 'Design'
    },
    {
      id: '6',
      type: 'performance',
      title: 'Compress Images',
      description: 'Large images can slow loading times and affect deliverability',
      impact: 'medium',
      confidence: 85,
      suggestion: 'Optimize images to under 100KB each and use web-friendly formats',
      category: 'Performance'
    },
    {
      id: '7',
      type: 'tone',
      title: 'Maintain Brand Voice',
      description: 'Some sections could better reflect your brand personality',
      impact: 'low',
      confidence: 68,
      suggestion: 'Use more conversational tone in the introduction to match brand guidelines',
      category: 'Brand Voice'
    },
    {
      id: '8',
      type: 'design',
      title: 'Mobile Optimization',
      description: 'Layout could be improved for mobile viewing experience',
      impact: 'medium',
      confidence: 81,
      suggestion: 'Increase button sizes to minimum 44px height for better mobile usability',
      category: 'Mobile'
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

  // Responsive handlers
  const handleDeviceChange = (device: 'desktop' | 'tablet' | 'mobile' | 'custom') => {
    setDeviceMode(device);
    const widthMap = {
      desktop: 1200,
      tablet: 768,
      mobile: 375,
      custom: canvasWidth
    };
    if (device !== 'custom') {
      setCanvasWidth(widthMap[device]);
    }
    setPreviewMode(device === 'mobile' ? 'mobile' : 'desktop');
  };

  const handleWidthChange = (width: number) => {
    setCanvasWidth(width);
    setDeviceMode('custom');
  };

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

  const [blockCount] = useState(0);
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
    console.log('Refreshing performance and brand analysis...');
    // Simulate refreshed data with more dynamic changes
    setPerformanceMetrics(prev => ({
      overallScore: Math.min(100, Math.max(60, (prev.overallScore || 0) + Math.floor(Math.random() * 20) - 10)),
      deliverabilityScore: Math.min(100, Math.max(60, (prev.deliverabilityScore || 0) + Math.floor(Math.random() * 15) - 7)),
      mobileScore: Math.min(100, Math.max(70, (prev.mobileScore || 0) + Math.floor(Math.random() * 10) - 5)),
      spamScore: Math.max(0, Math.min(50, (prev.spamScore || 0) + Math.floor(Math.random() * 10) - 5))
    }));
    
    setBrandMetrics(prev => ({
      ...prev,
      brandVoiceScore: Math.min(100, Math.max(60, prev.brandVoiceScore + Math.floor(Math.random() * 10) - 5)),
      engagementScore: Math.min(100, Math.max(60, prev.engagementScore + Math.floor(Math.random() * 10) - 5))
    }));

    // Simulate new suggestions appearing
    const newSuggestions: Suggestion[] = [
      {
        id: `new_${Date.now()}`,
        type: 'copy',
        title: 'Personalization Opportunity',
        description: 'Add dynamic content based on subscriber preferences',
        impact: 'high',
        confidence: 89,
        suggestion: 'Include merge tags for recent purchases or browsing history',
        category: 'Personalization'
      }
    ];
    
    setAiSuggestions(prev => [...prev, ...newSuggestions]);
  };

  const handleApplySuggestion = (suggestion: Suggestion) => {
    setAiSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
    console.log(`Applied: ${suggestion.title}`);
    
    // Simulate performance improvement after applying suggestion
    if (suggestion.impact === 'high') {
      setPerformanceMetrics(prev => ({
        ...prev,
        overallScore: Math.min(100, (prev.overallScore || 0) + 5)
      }));
    }
  };

  console.log('EmailEditor: About to render main component');

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Enhanced Top Bar */}
      <EnhancedTopBar
        onBack={onBack}
        canvasWidth={canvasWidth}
        deviceMode={deviceMode}
        onDeviceChange={handleDeviceChange}
        onWidthChange={handleWidthChange}
        onPreview={handlePreview}
        onSaveTemplate={handleSaveAsTemplate}
        onPublish={handlePublish}
        emailHTML={content}
        subjectLine={subject}
      />

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
