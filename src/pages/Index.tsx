
import React, { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { EmailBlockCanvas, EmailBlockCanvasRef } from '@/components/EmailBlockCanvas';
import { UnifiedAIAnalyzer } from '@/components/UnifiedAIAnalyzer';
import { CollaborativeEmailEditor } from '@/components/CollaborativeEmailEditor';
import { 
  Mail, 
  Eye, 
  Code, 
  Brain,
  Users,
  Palette,
  Settings,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react';

const Index = () => {
  const [emailContent, setEmailContent] = useState('');
  const [subjectLine, setSubjectLine] = useState('Welcome to our Newsletter!');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile' | 'tablet'>('desktop');
  const [activeView, setActiveView] = useState<'canvas' | 'code' | 'collaboration'>('canvas');
  const canvasRef = useRef<EmailBlockCanvasRef>(null);

  const handleContentChange = (content: string) => {
    setEmailContent(content);
  };

  const handleCollaborativeContentChange = (content: string) => {
    setEmailContent(content);
  };

  const getPreviewIcon = () => {
    switch (previewMode) {
      case 'mobile': return <Smartphone className="w-4 h-4" />;
      case 'tablet': return <Tablet className="w-4 h-4" />;
      default: return <Monitor className="w-4 h-4" />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Mail className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-semibold">Email Editor</h1>
            </div>
            
            {/* View Switcher */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <Button
                variant={activeView === 'canvas' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveView('canvas')}
                className="text-xs"
              >
                <Palette className="w-3 h-3 mr-1" />
                Canvas
              </Button>
              <Button
                variant={activeView === 'code' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveView('code')}
                className="text-xs"
              >
                <Code className="w-3 h-3 mr-1" />
                Code
              </Button>
              <Button
                variant={activeView === 'collaboration' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveView('collaboration')}
                className="text-xs"
              >
                <Users className="w-3 h-3 mr-1" />
                Collaborate
              </Button>
            </div>
          </div>

          {/* Preview Mode Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Preview:</span>
            <Button
              variant={previewMode === 'desktop' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPreviewMode('desktop')}
            >
              <Monitor className="w-4 h-4" />
            </Button>
            <Button
              variant={previewMode === 'tablet' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPreviewMode('tablet')}
            >
              <Tablet className="w-4 h-4" />
            </Button>
            <Button
              variant={previewMode === 'mobile' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPreviewMode('mobile')}
            >
              <Smartphone className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Subject Line */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subject Line
          </label>
          <input
            type="text"
            value={subjectLine}
            onChange={(e) => setSubjectLine(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email subject line..."
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Main Editor Panel */}
          <ResizablePanel defaultSize={70} minSize={50}>
            <div className="h-full">
              {activeView === 'canvas' && (
                <EmailBlockCanvas
                  ref={canvasRef}
                  onContentChange={handleContentChange}
                  previewMode={previewMode}
                />
              )}
              
              {activeView === 'code' && (
                <div className="h-full p-4 bg-gray-900">
                  <div className="h-full bg-gray-800 rounded-lg p-4">
                    <pre className="text-green-400 text-sm font-mono overflow-auto h-full">
                      {emailContent || '<!-- Email HTML will appear here -->'}
                    </pre>
                  </div>
                </div>
              )}
              
              {activeView === 'collaboration' && (
                <CollaborativeEmailEditor
                  documentId="email-doc-1"
                  userId="user-1"
                  userName="Email Editor User"
                  onContentChange={handleCollaborativeContentChange}
                />
              )}
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* AI Analytics Panel */}
          <ResizablePanel defaultSize={30} minSize={25} maxSize={40}>
            <div className="h-full bg-white border-l border-gray-200">
              <UnifiedAIAnalyzer
                emailHTML={emailContent}
                subjectLine={subjectLine}
                canvasRef={canvasRef}
              />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default Index;
