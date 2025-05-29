
import React from 'react';
import { GlobalStylesPanel } from './GlobalStylesPanel';

interface RibbonInterfaceProps {
  // Add props as needed
}

export const RibbonInterface: React.FC<RibbonInterfaceProps> = () => {
  return (
    <div className="ribbon-interface bg-white border-b">
      <GlobalStylesPanel onStylesChange={() => {}} />
    </div>
  );
};
