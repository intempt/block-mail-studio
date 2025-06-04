
import React, { useMemo, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  RefreshCw, 
  Sparkles
} from 'lucide-react';
import { useEmailAnalytics } from '@/analytics/react/useEmailAnalytics';

interface CanvasStatusProps {
  selectedBlockId: string | null;
  canvasWidth: number;
  previewMode: 'desktop' | 'mobile';
  emailHTML?: string;
  subjectLine?: string;
}

export const CanvasStatus: React.FC<CanvasStatusProps> = ({
  selectedBlockId,
  canvasWidth,
  previewMode,
  emailHTML = '',
  subjectLine = ''
}) => {
  const { analyze, result, isAnalyzing, error, clearCache } = useEmailAnalytics();
  const [hasContent, setHasContent] = useState(false);

  // Check if there's content to analyze
  useEffect(() => {
    const contentExists = emailHTML.trim().length > 0;
    setHasContent(contentExists);
  }, [emailHTML]);

  const analyzeEmail = async () => {
    if (!emailHTML.trim()) {
      return;
    }

    await analyze({
      html: emailHTML,
      subjectLine: subjectLine
    });
  };

  const refreshAnalytics = async () => {
    await clearCache();
    analyzeEmail();
  };

  return (
    <div className="bg-gradient-to-r from-purple-600 via-violet-600 to-purple-700 border-t border-purple-500">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-white/20 rounded-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-base">Email Analytics</h3>
              <p className="text-purple-100 text-sm">Get AI-powered email optimization suggestions</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {result && (
              <Button
                variant="ghost"
                size="sm"
                onClick={refreshAnalytics}
                disabled={isAnalyzing}
                className="h-8 px-3 text-xs text-white hover:bg-white/20 hover:text-white border border-white/30"
              >
                {isAnalyzing ? (
                  <RefreshCw className="w-3 h-3 animate-spin mr-1" />
                ) : (
                  <RefreshCw className="w-3 h-3 mr-1" />
                )}
                Refresh
              </Button>
            )}
            
            <Button 
              onClick={analyzeEmail} 
              className="bg-white text-purple-700 hover:bg-purple-50 font-medium px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-200"
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              {isAnalyzing ? 'Analyzing...' : result ? 'Re-analyze Email' : 'Analyze Email'}
            </Button>
          </div>
        </div>
        
        {error && (
          <div className="mt-3 px-3 py-2 bg-red-500/20 border border-red-400/30 rounded text-red-100 text-sm">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};
