
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2 } from 'lucide-react';
import { EmailSnippet } from '@/types/snippets';
import { DirectSnippetService } from '@/services/directSnippetService';

interface SnippetManagerProps {
  onSnippetSelect: (snippet: EmailSnippet) => void;
  compactMode?: boolean;
}

export const SnippetManager: React.FC<SnippetManagerProps> = ({
  onSnippetSelect,
  compactMode = false
}) => {
  console.log('SnippetManager rendering (no persistence)');
  const [snippets, setSnippets] = useState<EmailSnippet[]>(DirectSnippetService.getDefaultSnippets());

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
      setSnippets(prev => prev.filter(s => s.id !== snippetId));
    }
  };

  if (snippets.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-slate-500 text-sm">No snippets available</p>
        <p className="text-slate-400 text-xs mt-1">Session-only snippets (no persistence)</p>
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
