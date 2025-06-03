
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TestUI } from '@/components/TestUI';

export default function TestRunnerPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white px-6 py-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Editor
          </Button>
          <div>
            <h1 className="text-xl font-semibold">Test Runner</h1>
            <p className="text-sm text-gray-600">Interactive test suite for the email editor</p>
          </div>
        </div>
      </div>
      
      <TestUI />
    </div>
  );
}
