
import React from 'react';

interface DeviceFrameProps {
  children: React.ReactNode;
  device?: 'iphone14pro' | 'pixel7' | 'galaxys23';
  showStatusBar?: boolean;
}

const StatusBars = {
  ios: () => (
    <div className="flex items-center justify-between px-8 pt-3 pb-1 text-black relative z-10" style={{ 
      fontSize: '17px',
      fontWeight: '600',
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      <span>9:41</span>
      <div className="flex items-center gap-1">
        {/* Signal strength */}
        <div className="flex gap-1">
          <div className="w-1 h-1 bg-black rounded-full"></div>
          <div className="w-1 h-1 bg-black rounded-full"></div>
          <div className="w-1 h-1 bg-black rounded-full"></div>
          <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
        </div>
        {/* WiFi */}
        <svg className="w-4 h-3 ml-1" viewBox="0 0 24 18" fill="black">
          <path d="M1 9l11-9h11v18H12L1 9z"/>
        </svg>
        {/* Battery */}
        <div className="w-6 h-3 border border-black rounded-sm relative ml-1">
          <div className="w-4 h-1.5 bg-black rounded-sm absolute top-0.5 left-0.5"></div>
          <div className="w-0.5 h-1 bg-black rounded-r-sm absolute top-1 -right-1"></div>
        </div>
      </div>
    </div>
  ),
  
  android: () => (
    <div className="flex items-center justify-between px-6 pt-2 pb-1 text-black relative z-10" style={{ 
      fontSize: '14px',
      fontWeight: '500',
      fontFamily: 'Roboto, sans-serif'
    }}>
      <span>9:41</span>
      <div className="flex items-center gap-1">
        {/* Signal, WiFi, Battery for Android */}
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="black">
          <path d="M2 17h20v2H2zm1.15-4.05L4 11.47l.85 1.48c.3-.21.62-.39.95-.54l-.65-1.13c-.83.48-1.54 1.03-2 1.67zm2.83-2.42L6.82 9.2c1.13-.64 2.37-.99 3.68-.99s2.55.35 3.68.99l.84-1.33C13.8 6.85 12.42 6.5 11 6.5s-2.8.35-4.02 1.03zM19 12l-3 5.5L13 12h6zm-8 0L8 17.5 5 12h6z"/>
        </svg>
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="black">
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
        <div className="w-6 h-3 border border-black rounded-sm relative">
          <div className="w-4 h-1.5 bg-black rounded-sm absolute top-0.5 left-0.5"></div>
        </div>
      </div>
    </div>
  )
};

const DeviceSpecs = {
  iphone14pro: {
    width: 393,
    height: 852,
    borderRadius: 47,
    padding: 2,
    screenRadius: 45,
    dynamicIsland: true,
    statusBar: 'ios'
  },
  pixel7: {
    width: 412,
    height: 915,
    borderRadius: 32,
    padding: 3,
    screenRadius: 29,
    dynamicIsland: false,
    statusBar: 'android'
  },
  galaxys23: {
    width: 384,
    height: 854,
    borderRadius: 28,
    padding: 2,
    screenRadius: 26,
    dynamicIsland: false,
    statusBar: 'android'
  }
};

export const GmailDeviceFrame: React.FC<DeviceFrameProps> = ({
  children,
  device = 'iphone14pro',
  showStatusBar = true
}) => {
  const spec = DeviceSpecs[device];
  const StatusBarComponent = StatusBars[spec.statusBar as keyof typeof StatusBars];

  return (
    <div 
      className="bg-black shadow-2xl relative overflow-hidden gmail-elevation-5"
      style={{ 
        width: `${spec.width}px`,
        height: `${spec.height}px`,
        borderRadius: `${spec.borderRadius}px`,
        padding: `${spec.padding}px`
      }}
      data-testid="device-frame"
      data-device={device}
    >
      {/* Screen */}
      <div 
        className="w-full h-full bg-white overflow-hidden relative"
        style={{ borderRadius: `${spec.screenRadius}px` }}
        data-testid="device-screen"
      >
        {/* Dynamic Island (iPhone 14 Pro) */}
        {spec.dynamicIsland && (
          <div 
            className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-black z-50"
            style={{
              width: '126px',
              height: '37px',
              borderRadius: '19px'
            }}
            data-testid="dynamic-island"
          />
        )}

        {/* Status Bar */}
        {showStatusBar && <StatusBarComponent />}

        {/* Content */}
        <div className="flex-1 overflow-hidden" style={{ 
          paddingTop: showStatusBar ? '8px' : '0' 
        }}
        data-testid="frame-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export const GmailResponsiveFrame: React.FC<{
  children: React.ReactNode;
  mode: 'mobile' | 'desktop';
  mobileDevice?: 'iphone14pro' | 'pixel7' | 'galaxys23';
}> = ({ children, mode, mobileDevice = 'iphone14pro' }) => {
  if (mode === 'desktop') {
    return (
      <div 
        className="w-full h-full bg-white overflow-hidden gmail-elevation-2 gmail-rounded-lg"
        data-testid="desktop-frame"
      >
        {children}
      </div>
    );
  }

  return (
    <GmailDeviceFrame device={mobileDevice}>
      {children}
    </GmailDeviceFrame>
  );
};
