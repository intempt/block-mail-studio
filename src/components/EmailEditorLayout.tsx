
import React from 'react';
import { EmailBlockCanvas } from './EmailBlockCanvas';
import { SnippetRibbon } from './SnippetRibbon';
import { EmailSnippet } from '@/types/snippets';

type ViewMode = 'edit' | 'desktop-preview' | 'mobile-preview';

interface EmailEditorLayoutProps {
  viewMode: ViewMode;
  canvasRef: React.RefObject<any>;
  handleContentChange: (content: string) => void;
  setSelectedBlockId: (id: string | null) => void;
  handleBlocksChange: (blocks: any[]) => void;
  canvasWidth: number;
  previewMode: 'desktop' | 'mobile';
  subject: string;
  onSubjectChange: (subject: string) => void;
  showAIAnalytics: boolean;
  snippetRefreshTrigger: number;
  setSnippetRefreshTrigger: (fn: (prev: number) => number) => void;
  handleSnippetAdd: (snippet: EmailSnippet) => void;
}

export const EmailEditorLayout: React.FC<EmailEditorLayoutProps> = ({
  viewMode,
  canvasRef,
  handleContentChange,
  setSelectedBlockId,
  handleBlocksChange,
  canvasWidth,
  previewMode,
  subject,
  onSubjectChange,
  showAIAnalytics,
  snippetRefreshTrigger,
  setSnippetRefreshTrigger,
  handleSnippetAdd
}) => {
  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Snippet Ribbon - Only show in edit mode */}
      {viewMode === 'edit' && (
        <SnippetRibbon
          refreshTrigger={snippetRefreshTrigger}
          onSnippetSelect={handleSnippetAdd}
        />
      )}

      {/* Canvas Area */}
      <div className="flex-1 overflow-auto bg-gray-50 p-6">
        <EmailBlockCanvas
          ref={canvasRef}
          onContentChange={handleContentChange}
          onBlockSelect={setSelectedBlockId}
          onBlocksChange={handleBlocksChange}
          previewWidth={canvasWidth}
          previewMode={previewMode}
          compactMode={false}
          subject={subject}
          onSubjectChange={onSubjectChange}
          showAIAnalytics={showAIAnalytics}
          onSnippetRefresh={() => setSnippetRefreshTrigger(prev => prev + 1)}
          viewMode={viewMode}
        />
      </div>
    </div>
  );
};
