
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EnhancedEmailBlockPalette } from '@/components/EnhancedEmailBlockPalette';
import { UniversalContent } from '@/types/emailBlocks';
import { EmailSnippet } from '@/types/snippets';

interface BlocksSidebarProps {
  onBlockAdd: (blockType: string, layoutConfig?: any) => void;
  onSnippetAdd?: (snippet: EmailSnippet) => void;
  universalContent: UniversalContent[];
  onUniversalContentAdd: (content: UniversalContent) => void;
  snippetRefreshTrigger?: number;
}

export const BlocksSidebar: React.FC<BlocksSidebarProps> = ({
  onBlockAdd,
  onSnippetAdd,
  universalContent,
  onUniversalContentAdd,
  snippetRefreshTrigger = 0
}) => {
  return (
    <div className="w-80 min-w-80 h-full bg-gray-50 border-r border-gray-200 flex flex-col flex-shrink-0">
      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <EnhancedEmailBlockPalette
          onBlockAdd={onBlockAdd}
          onSnippetAdd={onSnippetAdd}
          universalContent={universalContent}
          onUniversalContentAdd={onUniversalContentAdd}
          compactMode={false}
          snippetRefreshTrigger={snippetRefreshTrigger}
        />
      </div>
    </div>
  );
};
