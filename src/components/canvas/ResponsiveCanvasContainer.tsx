
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
        console.log('ResponsiveCanvasContainer: Container width changed to:', width);
        setContainerWidth(width);
        onWidthChange?.(width);
      }
    };

    // Initial measurement
    updateWidth();
    
    const resizeObserver = new ResizeObserver(() => {
      updateWidth();
    });
    
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Also listen to window resize as a fallback
    window.addEventListener('resize', updateWidth);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateWidth);
    };
  }, [onWidthChange]);

  return (
    <div 
      ref={containerRef}
      className="w-full h-full"
      style={{ minWidth: 0 }} // Important for flex shrinking
    >
      {/* Clone children and pass the width */}
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { 
            ...child.props, 
            containerWidth: containerWidth 
          } as any);
        }
        return child;
      })}
    </div>
  );
};
