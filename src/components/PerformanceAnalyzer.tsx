
import React from 'react';

interface PerformanceAnalyzerProps {
  canvasRef: any;
}

export const PerformanceAnalyzer: React.FC<PerformanceAnalyzerProps> = ({ canvasRef }) => {
  return (
    <div className="p-4">
      <h3 className="text-lg font-medium mb-4">Performance Analyzer</h3>
      <div className="text-gray-500 text-sm">
        Performance analysis will appear here.
      </div>
    </div>
  );
};
