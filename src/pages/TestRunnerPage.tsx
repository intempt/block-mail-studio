
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TestRunner from '@/components/TestRunner';

const queryClient = new QueryClient();

export default function TestRunnerPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        <div className="h-screen">
          <TestRunner />
        </div>
      </div>
    </QueryClientProvider>
  );
}
