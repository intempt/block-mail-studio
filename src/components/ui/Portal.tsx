
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: React.ReactNode;
  containerId?: string;
}

export const Portal: React.FC<PortalProps> = ({ 
  children, 
  containerId = 'floating-elements-portal' 
}) => {
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    let element = document.getElementById(containerId);
    
    if (!element) {
      element = document.createElement('div');
      element.id = containerId;
      element.style.position = 'absolute';
      element.style.top = '0';
      element.style.left = '0';
      element.style.pointerEvents = 'none';
      element.style.zIndex = '99999';
      document.body.appendChild(element);
    }

    setPortalElement(element);

    return () => {
      // Only remove if we created it and it's empty
      if (element && element.children.length === 0 && element.parentNode) {
        element.parentNode.removeChild(element);
      }
    };
  }, [containerId]);

  if (!portalElement) return null;

  return createPortal(children, portalElement);
};
