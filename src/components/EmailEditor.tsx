
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useMutation, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { useDebounce } from 'usehooks-ts';
import { ArrowLeft, Eye, Code, Tablet, Monitor, Smartphone } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { OmnipresentRibbon } from '@/components/OmnipresentRibbon';
import { EmailBlockCanvas } from '@/components/EmailBlockCanvas';
import { CompactAISuggestions } from '@/components/CompactAISuggestions';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import TestRunnerDialog from './TestRunnerDialog';
import { EmailBlock } from '@/types/emailBlocks';

interface EmailEditorProps {
  content: string;
  subject: string;
  onContentChange: (content: string) => void;
  onSubjectChange: (subject: string) => void;
  onBack?: () => void;
}

const EmailEditor: React.FC<EmailEditorProps> = ({ content, subject, onContentChange, onSubjectChange, onBack }) => {
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [canvasWidth, setCanvasWidth] = useState<number>(1200);
  const [isCompact, setIsCompact] = useState<boolean>(false);
  const [showAIAnalytics, setShowAIAnalytics] = useState<boolean>(false);
  const [blocks, setBlocks] = useState<EmailBlock[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [debouncedCanvasWidth] = useDebounce(canvasWidth, 500);
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const canvasRef = useRef<any>(null);

  const queryClient = new QueryClient();

  const handleSubjectChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onSubjectChange(e.target.value);
  }, [onSubjectChange]);

  const handleCanvasWidthChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = parseInt(e.target.value, 10);
    setCanvasWidth(isNaN(newWidth) ? 600 : newWidth);
  }, []);

  const handleContentChangeFromCanvas = useCallback((content: string) => {
    onContentChange(content);
  }, [onContentChange]);

  const handleBlockAdd = useCallback((blockType: string, layoutConfig?: any) => {
    console.log('Adding block:', blockType, layoutConfig);
    // Block addition logic would be implemented here
  }, []);

  const handleBlockSelect = useCallback((blockId: string | null) => {
    setSelectedBlockId(blockId);
  }, []);

  // Simplified keyboard shortcuts - just handle save
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        toast({
          title: "Saved!",
          description: "Your email has been saved.",
        });
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [toast]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
        {/* Enhanced Top Bar */}
        <div className="flex-none bg-white border-b border-gray-200 px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {onBack && (
                <Button variant="ghost" size="sm" onClick={onBack}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              )}
              <h1 className="text-lg font-semibold text-gray-900">Email Builder Pro</h1>
            </div>
            <div className="flex items-center space-x-2">
              <TestRunnerDialog />
              <Button variant="outline" size="sm" onClick={() => console.log('Preview clicked')}>
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button variant="outline" size="sm" onClick={() => console.log('Code clicked')}>
                <Code className="w-4 h-4 mr-2" />
                Export Code
              </Button>
            </div>
          </div>
        </div>

        {/* Subject Line Input */}
        <div className="flex-none bg-gray-100 border-b border-gray-200 px-4 py-2">
          <div className="flex items-center space-x-2">
            <Label htmlFor="subject" className="text-sm font-medium text-gray-700">
              Subject:
            </Label>
            <Input
              type="text"
              id="subject"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-sm"
              value={subject}
              onChange={handleSubjectChange}
              placeholder="Enter subject line"
            />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-grow flex overflow-hidden">
          {/* Left Sidebar (OmnipresentRibbon) */}
          <div className="flex-none w-64 border-r border-gray-200 bg-gray-100 overflow-y-auto">
            <OmnipresentRibbon
              onBlockAdd={handleBlockAdd}
              universalContent={[]}
              onUniversalContentAdd={() => {}}
              onGlobalStylesChange={() => {}}
              emailHTML=""
              subjectLine={subject}
              canvasWidth={canvasWidth}
              deviceMode="desktop"
              onDeviceChange={() => {}}
              onWidthChange={setCanvasWidth}
              onPreview={() => {}}
              onSaveTemplate={() => {}}
              onPublish={() => {}}
              blocks={blocks}
            />
          </div>

          {/* Email Canvas */}
          <div className="flex-grow flex flex-col items-center justify-center p-4 overflow-auto">
            <div className="flex items-center justify-center mb-4">
              <Button
                variant="outline"
                size="sm"
                className={`mr-2 ${previewMode === 'desktop' ? 'bg-blue-500 text-white hover:bg-blue-700' : 'bg-white text-gray-700'}`}
                onClick={() => setPreviewMode('desktop')}
              >
                <Monitor className="w-4 h-4 mr-2" />
                Desktop
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={previewMode === 'mobile' ? 'bg-blue-500 text-white hover:bg-blue-700' : 'bg-white text-gray-700'}
                onClick={() => setPreviewMode('mobile')}
              >
                <Smartphone className="w-4 h-4 mr-2" />
                Mobile
              </Button>
            </div>

            <EmailBlockCanvas
              ref={canvasRef}
              onContentChange={handleContentChangeFromCanvas}
              onBlockSelect={handleBlockSelect}
              previewWidth={debouncedCanvasWidth}
              previewMode={previewMode}
              compactMode={isCompact}
              subject={subject}
              onSubjectChange={onSubjectChange}
              showAIAnalytics={showAIAnalytics}
            />
          </div>

          {/* Right Sidebar (AI Suggestions / Analytics) */}
          <div className="flex-none w-64 border-l border-gray-200 bg-gray-100 p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="ai-analytics" className="text-sm font-medium text-gray-700">
                AI Analytics
              </Label>
              <Switch
                id="ai-analytics"
                checked={showAIAnalytics}
                onCheckedChange={(checked) => setShowAIAnalytics(checked)}
              />
            </div>
            <Separator className="mb-4" />
            <CompactAISuggestions />
          </div>
        </div>

        {/* Canvas Width Adjustment */}
        <div className="flex-none bg-gray-100 border-t border-gray-200 px-4 py-2">
          <div className="flex items-center space-x-2">
            <Label htmlFor="canvas-width" className="text-sm font-medium text-gray-700">
              Canvas Width:
            </Label>
            <Input
              type="number"
              id="canvas-width"
              className="w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-sm"
              value={canvasWidth}
              onChange={handleCanvasWidthChange}
            />
            <Label htmlFor="compact-mode" className="text-sm font-medium text-gray-700 ml-4">
              Compact Mode:
            </Label>
            <Switch
              id="compact-mode"
              checked={isCompact}
              onCheckedChange={(checked) => setIsCompact(checked)}
            />
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
};

export default EmailEditor;
