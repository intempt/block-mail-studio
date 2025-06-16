
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

  // On mobile, auto-collapse sidebars when a block is selected
  React.useEffect(() => {
    if (isMobile && selectedBlock) {
      setLeftSidebarCollapsed(true);
    }
  }, [isMobile, selectedBlock]);

  return (
    <div className="h-screen w-full flex flex-col bg-white">
      {/* Top Toolbar - Full width, fixed at top */}
      <div className="flex-shrink-0 border-b border-gray-200">
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
      
      {/* Main Content Area - Responsive layout */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Left Sidebar - Responsive and collapsible */}
        {!leftSidebarCollapsed && (
          <div className={`
            flex-shrink-0 border-r border-gray-200 bg-gray-50
            ${isMobile ? 'absolute top-0 left-0 z-20 h-full w-72' : 'w-64 lg:w-72 xl:w-80'}
          `}>
            <BlocksSidebar
              onBlockAdd={handleBlockAdd}
              onSnippetAdd={handleSnippetAdd}
              universalContent={universalContent}
              onUniversalContentAdd={handleUniversalContentAdd}
              snippetRefreshTrigger={snippetRefreshTrigger}
            />
          </div>
        )}
        
        {/* Toggle button for left sidebar on mobile */}
        {isMobile && (
          <button
            onClick={() => setLeftSidebarCollapsed(!leftSidebarCollapsed)}
            className="fixed top-16 left-2 z-30 bg-white border border-gray-300 rounded-md p-2 shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
        
        {/* Canvas Area - Takes remaining space, fully responsive */}
        <div className="flex-1 flex flex-col min-w-0 bg-white overflow-hidden">
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
          
          {/* Bottom Metrics Panel - Hide on small screens when sidebar is open */}
          {!(isMobile && selectedBlock) && (
            <div className="flex-shrink-0 border-t border-gray-200">
              <EmailMetricsPanel 
                blocks={blocks}
                emailContent={content}
              />
            </div>
          )}
        </div>

        {/* Right Sidebar - Properties Panel - Responsive */}
        {selectedBlock && (
          <div className={`
            flex-shrink-0 border-l border-gray-200 bg-gray-50
            ${isMobile 
              ? 'absolute top-0 right-0 z-20 h-full w-full max-w-sm' 
              : 'w-80 xl:w-96'
            }
          `}>
            <div className="h-full flex flex-col">
              {/* Close button for mobile */}
              {isMobile && (
                <div className="flex justify-between items-center p-3 border-b border-gray-200">
                  <h3 className="font-semibold">Block Properties</h3>
                  <button
                    onClick={() => setSelectedBlock(null)}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
              
              <div className="flex-1 overflow-auto">
                <PropertyEditorPanel
                  selectedBlock={selectedBlock}
                  onBlockUpdate={handleBlockUpdate}
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Mobile overlay when sidebars are open */}
        {isMobile && (selectedBlock || !leftSidebarCollapsed) && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-25 z-10"
            onClick={() => {
              setSelectedBlock(null);
              setLeftSidebarCollapsed(true);
            }}
          />
        )}
      </div>
      
      {/* Floating Test Button */}
      <FloatingTestButton />
    </div>
  );
};

export default EmailEditor;
