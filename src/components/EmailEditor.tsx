import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Eye, Code2, Smartphone, Tablet, Monitor, Download, Upload, Save } from 'lucide-react';
import { EmailBlockCanvas, EmailBlockCanvasRef } from './EmailBlockCanvas';
import { EmailBlockPalette } from './EmailBlockPalette';
import { EmailPreview } from './EmailPreview';
import { EmailCodeEditor } from './EmailCodeEditor';
import { EnhancedPropertiesPanel } from './EnhancedPropertiesPanel';
import { EmailBlock } from '@/types/emailBlocks';
import { OmnipresentRibbon } from './OmnipresentRibbon';
import { StatusBar } from './StatusBar';
import { AISuggestionsPanel } from './AISuggestionsPanel';
import { EnhancedAISuggestionsWidget } from './EnhancedAISuggestionsWidget';
import { GlobalBrandStylesProvider, useGlobalBrandStyles, GlobalBrandStyles } from '@/contexts/GlobalBrandStylesContext';
import { UnifiedAISuggestion } from '@/services/CentralizedAIAnalysisService';
import './EmailEditor.css';

interface EmailEditorProps {
  content: string;
  subject: string;
  onContentChange?: (content: string) => void;
  onSubjectChange?: (subject: string) => void;
  onBack?: () => void;
}

const EmailEditorContent: React.FC<EmailEditorProps> = ({
  content,
  subject,
  onContentChange,
  onSubjectChange,
  onBack
}) => {
  const { styles: globalStyles, updateStyles: updateGlobalStyles } = useGlobalBrandStyles();
  
  const [viewMode, setViewMode] = useState<'design' | 'preview' | 'code'>('design');
  const [previewViewport, setPreviewViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [leftSidebarContent, setLeftSidebarContent] = useState<'palette' | 'ai'>('palette');
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<EmailBlock | null>(null);
  const canvasRef = useRef<EmailBlockCanvasRef>(null);
  const [currentEmailHTML, setCurrentEmailHTML] = useState(content);

  const handleViewportChange = (viewport: 'desktop' | 'tablet' | 'mobile') => {
    setPreviewViewport(viewport);
  };

  const handleSidebarToggle = (sidebar: 'palette' | 'ai') => {
    setLeftSidebarContent(sidebar);
  };

  const handleBlockUpdate = useCallback((blockId: string, updates: Partial<EmailBlock>) => {
    canvasRef.current?.updateBlock(blockId, updates);
  }, []);

  const handleBlockDelete = useCallback((blockId: string) => {
    canvasRef.current?.deleteBlock(blockId);
    setSelectedBlock(null);
  }, []);

  const handleEmailExport = () => {
    const htmlContent = canvasRef.current?.exportToHTML() || '<p>No content to export.</p>';
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'email_template.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleEmailImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const htmlContent = e.target?.result as string;
        canvasRef.current?.importFromHTML(htmlContent);
        onContentChange?.(htmlContent);
      };
      reader.readAsText(file);
    }
  };

  const handleEmailSave = () => {
    const htmlContent = canvasRef.current?.exportToHTML() || '<p>No content to save.</p>';
    localStorage.setItem('emailContent', htmlContent);
    alert('Email content saved to local storage!');
  };

  const handleEmailLoad = () => {
    const savedContent = localStorage.getItem('emailContent') || '<p>No saved content.</p>';
    canvasRef.current?.importFromHTML(savedContent);
    onContentChange?.(savedContent);
  };

  useEffect(() => {
    if (content !== currentEmailHTML) {
      setCurrentEmailHTML(content);
    }
  }, [content, currentEmailHTML]);

  const handleGlobalStylesChange = useCallback((newStyles: Partial<GlobalBrandStyles>) => {
    updateGlobalStyles(newStyles);
    
    // Apply styles to existing blocks in canvas
    if (canvasRef.current) {
      canvasRef.current.applyGlobalStyles(globalStyles);
    }
  }, [updateGlobalStyles, globalStyles]);

  const applySuggestion = useCallback(async (suggestion: UnifiedAISuggestion) => {
    if (!canvasRef.current) {
      console.warn('EmailEditor: No canvas reference available');
      return;
    }

    try {
      console.log('EmailEditor: Applying AI suggestion:', suggestion.title);
      
      // Apply suggestion based on type
      switch (suggestion.type) {
        case 'subject':
          onSubjectChange?.(suggestion.suggested);
          break;
          
        case 'copy':
        case 'tone':
          if (suggestion.blockId && canvasRef.current.updateBlockContent) {
            canvasRef.current.updateBlockContent(suggestion.blockId, {
              html: `<p>${suggestion.suggested}</p>`
            });
          } else {
            canvasRef.current.replaceTextInAllBlocks(suggestion.current, suggestion.suggested);
          }
          break;
          
        case 'cta':
          if (suggestion.blockId && canvasRef.current.updateBlockContent) {
            canvasRef.current.updateBlockContent(suggestion.blockId, {
              text: suggestion.suggested
            });
          } else {
            canvasRef.current.replaceTextInAllBlocks(suggestion.current, suggestion.suggested);
          }
          break;
          
        case 'design':
          if (suggestion.blockId && suggestion.styleChanges && canvasRef.current.updateBlockStyle) {
            canvasRef.current.updateBlockStyle(suggestion.blockId, suggestion.styleChanges);
          }
          break;
          
        case 'performance':
        case 'optimization':
          // Generic text replacement for performance suggestions
          canvasRef.current.replaceTextInAllBlocks(suggestion.current, suggestion.suggested);
          break;
          
        default:
          console.warn('EmailEditor: Unknown suggestion type:', suggestion.type);
          canvasRef.current.replaceTextInAllBlocks(suggestion.current, suggestion.suggested);
      }

      console.log('EmailEditor: Successfully applied suggestion:', suggestion.title);
      
    } catch (error) {
      console.error('EmailEditor: Failed to apply suggestion:', error);
    }
  }, [onSubjectChange]);

  const handleBlockAdd = (blockType: string) => {
    // Simple block adding logic
    console.log('Adding block:', blockType);
  };

  return (
    <div className="email-editor">
      {/* Enhanced Top Bar with Global Styles */}
      <OmnipresentRibbon
        onBlockAdd={handleBlockAdd}
        universalContent={[]}
        onUniversalContentAdd={() => {}}
        onGlobalStylesChange={handleGlobalStylesChange}
        emailHTML={currentEmailHTML}
        subjectLine={subject}
        canvasWidth={600}
        deviceMode="desktop"
        onDeviceChange={() => {}}
        onWidthChange={() => {}}
        onPreview={() => {}}
        onSaveTemplate={() => {}}
        onPublish={() => {}}
        canvasRef={canvasRef}
        onSubjectLineChange={onSubjectChange}
      />

      {/* AI Suggestions Widget */}
      <EnhancedAISuggestionsWidget
        isOpen={showAISuggestions}
        onToggle={() => setShowAISuggestions(!showAISuggestions)}
        emailHTML={currentEmailHTML}
        subjectLine={subject}
        canvasRef={canvasRef}
        onSubjectLineChange={onSubjectChange}
        onApplySuggestion={applySuggestion}
      />

      {/* Main Content */}
      <div className="email-editor-content">
        {/* Left Sidebar */}
        <div className="email-editor-sidebar">
          {leftSidebarContent === 'palette' && <EmailBlockPalette onBlockAdd={handleBlockAdd} />}
          {leftSidebarContent === 'ai' && (
            <AISuggestionsPanel
              emailHTML={currentEmailHTML}
              subjectLine={subject}
              onApplySuggestion={applySuggestion}
            />
          )}
        </div>

        {/* Canvas Area */}
        <div className="email-editor-canvas-container">
          {viewMode === 'design' && (
            <EmailBlockCanvas
              ref={canvasRef}
              content={content}
              subject={subject}
              onContentChange={onContentChange}
              onSubjectChange={onSubjectChange}
              onSelectionChange={setSelectedBlock}
              selectedBlockId={selectedBlock?.id}
              globalStyles={globalStyles}
            />
          )}
          {viewMode === 'preview' && (
            <EmailPreview
              html={content}
              subject={subject}
              viewport={previewViewport}
            />
          )}
          {viewMode === 'code' && (
            <EmailCodeEditor
              html={content}
              onHtmlChange={onContentChange}
            />
          )}
        </div>

        {/* Right Sidebar */}
        <div className="email-editor-properties">
          <EnhancedPropertiesPanel
            selectedBlock={selectedBlock}
            onBlockUpdate={(block) => handleBlockUpdate(block.id, block)}
            onBlockDelete={handleBlockDelete}
            globalStyles={globalStyles}
            onGlobalStylesChange={handleGlobalStylesChange}
          />
        </div>
      </div>

      {/* Status Bar */}
      <StatusBar
        blockCount={currentEmailHTML ? currentEmailHTML.split('<').length - 1 : 0}
        emailSize={currentEmailHTML.length}
      />
    </div>
  );
};

const EmailEditor: React.FC<EmailEditorProps> = (props) => {
  return (
    <GlobalBrandStylesProvider>
      <EmailEditorContent {...props} />
    </GlobalBrandStylesProvider>
  );
};

export default EmailEditor;
