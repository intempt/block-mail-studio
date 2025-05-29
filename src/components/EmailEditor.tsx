import React, { useState, useRef, useCallback, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Eye, Code2, Smartphone, Tablet, Monitor, Download, Upload, Save } from 'lucide-react';
import { EmailBlockCanvas, EmailBlockCanvasRef } from './EmailBlockCanvas';
import { EmailBlockPalette } from './EmailBlockPalette';
import { EmailPreview } from './EmailPreview';
import { EmailCodeEditor } from './EmailCodeEditor';
import { PropertyEditorPanel } from './PropertyEditorPanel';
import { EmailBlock } from '@/types/emailBlocks';
import { StatusBar } from './StatusBar';
import './EmailEditor.css';

interface EmailEditorProps {
  content: string;
  subject: string;
  onContentChange?: (content: string) => void;
  onSubjectChange?: (subject: string) => void;
  onBack?: () => void;
}

const EmailEditor: React.FC<EmailEditorProps> = ({
  content,
  subject,
  onContentChange,
  onSubjectChange,
  onBack
}) => {
  const [viewMode, setViewMode] = useState<'design' | 'preview' | 'code'>('design');
  const [previewViewport, setPreviewViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [leftSidebarContent, setLeftSidebarContent] = useState<'palette' | 'ai'>('palette');
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

  const handleBlockAdd = (blockType: string) => {
    console.log('Adding block:', blockType);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="email-editor">
        {/* Top Bar */}
        <div className="email-editor-toolbar bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {onBack && (
                <Button variant="ghost" size="sm" onClick={onBack}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              )}
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'design' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('design')}
                >
                  Design
                </Button>
                <Button
                  variant={viewMode === 'preview' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('preview')}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <Button
                  variant={viewMode === 'code' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('code')}
                >
                  <Code2 className="w-4 h-4 mr-2" />
                  Code
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {viewMode === 'preview' && (
                <div className="flex items-center gap-1 mr-4">
                  <Button
                    variant={previewViewport === 'desktop' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => handleViewportChange('desktop')}
                  >
                    <Monitor className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={previewViewport === 'tablet' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => handleViewportChange('tablet')}
                  >
                    <Tablet className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={previewViewport === 'mobile' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => handleViewportChange('mobile')}
                  >
                    <Smartphone className="w-4 h-4" />
                  </Button>
                </div>
              )}

              <Button variant="outline" size="sm" onClick={handleEmailSave}>
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm" onClick={handleEmailExport}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <input
                type="file"
                accept=".html"
                onChange={handleEmailImport}
                style={{ display: 'none' }}
                id="import-input"
              />
              <Button variant="outline" size="sm" onClick={() => document.getElementById('import-input')?.click()}>
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="email-editor-content">
          {/* Left Sidebar */}
          <div className="email-editor-sidebar">
            <EmailBlockPalette onBlockAdd={handleBlockAdd} />
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
            <PropertyEditorPanel
              selectedBlock={selectedBlock}
              onBlockUpdate={(block) => handleBlockUpdate(block.id, block)}
            />
          </div>
        </div>

        {/* Status Bar */}
        <StatusBar
          blockCount={currentEmailHTML ? currentEmailHTML.split('<').length - 1 : 0}
          emailSize={currentEmailHTML.length}
        />
      </div>
    </DndProvider>
  );
};

export default EmailEditor;
