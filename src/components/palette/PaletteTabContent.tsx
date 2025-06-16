
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TabsContent } from '@/components/ui/tabs';

interface PaletteTabContentProps {
  value: string;
  compactMode: boolean;
  children: React.ReactNode;
}

export const PaletteTabContent: React.FC<PaletteTabContentProps> = ({
  value,
  compactMode,
  children
}) => {
  return (
    <TabsContent value={value} className="h-full mt-0">
      <ScrollArea className="flex-1">
        <div className={compactMode ? 'px-2 pb-4' : 'px-4 pb-6'}>
          {children}
        </div>
      </ScrollArea>
    </TabsContent>
  );
};
