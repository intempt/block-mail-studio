
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { 
  Monitor, 
  Smartphone, 
  Tablet, 
  Eye, 
  Settings,
  Maximize2,
  Minimize2
} from 'lucide-react';

interface DevicePreset {
  name: string;
  width: number;
  height: number;
  icon: React.ReactNode;
}

interface ResponsiveLayoutControlsProps {
  currentDevice: string;
  onDeviceChange: (device: string) => void;
  onWidthChange: (width: number) => void;
}

export const ResponsiveLayoutControls: React.FC<ResponsiveLayoutControlsProps> = ({
  currentDevice,
  onDeviceChange,
  onWidthChange
}) => {
  const [customWidth, setCustomWidth] = useState(600);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const devicePresets: DevicePreset[] = [
    {
      name: 'desktop',
      width: 1200,
      height: 800,
      icon: <Monitor className="w-4 h-4" />
    },
    {
      name: 'tablet',
      width: 768,
      height: 1024,
      icon: <Tablet className="w-4 h-4" />
    },
    {
      name: 'mobile',
      width: 375,
      height: 667,
      icon: <Smartphone className="w-4 h-4" />
    }
  ];

  const popularDevices = [
    { name: 'iPhone 14', width: 390 },
    { name: 'iPhone 14 Pro', width: 393 },
    { name: 'Samsung Galaxy S23', width: 360 },
    { name: 'iPad', width: 768 },
    { name: 'iPad Pro', width: 1024 },
    { name: 'MacBook Air', width: 1280 },
    { name: 'MacBook Pro', width: 1440 }
  ];

  const handleDeviceSelect = (device: DevicePreset) => {
    onDeviceChange(device.name);
    onWidthChange(device.width);
    setCustomWidth(device.width);
  };

  const handleCustomWidth = (value: number[]) => {
    const width = value[0];
    setCustomWidth(width);
    onWidthChange(width);
    onDeviceChange('custom');
  };

  return (
    <Card className="w-full">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Responsive Preview</h3>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2 mb-4">
          {devicePresets.map((device) => (
            <Button
              key={device.name}
              variant={currentDevice === device.name ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleDeviceSelect(device)}
              className="flex items-center gap-2"
            >
              {device.icon}
              <span className="capitalize">{device.name}</span>
            </Button>
          ))}
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm font-medium">Width</Label>
            <Badge variant="secondary" className="text-xs">
              {customWidth}px
            </Badge>
          </div>
          
          <Slider
            value={[customWidth]}
            onValueChange={handleCustomWidth}
            max={1920}
            min={320}
            step={10}
            className="w-full"
          />
          
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>320px</span>
            <span>1920px</span>
          </div>
        </div>

        {showAdvanced && (
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Popular Devices
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {popularDevices.map((device) => (
                  <Button
                    key={device.name}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCustomWidth(device.width);
                      onWidthChange(device.width);
                      onDeviceChange('custom');
                    }}
                    className="text-xs justify-start"
                  >
                    <span className="truncate">{device.name}</span>
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {device.width}
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Responsive Breakpoints
              </Label>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    Mobile
                  </span>
                  <Badge variant="outline" className="text-xs">
                    &lt; 768px
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <Tablet className="w-4 h-4" />
                    Tablet
                  </span>
                  <Badge variant="outline" className="text-xs">
                    768px - 1024px
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <Monitor className="w-4 h-4" />
                    Desktop
                  </span>
                  <Badge variant="outline" className="text-xs">
                    &gt; 1024px
                  </Badge>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Quick Actions
              </Label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCustomWidth(320);
                    onWidthChange(320);
                    onDeviceChange('custom');
                  }}
                  className="flex items-center gap-2"
                >
                  <Minimize2 className="w-4 h-4" />
                  Min Width
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCustomWidth(1920);
                    onWidthChange(1920);
                    onDeviceChange('custom');
                  }}
                  className="flex items-center gap-2"
                >
                  <Maximize2 className="w-4 h-4" />
                  Max Width
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
