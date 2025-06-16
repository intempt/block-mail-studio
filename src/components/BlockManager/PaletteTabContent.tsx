
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';

interface PaletteTabContentProps {
  value: string;
  compactMode?: boolean;
  children: React.ReactNode;
}

export const PaletteTabContent: React.FC<PaletteTabContentProps> = ({
  value,
  compactMode,
  children
}) => {
  return (
    <TabsContent value={value} className="h-full mt-0">
      <div className="h-full overflow-y-auto">
        <div className={`p-2 space-y-1 ${compactMode ? 'px-1' : 'px-2'}`}>
          {children}
        </div>
      </div>
    </TabsContent>
  );
};
