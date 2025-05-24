
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Save, 
  Search, 
  Star, 
  Copy, 
  Trash2, 
  Edit2,
  Filter,
  Calendar,
  Eye
} from 'lucide-react';
import { Editor } from '@tiptap/react';

export interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  html: string;
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  isFavorite: boolean;
  usageCount: number;
  previewImage?: string;
}

interface TemplateManagerProps {
  editor: Editor | null;
  templates: EmailTemplate[];
  onSaveTemplate: (template: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>) => void;
  onLoadTemplate: (template: EmailTemplate) => void;
  onDeleteTemplate: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export const TemplateManager: React.FC<TemplateManagerProps> = ({
  editor,
  templates,
  onSaveTemplate,
  onLoadTemplate,
  onDeleteTemplate,
  onToggleFavorite
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    category: 'Custom',
    tags: [] as string[]
  });

  const categories = ['All', 'Custom', 'AI Generated', 'Promotional', 'Newsletter', 'Welcome'];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleSaveCurrentEmail = () => {
    if (!editor) return;
    
    const html = editor.getHTML();
    onSaveTemplate({
      ...newTemplate,
      html,
      isFavorite: false
    });
    
    setShowSaveDialog(false);
    setNewTemplate({
      name: '',
      description: '',
      category: 'Custom',
      tags: []
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">Templates</h3>
          <Button
            size="sm"
            onClick={() => setShowSaveDialog(true)}
            disabled={!editor}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Current
          </Button>
        </div>

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

          <div className="flex flex-wrap gap-1">
            {categories.map((category) => (
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
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900 mb-1">
                    {template.name}
                  </h4>
                  <p className="text-xs text-gray-600 mb-2">
                    {template.description}
                  </p>
                  
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {template.category}
                    </Badge>
                    {template.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {template.updatedAt.toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {template.usageCount} uses
                    </span>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onToggleFavorite(template.id)}
                  className="p-1"
                >
                  <Star 
                    className={`w-4 h-4 ${template.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} 
                  />
                </Button>
              </div>

              <div className="flex items-center gap-2">
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
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}

          {filteredTemplates.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">No templates found</p>
              <p className="text-gray-400 text-xs mt-1">
                Try adjusting your search or save your first template
              </p>
            </div>
          )}
        </div>
      </ScrollArea>

      {showSaveDialog && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">Save Template</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Name</label>
                <Input
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                  placeholder="Template name"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Description</label>
                <Input
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                  placeholder="Brief description"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Category</label>
                <select
                  value={newTemplate.category}
                  onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  {categories.filter(c => c !== 'All').map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button 
                variant="outline" 
                onClick={() => setShowSaveDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSaveCurrentEmail}
                disabled={!newTemplate.name.trim()}
                className="flex-1"
              >
                Save Template
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
