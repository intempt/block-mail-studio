
import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Code, 
  Plus, 
  Copy, 
  Trash2,
  ChevronDown,
  Calendar,
  MapPin,
  Mail
} from 'lucide-react';

interface MergeTag {
  id: string;
  name: string;
  tag: string;
  category: string;
  description: string;
  defaultValue?: string;
}

interface ConditionalBlock {
  id: string;
  condition: string;
  content: string;
  fallback?: string;
}

interface DynamicContentEditorProps {
  editor: Editor | null;
}

export const DynamicContentEditor: React.FC<DynamicContentEditorProps> = ({ editor }) => {
  const [mergeTags] = useState<MergeTag[]>([
    {
      id: '1',
      name: 'First Name',
      tag: '{{first_name}}',
      category: 'Personal',
      description: 'Customer\'s first name',
      defaultValue: 'there'
    },
    {
      id: '2',
      name: 'Last Name',
      tag: '{{last_name}}',
      category: 'Personal',
      description: 'Customer\'s last name'
    },
    {
      id: '3',
      name: 'Email',
      tag: '{{email}}',
      category: 'Contact',
      description: 'Customer\'s email address'
    },
    {
      id: '4',
      name: 'Company',
      tag: '{{company}}',
      category: 'Business',
      description: 'Customer\'s company name'
    },
    {
      id: '5',
      name: 'City',
      tag: '{{city}}',
      category: 'Location',
      description: 'Customer\'s city'
    },
    {
      id: '6',
      name: 'Country',
      tag: '{{country}}',
      category: 'Location',
      description: 'Customer\'s country'
    },
    {
      id: '7',
      name: 'Purchase Date',
      tag: '{{purchase_date}}',
      category: 'Commerce',
      description: 'Date of last purchase'
    },
    {
      id: '8',
      name: 'Total Spent',
      tag: '{{total_spent}}',
      category: 'Commerce',
      description: 'Total amount spent'
    }
  ]);

  const [conditionalBlocks, setConditionalBlocks] = useState<ConditionalBlock[]>([]);
  const [newCondition, setNewCondition] = useState({
    condition: '',
    content: '',
    fallback: ''
  });

  const categories = ['All', 'Personal', 'Contact', 'Business', 'Location', 'Commerce'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredMergeTags = selectedCategory === 'All' 
    ? mergeTags 
    : mergeTags.filter(tag => tag.category === selectedCategory);

  const insertMergeTag = (tag: string) => {
    if (editor) {
      editor.chain().focus().insertContent(tag).run();
    }
  };

  const addConditionalBlock = () => {
    if (newCondition.condition && newCondition.content) {
      const block: ConditionalBlock = {
        id: Date.now().toString(),
        condition: newCondition.condition,
        content: newCondition.content,
        fallback: newCondition.fallback
      };
      
      setConditionalBlocks([...conditionalBlocks, block]);
      setNewCondition({ condition: '', content: '', fallback: '' });
    }
  };

  const insertConditionalBlock = (block: ConditionalBlock) => {
    if (editor) {
      const conditionalHTML = `
        <div class="conditional-block" data-condition="${block.condition}">
          <div class="conditional-content">${block.content}</div>
          ${block.fallback ? `<div class="conditional-fallback">${block.fallback}</div>` : ''}
        </div>
      `;
      editor.chain().focus().insertContent(conditionalHTML).run();
    }
  };

  const deleteConditionalBlock = (id: string) => {
    setConditionalBlocks(conditionalBlocks.filter(block => block.id !== id));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Personal':
        return <User className="w-4 h-4" />;
      case 'Contact':
        return <Mail className="w-4 h-4" />;
      case 'Location':
        return <MapPin className="w-4 h-4" />;
      case 'Commerce':
        return <Calendar className="w-4 h-4" />;
      default:
        return <Code className="w-4 h-4" />;
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Dynamic Content</h3>
        </div>
        
        <Tabs defaultValue="merge-tags" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="merge-tags">Merge Tags</TabsTrigger>
            <TabsTrigger value="conditional">Conditional</TabsTrigger>
          </TabsList>
          
          <TabsContent value="merge-tags" className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Categories
              </Label>
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

            <ScrollArea className="h-64">
              <div className="space-y-2">
                {filteredMergeTags.map((tag) => (
                  <Card key={tag.id} className="p-3 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {getCategoryIcon(tag.category)}
                          <span className="font-medium text-sm">{tag.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {tag.category}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{tag.description}</p>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {tag.tag}
                        </code>
                        {tag.defaultValue && (
                          <p className="text-xs text-gray-500 mt-1">
                            Default: "{tag.defaultValue}"
                          </p>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigator.clipboard.writeText(tag.tag)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => insertMergeTag(tag.tag)}
                        >
                          Insert
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="conditional" className="space-y-4">
            <Card className="p-4 bg-gray-50">
              <h4 className="font-medium text-gray-900 mb-3">Create Conditional Block</h4>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="condition">Condition</Label>
                  <Input
                    id="condition"
                    value={newCondition.condition}
                    onChange={(e) => setNewCondition({ ...newCondition, condition: e.target.value })}
                    placeholder="e.g., total_spent > 100"
                  />
                </div>
                
                <div>
                  <Label htmlFor="content">Content</Label>
                  <Input
                    id="content"
                    value={newCondition.content}
                    onChange={(e) => setNewCondition({ ...newCondition, content: e.target.value })}
                    placeholder="Content to show when condition is true"
                  />
                </div>
                
                <div>
                  <Label htmlFor="fallback">Fallback (Optional)</Label>
                  <Input
                    id="fallback"
                    value={newCondition.fallback}
                    onChange={(e) => setNewCondition({ ...newCondition, fallback: e.target.value })}
                    placeholder="Content to show when condition is false"
                  />
                </div>
                
                <Button onClick={addConditionalBlock} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Conditional Block
                </Button>
              </div>
            </Card>

            <ScrollArea className="h-48">
              <div className="space-y-2">
                {conditionalBlocks.map((block) => (
                  <Card key={block.id} className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="text-sm font-medium mb-1">
                          Condition: <code className="bg-gray-100 px-1 rounded">{block.condition}</code>
                        </div>
                        <div className="text-xs text-gray-600 mb-1">
                          Content: {block.content}
                        </div>
                        {block.fallback && (
                          <div className="text-xs text-gray-500">
                            Fallback: {block.fallback}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => insertConditionalBlock(block)}
                        >
                          Insert
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteConditionalBlock(block.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
                
                {conditionalBlocks.length === 0 && (
                  <div className="text-center text-gray-500 py-4">
                    <Code className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No conditional blocks created</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
};
