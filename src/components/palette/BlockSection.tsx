
import React from 'react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Blocks, ChevronDown, ChevronRight } from 'lucide-react';
import { BlockItem } from './BlockItem';
import { BlockSectionProps } from '@/types/blockPalette';

export const BlockSection: React.FC<BlockSectionProps> = ({
  blockItems,
  compactMode,
  isExpanded,
  onToggle,
  onBlockAdd,
  onDragStart
}) => {
  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between p-0 h-auto mb-2">
          <div className={`${compactMode ? 'text-xs' : 'text-sm'} font-medium flex items-center gap-2`}>
            <Blocks className={compactMode ? 'w-3 h-3' : 'w-4 h-4'} />
            Content ({blockItems.length} blocks)
          </div>
          {isExpanded ? 
            <ChevronDown className="w-4 h-4" /> : 
            <ChevronRight className="w-4 h-4" />
          }
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className={`grid ${compactMode ? 'grid-cols-2 gap-1' : 'grid-cols-2 gap-1'} mb-4`}>
          {blockItems.map(block => (
            <BlockItem
              key={block.id}
              block={block}
              compactMode={compactMode}
              onBlockAdd={onBlockAdd}
              onDragStart={onDragStart}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
