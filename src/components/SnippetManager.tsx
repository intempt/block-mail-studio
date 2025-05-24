
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
  Eye, 
  Trash2, 
  Download, 
  Heart,
  TrendingUp,
  Filter,
  Grid3X3,
  List,
  SortAsc,
  SortDesc,
  Calendar
} from 'lucide-react';
import { EmailSnippet } from '@/types/snippets';
import { SnippetService } from '@/services/snippetService';

interface SnippetManagerProps {
  onSnippetSelect: (snippet: EmailSnippet) => void;
  compactMode?: boolean;
}

type SortOption = 'name' | 'created' | 'usage' | 'updated';
type ViewMode = 'grid' | 'list';

export const SnippetManager: React.FC<SnippetManagerProps> = ({
  onSnippetSelect,
  compactMode = false
}) => {
  const [snippets, setSnippets] = useState<EmailSnippet[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('created');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const categories = [
    { id: 'all', name: 'All', icon: '📦', count: 0 },
    { id: 'content', name: 'Content', icon: '📝', count: 0 },
    { id: 'layout', name: 'Layout', icon: '🏗️', count: 0 },
    { id: 'media', name: 'Media', icon: '🖼️', count: 0 },
    { id: 'navigation', name: 'Navigation', icon: '🧭', count: 0 },
    { id: 'custom', name: 'Custom', icon: '⭐', count: 0 }
  ];

  useEffect(() => {
    loadSnippets();
  }, []);

  const loadSnippets = () => {
    const allSnippets = SnippetService.getAllSnippets();
    setSnippets(allSnippets);
    
    // Update category counts
    categories.forEach(cat => {
      cat.count = cat.id === 'all' 
        ? allSnippets.length 
        : allSnippets.filter(s => s.category === cat.id).length;
    });
  };

  const sortedSnippets = [...snippets].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'created':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      case 'updated':
        comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        break;
      case 'usage':
        comparison = a.usageCount - b.usageCount;
        break;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const filteredSnippets = sortedSnippets.filter(snippet => {
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

  const renderSnippetCard = (snippet: EmailSnippet) => {
    const cardClass = viewMode === 'grid' 
      ? `${compactMode ? 'p-2' : 'p-3'} hover:shadow-md transition-all cursor-pointer group`
      : `${compactMode ? 'p-2' : 'p-3'} hover:shadow-md transition-all cursor-pointer group flex items-center gap-3`;

    return (
      <Card key={snippet.id} className={cardClass}>
        {viewMode === 'list' && (
          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
            <span className="text-sm font-medium text-blue-600">
              {snippet.blockType.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        
        <div className={viewMode === 'list' ? 'flex-1' : ''}>
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h4 className={`font-medium text-slate-900 ${compactMode ? 'text-xs' : 'text-sm'} truncate`}>
                {snippet.name}
              </h4>
              <p className={`text-slate-600 ${compactMode ? 'text-xs' : 'text-xs'} mt-1 ${viewMode === 'grid' ? 'line-clamp-2' : 'line-clamp-1'}`}>
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

          <div className={`flex items-center ${viewMode === 'list' ? 'justify-between' : 'justify-between'}`}>
            <div className="flex items-center gap-1 flex-wrap">
              <Badge variant="secondary" className="text-xs">
                {snippet.blockType}
              </Badge>
              {snippet.tags.slice(0, viewMode === 'list' ? 3 : 2).map(tag => (
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
              {viewMode === 'list' && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(snippet.createdAt).toLocaleDateString()}
                </span>
              )}
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
        </div>
      </Card>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <Tabs defaultValue="library" className="flex-1 flex flex-col">
        <TabsList className={`mx-2 ${compactMode ? 'mb-1' : 'mb-2'}`}>
          <TabsTrigger value="library" className={`flex-1 ${compactMode ? 'text-xs' : 'text-sm'}`}>
            Library ({filteredSnippets.length})
          </TabsTrigger>
          <TabsTrigger value="popular" className={`flex-1 ${compactMode ? 'text-xs' : 'text-sm'}`}>
            Popular
          </TabsTrigger>
        </TabsList>

        <div className={compactMode ? 'px-2' : 'px-4'}>
          {/* Enhanced Search and Filters */}
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

            {/* Category filters */}
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
                  {category.count > 0 && (
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {category.count}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>

            {/* Controls row */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1">
                <Button
                  variant={showFavoritesOnly ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  className={`${compactMode ? 'h-6 text-xs' : 'h-7 text-xs'} flex items-center gap-1`}
                >
                  <Heart className="w-3 h-3" />
                  Favorites
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                  className={`${compactMode ? 'h-6 text-xs' : 'h-7 text-xs'} flex items-center gap-1`}
                >
                  {viewMode === 'grid' ? <List className="w-3 h-3" /> : <Grid3X3 className="w-3 h-3" />}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className={`${compactMode ? 'h-6 text-xs' : 'h-7 text-xs'} flex items-center gap-1`}
                >
                  {sortOrder === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />}
                </Button>
              </div>

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
              <div className={`${compactMode ? 'px-2 pb-4' : 'px-4 pb-6'} ${
                viewMode === 'grid' ? 'space-y-2' : 'space-y-1'
              }`}>
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
              <div className={`${compactMode ? 'px-2 pb-4' : 'px-4 pb-6'} ${
                viewMode === 'grid' ? 'space-y-2' : 'space-y-1'
              }`}>
                {SnippetService.getPopularSnippets().map(renderSnippetCard)}
              </div>
            </ScrollArea>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
