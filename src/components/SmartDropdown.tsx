
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Zap, 
  FileText, 
  Sparkles,
  Star,
  Eye
} from 'lucide-react';
import { EmailTemplate } from './TemplateManager';

interface SmartDropdownProps {
  quickActions: Array<{
    id: string;
    icon: React.ReactNode;
    label: string;
    description: string;
  }>;
  templates: EmailTemplate[];
  samplePrompts: string[];
  onPromptSelect: (prompt: string) => void;
  onTemplateSelect: (template: EmailTemplate) => void;
  onActionSelect: (action: any) => void;
  onClose: () => void;
}

export const SmartDropdown: React.FC<SmartDropdownProps> = ({
  quickActions,
  templates,
  samplePrompts,
  onPromptSelect,
  onTemplateSelect,
  onActionSelect,
  onClose
}) => {
  return (
    <div className="absolute top-full left-0 right-0 mt-2 z-50">
      <Card className="p-4 border border-gray-200 shadow-lg bg-white max-h-96 overflow-y-auto">
        {/* Quick Actions */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Quick Actions
          </h4>
          <div className="grid grid-cols-1 gap-2">
            {quickActions.map((action) => (
              <Button
                key={action.id}
                variant="ghost"
                onClick={() => onActionSelect(action)}
                className="justify-start h-auto p-2 text-left hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <div className="text-gray-600">{action.icon}</div>
                  <div>
                    <div className="text-sm font-medium">{action.label}</div>
                    <div className="text-xs text-gray-500">{action.description}</div>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Templates */}
        <div className="my-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Templates
          </h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {templates.slice(0, 4).map((template) => (
              <Button
                key={template.id}
                variant="ghost"
                onClick={() => onTemplateSelect(template)}
                className="justify-start h-auto p-2 text-left hover:bg-gray-50 w-full"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex-1">
                    <div className="text-sm font-medium">{template.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {template.category}
                      </Badge>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {template.usageCount}
                      </span>
                      {template.isFavorite && (
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      )}
                    </div>
                  </div>
                </div>
              </Button>
            ))}
            {templates.length > 4 && (
              <p className="text-xs text-gray-500 text-center py-1">
                +{templates.length - 4} more templates available
              </p>
            )}
          </div>
        </div>

        <Separator />

        {/* Sample Prompts */}
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Sample Prompts
          </h4>
          <div className="space-y-1">
            {samplePrompts.slice(0, 4).map((prompt, index) => (
              <Button
                key={index}
                variant="ghost"
                onClick={() => onPromptSelect(prompt)}
                className="justify-start h-auto p-2 text-left hover:bg-gray-50 w-full text-xs"
              >
                <Sparkles className="w-3 h-3 mr-2 text-blue-500 flex-shrink-0" />
                <span className="text-gray-700">{prompt}</span>
              </Button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};
