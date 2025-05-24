
import React from 'react';
import { GlobalStylesPanel } from './GlobalStylesPanel';

interface EmailPropertiesPanelProps {
  emailHTML?: string;
  onPropertyChange?: (property: string, value: any) => void;
}

export const EmailPropertiesPanel: React.FC<EmailPropertiesPanelProps> = ({ 
  emailHTML = '',
  onPropertyChange
}) => {
  const handleGlobalStylesChange = (styles: any) => {
    onPropertyChange?.('globalStyles', styles);
  };

  return (
    <GlobalStylesPanel 
      onStylesChange={handleGlobalStylesChange}
      compactMode={false}
    />
  );
};
