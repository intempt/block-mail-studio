
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  BarChart3, 
  Monitor, 
  Smartphone, 
  Settings,
  ChevronUp,
  ChevronDown,
  Zap,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Shield
} from 'lucide-react';
import { PerformanceBrandPanel } from '../PerformanceBrandPanel';

interface CanvasStatusProps {
  selectedBlockId?: string | null;
  canvasWidth: number;
  previewMode: 'desktop' | 'mobile';
  emailHTML: string;
  subjectLine: string;
  onApplyFix?: (fix: string) => void;
}

export const CanvasStatus: React.FC<CanvasStatusProps> = ({
  selectedBlockId,
  canvasWidth,
  previewMode,
  emailHTML,
  subjectLine,
  onApplyFix
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeView, setActiveView] = useState<'status' | 'analytics'>('status');

  const getDeviceIcon = () => {
    return previewMode === 'mobile' ? (
      <Smartphone className="w-4 h-4" />
    ) : (
      <Monitor className="w-4 h-4" />
    );
  };

  const getStatusColor = () => {
    if (!emailHTML.trim()) return 'text-gray-500';
    return 'text-green-600';
  };

  const getStatusText = () => {
    if (!emailHTML.trim()) return 'No content';
    return 'Ready';
  };

  const handleToggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleViewChange = (view: 'status' | 'analytics') => {
    setActiveView(view);
    if (view === 'analytics' && !isExpanded) {
      setIsExpanded(true);
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white">
      {/* Compact Status Bar */}
      <div className="px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Canvas Status */}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getStatusColor().replace('text-', 'bg-')}`} />
            <span className="text-sm font-medium">{getStatusText()}</span>
          </div>

          {/* Device & Width */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            {getDeviceIcon()}
            <span>{canvasWidth}px</span>
          </div>

          {/* Selected Block */}
          {selectedBlockId && (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {selectedBlockId.replace(/^block-/, '').substring(0, 8)}...
              </Badge>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant={activeView === 'status' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleViewChange('status')}
            className="h-7 px-2"
          >
            <Settings className="w-3 h-3 mr-1" />
            Status
          </Button>
          
          <Button
            variant={activeView === 'analytics' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleViewChange('analytics')}
            className="h-7 px-2"
          >
            <BarChart3 className="w-3 h-3 mr-1" />
            Analytics
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleExpanded}
            className="h-7 px-2"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-200">
          {activeView === 'status' ? (
            <div className="p-4 max-h-96 overflow-y-auto">
              <div className="space-y-4">
                {/* Canvas Info */}
                <Card className="p-3">
                  <h4 className="font-medium text-gray-900 mb-2">Canvas Information</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Width:</span>
                      <span className="ml-2 font-medium">{canvasWidth}px</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Mode:</span>
                      <span className="ml-2 font-medium capitalize">{previewMode}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Content:</span>
                      <span className="ml-2 font-medium">
                        {emailHTML.trim() ? 'Present' : 'Empty'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Subject:</span>
                      <span className="ml-2 font-medium">
                        {subjectLine.trim() ? 'Set' : 'Empty'}
                      </span>
                    </div>
                  </div>
                </Card>

                {/* Quick Actions */}
                <Card className="p-3">
                  <h4 className="font-medium text-gray-900 mb-2">Quick Actions</h4>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" disabled={!emailHTML.trim()}>
                      <Zap className="w-3 h-3 mr-1" />
                      Optimize
                    </Button>
                    <Button variant="outline" size="sm" disabled={!emailHTML.trim()}>
                      <Shield className="w-3 h-3 mr-1" />
                      Validate
                    </Button>
                    <Button variant="outline" size="sm" disabled={!emailHTML.trim()}>
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Analyze
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              <PerformanceBrandPanel
                emailHTML={emailHTML}
                subjectLine={subjectLine}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
