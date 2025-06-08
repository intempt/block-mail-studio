
import React from 'react';
import { Button } from '@/components/ui/button';
import { EmailPreview } from './EmailPreview';
import { EmailTemplateLibrary } from './EmailTemplateLibrary';
import { EmailTemplate } from './TemplateManager';

interface EmailEditorModalsProps {
  showPreview: boolean;
  setShowPreview: (show: boolean) => void;
  emailContent: string;
  previewMode: 'desktop' | 'mobile';
  subject: string;
  showTemplateLibrary: boolean;
  setShowTemplateLibrary: (show: boolean) => void;
  templates: EmailTemplate[];
  canvasRef: React.RefObject<any>;
  onSubjectChange: (subject: string) => void;
  success: (message: string) => void;
}

export const EmailEditorModals: React.FC<EmailEditorModalsProps> = ({
  showPreview,
  setShowPreview,
  emailContent,
  previewMode,
  subject,
  showTemplateLibrary,
  setShowTemplateLibrary,
  templates,
  canvasRef,
  onSubjectChange,
  success
}) => {
  return (
    <>
      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl h-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Email Preview</h2>
              <Button variant="ghost" onClick={() => setShowPreview(false)}>
                ×
              </Button>
            </div>
            <EmailPreview 
              html={emailContent}
              previewMode={previewMode}
              subject={subject}
            />
          </div>
        </div>
      )}

      {/* Template Library Modal */}
      {showTemplateLibrary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-6xl h-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Template Library</h2>
              <Button variant="ghost" onClick={() => setShowTemplateLibrary(false)}>
                ×
              </Button>
            </div>
            <EmailTemplateLibrary
              isOpen={showTemplateLibrary}
              onSelectTemplate={(template) => {
                if (template.blocks && canvasRef.current) {
                  canvasRef.current.replaceAllBlocks(template.blocks);
                  if (template.subject) {
                    onSubjectChange(template.subject);
                  }
                  success(`Template "${template.name}" loaded successfully`);
                }
                setShowTemplateLibrary(false);
              }}
              templates={templates}
            />
          </div>
        </div>
      )}
    </>
  );
};
