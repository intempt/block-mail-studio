
import React from 'react';
import { DeviceConfig } from './DevicePreviewSelector';

interface DeviceFrameProps {
  device: DeviceConfig;
  orientation: 'portrait' | 'landscape';
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ device, orientation, children }) => {
  const isLandscape = orientation === 'landscape' && (device.type === 'mobile' || device.type === 'tablet');
  const frameWidth = isLandscape ? device.height : device.width;
  const frameHeight = isLandscape ? device.width : device.height;

  if (device.type === 'desktop') {
    return <DesktopFrame device={device}>{children}</DesktopFrame>;
  }

  if (device.type === 'mobile') {
    return (
      <MobileFrame 
        device={device} 
        width={frameWidth} 
        height={frameHeight}
        isLandscape={isLandscape}
      >
        {children}
      </MobileFrame>
    );
  }

  if (device.type === 'tablet') {
    return (
      <TabletFrame 
        device={device} 
        width={frameWidth} 
        height={frameHeight}
        isLandscape={isLandscape}
      >
        {children}
      </TabletFrame>
    );
  }

  return <div>{children}</div>;
};

const DesktopFrame: React.FC<{ device: DeviceConfig; children: React.ReactNode }> = ({ device, children }) => (
  <div className="bg-gray-800 rounded-lg p-1 shadow-2xl max-w-full">
    {/* Browser/Email Client Header */}
    <div className="bg-gray-700 rounded-t px-3 py-2 flex items-center gap-2">
      <div className="flex gap-1">
        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
      </div>
      <div className="flex-1 bg-gray-600 rounded px-3 py-1 text-xs text-gray-300">
        {device.client === 'Gmail' ? 'mail.google.com' : 'outlook.live.com'}
      </div>
    </div>
    
    {/* Email Client Interface */}
    <div className="bg-white rounded-b overflow-hidden" style={{ width: device.width, height: device.height }}>
      {device.client === 'Gmail' ? <GmailInterface>{children}</GmailInterface> : <OutlookInterface>{children}</OutlookInterface>}
    </div>
  </div>
);

const MobileFrame: React.FC<{ 
  device: DeviceConfig; 
  width: number; 
  height: number; 
  isLandscape: boolean;
  children: React.ReactNode;
}> = ({ device, width, height, isLandscape, children }) => (
  <div className={`bg-black rounded-3xl p-2 shadow-2xl transition-all duration-500 ${isLandscape ? 'rotate-90' : ''}`}>
    {/* Status Bar */}
    <div className="bg-black text-white px-4 py-1 flex justify-between items-center text-xs">
      <span>9:41</span>
      <div className="flex items-center gap-1">
        <div className="w-1 h-1 bg-white rounded-full"></div>
        <div className="w-1 h-1 bg-white rounded-full"></div>
        <div className="w-1 h-1 bg-white rounded-full"></div>
        <span>100%</span>
      </div>
    </div>
    
    {/* Screen */}
    <div className="bg-white rounded-2xl overflow-hidden" style={{ width, height: height - 80 }}>
      {device.client === 'Gmail' ? <MobileGmailInterface>{children}</MobileGmailInterface> : <MobileMailInterface>{children}</MobileMailInterface>}
    </div>
    
    {/* Home Indicator */}
    <div className="flex justify-center mt-2">
      <div className="w-32 h-1 bg-white rounded-full opacity-60"></div>
    </div>
  </div>
);

const TabletFrame: React.FC<{ 
  device: DeviceConfig; 
  width: number; 
  height: number; 
  isLandscape: boolean;
  children: React.ReactNode;
}> = ({ device, width, height, isLandscape, children }) => (
  <div className={`bg-black rounded-2xl p-3 shadow-2xl transition-all duration-500 ${isLandscape ? 'rotate-90' : ''}`}>
    {/* Status Bar */}
    <div className="bg-black text-white px-6 py-2 flex justify-between items-center text-sm">
      <span>9:41 AM</span>
      <div className="flex items-center gap-2">
        <span>WiFi</span>
        <span>100%</span>
      </div>
    </div>
    
    {/* Screen */}
    <div className="bg-white rounded-xl overflow-hidden" style={{ width, height: height - 60 }}>
      <MobileMailInterface>{children}</MobileMailInterface>
    </div>
  </div>
);

const GmailInterface: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="h-full flex flex-col">
    {/* Gmail Header */}
    <div className="bg-white border-b border-gray-200 p-3 flex items-center gap-3">
      <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">G</div>
      <div className="flex-1">
        <div className="text-sm font-medium">Inbox</div>
      </div>
    </div>
    
    {/* Email Content */}
    <div className="flex-1 overflow-auto p-4">
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="border-b border-gray-200 p-3 bg-gray-50">
          <div className="text-sm font-medium">Email Subject</div>
          <div className="text-xs text-gray-600 mt-1">From: sender@example.com</div>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  </div>
);

const OutlookInterface: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="h-full flex flex-col">
    {/* Outlook Header */}
    <div className="bg-blue-600 text-white p-3 flex items-center gap-3">
      <div className="text-lg font-bold">Outlook</div>
      <div className="flex-1"></div>
    </div>
    
    {/* Email Content */}
    <div className="flex-1 overflow-auto p-4 bg-gray-50">
      <div className="bg-white border border-gray-300 rounded overflow-hidden">
        <div className="border-b border-gray-300 p-3">
          <div className="text-sm font-medium">Email Subject</div>
          <div className="text-xs text-gray-600 mt-1">From: sender@example.com</div>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  </div>
);

const MobileGmailInterface: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="h-full flex flex-col">
    {/* Mobile Gmail Header */}
    <div className="bg-red-500 text-white p-3 flex items-center gap-3">
      <div className="text-white text-lg">←</div>
      <div className="flex-1 text-center font-medium">Gmail</div>
      <div className="text-white text-lg">⋮</div>
    </div>
    
    {/* Email Content */}
    <div className="flex-1 overflow-auto">
      <div className="border-b border-gray-200 p-3 bg-white">
        <div className="text-sm font-medium">Email Subject</div>
        <div className="text-xs text-gray-600 mt-1">sender@example.com</div>
      </div>
      <div className="p-3 bg-white">
        {children}
      </div>
    </div>
  </div>
);

const MobileMailInterface: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="h-full flex flex-col">
    {/* Mobile Mail Header */}
    <div className="bg-white border-b border-gray-200 p-3 flex items-center gap-3">
      <div className="text-blue-500 text-lg">←</div>
      <div className="flex-1">
        <div className="text-sm font-medium">Mail</div>
      </div>
      <div className="text-blue-500 text-lg">⋮</div>
    </div>
    
    {/* Email Content */}
    <div className="flex-1 overflow-auto">
      <div className="border-b border-gray-200 p-3 bg-white">
        <div className="text-sm font-medium">Email Subject</div>
        <div className="text-xs text-gray-600 mt-1">From: sender@example.com</div>
      </div>
      <div className="p-3 bg-white">
        {children}
      </div>
    </div>
  </div>
);
