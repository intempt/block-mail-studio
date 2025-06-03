
import React from 'react';
import { Button } from '@/components/ui/button';
import { TestTube2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function FloatingTestButton() {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={() => navigate('/test-runner')}
        className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-shadow bg-blue-600 hover:bg-blue-700"
        title="Open Test Runner"
      >
        <TestTube2 className="w-6 h-6" />
      </Button>
    </div>
  );
}
