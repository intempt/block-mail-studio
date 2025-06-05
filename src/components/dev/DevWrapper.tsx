
import React from 'react';
import { ComponentHoverInfo } from './ComponentHoverInfo';
import { envConfig } from '@/utils/envConfig';

interface DevWrapperProps {
  componentName: string;
  htmlId?: string;
  children: React.ReactNode;
  className?: string;
  enabled?: boolean;
}

export const DevWrapper: React.FC<DevWrapperProps> = ({
  componentName,
  htmlId,
  children,
  className,
  enabled = true
}) => {
  // Only wrap in development mode and when enabled
  if (!envConfig.showComponentInfo || !enabled) {
    return <>{children}</>;
  }

  return (
    <ComponentHoverInfo
      componentName={componentName}
      htmlId={htmlId}
      className={className}
    >
      {children}
    </ComponentHoverInfo>
  );
};
