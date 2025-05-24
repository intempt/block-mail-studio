
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Mail, 
  FileText, 
  Upload, 
  Sparkles,
  ArrowRight,
  Zap
} from 'lucide-react';

interface WelcomeScreenProps {
  onEnterEditor: () => void;
  onQuickStart: (type: string) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ 
  onEnterEditor, 
  onQuickStart 
}) => {
  const quickStartOptions = [
    {
      id: 'new-email',
      icon: <Mail className="w-5 h-5" />,
      title: 'New Email',
      description: 'Start from scratch',
      action: () => onQuickStart('new')
    },
    {
      id: 'use-template',
      icon: <FileText className="w-5 h-5" />,
      title: 'Use Template',
      description: 'Browse templates',
      action: () => onQuickStart('template')
    },
    {
      id: 'import-content',
      icon: <Upload className="w-5 h-5" />,
      title: 'Import Content',
      description: 'Upload existing email',
      action: () => onQuickStart('import')
    },
    {
      id: 'ai-generate',
      icon: <Sparkles className="w-5 h-5" />,
      title: 'AI Generate',
      description: 'Create with AI',
      action: () => onQuickStart('ai')
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Email Builder Pro</h1>
          <p className="text-gray-600">Create professional emails that convert</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {quickStartOptions.map((option) => (
            <Card 
              key={option.id}
              className="p-4 cursor-pointer hover:shadow-md transition-all duration-200 border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 group"
              onClick={option.action}
            >
              <div className="text-center">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:bg-blue-100 transition-colors">
                  <div className="text-gray-600 group-hover:text-blue-600 transition-colors">
                    {option.icon}
                  </div>
                </div>
                <h3 className="font-medium text-gray-900 text-sm mb-1">{option.title}</h3>
                <p className="text-xs text-gray-500">{option.description}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button
            onClick={onEnterEditor}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Open Full Editor
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};
