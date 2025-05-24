
import React, { useState, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Code, Eye, Save, Undo } from 'lucide-react';

interface EmailCodeEditorProps {
  editor: Editor | null;
  initialHtml?: string;
}

export const EmailCodeEditor: React.FC<EmailCodeEditorProps> = ({ 
  editor, 
  initialHtml = '' 
}) => {
  const [htmlCode, setHtmlCode] = useState(initialHtml);
  const [hasChanges, setHasChanges] = useState(false);
  const [lastSavedCode, setLastSavedCode] = useState(initialHtml);

  useEffect(() => {
    if (editor && !hasChanges) {
      const currentHtml = editor.getHTML();
      setHtmlCode(currentHtml);
      setLastSavedCode(currentHtml);
    }
  }, [editor, hasChanges]);

  const handleCodeChange = (value: string) => {
    setHtmlCode(value);
    setHasChanges(value !== lastSavedCode);
  };

  const applyChanges = () => {
    if (editor) {
      try {
        editor.commands.setContent(htmlCode);
        setLastSavedCode(htmlCode);
        setHasChanges(false);
      } catch (error) {
        console.error('Invalid HTML:', error);
      }
    }
  };

  const revertChanges = () => {
    setHtmlCode(lastSavedCode);
    setHasChanges(false);
  };

  const previewInEditor = () => {
    if (editor) {
      editor.commands.setContent(htmlCode);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
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
              onClick={previewInEditor}
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

      <div className="flex-1 p-4">
        <Textarea
          value={htmlCode}
          onChange={(e) => handleCodeChange(e.target.value)}
          className="h-full font-mono text-sm resize-none"
          placeholder="Enter your HTML code here..."
        />
      </div>
    </Card>
  );
};
