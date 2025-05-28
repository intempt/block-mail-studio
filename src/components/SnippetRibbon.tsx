
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
    text: <Type className="w-4 h-4" />,
    image: <Image className="w-4 h-4" />,
    button: <MousePointer className="w-4 h-4" />,
    spacer: <MoveVertical className="w-4 h-4" />,
    divider: <Minus className="w-4 h-4" />,
    video: <Video className="w-4 h-4" />,
    social: <Share2 className="w-4 h-4" />,
    html: <FileCode className="w-4 h-4" />,
    table: <Table className="w-4 h-4" />,
    columns: <Table className="w-4 h-4" />
  };
  return iconMap[blockType] || <Type className="w-4 h-4" />;
};

const getSnippetPreview = (snippet: EmailSnippet) => {
  const { blockData, blockType } = snippet;
  
  switch (blockType) {
    case 'text':
      const textContent = blockData?.content?.html || blockData?.content?.text || 'Text Block';
      const cleanText = textContent.replace(/<[^>]*>/g, '').slice(0, 30);
      return cleanText || 'Text Block';
    
    case 'button':
      const buttonText = blockData?.content?.text || 'Button';
      return buttonText;
    
    case 'image':
      return 'Image Block';
    
    case 'columns':
      const columnCount = blockData?.content?.columnCount || 2;
      return `${columnCount} Columns`;
    
    default:
      return `${blockType.charAt(0).toUpperCase() + blockType.slice(1)} Block`;
  }
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
    const allSnippets = DirectSnippetService.getAllSnippets();
    // Only show custom snippets in the ribbon (not default ones)
    const customSnippets = allSnippets.filter(s => s.category === 'custom');
    setSnippets(customSnippets);
  }, [refreshTrigger]);

  const handleSnippetUse = (snippet: EmailSnippet) => {
    console.log('Using snippet from ribbon:', snippet);
    onSnippetSelect(snippet);
  };

  const handleDeleteSnippet = (snippetId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this snippet?')) {
      DirectSnippetService.deleteSnippet(snippetId);
      setSnippets(prev => prev.filter(s => s.id !== snippetId));
    }
  };

  const handleEditName = (snippet: EmailSnippet, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(snippet.id);
    setEditingName(snippet.name);
  };

  const handleSaveName = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (editingId && editingName.trim()) {
      DirectSnippetService.updateSnippetName(editingId, editingName.trim());
      setSnippets(prev => prev.map(s => 
        s.id === editingId ? { ...s, name: editingName.trim() } : s
      ));
    }
    setEditingId(null);
    setEditingName('');
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
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
            <div className="flex gap-3 pb-2">
              {snippets.map((snippet) => (
                <Card 
                  key={snippet.id}
                  className="flex-shrink-0 w-40 h-20 p-2 cursor-grab hover:shadow-lg transition-all duration-200 group bg-gradient-to-br from-white to-gray-50"
                  draggable
                  onDragStart={(e) => handleDragStart(e, snippet)}
                  onClick={() => handleSnippetUse(snippet)}
                >
                  <div className="h-full flex flex-col justify-between">
                    {/* Header with icon and actions */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-1">
                        <div className="text-purple-600">
                          {getBlockIcon(snippet.blockType)}
                        </div>
                        <span className="text-xs text-gray-500 uppercase font-medium">
                          {snippet.blockType}
                        </span>
                      </div>
                      
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleEditName(snippet, e)}
                          className="h-4 w-4 p-0 text-gray-400 hover:text-blue-500"
                        >
                          <Edit2 className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleDeleteSnippet(snippet.id, e)}
                          className="h-4 w-4 p-0 text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Name (editable) */}
                    <div className="flex-1 flex items-center">
                      {editingId === snippet.id ? (
                        <div className="flex items-center gap-1 w-full">
                          <Input
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="h-5 text-xs p-1"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveName(e);
                              if (e.key === 'Escape') handleCancelEdit(e);
                            }}
                            autoFocus
                            onClick={(e) => e.stopPropagation()}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleSaveName}
                            className="h-4 w-4 p-0 text-green-600"
                          >
                            <Check className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCancelEdit}
                            className="h-4 w-4 p-0 text-red-600"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="w-full">
                          <div className="text-xs font-medium text-gray-800 truncate">
                            {snippet.name}
                          </div>
                          <div className="text-xs text-gray-500 truncate mt-0.5">
                            {getSnippetPreview(snippet)}
                          </div>
                        </div>
                      )}
                    </div>
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
