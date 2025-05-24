
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
      {/* Header */}
      <div className="border-b border-slate-200 p-4">
        <h3 className="text-lg font-semibold text-slate-900">Global Styles</h3>
        <p className="text-sm text-slate-600 mt-1">Customize the overall appearance of your email</p>
      </div>

      {/* Global Styles Content */}
      <ScrollArea className="flex-1">
        <GlobalStylesPanel />
      </ScrollArea>
    </div>
  );
};
