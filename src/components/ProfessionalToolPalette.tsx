
import React from 'react';
import { Editor } from '@tiptap/react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GlobalStylesPanel } from './GlobalStylesPanel';

interface ProfessionalToolPaletteProps {
  editor: Editor | null;
}

export const ProfessionalToolPalette: React.FC<ProfessionalToolPaletteProps> = ({ editor }) => {
  return (
    <div className="h-full flex flex-col">
      {/* Content */}
      <ScrollArea className="flex-1">
        <GlobalStylesPanel />
      </ScrollArea>
    </div>
  );
};
