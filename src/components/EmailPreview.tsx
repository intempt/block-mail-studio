
import React, { useState } from 'react';
import { DevicePreviewSelector, DeviceConfig } from './DevicePreviewSelector';
import { DeviceFrame } from './DeviceFrames';

interface EmailPreviewProps {
  html: string;
  previewMode: 'desktop' | 'mobile';
}

const deviceConfigs: DeviceConfig[] = [
  {
    id: 'desktop-gmail',
    name: 'Gmail Desktop',
    type: 'desktop',
    width: 800,
    height: 600,
    icon: null,
    client: 'Gmail',
    description: 'Gmail web client on desktop'
  },
  {
    id: 'desktop-outlook',
    name: 'Outlook Desktop',
    type: 'desktop',
    width: 850,
    height: 600,
    icon: null,
    client: 'Outlook',
    description: 'Outlook desktop application'
  },
  {
    id: 'iphone-14',
    name: 'iPhone 14',
    type: 'mobile',
    width: 393,
    height: 852,
    icon: null,
    client: 'Mail',
    description: 'iPhone 14 native Mail app'
  },
  {
    id: 'iphone-14-gmail',
    name: 'iPhone Gmail',
    type: 'mobile',
    width: 393,
    height: 852,
    icon: null,
    client: 'Gmail',
    description: 'Gmail app on iPhone 14'
  },
  {
    id: 'android-pixel',
    name: 'Android Pixel',
    type: 'mobile',
    width: 412,
    height: 915,
    icon: null,
    client: 'Gmail',
    description: 'Gmail app on Android Pixel'
  },
  {
    id: 'ipad',
    name: 'iPad',
    type: 'tablet',
    width: 768,
    height: 1024,
    icon: null,
    client: 'Mail',
    description: 'iPad native Mail app'
  }
];

export const EmailPreview: React.FC<EmailPreviewProps> = ({ html, previewMode }) => {
  // Set default device based on preview mode
  const defaultDevice = previewMode === 'desktop' ? 'desktop-gmail' : 'iphone-14';
  const [selectedDevice, setSelectedDevice] = useState(defaultDevice);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  // Update device when preview mode changes
  React.useEffect(() => {
    const newDevice = previewMode === 'desktop' ? 'desktop-gmail' : 'iphone-14';
    setSelectedDevice(newDevice);
  }, [previewMode]);

  const currentDevice = deviceConfigs.find(d => d.id === selectedDevice) || deviceConfigs[0];

  return (
    <div className="h-full flex flex-col bg-gray-100">
      {/* Device Selector */}
      <DevicePreviewSelector
        selectedDevice={selectedDevice}
        onDeviceChange={setSelectedDevice}
        orientation={orientation}
        onOrientationChange={setOrientation}
      />

      {/* Preview Area */}
      <div className="flex-1 overflow-auto p-8 flex items-center justify-center">
        <div className="transform-gpu transition-all duration-300">
          <DeviceFrame device={currentDevice} orientation={orientation}>
            <div 
              className="email-content h-full overflow-auto"
              dangerouslySetInnerHTML={{ __html: html }}
              style={{
                maxWidth: '100%',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                lineHeight: '1.6'
              }}
            />
          </DeviceFrame>
        </div>
      </div>

      {/* Preview Info */}
      <div className="bg-white border-t border-gray-200 p-3 text-center">
        <div className="text-xs text-gray-600">
          Previewing on {currentDevice.name} - {currentDevice.description}
        </div>
      </div>
    </div>
  );
};
