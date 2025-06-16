
import React, { useState, useCallback, useMemo } from 'react';
import { EmailEditorToolbar } from '@/components/EmailEditorToolbar';
import { EmailBlockCanvas } from '@/components/EmailBlockCanvas';
import { BlocksSidebar } from '@/components/BlocksSidebar';
import { EmailMetricsPanel } from '@/components/EmailMetricsPanel';
import { FloatingTestButton } from '@/components/FloatingTestButton';
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
    <div className="min-h-screen w-full flex flex-col bg-white">
      {/* Top Toolbar - Make sure it's visible */}
      <div className="w-full flex-shrink-0">
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
      
      {/* Main Content Area - responsive layout */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Left Sidebar - fixed width, sticks to left */}
        <BlocksSidebar
          onBlockAdd={handleBlockAdd}
          onSnippetAdd={handleSnippetAdd}
          universalContent={universalContent}
          onUniversalContentAdd={handleUniversalContentAdd}
          snippetRefreshTrigger={snippetRefreshTrigger}
        />
        
        {/* Canvas Area - takes remaining space */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <div className="flex-1 overflow-auto">
            <EmailBlockCanvas
              onContentChange={onContentChange}
              onBlockSelect={setSelectedBlockId}
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
      </div>
      
      {/* Floating Test Button */}
      <FloatingTestButton />
    </div>
  );
};

export default EmailEditor;
