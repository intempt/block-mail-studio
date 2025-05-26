
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Monitor, 
  Smartphone,
  Mail
} from 'lucide-react';

interface CompactEmailResponsiveControlsProps {
  currentWidth: number;
  onWidthChange: (width: number) => void;
}

export const CompactEmailResponsiveControls: React.FC<CompactEmailResponsiveControlsProps> = ({
  currentWidth,
  onWidthChange
}) => {
  const emailPresets = [
    { name: 'Mobile', width: 375, icon: Smartphone },
    { name: 'Email', width: 600, icon: Mail },
    { name: 'Wide', width: 640, icon: Monitor }
  ];

  const handlePresetClick = (width: number) => {
    onWidthChange(width);
  };

  return (
    <div className="flex items-center gap-3">
      {/* Email Client Presets */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
        {emailPresets.map((preset) => {
          const IconComponent = preset.icon;
          const isActive = currentWidth === preset.width;
          
          return (
            <Button
              key={preset.width}
              variant={isActive ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handlePresetClick(preset.width)}
              className={`flex items-center gap-1 h-7 px-2 ${
                isActive ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
              }`}
            >
              <IconComponent className="w-3 h-3" />
              <span className="text-xs">{preset.name}</span>
            </Button>
          );
        })}
      </div>

      {/* Custom Width Slider */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500 min-w-[50px]">{currentWidth}px</span>
        <Slider
          value={[currentWidth]}
          onValueChange={(value) => onWidthChange(value[0])}
          min={320}
          max={640}
          step={10}
          className="w-20"
        />
      </div>

      {/* Email Client Indicators */}
      <div className="flex items-center gap-1">
        <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
          Gmail ✓
        </Badge>
        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
          Outlook ✓
        </Badge>
      </div>
    </div>
  );
};
