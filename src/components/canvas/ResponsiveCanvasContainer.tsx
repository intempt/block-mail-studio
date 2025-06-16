
import React, { useRef, useEffect, useState } from 'react';

interface ResponsiveCanvasContainerProps {
  children: React.ReactNode;
  onWidthChange?: (width: number) => void;
}

export const ResponsiveCanvasContainer: React.FC<ResponsiveCanvasContainerProps> = ({
  children,
  onWidthChange
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setContainerWidth(width);
        onWidthChange?.(width);
      }
    };

    updateWidth();
    
    const resizeObserver = new ResizeObserver(updateWidth);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [onWidthChange]);

  return (
    <div 
      ref={containerRef}
      className="w-full h-full"
      style={{ minWidth: 0 }} // Important for flex shrinking
    >
      {children}
    </div>
  );
};
