
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Star, 
  Search, 
  Tag, 
  Calendar, 
  Eye, 
  Copy, 
  Trash2, 
  Download, 
  Upload,
  Heart,
  TrendingUp,
  Filter
} from 'lucide-react';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const categories = [
    { id: 'all', name: 'All', icon: '📦' },
    { id: 'content', name: 'Content', icon: '📝' },
    { id: 'layout', name: 'Layout', icon: '🏗️' },
    { id: 'media', name: 'Media', icon: '🖼️' },
    { id: 'navigation', name: 'Navigation', icon: '🧭' },
    { id: 'custom', name: 'Custom', icon: '⭐' }
  ];

  useEffect(() => {
    loadSnippets();
  }, []);

  const loadSnippets = () => {
    setSnippets(SnippetService.getAllSnippets());
  };

  const filteredSnippets = snippets.filter(snippet => {
    const matchesSearch = snippet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         snippet.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         snippet.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || snippet.category === selectedCategory;
    const matchesFavorites = !showFavoritesOnly || snippet.isFavorite;
    
    return matchesSearch && matchesCategory && matchesFavorites;
  });

  const handleSnippetUse = (snippet: EmailSnippet) => {
    SnippetService.incrementUsage(snippet.id);
    onSnippetSelect(snippet);
    loadSnippets();
  };

  const handleToggleFavorite = (snippetId: string) => {
    SnippetService.toggleFavorite(snippetId);
    loadSnippets();
  };

  const handleDeleteSnippet = (snippetId: string) => {
    if (confirm('Are you sure you want to delete this snippet?')) {
      SnippetService.deleteSnippet(snippetId);
      loadSnippets();
    }
  };

  const handleExportSnippets = () => {
    const data = SnippetService.exportSnippets();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `email-snippets-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderSnippetCard = (snippet: EmailSnippet) => (
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
        
        <div className="flex items-center gap-1 ml-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleToggleFavorite(snippet.id);
            }}
            className="h-6 w-6 p-0"
          >
            <Star 
              className={`w-3 h-3 ${snippet.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-slate-400'}`} 
            />
          </Button>
          
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
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 flex-wrap">
          <Badge variant="secondary" className="text-xs">
            {snippet.blockType}
          </Badge>
          {snippet.tags.slice(0, 2).map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {snippet.usageCount}
          </span>
        </div>
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
  );

  return (
    <div className="h-full flex flex-col">
      <Tabs defaultValue="library" className="flex-1 flex flex-col">
        <TabsList className={`mx-2 ${compactMode ? 'mb-1' : 'mb-2'}`}>
          <TabsTrigger value="library" className={`flex-1 ${compactMode ? 'text-xs' : 'text-sm'}`}>
            Library
          </TabsTrigger>
          <TabsTrigger value="popular" className={`flex-1 ${compactMode ? 'text-xs' : 'text-sm'}`}>
            Popular
          </TabsTrigger>
        </TabsList>

        <div className={compactMode ? 'px-2' : 'px-4'}>
          {/* Search and Filters */}
          <div className="space-y-2 mb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search snippets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 ${compactMode ? 'h-8 text-xs' : 'h-9'}`}
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {categories.map(category => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={compactMode ? 'h-6 text-xs px-2' : 'h-7 text-xs'}
                >
                  <span className="mr-1">{category.icon}</span>
                  {category.name}
                </Button>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <Button
                variant={showFavoritesOnly ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className={`${compactMode ? 'h-6 text-xs' : 'h-7 text-xs'} flex items-center gap-1`}
              >
                <Heart className="w-3 h-3" />
                Favorites Only
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleExportSnippets}
                className={`${compactMode ? 'h-6 text-xs' : 'h-7 text-xs'} flex items-center gap-1`}
              >
                <Download className="w-3 h-3" />
                Export
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="library" className="h-full mt-0">
            <ScrollArea className="flex-1">
              <div className={`${compactMode ? 'px-2 pb-4' : 'px-4 pb-6'} space-y-2`}>
                {filteredSnippets.map(renderSnippetCard)}
                
                {filteredSnippets.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-slate-500 text-sm">No snippets found</p>
                    <p className="text-slate-400 text-xs mt-1">
                      {searchTerm ? 'Try adjusting your search' : 'Star some blocks to create snippets'}
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="popular" className="h-full mt-0">
            <ScrollArea className="flex-1">
              <div className={`${compactMode ? 'px-2 pb-4' : 'px-4 pb-6'} space-y-2`}>
                {SnippetService.getPopularSnippets().map(renderSnippetCard)}
              </div>
            </ScrollArea>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
