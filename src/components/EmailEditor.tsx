
import React, { useState, useCallback, useMemo } from 'react';
import { EmailEditorToolbar } from '@/components/EmailEditorToolbar';
import { EmailBlockCanvas } from '@/components/EmailBlockCanvas';
import { BlocksSidebar } from '@/components/BlocksSidebar';
import { EmailMetricsPanel } from '@/components/EmailMetricsPanel';
import { FloatingTestButton } from '@/components/FloatingTestButton';
import { PropertyEditorPanel } from '@/components/PropertyEditorPanel';
import { EmailBlock, UniversalContent } from '@/types/emailBlocks';
import { EmailSnippet } from '@/types/snippets';

interface EmailEditorProps {
  content: string;
  subject: string;
  onContentChange: (content: string) => void;
  onSubjectChange: (subject: string) => void;
}

export const EmailEditor: React.FC<EmailEditorProps> = ({
  content,
  subject,
  onContentChange,
  onSubjectChange
}) => {
  console.log('EmailEditor: Component starting to render');
  
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<EmailBlock | null>(null);
  const [blocks, setBlocks] = useState<EmailBlock[]>([]);
  const [universalContent, setUniversalContent] = useState<UniversalContent[]>([]);
  const [snippetRefreshTrigger, setSnippetRefreshTrigger] = useState(0);
  const [campaignTitle, setCampaignTitle] = useState('Untitled Campaign');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  const handleBlockAdd = useCallback((blockType: string, layoutConfig?: any) => {
    console.log('EmailEditor: Adding block of type:', blockType);
    // This will be handled by the EmailBlockCanvas component
  }, []);

  const handleSnippetAdd = useCallback((snippet: EmailSnippet) => {
    console.log('EmailEditor: Adding snippet:', snippet);
    // This will be handled by the EmailBlockCanvas component
  }, []);

  const handleUniversalContentAdd = useCallback((content: UniversalContent) => {
    console.log('EmailEditor: Adding universal content:', content);
    setUniversalContent(prev => [...prev, content]);
  }, []);

  const handleBlocksChange = useCallback((newBlocks: EmailBlock[]) => {
    setBlocks(newBlocks);
    // Update selected block if it still exists
    if (selectedBlockId) {
      const updatedSelectedBlock = newBlocks.find(block => block.id === selectedBlockId);
      setSelectedBlock(updatedSelectedBlock || null);
    }
  }, [selectedBlockId]);

  const handleBlockSelect = useCallback((blockId: string | null) => {
    setSelectedBlockId(blockId);
    if (blockId) {
      const block = blocks.find(b => b.id === blockId);
      setSelectedBlock(block || null);
    } else {
      setSelectedBlock(null);
    }
  }, [blocks]);

  const handleBlockUpdate = useCallback((updatedBlock: EmailBlock) => {
    setBlocks(prev => prev.map(block => 
      block.id === updatedBlock.id ? updatedBlock : block
    ));
    setSelectedBlock(updatedBlock);
  }, []);

  const handleSnippetRefresh = useCallback(() => {
    setSnippetRefreshTrigger(prev => prev + 1);
  }, []);

  const handleExport = useCallback(() => {
    console.log('Exporting email...');
    // TODO: Implement export functionality
  }, []);

  const handleSave = useCallback(() => {
    console.log('Saving email...');
    // TODO: Implement save functionality
  }, []);

  const handlePreview = useCallback(() => {
    console.log('Opening preview...');
    // TODO: Implement preview functionality
  }, []);

  const handleViewCode = useCallback(() => {
    console.log('Viewing code...');
    // TODO: Implement code view functionality
  }, []);

  console.log('EmailEditor: About to render main component');

  return (
    <div className="h-screen w-full flex flex-col bg-white">
      {/* Top Toolbar - Full width, fixed at top */}
      <EmailEditorToolbar 
        onExport={handleExport}
        onSave={handleSave}
        onPreview={handlePreview}
        onViewCode={handleViewCode}
        campaignTitle={campaignTitle}
        onCampaignTitleChange={setCampaignTitle}
        previewMode={previewMode}
        onPreviewModeChange={setPreviewMode}
      />
      
      {/* Main Content Area - Responsive layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Responsive width */}
        <div className="w-64 lg:w-72 xl:w-80 flex-shrink-0">
          <BlocksSidebar
            onBlockAdd={handleBlockAdd}
            onSnippetAdd={handleSnippetAdd}
            universalContent={universalContent}
            onUniversalContentAdd={handleUniversalContentAdd}
            snippetRefreshTrigger={snippetRefreshTrigger}
          />
        </div>
        
        {/* Canvas Area - Takes remaining space, fully responsive */}
        <div className="flex-1 flex flex-col min-w-0 bg-white">
          <div className="flex-1 overflow-auto">
            <EmailBlockCanvas
              onContentChange={onContentChange}
              onBlockSelect={handleBlockSelect}
              onBlocksChange={handleBlocksChange}
              subject={subject}
              onSubjectChange={onSubjectChange}
              onSnippetRefresh={handleSnippetRefresh}
              viewMode="edit"
            />
          </div>
          
          {/* Bottom Metrics Panel */}
          <EmailMetricsPanel 
            blocks={blocks}
            emailContent={content}
          />
        </div>

        {/* Right Sidebar - Properties Panel */}
        {selectedBlock && (
          <div className="w-80 flex-shrink-0 border-l border-gray-200 bg-gray-50">
            <PropertyEditorPanel
              selectedBlock={selectedBlock}
              onBlockUpdate={handleBlockUpdate}
            />
          </div>
        )}
      </div>
      
      {/* Floating Test Button */}
      <FloatingTestButton />
    </div>
  );
};

export default EmailEditor;
