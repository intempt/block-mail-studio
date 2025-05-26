
import React from 'react';
import { RibbonGroup } from '../RibbonGroup';
import { Button } from '@/components/ui/button';
import { Palette, Paintbrush, Type, Layout } from 'lucide-react';

interface DesignTabProps {
  onGlobalStylesChange: (styles: any) => void;
}

export const DesignTab: React.FC<DesignTabProps> = ({
  onGlobalStylesChange
}) => {
  return (
    <div className="design-tab flex items-stretch bg-white border-b border-gray-100">
      {/* Themes Group */}
      <RibbonGroup title="Themes">
        <div className="grid grid-cols-2 gap-1">
          <div className="w-12 h-8 bg-blue-500 rounded cursor-pointer" title="Blue Theme" />
          <div className="w-12 h-8 bg-green-500 rounded cursor-pointer" title="Green Theme" />
          <div className="w-12 h-8 bg-purple-500 rounded cursor-pointer" title="Purple Theme" />
          <div className="w-12 h-8 bg-gray-500 rounded cursor-pointer" title="Gray Theme" />
        </div>
      </RibbonGroup>

      {/* Brand Group */}
      <RibbonGroup title="Brand">
        <div className="flex flex-col gap-1">
          <Button variant="ghost" size="sm" className="h-8 px-3">
            <Palette className="w-4 h-4 mr-1" />
            Colors
          </Button>
          <Button variant="ghost" size="sm" className="h-6 px-3">
            Fonts
          </Button>
        </div>
      </RibbonGroup>

      {/* Background Group */}
      <RibbonGroup title="Background">
        <div className="flex flex-col gap-1">
          <Button variant="ghost" size="sm" className="h-8 px-3">
            <Paintbrush className="w-4 h-4 mr-1" />
            Color
          </Button>
          <Button variant="ghost" size="sm" className="h-6 px-3">
            Image
          </Button>
        </div>
      </RibbonGroup>

      {/* Typography Group */}
      <RibbonGroup title="Typography">
        <div className="flex flex-col gap-1">
          <Button variant="ghost" size="sm" className="h-8 px-3">
            <Type className="w-4 h-4 mr-1" />
            Presets
          </Button>
          <Button variant="ghost" size="sm" className="h-6 px-3">
            Spacing
          </Button>
        </div>
      </RibbonGroup>
    </div>
  );
};
