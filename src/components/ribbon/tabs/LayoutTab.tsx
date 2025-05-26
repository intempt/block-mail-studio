
import React from 'react';
import { RibbonGroup } from '../RibbonGroup';
import { Button } from '@/components/ui/button';
import { Monitor, Smartphone, Move, RotateCcw } from 'lucide-react';

interface LayoutTabProps {
  selectedBlockId: string | null;
}

export const LayoutTab: React.FC<LayoutTabProps> = ({
  selectedBlockId
}) => {
  return (
    <div className="layout-tab flex items-stretch bg-white border-b border-gray-100">
      {/* Page Setup Group */}
      <RibbonGroup title="Page Setup">
        <div className="flex flex-col gap-1">
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" className="h-6 px-2">
              <Monitor className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-6 px-2">
              <Smartphone className="w-3 h-3" />
            </Button>
          </div>
          <select className="text-xs border border-gray-300 rounded px-2 py-1">
            <option>600px</option>
            <option>800px</option>
            <option>1000px</option>
          </select>
        </div>
      </RibbonGroup>

      {/* Arrange Group */}
      <RibbonGroup title="Arrange">
        <div className="flex flex-col gap-1">
          <Button variant="ghost" size="sm" className="h-8 px-3">
            <Move className="w-4 h-4 mr-1" />
            Position
          </Button>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" className="h-6 px-2">
              Forward
            </Button>
            <Button variant="ghost" size="sm" className="h-6 px-2">
              Back
            </Button>
          </div>
        </div>
      </RibbonGroup>

      {/* Responsive Group */}
      <RibbonGroup title="Responsive">
        <div className="flex flex-col gap-1">
          <Button variant="ghost" size="sm" className="h-8 px-3">
            Breakpoints
          </Button>
          <Button variant="ghost" size="sm" className="h-6 px-3">
            Preview
          </Button>
        </div>
      </RibbonGroup>
    </div>
  );
};
