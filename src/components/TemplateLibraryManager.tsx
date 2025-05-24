
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  Star, 
  Download, 
  Share2, 
  Copy, 
  Trash2,
  Eye,
  Calendar,
  TrendingUp,
  Heart,
  Bookmark,
  Grid3X3,
  List,
  SortAsc,
  SortDesc,
  Folder,
  Plus,
  Import,
  FileText
} from 'lucide-react';
import { EmailTemplate } from './TemplateManager';
import { Editor } from '@tiptap/react';

interface TemplateLibraryManagerProps {
  editor: Editor | null;
  templates: EmailTemplate[];
  onLoadTemplate: (template: EmailTemplate) => void;
  onDeleteTemplate: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onSaveTemplate: (template: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>) => void;
}

type SortOption = 'name' | 'created' | 'updated' | 'usage' | 'category';
type ViewMode = 'grid' | 'list';
type FilterMode = 'all' | 'favorites' | 'recent' | 'popular';

export const TemplateLibraryManager: React.FC<TemplateLibraryManagerProps> = ({
  editor,
  templates,
  onLoadTemplate,
  onDeleteTemplate,
  onToggleFavorite,
  onSaveTemplate
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [sortBy, setSortBy] = useState<SortOption>('updated');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);

  const categories = [
    'All', 'Welcome', 'Promotional', 'Newsletter', 'Transactional', 
    'Follow-up', 'Event', 'Survey', 'Announcement', 'Custom'
  ];

  const industries = [
    'All', 'E-commerce', 'SaaS', 'Healthcare', 'Education', 
    'Finance', 'Real Estate', 'Non-profit', 'Fitness', 'Travel'
  ];

  const getTemplateStats = () => {
    return {
      total: templates.length,
      favorites: templates.filter(t => t.isFavorite).length,
      recent: templates.filter(t => {
        const dayAgo = new Date();
        dayAgo.setDate(dayAgo.getDate() - 1);
        return new Date(t.updatedAt) > dayAgo;
      }).length,
      popular: templates.filter(t => t.usageCount > 5).length
    };
  };

  const stats = getTemplateStats();

  const sortedTemplates = [...templates].sort((a, b) => {
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
      case 'category':
        comparison = a.category.localeCompare(b.category);
        break;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const filteredTemplates = sortedTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    
    const matchesFilter = (() => {
      switch (filterMode) {
        case 'favorites':
          return template.isFavorite;
        case 'recent':
          const dayAgo = new Date();
          dayAgo.setDate(dayAgo.getDate() - 7);
          return new Date(template.updatedAt) > dayAgo;
        case 'popular':
          return template.usageCount > 5;
        default:
          return true;
      }
    })();
    
    return matchesSearch && matchesCategory && matchesFilter;
  });

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplates(prev => 
      prev.includes(templateId) 
        ? prev.filter(id => id !== templateId)
        : [...prev, templateId]
    );
  };

  const handleBulkAction = (action: string) => {
    switch (action) {
      case 'delete':
        if (confirm(`Delete ${selectedTemplates.length} templates?`)) {
          selectedTemplates.forEach(id => onDeleteTemplate(id));
          setSelectedTemplates([]);
        }
        break;
      case 'favorite':
        selectedTemplates.forEach(id => onToggleFavorite(id));
        setSelectedTemplates([]);
        break;
      case 'export':
        // Export functionality
        console.log('Exporting templates:', selectedTemplates);
        break;
    }
  };

  const renderTemplateCard = (template: EmailTemplate) => {
    const isSelected = selectedTemplates.includes(template.id);
    
    if (viewMode === 'list') {
      return (
        <Card key={template.id} className={`p-4 border transition-all ${isSelected ? 'ring-2 ring-blue-500' : 'border-gray-200'}`}>
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => handleTemplateSelect(template.id)}
              className="w-4 h-4"
            />
            
            <div className="w-16 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 truncate">{template.name}</h4>
                  <p className="text-sm text-gray-600 truncate">{template.description}</p>
                  
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <Badge variant="secondary" className="text-xs">
                      {template.category}
                    </Badge>
                    {template.tags.slice(0, 2).map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onToggleFavorite(template.id)}
                  >
                    <Star className={`w-4 h-4 ${template.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
                  </Button>
                  
                  <div className="text-xs text-gray-500 text-right">
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {template.usageCount}
                    </div>
                    <div>{new Date(template.updatedAt).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onLoadTemplate(template)}
                  className="flex-1"
                >
                  Load Template
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigator.clipboard.writeText(template.html)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteTemplate(template.id)}
                  className="text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      );
    }

    return (
      <Card key={template.id} className={`p-4 border transition-all hover:shadow-md ${isSelected ? 'ring-2 ring-blue-500' : 'border-gray-200'}`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => handleTemplateSelect(template.id)}
              className="w-4 h-4"
            />
            <div className="w-10 h-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleFavorite(template.id)}
            className="p-1"
          >
            <Star className={`w-4 h-4 ${template.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
          </Button>
        </div>

        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-gray-900 truncate">{template.name}</h4>
            <p className="text-sm text-gray-600 line-clamp-2 mt-1">{template.description}</p>
          </div>
          
          <div className="flex flex-wrap gap-1">
            <Badge variant="secondary" className="text-xs">
              {template.category}
            </Badge>
            {template.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(template.updatedAt).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {template.usageCount}
            </span>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onLoadTemplate(template)}
              className="flex-1"
            >
              Load
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigator.clipboard.writeText(template.html)}
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Template Library</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Import className="w-4 h-4 mr-2" />
              Import
            </Button>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              New
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          <Card className="p-3 text-center">
            <div className="text-lg font-semibold text-blue-600">{stats.total}</div>
            <div className="text-xs text-gray-600">Total</div>
          </Card>
          <Card className="p-3 text-center">
            <div className="text-lg font-semibold text-yellow-600">{stats.favorites}</div>
            <div className="text-xs text-gray-600">Favorites</div>
          </Card>
          <Card className="p-3 text-center">
            <div className="text-lg font-semibold text-green-600">{stats.recent}</div>
            <div className="text-xs text-gray-600">Recent</div>
          </Card>
          <Card className="p-3 text-center">
            <div className="text-lg font-semibold text-purple-600">{stats.popular}</div>
            <div className="text-xs text-gray-600">Popular</div>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center gap-2 justify-between">
            <div className="flex gap-2">
              <Button
                variant={filterMode === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterMode('all')}
              >
                All
              </Button>
              <Button
                variant={filterMode === 'favorites' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterMode('favorites')}
              >
                <Heart className="w-3 h-3 mr-1" />
                Favorites
              </Button>
              <Button
                variant={filterMode === 'recent' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterMode('recent')}
              >
                Recent
              </Button>
              <Button
                variant={filterMode === 'popular' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterMode('popular')}
              >
                <TrendingUp className="w-3 h-3 mr-1" />
                Popular
              </Button>
            </div>

            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              >
                {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-1">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="text-xs"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedTemplates.length > 0 && (
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg mt-3">
            <span className="text-sm font-medium text-blue-700">
              {selectedTemplates.length} selected
            </span>
            <div className="flex gap-1 ml-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('favorite')}
              >
                <Star className="w-3 h-3" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('export')}
              >
                <Download className="w-3 h-3" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('delete')}
                className="text-red-600"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className={`p-4 ${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-3'}`}>
          {filteredTemplates.map(renderTemplateCard)}
          
          {filteredTemplates.length === 0 && (
            <div className="col-span-full text-center py-8">
              <Folder className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 text-sm">No templates found</p>
              <p className="text-gray-400 text-xs mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
