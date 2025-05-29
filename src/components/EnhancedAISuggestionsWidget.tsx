
import React from 'react';

interface EnhancedAISuggestionsWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
  emailHTML: string;
  subjectLine: string;
  canvasRef: any;
  onSubjectLineChange?: (subject: string) => void;
  onApplySuggestion: (suggestion: any) => void;
}

export const EnhancedAISuggestionsWidget: React.FC<EnhancedAISuggestionsWidgetProps> = ({
  isOpen,
  onToggle,
  emailHTML,
  subjectLine,
  canvasRef,
  onSubjectLineChange,
  onApplySuggestion
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed right-4 top-20 w-80 bg-white border rounded-lg shadow-lg p-4 z-50">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">AI Suggestions</h3>
        <button onClick={onToggle} className="text-gray-500 hover:text-gray-700">
          ×
        </button>
      </div>
      <div className="text-sm text-gray-500">
        AI suggestions will appear here based on your email content.
      </div>
    </div>
  );
};
