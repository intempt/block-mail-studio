
import React from 'react';

interface AISuggestionsPanelProps {
  emailHTML: string;
  subjectLine: string;
  onApplySuggestion: (suggestion: any) => void;
}

export const AISuggestionsPanel: React.FC<AISuggestionsPanelProps> = ({
  emailHTML,
  subjectLine,
  onApplySuggestion
}) => {
  return (
    <div className="p-4">
      <h3 className="text-lg font-medium mb-4">AI Suggestions</h3>
      <div className="text-gray-500 text-sm">
        AI suggestions will appear here based on your email content.
      </div>
    </div>
  );
};
