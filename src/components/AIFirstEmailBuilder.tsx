
import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Sparkles, 
  Edit3, 
  ArrowRight, 
  Download, 
  Share,
  Monitor,
  Smartphone,
  Settings,
  Zap
} from 'lucide-react';

import { EmailCreationHub } from './EmailCreationHub';
import { ProEditorToolbar } from './ProEditorToolbar';
import { EmailPropertiesPanel } from './EmailPropertiesPanel';

type WorkflowStage = 'ai-creation' | 'pro-editing' | 'preview';
type PreviewMode = 'desktop' | 'mobile';

interface AIFirstEmailBuilderProps {
  initialStage?: WorkflowStage;
}

export const AIFirstEmailBuilder: React.FC<AIFirstEmailBuilderProps> = ({ 
  initialStage = 'ai-creation' 
}) => {
  const [currentStage, setCurrentStage] = useState<WorkflowStage>(initialStage);
  const [previewMode, setPreviewMode] = useState<PreviewMode>('desktop');
  const [propertiesPanelOpen, setPropertiesPanelOpen] = useState(false);
  const [generatedEmail, setGeneratedEmail] = useState<any>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
      }),
      Image.configure({
        HTMLAttributes: {
          style: 'max-width: 100%; height: auto;',
        },
      }),
      Color,
      TextStyle,
      Underline,
    ],
    content: '',
    onUpdate: ({ editor }) => {
      // Auto-save functionality can be added here
    },
  });

  const handleEmailGenerated = (emailData: any) => {
    setGeneratedEmail(emailData);
    if (editor) {
      editor.commands.setContent(emailData.html);
    }
  };

  const transitionToProEditing = () => {
    setCurrentStage('pro-editing');
    setPropertiesPanelOpen(true);
  };

  const transitionToPreview = () => {
    setCurrentStage('preview');
    setPropertiesPanelOpen(false);
  };

  const backToAI = () => {
    setCurrentStage('ai-creation');
    setPropertiesPanelOpen(false);
  };

  const exportEmail = () => {
    if (editor) {
      const htmlContent = editor.getHTML();
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'email-template.html';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="h-screen bg-slate-50 flex flex-col">
      {/* Streamlined Header */}
      <header className="bg-white border-b border-slate-200 h-14 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-md flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-medium text-slate-900">Email Builder Pro</span>
          </div>
          
          <Separator orientation="vertical" className="h-6" />
          
          {/* Workflow Progress */}
          <div className="flex items-center gap-2">
            <Button
              variant={currentStage === 'ai-creation' ? 'default' : 'ghost'}
              size="sm"
              onClick={backToAI}
              className="h-8 px-3"
            >
              <Sparkles className="w-3 h-3 mr-1" />
              Create
            </Button>
            <ArrowRight className="w-3 h-3 text-slate-400" />
            <Button
              variant={currentStage === 'pro-editing' ? 'default' : 'ghost'}
              size="sm"
              onClick={transitionToProEditing}
              disabled={!generatedEmail}
              className="h-8 px-3"
            >
              <Edit3 className="w-3 h-3 mr-1" />
              Edit
            </Button>
            <ArrowRight className="w-3 h-3 text-slate-400" />
            <Button
              variant={currentStage === 'preview' ? 'default' : 'ghost'}
              size="sm"
              onClick={transitionToPreview}
              disabled={!generatedEmail}
              className="h-8 px-3"
            >
              <Monitor className="w-3 h-3 mr-1" />
              Preview
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {currentStage !== 'ai-creation' && (
            <div className="flex items-center bg-slate-100 rounded-md p-0.5">
              <Button
                variant={previewMode === 'desktop' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPreviewMode('desktop')}
                className="h-7 px-2"
              >
                <Monitor className="w-3 h-3" />
              </Button>
              <Button
                variant={previewMode === 'mobile' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPreviewMode('mobile')}
                className="h-7 px-2"
              >
                <Smartphone className="w-3 h-3" />
              </Button>
            </div>
          )}
          
          <Button variant="outline" size="sm" onClick={exportEmail} disabled={!generatedEmail}>
            <Download className="w-3 h-3 mr-2" />
            Export
          </Button>
          
          <Button size="sm" disabled={!generatedEmail}>
            <Zap className="w-3 h-3 mr-2" />
            Publish
          </Button>
        </div>
      </header>

      {/* Pro Editor Toolbar (only shown in editing mode) */}
      {currentStage === 'pro-editing' && <ProEditorToolbar editor={editor} />}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* AI Creation Hub */}
        {currentStage === 'ai-creation' && (
          <div className="w-96 bg-white border-r border-slate-200">
            <EmailCreationHub 
              editor={editor}
              onEmailGenerated={handleEmailGenerated}
              onTransitionToEdit={transitionToProEditing}
            />
          </div>
        )}

        {/* AI Assistant Sidebar (in editing mode) */}
        {currentStage === 'pro-editing' && (
          <div className="w-80 bg-white border-r border-slate-200">
            <div className="p-4 border-b border-slate-200">
              <h3 className="font-medium text-slate-900 mb-2">AI Assistant</h3>
              <p className="text-xs text-slate-600">
                Ask for improvements or modifications to your email
              </p>
            </div>
            <div className="p-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={backToAI}
                className="w-full"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Start Over with AI
              </Button>
            </div>
          </div>
        )}

        {/* Editor Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-6 overflow-y-auto">
            {currentStage === 'ai-creation' ? (
              <div className="max-w-2xl mx-auto">
                <div className="text-center py-20">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold text-slate-900 mb-3">
                    What email do you want to create?
                  </h1>
                  <p className="text-slate-600 mb-8">
                    Tell our AI what you need, and we'll help you create a professional email in seconds.
                  </p>
                  <div className="text-left bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
                    <p className="text-sm text-slate-500 mb-4">Choose your starting point:</p>
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" className="justify-start h-auto p-4">
                        <div>
                          <div className="font-medium text-left">Welcome Email</div>
                          <div className="text-xs text-slate-500">Onboard new subscribers</div>
                        </div>
                      </Button>
                      <Button variant="outline" className="justify-start h-auto p-4">
                        <div>
                          <div className="font-medium text-left">Newsletter</div>
                          <div className="text-xs text-slate-500">Share updates & content</div>
                        </div>
                      </Button>
                      <Button variant="outline" className="justify-start h-auto p-4">
                        <div>
                          <div className="font-medium text-left">Promotional</div>
                          <div className="text-xs text-slate-500">Sales & special offers</div>
                        </div>
                      </Button>
                      <Button variant="outline" className="justify-start h-auto p-4">
                        <div>
                          <div className="font-medium text-left">Custom</div>
                          <div className="text-xs text-slate-500">Describe your needs</div>
                        </div>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Card className={`mx-auto transition-all duration-300 shadow-lg ${
                previewMode === 'desktop' ? 'max-w-4xl' : 'max-w-sm'
              }`}>
                <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      </div>
                      <span className="text-xs text-slate-500 ml-2">Email Preview</span>
                    </div>
                    {generatedEmail && (
                      <Badge variant="secondary" className="text-xs">
                        {generatedEmail.subject}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="p-6 bg-white rounded-b-lg">
                  <EditorContent 
                    editor={editor} 
                    className="prose max-w-none focus:outline-none min-h-[500px]"
                  />
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Properties Panel (only in pro editing mode) */}
        {currentStage === 'pro-editing' && propertiesPanelOpen && (
          <div className="w-80 border-l border-slate-200 bg-white">
            <div className="p-4 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-slate-900">Properties</h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setPropertiesPanelOpen(false)}
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <EmailPropertiesPanel editor={editor} />
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="bg-white border-t border-slate-200 px-6 py-2 text-xs text-slate-600 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Auto-saved
          </span>
          {generatedEmail && (
            <span>Subject: {generatedEmail.subject}</span>
          )}
        </div>
        <span className="text-slate-400">AI-First Email Builder</span>
      </div>
    </div>
  );
};
