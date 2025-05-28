
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Type, 
  Image, 
  MousePointer, 
  MoveVertical, 
  Minus,
  Video, 
  Share2, 
  FileCode,
  Table,
  Trash2,
  Edit2,
  Check,
  X,
  ChevronUp,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { EmailSnippet } from '@/types/snippets';
import { DirectSnippetService } from '@/services/directSnippetService';

interface SnippetRibbonProps {
  onSnippetSelect: (snippet: EmailSnippet) => void;
  refreshTrigger?: number;
}

const getBlockIcon = (blockType: string) => {
  const iconMap = {
    text: <Type className="w-5 h-5" />,
    image: <Image className="w-5 h-5" />,
    button: <MousePointer className="w-5 h-5" />,
    spacer: <MoveVertical className="w-5 h-5" />,
    divider: <Minus className="w-5 h-5" />,
    video: <Video className="w-5 h-5" />,
    social: <Share2 className="w-5 h-5" />,
    html: <FileCode className="w-5 h-5" />,
    table: <Table className="w-5 h-5" />,
    columns: <Table className="w-5 h-5" />
  };
  return iconMap[blockType] || <Type className="w-5 h-5" />;
};

export const SnippetRibbon: React.FC<SnippetRibbonProps> = ({
  onSnippetSelect,
  refreshTrigger = 0
}) => {
  const [snippets, setSnippets] = useState<EmailSnippet[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  useEffect(() => {
    const updateSnippets = () => {
      const customSnippets = DirectSnippetService.getCustomSnippets();
      console.log('SnippetRibbon: Updated snippets:', customSnippets.length);
      setSnippets(customSnippets);
    };

    // Initial load
    updateSnippets();

    // Add listener for real-time updates
    DirectSnippetService.addChangeListener(updateSnippets);

    return () => {
      DirectSnippetService.removeChangeListener(updateSnippets);
    };
  }, [refreshTrigger]);

  const handleSnippetUse = (snippet: EmailSnippet) => {
    console.log('Using snippet from ribbon:', snippet);
    DirectSnippetService.incrementUsage(snippet.id);
    onSnippetSelect(snippet);
  };

  const handleDeleteSnippet = (snippetId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this snippet?')) {
      DirectSnippetService.deleteSnippet(snippetId);
    }
  };

  const handleEditName = (snippet: EmailSnippet, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(snippet.id);
    setEditingName(snippet.name);
  };

  const handleSaveName = () => {
    if (editingId && editingName.trim()) {
      DirectSnippetService.updateSnippetName(editingId, editingName.trim());
    }
    setEditingId(null);
    setEditingName('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleDragStart = (e: React.DragEvent, snippet: EmailSnippet) => {
    console.log('Dragging snippet:', snippet);
    e.dataTransfer.setData('application/json', JSON.stringify({
      snippetId: snippet.id,
      blockType: snippet.blockType,
      isSnippet: true
    }));
    e.dataTransfer.effectAllowed = 'copy';
  };

  if (snippets.length === 0) {
    return null; // Hide ribbon when no custom snippets exist
  }

  return (
    <div className="border-t border-gray-200 bg-white shadow-sm">
      {/* Ribbon Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span className="text-sm font-medium text-gray-700">My Snippets</span>
          <span className="text-xs text-gray-500">({snippets.length})</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-6 w-6 p-0"
        >
          {isCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </Button>
      </div>

      {/* Snippet Cards */}
      {!isCollapsed && (
        <div className="p-3">
          <ScrollArea className="w-full">
            <div className="flex gap-2 pb-2">
              {snippets.map((snippet) => (
                <Card 
                  key={snippet.id}
                  className="flex-shrink-0 w-24 h-20 p-2 cursor-grab hover:shadow-lg transition-all duration-200 group bg-gradient-to-br from-white to-gray-50 relative hover:scale-105"
                  draggable
                  onDragStart={(e) => handleDragStart(e, snippet)}
                  onClick={() => handleSnippetUse(snippet)}
                  title={snippet.blockType}
                >
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    {/* Centered Icon */}
                    <div className="text-purple-600 mb-1">
                      {getBlockIcon(snippet.blockType)}
                    </div>
                    
                    {/* Snippet Name */}
                    <div className="flex-1 flex items-center justify-center w-full">
                      {editingId === snippet.id ? (
                        <div className="w-full">
                          <Input
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="h-4 text-xs p-1 border-blue-300 focus:border-blue-500 text-center"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveName();
                              if (e.key === 'Escape') handleCancelEdit();
                            }}
                            autoFocus
                            onClick={(e) => e.stopPropagation()}
                          />
                          <div className="flex gap-0.5 justify-center mt-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSaveName();
                              }}
                              className="h-3 w-3 p-0 text-green-600 hover:bg-green-50"
                            >
                              <Check className="w-2 h-2" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCancelEdit();
                              }}
                              className="h-3 w-3 p-0 text-red-600 hover:bg-red-50"
                            >
                              <X className="w-2 h-2" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full">
                          <div className="text-xs font-medium text-gray-800 truncate leading-tight">
                            {snippet.name}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action buttons - positioned at top right */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-1 right-1 flex gap-0.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleEditName(snippet, e)}
                      className="h-4 w-4 p-0 text-gray-400 hover:text-blue-500 hover:bg-blue-50 bg-white/90 rounded shadow-sm"
                      title="Edit name"
                    >
                      <Edit2 className="w-2.5 h-2.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleDeleteSnippet(snippet.id, e)}
                      className="h-4 w-4 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50 bg-white/90 rounded shadow-sm"
                      title="Delete snippet"
                    >
                      <Trash2 className="w-2.5 h-2.5" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};
