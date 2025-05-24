
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, Edit2, Check, X } from 'lucide-react';
import { EmailSnippet } from '@/types/snippets';
import { DirectSnippetService } from '@/services/directSnippetService';

interface SnippetManagerProps {
  onSnippetSelect: (snippet: EmailSnippet) => void;
  compactMode?: boolean;
  refreshTrigger?: number;
}

export const SnippetManager: React.FC<SnippetManagerProps> = ({
  onSnippetSelect,
  compactMode = false,
  refreshTrigger = 0
}) => {
  console.log('SnippetManager rendering (no persistence)');
  const [snippets, setSnippets] = useState<EmailSnippet[]>(DirectSnippetService.getAllSnippets());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  // Refresh snippets when trigger changes
  useEffect(() => {
    setSnippets(DirectSnippetService.getAllSnippets());
  }, [refreshTrigger]);

  const handleSnippetUse = (snippet: EmailSnippet) => {
    console.log('Using snippet:', snippet);
    // Update usage count in memory only
    setSnippets(prev => prev.map(s => 
      s.id === snippet.id ? { ...s, usageCount: s.usageCount + 1 } : s
    ));
    onSnippetSelect(snippet);
  };

  const handleDeleteSnippet = (snippetId: string) => {
    if (confirm('Are you sure you want to delete this snippet? (Session only)')) {
      console.log('Deleting snippet from memory:', snippetId);
      DirectSnippetService.deleteSnippet(snippetId);
      setSnippets(DirectSnippetService.getAllSnippets());
    }
  };

  const handleEditName = (snippet: EmailSnippet) => {
    setEditingId(snippet.id);
    setEditingName(snippet.name);
  };

  const handleSaveName = () => {
    if (editingId && editingName.trim()) {
      DirectSnippetService.updateSnippetName(editingId, editingName.trim());
      setSnippets(DirectSnippetService.getAllSnippets());
    }
    setEditingId(null);
    setEditingName('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  if (snippets.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-slate-500 text-sm">No snippets available</p>
        <p className="text-slate-400 text-xs mt-1">Save blocks as snippets to reuse them</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className={`${compactMode ? 'px-2 pb-4' : 'px-4 pb-6'} space-y-2`}>
        {snippets.map(snippet => (
          <Card key={snippet.id} className={`${compactMode ? 'p-2' : 'p-3'} hover:shadow-md transition-all cursor-pointer group`}>
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                {editingId === snippet.id ? (
                  <div className="flex items-center gap-1">
                    <Input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="h-6 text-xs"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveName();
                        if (e.key === 'Escape') handleCancelEdit();
                      }}
                      autoFocus
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSaveName}
                      className="h-6 w-6 p-0 text-green-600"
                    >
                      <Check className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCancelEdit}
                      className="h-6 w-6 p-0 text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <h4 className={`font-medium text-slate-900 ${compactMode ? 'text-xs' : 'text-sm'} truncate`}>
                      {snippet.name}
                    </h4>
                    {snippet.category === 'custom' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditName(snippet);
                        }}
                        className="h-4 w-4 p-0 text-slate-400 hover:text-blue-500 opacity-0 group-hover:opacity-100"
                      >
                        <Edit2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                )}
                <p className={`text-slate-600 ${compactMode ? 'text-xs' : 'text-xs'} mt-1 line-clamp-2`}>
                  {snippet.description}
                </p>
              </div>
              
              {snippet.category === 'custom' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteSnippet(snippet.id);
                  }}
                  className="h-6 w-6 p-0 text-slate-400 hover:text-red-500"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSnippetUse(snippet)}
              className={`w-full ${compactMode ? 'mt-2 h-6 text-xs' : 'mt-3 h-8'}`}
            >
              Use Snippet
            </Button>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};
