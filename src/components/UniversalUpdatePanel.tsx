
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  AlertTriangle, 
  Check, 
  X, 
  Clock, 
  Eye,
  RefreshCw,
  Lock,
  Unlock
} from 'lucide-react';
import { UniversalChange, ChangeImpact } from '@/types/universal';
import { UniversalSnippetService } from '@/services/universalSnippetService';
import { GlobalStylesService } from '@/services/globalStylesService';

interface UniversalUpdatePanelProps {
  className?: string;
}

export const UniversalUpdatePanel: React.FC<UniversalUpdatePanelProps> = ({
  className
}) => {
  const [pendingChanges, setPendingChanges] = useState<UniversalChange[]>([]);
  const [selectedChange, setSelectedChange] = useState<UniversalChange | null>(null);
  const [impactAnalysis, setImpactAnalysis] = useState<ChangeImpact[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const handleUniversalChange = (change: UniversalChange) => {
      setPendingChanges(prev => {
        const filtered = prev.filter(c => c.id !== change.id);
        return [...filtered, change];
      });
    };

    UniversalSnippetService.addChangeListener(handleUniversalChange);
    GlobalStylesService.addChangeListener(handleUniversalChange);

    return () => {
      UniversalSnippetService.removeChangeListener(handleUniversalChange);
      GlobalStylesService.removeChangeListener(handleUniversalChange);
    };
  }, []);

  const handleApplyChange = (changeId: string) => {
    const change = pendingChanges.find(c => c.id === changeId);
    if (!change) return;

    if (change.type === 'snippet') {
      UniversalSnippetService.applyUniversalChanges(changeId);
    }

    setPendingChanges(prev => 
      prev.map(c => 
        c.id === changeId 
          ? { ...c, status: 'applied' }
          : c
      )
    );
  };

  const handleRejectChange = (changeId: string) => {
    setPendingChanges(prev => 
      prev.map(c => 
        c.id === changeId 
          ? { ...c, status: 'rejected' }
          : c
      )
    );
  };

  const handlePreviewChange = (change: UniversalChange) => {
    setSelectedChange(change);
    // Calculate impact analysis for the selected change
    if (change.type === 'snippet') {
      // Get impact from snippet service
      setImpactAnalysis([]);
    }
    setShowPreview(true);
  };

  const getSeverityColor = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'low': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'high': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'applied': return <Check className="w-4 h-4 text-green-500" />;
      case 'rejected': return <X className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const activePendingChanges = pendingChanges.filter(c => c.status === 'pending');

  if (activePendingChanges.length === 0) {
    return (
      <Card className={`p-4 ${className}`}>
        <div className="text-center text-gray-500">
          <RefreshCw className="w-8 h-8 mx-auto mb-2 text-gray-300" />
          <p className="text-sm">No pending universal updates</p>
          <p className="text-xs text-gray-400 mt-1">
            Changes to snippets and global styles will appear here
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">
          Universal Updates
          <Badge variant="secondary" className="ml-2">
            {activePendingChanges.length}
          </Badge>
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowPreview(!showPreview)}
        >
          <Eye className="w-4 h-4 mr-1" />
          Preview
        </Button>
      </div>

      <ScrollArea className="max-h-80">
        <div className="space-y-3">
          {activePendingChanges.map((change) => (
            <Card key={change.id} className="p-3 border-l-4 border-l-blue-500">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {getStatusIcon(change.status)}
                    <span className="font-medium text-sm">
                      {change.type === 'snippet' ? 'Snippet Update' : 'Style Update'}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {change.type}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">
                    {Object.keys(change.changes).length} changes affecting{' '}
                    {change.affectedTemplates.length} templates
                  </p>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{new Date(change.timestamp).toLocaleTimeString()}</span>
                    {change.affectedTemplates.length > 0 && (
                      <>
                        <span>•</span>
                        <span>{change.affectedTemplates.length} templates affected</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex gap-1 ml-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePreviewChange(change)}
                  >
                    <Eye className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleApplyChange(change.id)}
                    className="text-green-600 hover:text-green-700"
                  >
                    <Check className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRejectChange(change.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {showPreview && selectedChange && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-sm mb-2">Impact Preview</h4>
          <div className="text-xs text-gray-600">
            <p>Changes will be applied to {selectedChange.affectedTemplates.length} templates</p>
            <div className="mt-2 space-y-1">
              {Object.entries(selectedChange.changes).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="font-medium">{key}:</span>
                  <span className="text-blue-600">{JSON.stringify(value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
