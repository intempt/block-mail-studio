
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingFallbackProps {
  message?: string;
  height?: string;
}

export const LoadingFallback: React.FC<LoadingFallbackProps> = ({ 
  message = "Loading...", 
  height = "400px" 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8" style={{ height }}>
      <div className="space-y-4 w-full max-w-md">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-8 w-1/2" />
        <div className="text-center text-gray-500 mt-4">
          {message}
        </div>
      </div>
    </div>
  );
};

export const EditorLoadingFallback: React.FC = () => {
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="h-16 bg-white border-b">
        <Skeleton className="h-full w-full" />
      </div>
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-96 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
};
