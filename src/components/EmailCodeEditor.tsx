
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Code, Eye, Save, Undo } from 'lucide-react';

interface EmailCodeEditorProps {
  html: string;
  onHtmlChange?: (html: string) => void;
}

export const EmailCodeEditor: React.FC<EmailCodeEditorProps> = ({ 
  html, 
  onHtmlChange
}) => {
  const [htmlCode, setHtmlCode] = useState(html);
  const [hasChanges, setHasChanges] = useState(false);
  const [lastSavedCode, setLastSavedCode] = useState(html);

  useEffect(() => {
    if (html !== htmlCode && !hasChanges) {
      setHtmlCode(html);
      setLastSavedCode(html);
    }
  }, [html, htmlCode, hasChanges]);

  const handleCodeChange = (value: string) => {
    setHtmlCode(value);
    setHasChanges(value !== lastSavedCode);
  };

  const applyChanges = () => {
    try {
      onHtmlChange?.(htmlCode);
      setLastSavedCode(htmlCode);
      setHasChanges(false);
    } catch (error) {
      console.error('Invalid HTML:', error);
    }
  };

  const revertChanges = () => {
    setHtmlCode(lastSavedCode);
    setHasChanges(false);
  };

  const previewChanges = () => {
    onHtmlChange?.(htmlCode);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5" />
            <h3 className="text-lg font-semibold">HTML Code Editor</h3>
            {hasChanges && (
              <Badge variant="secondary" className="text-xs">
                Unsaved changes
              </Badge>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={previewChanges}
              disabled={!hasChanges}
            >
              <Eye className="w-4 h-4 mr-1" />
              Preview
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={revertChanges}
              disabled={!hasChanges}
            >
              <Undo className="w-4 h-4 mr-1" />
              Revert
            </Button>
            <Button
              size="sm"
              onClick={applyChanges}
              disabled={!hasChanges}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="w-4 h-4 mr-1" />
              Apply
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 min-h-0">
        <Textarea
          value={htmlCode}
          onChange={(e) => handleCodeChange(e.target.value)}
          className="h-full font-mono text-sm resize-none"
          placeholder="Enter your HTML code here..."
        />
      </div>
    </div>
  );
};
