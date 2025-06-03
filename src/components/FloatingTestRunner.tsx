
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { TestTube } from 'lucide-react';

export const FloatingTestRunner = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        onClick={() => navigate('/test-runner')}
        className="bg-green-600 hover:bg-green-700 text-white shadow-lg"
        size="sm"
      >
        <TestTube className="w-4 h-4 mr-2" />
        Test Runner
      </Button>
    </div>
  );
};

export default FloatingTestRunner;
