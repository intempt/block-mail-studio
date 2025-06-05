
import React, { useState, useEffect } from 'react';
import { envConfig } from '@/utils/envConfig';

interface ComponentHoverInfoProps {
  componentName: string;
  htmlId?: string;
  children: React.ReactNode;
  className?: string;
}

export const ComponentHoverInfo: React.FC<ComponentHoverInfoProps> = ({
  componentName,
  htmlId,
  children,
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    if (isHovered) {
      document.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isHovered]);

  // Only render in development mode
  if (!envConfig.showComponentInfo) {
    return <>{children}</>;
  }

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      id={htmlId}
    >
      {children}
      
      {isHovered && (
        <>
          {/* Overlay highlight */}
          <div className="absolute inset-0 border-2 border-blue-400 bg-blue-100 bg-opacity-10 pointer-events-none z-50" />
          
          {/* Info tooltip */}
          <div
            className="fixed bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg z-50 pointer-events-none"
            style={{
              left: mousePosition.x + 10,
              top: mousePosition.y - 30,
              maxWidth: '200px'
            }}
          >
            <div className="font-semibold text-blue-300">{componentName}</div>
            {htmlId && (
              <div className="text-gray-300">
                ID: <span className="text-yellow-300">{htmlId}</span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
