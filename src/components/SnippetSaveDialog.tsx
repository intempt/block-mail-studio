
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { X, Star, Tag } from 'lucide-react';

interface SnippetSaveDialogProps {
  onSave: (name: string, description: string, category: string, tags: string[]) => void;
  onClose: () => void;
}

export const SnippetSaveDialog: React.FC<SnippetSaveDialogProps> = ({
  onSave,
  onClose
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('custom');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const categories = [
    { id: 'content', name: 'Content', icon: '📝' },
    { id: 'layout', name: 'Layout', icon: '🏗️' },
    { id: 'media', name: 'Media', icon: '🖼️' },
    { id: 'navigation', name: 'Navigation', icon: '🧭' },
    { id: 'custom', name: 'Custom', icon: '⭐' }
  ];

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = () => {
    if (!name.trim()) return;
    
    onSave(name.trim(), description.trim(), category, tags);
  };

  const isValid = name.trim().length > 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md p-6 bg-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <h3 className="text-lg font-semibold text-slate-900">Save as Snippet</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="snippet-name" className="text-sm font-medium text-slate-700">
              Snippet Name *
            </Label>
            <Input
              id="snippet-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter snippet name"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="snippet-description" className="text-sm font-medium text-slate-700">
              Description
            </Label>
            <Textarea
              id="snippet-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this snippet"
              rows={3}
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-slate-700">Category</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={category === cat.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCategory(cat.id)}
                  className="text-xs"
                >
                  <span className="mr-1">{cat.icon}</span>
                  {cat.name}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="snippet-tags" className="text-sm font-medium text-slate-700">
              Tags
            </Label>
            <Input
              id="snippet-tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Add tags (press Enter)"
              className="mt-1"
            />
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="text-xs cursor-pointer hover:bg-slate-200"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!isValid}
            className="flex-1"
          >
            Save Snippet
          </Button>
        </div>
      </Card>
    </div>
  );
};
