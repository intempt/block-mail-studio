
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PromptBasedEmailEditor } from '@/components/PromptBasedEmailEditor';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const PromptEditorPage: React.FC = () => {
  const navigate = useNavigate();
  const [emailHtml, setEmailHtml] = useState<string>('');

  const handleEmailExport = (html: string) => {
    setEmailHtml(html);
    console.log('Email exported:', html);
  };

  const handleBackToWorkspace = () => {
    navigate('/');
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToWorkspace}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Workspace
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">
              AI Prompt Email Editor
            </h1>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <PromptBasedEmailEditor
          onEmailExport={handleEmailExport}
          initialBlocks={[]}
        />
      </div>
    </div>
  );
};

export default PromptEditorPage;
