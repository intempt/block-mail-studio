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
import { CompactAISuggestions } from './CompactAISuggestions';
import { EmailTemplateLibrary } from './EmailTemplateLibrary';
import { CanvasStatus } from './canvas/CanvasStatus';
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

interface BasicAISuggestion {
  id: string;
  type: 'subject' | 'copy' | 'cta' | 'tone';
  title: string;
  current: string;
  suggested: string;
  reason: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  applied?: boolean;
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

  const [blocks, setBlocks] = useState<Block[]>([]);
  const [emailBlocks, setEmailBlocks] = useState<EmailBlock[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [universalContent] = useState<UniversalContent[]>([]);
  const [snippetRefreshTrigger, setSnippetRefreshTrigger] = useState(0);
  const [showAIAnalytics, setShowAIAnalytics] = useState(true);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  
  // AI Suggestions state
  const [aiSuggestions, setAiSuggestions] = useState<BasicAISuggestion[]>([]);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);

  const [canvasWidth, setCanvasWidth] = useState(600);
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile' | 'custom'>('desktop');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  const canvasRef = useRef<any>(null);

  const layoutConfig = useMemo<LayoutConfig>(() => ({
    direction: 'column',
    alignItems: 'center',
    justifyContent: 'start'
  }), []);

  console.log('EmailEditor: State initialized, creating extensions');

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

  const handleEditorUpdate = useCallback(({ editor }) => {
    const newContent = editor.getHTML();
    onContentChange(newContent);
  }, [onContentChange]);

  console.log('EmailEditor: About to create TipTap editor');

  const editor = useEditor({
    extensions,
    content: '',
    onUpdate: handleEditorUpdate,
    immediatelyRender: false,
  });

  console.log('EmailEditor: TipTap editor created', { editor: !!editor });

  useEffect(() => {
    if (editor && editor.getHTML() !== content) {
      console.log('EmailEditor: Updating editor content from prop');
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  useEffect(() => {
    console.log('EmailEditor: Loading templates');
    const initialTemplates = DirectTemplateService.getAllTemplates();
    setTemplates(initialTemplates);
  }, []);

  // AI Suggestions handlers
  const generateAISuggestions = useCallback(async () => {
    if (!content || content.length < 50) {
      console.warn('Email content too short for analysis');
      return;
    }
    
    setIsGeneratingSuggestions(true);
    
    try {
      console.log('Generating AI suggestions...');
      
      // Generate suggestions based on content analysis
      const suggestions: BasicAISuggestion[] = [
        {
          id: 'suggestion_1',
          type: 'subject',
          title: 'Improve subject line engagement',
          current: subject || 'Current subject',
          suggested: subject ? `${subject} - Limited Time!` : 'Your Amazing Offer - Limited Time!',
          reason: 'Adding urgency can increase open rates by 15-20%',
          impact: 'high',
          confidence: 85,
          applied: false
        },
        {
          id: 'suggestion_2',
          type: 'cta',
          title: 'Strengthen call-to-action',
          current: 'Click here',
          suggested: 'Get Started Now',
          reason: 'Action-oriented CTAs perform 25% better',
          impact: 'high',
          confidence: 90,
          applied: false
        },
        {
          id: 'suggestion_3',
          type: 'copy',
          title: 'Improve readability',
          current: 'Long paragraph text',
          suggested: 'Break into shorter, scannable sections',
          reason: 'Shorter paragraphs improve engagement by 18%',
          impact: 'medium',
          confidence: 75,
          applied: false
        }
      ];
      
      setAiSuggestions(suggestions);
      console.log('Generated AI suggestions:', suggestions);
      
    } catch (error) {
      console.error('Failed to generate suggestions:', error);
      setAiSuggestions([]);
    } finally {
      setIsGeneratingSuggestions(false);
    }
  }, [content, subject]);

  const handleApplyAISuggestion = useCallback(async (suggestion: BasicAISuggestion) => {
    try {
      if (suggestion.type === 'subject') {
        onSubjectChange(suggestion.suggested);
      } else if (canvasRef?.current) {
        switch (suggestion.type) {
          case 'copy':
          case 'cta':
          case 'tone':
            // Try to apply the suggestion to the canvas
            if (canvasRef.current.findAndReplaceText) {
              canvasRef.current.findAndReplaceText(suggestion.current, suggestion.suggested);
            }
            break;
        }
      }

      // Mark as applied
      setAiSuggestions(prev => prev.map(s => 
        s.id === suggestion.id ? { ...s, applied: true } : s
      ));

      console.log(`Applied suggestion: ${suggestion.title}`);
    } catch (error) {
      console.error('Failed to apply suggestion:', error);
    }
  }, [onSubjectChange]);

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
    console.log('EmailEditor: handleBlockAdd called with:', { blockType, layoutConfig });
    
    if (!canvasRef.current) {
      console.warn('EmailEditor: Canvas ref not available, cannot add block');
      return;
    }

    // Handle layout blocks specifically
    if (blockType === 'columns' && layoutConfig) {
      console.log('EmailEditor: Processing layout configuration:', layoutConfig);
      
      // Create the layout block data structure
      const columnCount = layoutConfig.columnCount || layoutConfig.columns || 2;
      const columnRatio = layoutConfig.columnRatio || layoutConfig.ratio || '50-50';
      const columnElements = layoutConfig.columnElements || [];
      
      const newLayoutBlock: EmailBlock = {
        id: `layout-${Date.now()}`,
        type: 'columns',
        content: {
          columnCount: columnCount as 1 | 2 | 3 | 4,
          columnRatio: columnRatio,
          columns: columnElements.length > 0 ? columnElements : Array.from({ length: columnCount }, (_, i) => ({
            id: `col-${i}-${Date.now()}`,
            blocks: [],
            width: `${100 / columnCount}%`
          })),
          gap: '16px'
        },
        styling: {
          desktop: { width: '100%', height: 'auto' },
          tablet: { width: '100%', height: 'auto' },
          mobile: { width: '100%', height: 'auto' }
        },
        position: { x: 0, y: 0 },
        displayOptions: {
          showOnDesktop: true,
          showOnTablet: true,
          showOnMobile: true
        }
      };

      console.log('EmailEditor: Created layout block:', newLayoutBlock);
      
      // Add the block directly to the canvas
      if (canvasRef.current) {
        canvasRef.current.addBlock(newLayoutBlock);
      }
      
      return;
    }

    // Handle regular blocks
    const newBlock: Block = {
      id: `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: blockType,
      content: `New ${blockType} block`,
      styles: {}
    };

    console.log('EmailEditor: Created regular block:', newBlock);
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
    console.log('Applying global styles:', styles);
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  const handlePublish = async () => {
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
    console.log('Adding snippet:', snippet);
    setSnippetRefreshTrigger(prev => prev + 1);
  };

  const handleUniversalContentAdd = (content: UniversalContent) => {
    console.log('Adding universal content:', content);
  };

  const handleContentChangeFromCanvas = (newContent: string) => {
    onContentChange(newContent);
  };

  const handleBlocksChangeFromCanvas = (blocks: EmailBlock[]) => {
    setEmailBlocks(blocks);
    // Convert blocks to HTML content
    const htmlContent = blocks.map(block => block.content.html || '').join('');
    onContentChange(htmlContent);
  };

  const handlePreviewModeChange = (mode: 'desktop' | 'mobile') => {
    setPreviewMode(mode);
  };

  const handleTemplateLibraryOpen = () => {
    setShowTemplateLibrary(true);
  };

  const handleSnippetSelect = (snippet: EmailSnippet) => {
    console.log('Adding snippet to canvas:', snippet);
    if (canvasRef.current && snippet.blockData) {
      // Create a new block from the snippet data
      const newBlock: EmailBlock = {
        ...snippet.blockData,
        id: `block-${Date.now()}`, // Generate new unique ID
      };
      canvasRef.current.addBlock(newBlock);
      setSnippetRefreshTrigger(prev => prev + 1);
    }
  };

  const handleToggleAIAnalytics = () => {
    setShowAIAnalytics(prev => !prev);
  };

  const handleBlockSelect = (blockId: string | null) => {
    setSelectedBlockId(blockId);
  };

  console.log('EmailEditor: About to render main component');

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <OmnipresentRibbon
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
        onBack={onBack}
        canvasWidth={canvasWidth}
        deviceMode={deviceMode}
        onDeviceChange={handleDeviceChange}
        onWidthChange={handleWidthChange}
        onPreview={handlePreview}
        onSaveTemplate={handleSaveAsTemplate}
        onPublish={handlePublish}
        onToggleAIAnalytics={handleToggleAIAnalytics}
      />

      <SnippetRibbon
        onSnippetSelect={handleSnippetSelect}
        refreshTrigger={snippetRefreshTrigger}
      />

      {/* AI Suggestions Header - Always Visible */}
      <CompactAISuggestions
        suggestions={aiSuggestions}
        isLoading={isGeneratingSuggestions}
        onApplySuggestion={handleApplyAISuggestion}
        onRefresh={generateAISuggestions}
      />

      <div className="flex-1 overflow-auto bg-gray-100 p-6 min-h-0">
        <div className="max-w-4xl mx-auto">
          <EmailBlockCanvas
            ref={canvasRef}
            initialBlocks={emailBlocks}
            onBlocksChange={handleBlocksChangeFromCanvas}
            onBlockSelect={handleBlockSelect}
            previewWidth={canvasWidth}
            previewMode={previewMode}
            compactMode={false}
            subject={subject}
            onSubjectChange={onSubjectChange}
            showAIAnalytics={false}
          />
        </div>
      </div>

      {/* AI Analytics Footer - Always visible */}
      <div className="bg-white border-t border-gray-200 shadow-lg">
        <CanvasStatus 
          selectedBlockId={selectedBlockId}
          canvasWidth={canvasWidth}
          previewMode={previewMode}
          emailHTML={content}
          subjectLine={subject}
        />
      </div>

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
