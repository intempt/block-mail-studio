import React, { useState, useCallback, useMemo } from 'react';
import { EmailEditorToolbar } from '@/components/EmailEditorToolbar';
import { EmailBlockCanvas } from '@/components/EmailBlockCanvas';
import { BlocksSidebar } from '@/components/BlocksSidebar';
import { EmailMetricsPanel } from '@/components/EmailMetricsPanel';
import { FloatingTestButton } from '@/components/FloatingTestButton';
import { PropertyEditorPanel } from '@/components/PropertyEditorPanel';
import { EmailBlock, UniversalContent } from '@/types/emailBlocks';
import { EmailSnippet } from '@/types/snippets';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);
  
  const isMobile = useIsMobile();

  // Auto-collapse left sidebar on mobile when property panel opens
  React.useEffect(() => {
    if (isMobile && selectedBlock) {
      setLeftSidebarCollapsed(true);
    }
  }, [isMobile, selectedBlock]);

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
      {/* Top Toolbar - Fixed at top */}
      <div className="flex-shrink-0 border-b border-gray-200 z-30">
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
      </div>
      
      {/* Main Content Area - Completely flexible grid layout */}
      <div className="flex-1 overflow-hidden relative">
        <div className="h-full grid" style={{
          gridTemplateColumns: leftSidebarCollapsed 
            ? selectedBlock 
              ? '0fr 1fr 380px' 
              : '0fr 1fr'
            : selectedBlock
              ? '280px 1fr 380px'
              : '280px 1fr',
          transition: 'grid-template-columns 0.3s ease'
        }}>
          {/* Left Sidebar - Blocks Palette */}
          <div className={`bg-gray-50 border-r border-gray-200 overflow-hidden transition-all duration-300 ${
            leftSidebarCollapsed ? 'w-0' : 'w-full'
          }`}>
            {!leftSidebarCollapsed && (
              <BlocksSidebar
                onBlockAdd={handleBlockAdd}
                onSnippetAdd={handleSnippetAdd}
                universalContent={universalContent}
                onUniversalContentAdd={handleUniversalContentAdd}
                snippetRefreshTrigger={snippetRefreshTrigger}
              />
            )}
          </div>
          
          {/* Center Canvas Area - Fully responsive */}
          <div className="bg-gray-100 overflow-hidden flex flex-col min-w-0">
            <div className="flex-1 overflow-auto p-4">
              <div className="w-full h-full">
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
            </div>
            
            {/* Bottom Metrics Panel */}
            <div className="flex-shrink-0 border-t border-gray-200">
              <EmailMetricsPanel 
                blocks={blocks}
                emailContent={content}
              />
            </div>
          </div>

          {/* Right Sidebar - Properties Panel */}
          {selectedBlock && (
            <div className="bg-gray-50 border-l border-gray-200 overflow-hidden">
              <div className="h-full flex flex-col">
                <div className="flex-1 overflow-auto">
                  <PropertyEditorPanel
                    selectedBlock={selectedBlock}
                    onBlockUpdate={handleBlockUpdate}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Toggle button for left sidebar */}
        <button
          onClick={() => setLeftSidebarCollapsed(!leftSidebarCollapsed)}
          className="absolute top-4 left-2 z-30 bg-white border border-gray-300 rounded-md p-2 shadow-lg hover:bg-gray-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      
      {/* Floating Test Button */}
      <FloatingTestButton />
    </div>
  );
};

export default EmailEditor;
