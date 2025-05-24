
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2 } from 'lucide-react';
import { EmailSnippet } from '@/types/snippets';
import { SnippetService } from '@/services/snippetService';

interface SnippetManagerProps {
  onSnippetSelect: (snippet: EmailSnippet) => void;
  compactMode?: boolean;
}

export const SnippetManager: React.FC<SnippetManagerProps> = ({
  onSnippetSelect,
  compactMode = false
}) => {
  const [snippets, setSnippets] = useState<EmailSnippet[]>([]);

  useEffect(() => {
    try {
      const allSnippets = SnippetService.getAllSnippets();
      setSnippets(allSnippets);
    } catch (error) {
      console.error('Failed to load snippets:', error);
      setSnippets([]);
    }
  }, []);

  const handleSnippetUse = (snippet: EmailSnippet) => {
    try {
      SnippetService.incrementUsage(snippet.id);
      onSnippetSelect(snippet);
      const updatedSnippets = SnippetService.getAllSnippets();
      setSnippets(updatedSnippets);
    } catch (error) {
      console.error('Failed to use snippet:', error);
    }
  };

  const handleDeleteSnippet = (snippetId: string) => {
    if (confirm('Are you sure you want to delete this snippet?')) {
      try {
        SnippetService.deleteSnippet(snippetId);
        const updatedSnippets = SnippetService.getAllSnippets();
        setSnippets(updatedSnippets);
      } catch (error) {
        console.error('Failed to delete snippet:', error);
      }
    }
  };

  if (snippets.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-slate-500 text-sm">No snippets saved yet</p>
        <p className="text-slate-400 text-xs mt-1">Save blocks to create reusable snippets</p>
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
                <h4 className={`font-medium text-slate-900 ${compactMode ? 'text-xs' : 'text-sm'} truncate`}>
                  {snippet.name}
                </h4>
                <p className={`text-slate-600 ${compactMode ? 'text-xs' : 'text-xs'} mt-1 line-clamp-2`}>
                  {snippet.description}
                </p>
              </div>
              
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
