
import React from 'react';
import { RibbonGroup } from '../RibbonGroup';
import { Button } from '@/components/ui/button';
import { Eye, Code, Grid, ZoomIn, ZoomOut } from 'lucide-react';

export const ViewTab: React.FC = () => {
  return (
    <div className="view-tab flex items-stretch bg-white border-b border-gray-100">
      {/* Views Group */}
      <RibbonGroup title="Views">
        <div className="flex flex-col gap-1">
          <Button variant="ghost" size="sm" className="h-8 px-3">
            <Eye className="w-4 h-4 mr-1" />
            Design
          </Button>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" className="h-6 px-2">
              <Code className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-6 px-2">
              Preview
            </Button>
          </div>
        </div>
      </RibbonGroup>

      {/* Show Group */}
      <RibbonGroup title="Show">
        <div className="flex flex-col gap-1">
          <Button variant="ghost" size="sm" className="h-8 px-3">
            <Grid className="w-4 h-4 mr-1" />
            Grid
          </Button>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" className="h-6 px-2">
              Rulers
            </Button>
            <Button variant="ghost" size="sm" className="h-6 px-2">
              Guides
            </Button>
          </div>
        </div>
      </RibbonGroup>

      {/* Zoom Group */}
      <RibbonGroup title="Zoom">
        <div className="flex flex-col gap-1">
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <ZoomOut className="w-3 h-3" />
            </Button>
            <span className="text-xs px-2 py-1">100%</span>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <ZoomIn className="w-3 h-3" />
            </Button>
          </div>
          <Button variant="ghost" size="sm" className="h-6 px-3">
            Fit Page
          </Button>
        </div>
      </RibbonGroup>
    </div>
  );
};
