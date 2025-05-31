
import React from 'react';
import { RealTestRunner } from './RealTestRunner';

interface EmailEditorProps {
  initialBlocks?: any[];
  onBlockUpdate?: (block: any) => void;
  collaborationMode?: boolean;
  content?: string;
  subject?: string;
  onContentChange?: (newContent: string) => void;
  onSubjectChange?: (newSubject: string) => void;
  onBack?: () => void;
}

export const EmailEditor: React.FC<EmailEditorProps> = ({ 
  initialBlocks = [],
  onBlockUpdate,
  collaborationMode = false,
  content,
  subject,
  onContentChange,
  onSubjectChange,
  onBack
}) => {
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="flex-1 flex">
        <div className="flex-1">
          <RealTestRunner />
        </div>
      </div>
    </div>
  );
};

export default EmailEditor;
