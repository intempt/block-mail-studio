
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TestTube } from 'lucide-react';
import TestRunner from './TestRunner';

export const TestRunnerDialog = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <TestTube className="w-4 h-4" />
          Run Tests
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl h-[80vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Test Runner - Email Builder Pro</DialogTitle>
        </DialogHeader>
        <div className="h-[calc(100%-80px)]">
          <TestRunner />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TestRunnerDialog;
