import React, {
  useState,
  useEffect,
  useRef,
  useCallback
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
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Eye,
  Send,
  Copy,
  RefreshCw,
  Layers,
  Palette,
  Settings,
  BarChart3
} from 'lucide-react';
import { EmailCodeEditor } from './EmailCodeEditor';
import { EmailPreview } from './EmailPreview';
import { EmailBlockCanvas } from './EmailBlockCanvas';
import { EnhancedEmailBlockPalette } from './EnhancedEmailBlockPalette';
import { GlobalStylesPanel } from './GlobalStylesPanel';
import { PropertyEditorPanel } from './PropertyEditorPanel';
import { PerformanceBrandPanel } from './PerformanceBrandPanel';
import { EmailTemplateLibrary } from './EmailTemplateLibrary';
import { EnhancedEmailSubjectLine } from './EnhancedEmailSubjectLine';
import { EmailTemplate } from './TemplateManager';
import { DirectTemplateService } from '@/services/directTemplateService';
import { AIBlockGenerator } from '@/services/AIBlockGenerator';
import { EmailContentAnalyzer } from '@/services/EmailContentAnalyzer';

import 'highlight.js/styles/atom-one-dark.css';
import { lowlight } from 'lowlight';

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

type LeftPanelTab = 'blocks' | 'design' | 'properties' | 'performance';

export default function EmailEditor({ 
  initialHTML = '', 
  initialSubject = '', 
  onBack 
}: { 
  initialHTML?: string; 
  initialSubject?: string; 
  onBack?: () => void;
}) {
  const [emailHTML, setEmailHTML] = useState(initialHTML);
  const [subjectLine, setSubjectLine] = useState(initialSubject);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [layoutConfig, setLayoutConfig] = useState<LayoutConfig>({
    direction: 'column',
    alignItems: 'center',
    justifyContent: 'start'
  });
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [leftPanel, setLeftPanel] = useState<LeftPanelTab>('blocks');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: true,
        // menuBar: {
        //   items: ['undo', 'redo', 'bold', 'italic', 'link', 'image']
        // }
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
      CodeBlockLowlight.extend({
        addOptions() {
          return {
            lowlight
          }
        },
      }),
    ],
    content: emailHTML,
    onUpdate: ({ editor }) => {
      setEmailHTML(editor.getHTML());
    }
  });

  useEffect(() => {
    if (initialHTML) {
      setEmailHTML(initialHTML);
      if (editor) {
        editor.commands.setContent(initialHTML);
      }
    }
    if (initialSubject) {
      setSubjectLine(initialSubject);
    }
  }, [initialHTML, initialSubject, editor]);

  useEffect(() => {
    const initialTemplates = DirectTemplateService.getAllTemplates();
    setTemplates(initialTemplates);
  }, []);

  const handleBlockSelect = (blockType: string) => {
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

  const handleBlockUpdate = (blockId: string, updatedBlock: Partial<Block>) => {
    setBlocks(prev =>
      prev.map(block =>
        block.id === blockId ? { ...block, ...updatedBlock } : block
      )
    );
  };

  const handleBlockDelete = (blockId: string) => {
    setBlocks(prev => prev.filter(block => block.id !== blockId));
    setSelectedBlockId(null);
  };

  const handleGlobalStyleUpdate = (styles: Record<string, string>) => {
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
      emailHTML,
      subjectLine,
      existingTemplateNames
    );
    setTemplates(prev => [...prev, newTemplate]);
    setShowTemplateLibrary(false);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(emailHTML);
  };

  const handleSyncFromCode = () => {
    if (editor) {
      editor.commands.setContent(emailHTML);
    }
  };

  const handleTemplateLoad = (template: EmailTemplate) => {
    setEmailHTML(template.html);
    setSubjectLine(template.subject);
    if (editor) {
      editor.commands.setContent(template.html);
    }
  };

  const handleSaveAsTemplate = (template: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>) => {
    const newTemplate = DirectTemplateService.saveTemplate(template);
    setTemplates(prev => [...prev, newTemplate]);
    setShowTemplateLibrary(false);
  };

  const handleTemplateLibraryOpen = () => {
    setShowTemplateLibrary(true);
  };

  const handleTemplateLibraryClose = () => {
    setShowTemplateLibrary(false);
  };

  const handleLoadToEditor = async (emailHTML: string, subjectLine: string) => {
    try {
      // Analyze the email content
      const analysis = await EmailContentAnalyzer.analyzeEmailContent(
        subjectLine,
        emailHTML
      );

      // Generate blocks from analysis
      const result = AIBlockGenerator.generateBlocksFromAnalysis(
        analysis,
        emailHTML
      );

      // Load into editor
      setBlocks(result.blocks);
      setLayoutConfig(result.layoutConfig);

    } catch (error) {
      console.error('Failed to load to editor:', error);
    }
  };

  const renderLeftPanel = () => {
    switch (leftPanel) {
      case 'blocks':
        return (
          <EnhancedEmailBlockPalette
            onBlockSelect={handleBlockSelect}
            onLoadTemplate={handleTemplateLoad}
            onSaveAsTemplate={handleSaveAsTemplate}
            templates={templates}
          />
        );
      case 'design':
        return (
          <GlobalStylesPanel
            emailHTML={emailHTML}
            onStyleUpdate={handleGlobalStyleUpdate}
          />
        );
      case 'properties':
        return selectedBlockId ? (
          <PropertyEditorPanel
            blockId={selectedBlockId}
            blocks={blocks}
            onBlockUpdate={handleBlockUpdate}
            onBlockDelete={handleBlockDelete}
          />
        ) : (
          <div className="p-4 text-center text-gray-500">
            <p>Select a block to edit its properties</p>
          </div>
        );
      case 'performance':
        return (
          <PerformanceBrandPanel
            emailHTML={emailHTML}
            subjectLine={subjectLine}
            editor={editor}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
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
          <EnhancedEmailSubjectLine
            value={subjectLine}
            onChange={setSubjectLine}
            emailContent={emailHTML}
          />
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

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setLeftPanel('blocks')}
                className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  leftPanel === 'blocks'
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Layers className="w-4 h-4" />
                  Blocks
                </div>
              </button>
              <button
                onClick={() => setLeftPanel('design')}
                className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  leftPanel === 'design'
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Palette className="w-4 h-4" />
                  Design
                </div>
              </button>
            </div>
            <div className="flex">
              <button
                onClick={() => setLeftPanel('properties')}
                className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  leftPanel === 'properties'
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Settings className="w-4 h-4" />
                  Properties
                </div>
              </button>
              <button
                onClick={() => setLeftPanel('performance')}
                className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  leftPanel === 'performance'
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Analytics
                </div>
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-hidden">
            {renderLeftPanel()}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Canvas */}
          <div className="flex-1 overflow-auto bg-gray-100 p-6">
            <div className="max-w-2xl mx-auto">
              <EmailBlockCanvas
                blocks={blocks}
                onBlocksChange={handleBlocksChange}
                onBlockSelect={setSelectedBlockId}
                selectedBlockId={selectedBlockId}
                layoutConfig={layoutConfig}
                onLayoutConfigChange={setLayoutConfig}
              />
            </div>
          </div>

          {/* Right Panel - Code Editor */}
          <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
            <div className="border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">HTML Code</h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSyncFromCode}
                    className="text-xs"
                  >
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Sync
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyCode}
                    className="text-xs"
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Copy
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-hidden">
              <EmailCodeEditor
                value={emailHTML}
                onChange={setEmailHTML}
                language="html"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showPreview && (
        <EmailPreview
          emailHTML={emailHTML}
          subjectLine={subjectLine}
          onClose={() => setShowPreview(false)}
        />
      )}

      {showTemplateLibrary && (
        <EmailTemplateLibrary
          onClose={() => setShowTemplateLibrary(false)}
          onSelectTemplate={handleTemplateLoad}
          onSaveTemplate={handleSaveAsTemplate}
          currentEmailHTML={emailHTML}
          currentSubject={subjectLine}
        />
      )}
    </div>
  );
}
