
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Monitor,
  Smartphone,
  Tablet,
  Mail,
  RotateCcw
} from 'lucide-react';

export interface DeviceConfig {
  id: string;
  name: string;
  type: 'desktop' | 'mobile' | 'tablet';
  width: number;
  height: number;
  icon: React.ReactNode;
  client: string;
  description: string;
}

const deviceConfigs: DeviceConfig[] = [
  {
    id: 'desktop-gmail',
    name: 'Gmail Desktop',
    type: 'desktop',
    width: 800,
    height: 600,
    icon: <Monitor className="w-4 h-4" />,
    client: 'Gmail',
    description: 'Gmail web client on desktop'
  },
  {
    id: 'desktop-outlook',
    name: 'Outlook Desktop',
    type: 'desktop',
    width: 850,
    height: 600,
    icon: <Monitor className="w-4 h-4" />,
    client: 'Outlook',
    description: 'Outlook desktop application'
  },
  {
    id: 'iphone-14',
    name: 'iPhone 14',
    type: 'mobile',
    width: 393,
    height: 852,
    icon: <Smartphone className="w-4 h-4" />,
    client: 'Mail',
    description: 'iPhone 14 native Mail app'
  },
  {
    id: 'iphone-14-gmail',
    name: 'iPhone Gmail',
    type: 'mobile',
    width: 393,
    height: 852,
    icon: <Smartphone className="w-4 h-4" />,
    client: 'Gmail',
    description: 'Gmail app on iPhone 14'
  },
  {
    id: 'android-pixel',
    name: 'Android Pixel',
    type: 'mobile',
    width: 412,
    height: 915,
    icon: <Smartphone className="w-4 h-4" />,
    client: 'Gmail',
    description: 'Gmail app on Android Pixel'
  },
  {
    id: 'ipad',
    name: 'iPad',
    type: 'tablet',
    width: 768,
    height: 1024,
    icon: <Tablet className="w-4 h-4" />,
    client: 'Mail',
    description: 'iPad native Mail app'
  }
];

interface DevicePreviewSelectorProps {
  selectedDevice: string;
  onDeviceChange: (deviceId: string) => void;
  orientation: 'portrait' | 'landscape';
  onOrientationChange: (orientation: 'portrait' | 'landscape') => void;
}

export const DevicePreviewSelector: React.FC<DevicePreviewSelectorProps> = ({
  selectedDevice,
  onDeviceChange,
  orientation,
  onOrientationChange
}) => {
  const currentDevice = deviceConfigs.find(d => d.id === selectedDevice) || deviceConfigs[0];
  const isMobileOrTablet = currentDevice.type === 'mobile' || currentDevice.type === 'tablet';

  return (
    <div className="flex items-center gap-4 p-4 bg-white border-b border-gray-200">
      {/* Device Selection */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">Device:</span>
        <div className="flex gap-1">
          {deviceConfigs.map((device) => (
            <Button
              key={device.id}
              variant={selectedDevice === device.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => onDeviceChange(device.id)}
              className="flex items-center gap-2 h-9"
              title={device.description}
            >
              {device.icon}
              <span className="hidden sm:inline text-xs">{device.name}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Device Info */}
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="text-xs">
          {currentDevice.client}
        </Badge>
        <Badge variant="outline" className="text-xs font-mono">
          {orientation === 'landscape' && isMobileOrTablet 
            ? `${currentDevice.height}×${currentDevice.width}`
            : `${currentDevice.width}×${currentDevice.height}`
          }
        </Badge>
      </div>

      {/* Orientation Toggle */}
      {isMobileOrTablet && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onOrientationChange(orientation === 'portrait' ? 'landscape' : 'portrait')}
          className="flex items-center gap-2"
          title="Rotate device"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="text-xs">{orientation}</span>
        </Button>
      )}
    </div>
  );
};
